package cl.viajes.dto;

import cl.viajes.model.Ticket;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public record ReportTicketResponse(
        @JsonProperty("ticket_code") String ticketCode,
        @JsonProperty("trip_title") String tripTitle,
        String destination,
        @JsonProperty("schedule_date") String scheduleDate,
        @JsonProperty("departure_time") String departureTime,
        @JsonProperty("seat_number") int seatNumber,
        @JsonProperty("passenger_name") String passengerName,
        @JsonProperty("price_paid") long pricePaid,
        String status,
        @JsonProperty("cancelled_at") LocalDateTime cancelledAt,
        @JsonProperty("cancel_reason") String cancelReason
) {
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

    public static ReportTicketResponse from(Ticket ticket) {
        return new ReportTicketResponse(
                ticket.getTicketCode(), ticket.getTripTitle(), ticket.getDestination(),
                ticket.getScheduleDate().toString(), TIME_FORMAT.format(ticket.getDepartureTime()),
                ticket.getSeatNumber(), ticket.getPassengerName(), ticket.getPricePaid(),
                ticket.getStatus(), ticket.getCancelledAt(), ticket.getCancelReason()
        );
    }
}
