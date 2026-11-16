package cl.viajes.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonProperty;

public record ContactMessageUpdateRequest(
        @Pattern(regexp = "no_leido|leido|aplicado|archivado|eliminado") String status,
        @JsonProperty("admin_notes") @Size(max = 65535) String adminNotes
) {
}
