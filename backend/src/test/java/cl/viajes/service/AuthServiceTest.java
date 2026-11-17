package cl.viajes.service;

import cl.viajes.dto.ChangePasswordRequest;
import cl.viajes.dto.LoginRequest;
import cl.viajes.dto.ProfileUpdateRequest;
import cl.viajes.dto.UserResponse;
import cl.viajes.model.User;
import cl.viajes.repository.UserRepository;
import cl.viajes.security.GoogleIdentityVerifier;
import cl.viajes.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    private UserRepository userRepository;
    private PasswordEncoder encoder;
    private AuthService service;
    private User user;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        encoder = new BCryptPasswordEncoder();
        service = new AuthService(
                userRepository, encoder, mock(JwtService.class), mock(RefreshTokenService.class),
                mock(GoogleIdentityVerifier.class), mock(ActivityLogService.class));

        user = new User();
        user.setName("María");
        user.setEmail("cote@gmail.com");
        user.setPasswordHash(encoder.encode("Cote1234"));
        user.setRole("customer");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(call -> call.getArgument(0));
    }

    @Test
    void loginConClaveIncorrectaDevuelve401() {
        when(userRepository.findByEmail("cote@gmail.com")).thenReturn(Optional.of(user));
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> service.login(new LoginRequest("cote@gmail.com", "otra-clave")));
        assertEquals(HttpStatus.UNAUTHORIZED, error.getStatusCode());
    }

    @Test
    void loginConCorreoInexistenteDevuelve401() {
        when(userRepository.findByEmail("nadie@x.cl")).thenReturn(Optional.empty());
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> service.login(new LoginRequest("nadie@x.cl", "Cote1234")));
        assertEquals(HttpStatus.UNAUTHORIZED, error.getStatusCode());
    }

    @Test
    void cambiarClaveConActualIncorrectaDevuelve400SinGuardar() {
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> service.changePassword(1L, new ChangePasswordRequest("mala", "Nueva12345")));
        assertEquals(HttpStatus.BAD_REQUEST, error.getStatusCode());
        verify(userRepository, never()).save(any());
    }

    @Test
    void cambiarClaveConActualCorrectaGuardaNuevoHash() {
        service.changePassword(1L, new ChangePasswordRequest("Cote1234", "Nueva12345"));
        assertTrue(encoder.matches("Nueva12345", user.getPasswordHash()));
        verify(userRepository).save(user);
    }

    @Test
    void cuentaInexistenteAlCambiarClaveDevuelve401() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> service.changePassword(99L, new ChangePasswordRequest("a", "Nueva12345")));
        assertEquals(HttpStatus.UNAUTHORIZED, error.getStatusCode());
    }

    @Test
    void actualizarPerfilGuardaLosDatosSinEspacios() {
        UserResponse response = service.updateProfile(1L,
                new ProfileUpdateRequest("  María Pérez ", " 912345678 ", " RM ", " La Florida "));
        assertEquals("María Pérez", user.getName());
        assertEquals("912345678", user.getTelephone());
        assertEquals("La Florida", user.getCommune());
        assertEquals("María Pérez", response.name());
    }
}
