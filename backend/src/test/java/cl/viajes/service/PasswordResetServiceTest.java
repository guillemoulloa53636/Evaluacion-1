package cl.viajes.service;

import cl.viajes.model.PasswordResetToken;
import cl.viajes.model.User;
import cl.viajes.repository.PasswordResetTokenRepository;
import cl.viajes.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class PasswordResetServiceTest {

    private UserRepository userRepository;
    private PasswordResetTokenRepository tokenRepository;
    private PasswordEncoder encoder;
    private PasswordResetService service;

    @SuppressWarnings("unchecked")
    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        tokenRepository = mock(PasswordResetTokenRepository.class);
        encoder = new BCryptPasswordEncoder();
        ObjectProvider<JavaMailSender> noMail = mock(ObjectProvider.class);
        when(noMail.getIfAvailable()).thenReturn(null);
        service = new PasswordResetService(userRepository, tokenRepository, encoder, noMail,
                "http://localhost:5173", "no-reply@viajes.cl", 30);
    }

    @Test
    void correoInexistenteNoCreaTokenNiFalla() {
        when(userRepository.findByEmail("nadie@x.cl")).thenReturn(Optional.empty());
        service.requestReset("Nadie@x.cl");
        verify(tokenRepository, never()).save(any());
    }

    @Test
    void correoExistenteGuardaUnTokenConExpiracion() {
        User user = new User();
        user.setEmail("cote@gmail.com");
        user.setName("María");
        when(userRepository.findByEmail("cote@gmail.com")).thenReturn(Optional.of(user));

        service.requestReset(" COTE@gmail.com ");

        verify(tokenRepository).deleteByUser(user);
        verify(tokenRepository).save(any(PasswordResetToken.class));
    }

    @Test
    void tokenInvalidoDevuelve400() {
        when(tokenRepository.findByTokenHash(any())).thenReturn(Optional.empty());
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> service.reset("token-falso", "Nueva12345"));
        assertEquals(HttpStatus.BAD_REQUEST, error.getStatusCode());
    }

    @Test
    void tokenExpiradoDevuelve400() {
        PasswordResetToken token = new PasswordResetToken();
        token.setUser(new User());
        token.setExpiresAt(LocalDateTime.now(ZoneOffset.UTC).minusMinutes(1));
        when(tokenRepository.findByTokenHash(any())).thenReturn(Optional.of(token));
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> service.reset("abc", "Nueva12345"));
        assertEquals(HttpStatus.BAD_REQUEST, error.getStatusCode());
    }

    @Test
    void tokenValidoCambiaLaClaveYConsumeLosTokens() {
        User user = new User();
        user.setPasswordHash(encoder.encode("vieja"));
        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setExpiresAt(LocalDateTime.now(ZoneOffset.UTC).plusMinutes(10));
        when(tokenRepository.findByTokenHash(any())).thenReturn(Optional.of(token));

        service.reset("abc", "Nueva12345");

        assertTrue(encoder.matches("Nueva12345", user.getPasswordHash()));
        verify(userRepository).save(user);
        verify(tokenRepository).deleteByUser(user);
    }
}
