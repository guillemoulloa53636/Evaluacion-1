package cl.viajes.service;

import cl.viajes.model.RefreshToken;
import cl.viajes.model.User;
import cl.viajes.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class RefreshTokenService {

    private static final int TOKEN_BYTES = 32;

    private final RefreshTokenRepository repository;
    private final long expirationMillis;
    private final SecureRandom secureRandom = new SecureRandom();

    public RefreshTokenService(
            RefreshTokenRepository repository,
            @Value("${app.jwt.refresh-expiration-ms}") long expirationMillis
    ) {
        if (expirationMillis <= 0) {
            throw new IllegalStateException("JWT_REFRESH_EXPIRATION_MS debe ser mayor que cero");
        }
        this.repository = repository;
        this.expirationMillis = expirationMillis;
    }

    @Transactional
    public IssuedRefreshToken issue(User user) {
        byte[] randomBytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(randomBytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setTokenHash(hash(rawToken));
        refreshToken.setExpiresAt(LocalDateTime.now(ZoneOffset.UTC).plus(expirationMillis, java.time.temporal.ChronoUnit.MILLIS));
        repository.save(refreshToken);

        return new IssuedRefreshToken(user, rawToken, expirationMillis / 1000);
    }

    @Transactional
    public IssuedRefreshToken rotate(String rawToken) {
        if (rawToken == null || rawToken.isBlank() || rawToken.length() > 128) {
            throw invalidRefreshToken();
        }

        RefreshToken current = repository.findByTokenHashForUpdate(hash(rawToken))
                .orElseThrow(this::invalidRefreshToken);
        if (!current.getExpiresAt().isAfter(LocalDateTime.now(ZoneOffset.UTC))) {
            throw invalidRefreshToken();
        }

        User user = current.getUser();
        repository.delete(current);
        return issue(user);
    }

    @Transactional
    public void revoke(String rawToken) {
        if (rawToken == null || rawToken.isBlank() || rawToken.length() > 128) return;
        repository.findByTokenHashForUpdate(hash(rawToken)).ifPresent(repository::delete);
    }

    private String hash(String rawToken) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(rawToken.getBytes(StandardCharsets.US_ASCII));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 no está disponible", exception);
        }
    }

    private ResponseStatusException invalidRefreshToken() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token inválido o expirado");
    }

    public record IssuedRefreshToken(User user, String value, long expiresInSeconds) {
    }
}
