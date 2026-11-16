package cl.viajes.dto;

import cl.viajes.model.ActivityLog;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public record ActivityLogResponse(
        Long id,
        String type,
        String description,
        String actor,
        @JsonProperty("created_at") LocalDateTime createdAt
) {
    public static ActivityLogResponse from(ActivityLog event) {
        return new ActivityLogResponse(event.getId(), event.getType(), event.getDescription(), event.getActor(), event.getCreatedAt());
    }
}
