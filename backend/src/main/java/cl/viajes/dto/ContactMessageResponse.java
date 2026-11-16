package cl.viajes.dto;

import cl.viajes.model.ContactMessage;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public record ContactMessageResponse(
        Long id,
        String name,
        String email,
        String message,
        String type,
        String status,
        @JsonProperty("admin_notes") String adminNotes,
        @JsonProperty("created_at") LocalDateTime createdAt,
        @JsonProperty("updated_at") LocalDateTime updatedAt
) {
    public static ContactMessageResponse from(ContactMessage message) {
        return new ContactMessageResponse(
                message.getId(), message.getName(), message.getEmail(), message.getMessage(),
                message.getType(), message.getStatus(), message.getAdminNotes(),
                message.getCreatedAt(), message.getUpdatedAt()
        );
    }
}
