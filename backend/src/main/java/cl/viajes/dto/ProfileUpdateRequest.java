package cl.viajes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProfileUpdateRequest(
        @NotBlank @Size(max = 150) String name,
        @Size(max = 40) String telephone,
        @NotBlank @Size(max = 100) String region,
        @NotBlank @Size(max = 100) String commune
) {
}
