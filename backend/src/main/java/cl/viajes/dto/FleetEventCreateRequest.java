package cl.viajes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record FleetEventCreateRequest(
        @NotBlank @Size(max = 60) String vehicle,
        @NotBlank @Size(max = 500) String description,
        @Pattern(regexp = "con_falla|en_servicio_tecnico|reparado|fuera_de_servicio") String status
) {
}
