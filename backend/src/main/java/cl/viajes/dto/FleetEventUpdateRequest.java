package cl.viajes.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonProperty;

public record FleetEventUpdateRequest(
        @Pattern(regexp = "con_falla|en_servicio_tecnico|reparado|fuera_de_servicio") String status,
        @Size(max = 500) String description,
        @JsonProperty("admin_notes") @Size(max = 65535) String adminNotes
) {
}
