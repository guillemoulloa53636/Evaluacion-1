package cl.viajes.service;

import cl.viajes.dto.*;
import cl.viajes.model.Product;
import cl.viajes.model.Sale;
import cl.viajes.model.Ticket;
import cl.viajes.repository.ProductRepository;
import cl.viajes.repository.SaleRepository;
import cl.viajes.repository.TicketRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class PurchaseService {

    private final ProductRepository productRepository;
    private final SaleRepository saleRepository;
    private final TicketRepository ticketRepository;
    private final ActivityLogService activityLog;

    public PurchaseService(
            ProductRepository productRepository,
            SaleRepository saleRepository,
            TicketRepository ticketRepository,
            ActivityLogService activityLog
    ) {
        this.productRepository = productRepository;
        this.saleRepository = saleRepository;
        this.ticketRepository = ticketRepository;
        this.activityLog = activityLog;
    }

    @Transactional
    public PurchaseResponse createPurchase(PurchaseRequest request) {
        return createPurchase(request, null);
    }

    @Transactional(readOnly = true)
    public List<OrderSummaryResponse> listMine(Long userId) {
        return saleRepository.findOrderSummariesByUser(userId);
    }

    @Transactional
    public PurchaseResponse createPurchase(PurchaseRequest request, Long userId) {
        List<Ticket> tickets = new ArrayList<>();
        Map<String, Set<Integer>> reservedBySchedule = new HashMap<>();
        long total = 0;

        for (PurchaseItem item : request.items()) {
            if (item.slug() == null || item.slug().isBlank() || item.passengers() == null || item.passengers().isEmpty()) {
                throw invalid("Cada pasaje debe incluir ruta, salida y datos de sus pasajeros");
            }

            Product product = productRepository.findBySlugForUpdate(item.slug().trim().toLowerCase(Locale.ROOT))
                    .orElseThrow(() -> conflict("Una de las rutas ya no está disponible"));
            if (!"Activo".equals(product.getStatus())) {
                throw conflict("Una de las rutas ya no está disponible");
            }

            TripSchedule schedule = resolveSchedule(product, item);
            SeatRange seatRange = seatRange(product, item, schedule.capacity());
            String scheduleKey = product.getId() + "|" + schedule.date() + "|" + schedule.time();
            Set<Integer> occupied = reservedBySchedule.computeIfAbsent(scheduleKey, ignored -> new HashSet<>());
            for (Ticket sold : ticketRepository.findByProductIdAndScheduleDateAndDepartureTimeAndStatus(
                    product.getId(), schedule.date(), schedule.time(), "activo")) {
                occupied.add(sold.getSeatNumber());
            }

            List<Integer> seats = availableSeats(seatRange, occupied, item.passengers().size());
            if (seats.size() != item.passengers().size()) {
                throw conflict("No quedan suficientes asientos de ese tipo disponibles para una de las salidas");
            }

            long originalPrice = Math.round(product.getPrice() * (double) seatRange.priceFactor() / 100);
            int discount = product.getDiscountPercent();
            long pricePaid = Math.round(originalPrice * (100 - discount) / 100.0);
            for (int index = 0; index < item.passengers().size(); index++) {
                PassengerRequest passenger = item.passengers().get(index);
                String name = passenger.name() == null ? "" : passenger.name().trim();
                String rut = passenger.rut() == null ? "" : passenger.rut().replaceAll("[^0-9kK]", "");
                if (name.isBlank() || name.length() > 150 || !rut.matches("\\d{7,8}[0-9kK]")) {
                    throw invalid("Ingresa nombre y RUT válido para cada pasajero");
                }

                Ticket ticket = new Ticket();
                ticket.setTicketCode(newCode());
                ticket.setProductId(product.getId());
                ticket.setTripTitle(product.getTitle());
                ticket.setDestination(product.getDestination());
                ticket.setScheduleDate(schedule.date());
                ticket.setDepartureTime(schedule.time());
                ticket.setPlatform(schedule.platform());
                ticket.setSeatNumber(seats.get(index));
                ticket.setPassengerName(name);
                ticket.setPassengerRut(rut);
                ticket.setOriginalPrice(originalPrice);
                ticket.setDiscountPercent(discount);
                ticket.setPricePaid(pricePaid);
                tickets.add(ticket);
                total += pricePaid;
            }
        }

        Sale sale = new Sale();
        sale.setSaleCode(newCode());
        sale.setTotalAmount(total);
        sale.setUserId(userId);
        tickets.forEach(sale::addTicket);
        saleRepository.save(sale);
        String actor = tickets.get(0).getPassengerName();
        activityLog.record("compra", "Compra " + sale.getSaleCode().substring(0, 8) + ": "
                + tickets.size() + " boleto(s) por $" + String.format(Locale.forLanguageTag("es-CL"), "%,d", total), actor);

        return new PurchaseResponse(
                sale.getSaleCode(),
                total,
                tickets.stream().map(TicketResponse::from).toList()
        );
    }

    @Transactional(readOnly = true)
    public SaleDetailsResponse getPurchase(String saleCode) {
        Sale sale = saleRepository.findBySaleCode(saleCode.toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No se encontró la compra solicitada"));
        return SaleDetailsResponse.from(
                sale,
                sale.getTickets().stream().map(TicketResponse::from).toList()
        );
    }

    @Transactional(readOnly = true)
    public List<OrderSummaryResponse> listOrders() {
        return saleRepository.findAllOrderSummaries();
    }

    private TripSchedule resolveSchedule(Product product, PurchaseItem item) {
        LocalDate today = LocalDate.now();
        List<Map<?, ?>> schedules = scheduleMaps(product);

        if (item.customSchedule()) {
            boolean hasFutureSchedule = schedules.stream()
                    .map(candidate -> stringValue(candidate.get("date")))
                    .anyMatch(date -> date.compareTo(today.toString()) >= 0);
            if (hasFutureSchedule) {
                throw conflict("Esta ruta ya tiene salidas publicadas. Selecciona una de ellas");
            }
            LocalDate date = parseDate(item.scheduleDate());
            LocalTime time = parseTime(item.departureTime());
            if (date.isBefore(today)) {
                throw invalid("Selecciona una fecha y hora de viaje válidas");
            }
            return new TripSchedule(date, time, "Por asignar", null);
        }

        if (item.scheduleId() == null || item.scheduleId().isBlank()) {
            throw invalid("Cada pasaje debe incluir ruta y salida");
        }
        for (Map<?, ?> candidate : schedules) {
            if (item.scheduleId().equals(stringValue(candidate.get("id")))) {
                LocalDate date = parseDate(stringValue(candidate.get("date")));
                LocalTime time = parseTime(stringValue(candidate.get("time")));
                if (date.isBefore(today)) {
                    throw conflict("Una de las salidas seleccionadas ya no está disponible");
                }
                return new TripSchedule(
                        date,
                        time,
                        stringValue(candidate.get("platform")),
                        integerValue(candidate.get("capacity"))
                );
            }
        }
        throw conflict("Una de las salidas seleccionadas ya no está disponible");
    }

    private List<Map<?, ?>> scheduleMaps(Product product) {
        List<Map<?, ?>> schedules = new ArrayList<>();
        for (Object schedule : product.getSchedules()) {
            if (schedule instanceof Map<?, ?> map) {
                schedules.add(map);
            }
        }
        return schedules;
    }

    private SeatRange seatRange(Product product, PurchaseItem item, Integer capacity) {
        int from = 1;
        int to = capacity == null ? 65535 : capacity;
        int priceFactor = 100;
        if ("Semi Cama".equals(product.getType())) {
            to = Math.min(to, 44);
        } else if ("Salón Cama".equals(product.getType())) {
            if ("salon".equalsIgnoreCase(item.seatClass())) {
                to = 12;
                priceFactor = 125;
            } else {
                from = 13;
                to = 56;
            }
        }
        return new SeatRange(from, to, priceFactor);
    }

    private List<Integer> availableSeats(SeatRange range, Set<Integer> occupied, int requested) {
        List<Integer> available = new ArrayList<>(requested);
        for (int seat = range.from(); seat <= range.to() && available.size() < requested; seat++) {
            if (!occupied.contains(seat)) {
                occupied.add(seat);
                available.add(seat);
            }
        }
        return available;
    }

    private LocalDate parseDate(String value) {
        try {
            if (value == null || !value.matches("\\d{4}-\\d{2}-\\d{2}")) {
                throw new DateTimeParseException("Invalid ISO date", value == null ? "" : value, 0);
            }
            return LocalDate.parse(value);
        } catch (DateTimeParseException exception) {
            throw invalid("Selecciona una fecha y hora de viaje válidas");
        }
    }

    private LocalTime parseTime(String value) {
        try {
            if (value == null || !value.matches("(?:[01]\\d|2[0-3]):[0-5]\\d")) {
                throw new DateTimeParseException("Invalid time", value == null ? "" : value, 0);
            }
            return LocalTime.parse(value, DateTimeFormatter.ofPattern("HH:mm"));
        } catch (DateTimeParseException exception) {
            throw invalid("Selecciona una fecha y hora de viaje válidas");
        }
    }

    private Integer integerValue(Object value) {
        if (!(value instanceof Number number) || number.doubleValue() != number.intValue()) {
            return null;
        }
        return number.intValue();
    }

    private String stringValue(Object value) {
        return value instanceof String string ? string : "";
    }

    private String newCode() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    private ResponseStatusException invalid(String message) {
        return new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, message);
    }

    private ResponseStatusException conflict(String message) {
        return new ResponseStatusException(HttpStatus.CONFLICT, message);
    }

    private record TripSchedule(LocalDate date, LocalTime time, String platform, Integer capacity) {
    }

    private record SeatRange(int from, int to, int priceFactor) {
    }
}
