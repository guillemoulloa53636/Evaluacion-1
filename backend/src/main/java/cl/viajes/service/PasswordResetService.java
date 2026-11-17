package cl.viajes.service;

import cl.viajes.model.PasswordResetToken;
import cl.viajes.model.User;
import cl.viajes.repository.PasswordResetTokenRepository;
import cl.viajes.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
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
import java.util.Locale;

@Service
public class PasswordResetService {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetService.class);

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectProvider<JavaMailSender> mailSender;
    private final String frontendUrl;
    private final String mailFrom;
    private final long expirationMinutes;
    private final SecureRandom random = new SecureRandom();

    public PasswordResetService(
            UserRepository userRepository,
            PasswordResetTokenRepository tokenRepository,
            PasswordEncoder passwordEncoder,
            ObjectProvider<JavaMailSender> mailSender,
            @Value("${app.frontend-url:http://localhost:5173}") String frontendUrl,
            @Value("${app.mail.from:no-reply@viajesporchile.cl}") String mailFrom,
            @Value("${app.password-reset.expiration-minutes:30}") long expirationMinutes
    ) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
        this.frontendUrl = frontendUrl.replaceAll("/+$", "");
        this.mailFrom = mailFrom;
        this.expirationMinutes = expirationMinutes;
    }

    /** Responde siempre igual para no revelar si el correo existe. */
    @Transactional
    public void requestReset(String rawEmail) {
        String email = rawEmail.trim().toLowerCase(Locale.ROOT);
        userRepository.findByEmail(email).ifPresent(user -> {
            tokenRepository.deleteByUser(user);
            byte[] bytes = new byte[32];
            random.nextBytes(bytes);
            String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

            PasswordResetToken token = new PasswordResetToken();
            token.setUser(user);
            token.setTokenHash(hash(rawToken));
            token.setExpiresAt(LocalDateTime.now(ZoneOffset.UTC).plusMinutes(expirationMinutes));
            tokenRepository.save(token);

            sendEmail(user, frontendUrl + "/restablecer?token=" + rawToken);
        });
    }

    @Transactional
    public void reset(String rawToken, String newPassword) {
        PasswordResetToken token = tokenRepository.findByTokenHash(hash(rawToken))
                .filter(candidate -> candidate.getExpiresAt().isAfter(LocalDateTime.now(ZoneOffset.UTC)))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "El enlace es inválido o ya expiró"));
        User user = token.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        tokenRepository.deleteByUser(user);
    }

    private void sendEmail(User user, String link) {
        String body = "Hola " + user.getName() + ",\n\nPara crear una nueva contraseña ingresa a este enlace "
                + "(vence en " + expirationMinutes + " minutos):\n" + link
                + "\n\nSi no lo solicitaste, ignora este correo.";
        JavaMailSender sender = mailSender.getIfAvailable();
        if (sender == null) {
            log.warn("SMTP no configurado (spring.mail.host). Enlace de recuperación para {}: {}", user.getEmail(), link);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(user.getEmail());
            message.setSubject("Recupera tu contraseña - Viajes por Chile");
            message.setText(body);
            sender.send(message);
        } catch (RuntimeException exception) {
            log.error("No se pudo enviar el correo de recuperación a {}. Enlace: {}", user.getEmail(), link, exception);
        }
    }

    private String hash(String raw) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(raw.getBytes(StandardCharsets.US_ASCII)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(exception);
        }
    }
}
