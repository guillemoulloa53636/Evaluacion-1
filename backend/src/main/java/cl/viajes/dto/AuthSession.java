package cl.viajes.dto;

public record AuthSession(
        AuthResponse response,
        String refreshToken,
        long refreshExpiresInSeconds
) {
}
