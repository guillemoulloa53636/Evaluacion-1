package cl.viajes.service;

import cl.viajes.dto.SaleCancellationRequest;
import cl.viajes.model.Sale;
import cl.viajes.model.Ticket;
import cl.viajes.repository.SaleRepository;
import cl.viajes.repository.TicketRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final TicketRepository ticketRepository;
    private final ActivityLogService activityLog;

    public SaleService(SaleRepository saleRepository, TicketRepository ticketRepository, ActivityLogService activityLog) {
        this.saleRepository = saleRepository;
        this.ticketRepository = ticketRepository;
        this.activityLog = activityLog;
    }

    @Transactional
    public String cancel(SaleCancellationRequest request) {
        boolean hasTicketCode = request.ticketCode() != null && !request.ticketCode().isBlank();
        boolean hasSaleCode = request.saleCode() != null && !request.saleCode().isBlank();
        if (!hasTicketCode && !hasSaleCode) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Indica el boleto o la compra a cancelar");
        }

        Ticket requestedTicket = hasTicketCode
                ? ticketRepository.findByTicketCode(request.ticketCode().trim().toLowerCase(Locale.ROOT))
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Boleto no encontrado"))
                : null;
        String saleCode = hasTicketCode ? requestedTicket.getSale().getSaleCode() : request.saleCode().trim().toLowerCase(Locale.ROOT);
        Sale sale = saleRepository.findBySaleCodeForUpdate(saleCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Compra no encontrada"));

        List<Ticket> activeTickets = ticketRepository.findActiveTicketsBySaleIdForUpdate(sale.getId());
        if (activeTickets.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ese boleto o compra ya estaba cancelado");
        }

        String reason = request.reason() == null ? "" : request.reason().trim();
        LocalDateTime cancelledAt = LocalDateTime.now();
        String description;
        if (hasTicketCode) {
            Ticket ticket = activeTickets.stream()
                    .filter(item -> item.getTicketCode().equals(requestedTicket.getTicketCode()))
                    .findFirst()
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT, "Ese boleto o compra ya estaba cancelado"));
            ticket.setStatus("cancelado");
            ticket.setCancelledAt(cancelledAt);
            ticket.setCancelReason(reason.isEmpty() ? null : reason);
            description = "Boleto cancelado: " + ticket.getPassengerName() + ", asiento " + ticket.getSeatNumber()
                    + ", " + ticket.getTripTitle() + " (compra " + sale.getSaleCode().substring(0, 8) + ")";
        } else {
            activeTickets.forEach(ticket -> {
                ticket.setStatus("cancelado");
                ticket.setCancelledAt(cancelledAt);
                ticket.setCancelReason(reason.isEmpty() ? null : reason);
            });
            description = "Compra cancelada completa (" + sale.getSaleCode().substring(0, 8) + ")";
        }

        List<Ticket> allTickets = ticketRepository.findBySale_IdOrderByIdAsc(sale.getId());
        long activeCount = allTickets.stream().filter(ticket -> "activo".equals(ticket.getStatus())).count();
        long cancelledCount = allTickets.stream().filter(ticket -> "cancelado".equals(ticket.getStatus())).count();
        sale.setStatus(activeCount == 0 ? "anulada" : (cancelledCount > 0 ? "parcial" : "pagada"));
        saleRepository.save(sale);
        activityLog.record("cancelacion", description + (reason.isEmpty() ? "" : ". Motivo: " + reason), "Administrador");
        return sale.getStatus();
    }
}
