package cl.viajes.dto;

import cl.viajes.model.FleetEvent;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public record FleetEventResponse(
        Long id,
        String vehicle,
        String description,
        String status,
        @JsonProperty("admin_notes") String adminNotes,
        @JsonProperty("reported_at") LocalDateTime reportedAt,
        @JsonProperty("resolved_at") LocalDateTime resolvedAt
) {
    public static FleetEventResponse from(FleetEvent event) {
        return new FleetEventResponse(
                event.getId(), event.getVehicle(), event.getDescription(), event.getStatus(),
                event.getAdminNotes(), event.getReportedAt(), event.getResolvedAt()
        );
    }
}
