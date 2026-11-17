package cl.viajes.controller;

import cl.viajes.dto.AuthResponse;
import cl.viajes.dto.AuthSession;
import cl.viajes.dto.GoogleLoginRequest;
import cl.viajes.dto.LoginRequest;
import cl.viajes.dto.RegisterRequest;
import cl.viajes.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.Map;

@io.swagger.v3.oas.annotations.tags.Tag(name = "Autenticación", description = "Login, registro, Google, refresh, recuperación y cambio de contraseña, perfil")
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final String REFRESH_COOKIE = "viajes_refresh";
    private static final String REFRESH_COOKIE_PATH = "/api/v1/auth";

    private final AuthService authService;
    private final cl.viajes.service.PasswordResetService passwordResetService;
    private final boolean refreshCookieSecure;

    public AuthController(
            AuthService authService,
            cl.viajes.service.PasswordResetService passwordResetService,
            @Value("${app.auth.refresh-cookie-secure:true}") boolean refreshCookieSecure
    ) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
        this.refreshCookieSecure = refreshCookieSecure;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return sessionResponse(authService.login(request));
    }

    @PostMapping("/register")
    @org.springframework.web.bind.annotation.ResponseStatus(HttpStatus.CREATED)
    public Map<String, Boolean> register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> loginWithGoogle(@Valid @RequestBody GoogleLoginRequest request) {
        return sessionResponse(authService.loginWithGoogle(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @CookieValue(name = REFRESH_COOKIE, required = false) String refreshToken
    ) {
        return sessionResponse(authService.refresh(refreshToken));
    }

    @GetMapping("/me")
    public Map<String, Object> currentUser(Authentication authentication) {
        Long id = Long.valueOf(authentication.getName());
        return Map.of("user", authService.currentUser(id));
    }

    @PostMapping("/change-password")
    public Map<String, Boolean> changePassword(
            Authentication authentication,
            @Valid @RequestBody cl.viajes.dto.ChangePasswordRequest request
    ) {
        return authService.changePassword(Long.valueOf(authentication.getName()), request);
    }

    @PostMapping("/forgot-password")
    public Map<String, Boolean> forgotPassword(@Valid @RequestBody cl.viajes.dto.ForgotPasswordRequest request) {
        passwordResetService.requestReset(request.email());
        return Map.of("ok", true);
    }

    @PostMapping("/reset-password")
    public Map<String, Boolean> resetPassword(@Valid @RequestBody cl.viajes.dto.ResetPasswordRequest request) {
        passwordResetService.reset(request.token(), request.newPassword());
        return Map.of("ok", true);
    }

    @org.springframework.web.bind.annotation.PutMapping("/me")
    public Map<String, Object> updateProfile(
            Authentication authentication,
            @Valid @RequestBody cl.viajes.dto.ProfileUpdateRequest request
    ) {
        return Map.of("user", authService.updateProfile(Long.valueOf(authentication.getName()), request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Boolean>> logout(
            @CookieValue(name = REFRESH_COOKIE, required = false) String refreshToken
    ) {
        authService.logout(refreshToken);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, clearedRefreshCookie().toString())
                .body(Map.of("ok", true));
    }

    private ResponseEntity<AuthResponse> sessionResponse(AuthSession session) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_COOKIE, session.refreshToken())
                .httpOnly(true)
                .secure(refreshCookieSecure)
                .sameSite("Strict")
                .path(REFRESH_COOKIE_PATH)
                .maxAge(Duration.ofSeconds(session.refreshExpiresInSeconds()))
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                .header(HttpHeaders.PRAGMA, "no-cache")
                .body(session.response());
    }

    private ResponseCookie clearedRefreshCookie() {
        return ResponseCookie.from(REFRESH_COOKIE, "")
                .httpOnly(true)
                .secure(refreshCookieSecure)
                .sameSite("Strict")
                .path(REFRESH_COOKIE_PATH)
                .maxAge(Duration.ZERO)
                .build();
    }
}
