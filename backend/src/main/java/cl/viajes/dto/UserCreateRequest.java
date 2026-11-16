package cl.viajes.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserCreateRequest(
        @NotBlank @Size(max = 150) String name,
        @NotBlank @Email @Size(max = 190) String email,
        @NotBlank @Size(min = 8, max = 72) String password,
        @Size(max = 40) String telephone,
        @Size(max = 100) String region,
        @Size(max = 100) String commune,
        @Pattern(regexp = "customer|seller|admin", message = "El rol debe ser customer, seller o admin") String role
) {
}
