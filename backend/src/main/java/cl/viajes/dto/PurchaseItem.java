package cl.viajes.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record PurchaseItem(
        String slug,
        String scheduleId,
        boolean customSchedule,
        String scheduleDate,
        String departureTime,
        String seatClass,
        List<@NotNull @Valid PassengerRequest> passengers
) {
}
