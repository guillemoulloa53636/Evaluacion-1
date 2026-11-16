package cl.viajes.service;

import cl.viajes.dto.AuthResponse;
import cl.viajes.dto.GoogleLoginRequest;
import cl.viajes.dto.LoginRequest;
import cl.viajes.dto.RegisterRequest;
import cl.viajes.dto.UserResponse;
import cl.viajes.model.User;
import cl.viajes.repository.UserRepository;
import cl.viajes.security.GoogleIdentityVerifier;
import cl.viajes.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final GoogleIdentityVerifier googleIdentityVerifier;
    private final ActivityLogService activityLog;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            GoogleIdentityVerifier googleIdentityVerifier,
            ActivityLogService activityLog
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.googleIdentityVerifier = googleIdentityVerifier;
        this.activityLog = activityLog;
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        User user = userRepository.findByEmail(email)
                .filter(candidate -> passwordEncoder.matches(request.password(), candidate.getPasswordHash()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "El correo o la contraseña no son correctos"
                ));

        return tokenResponse(user);
    }

    public Map<String, Boolean> register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una cuenta con ese correo");
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setTelephone(request.telephone() == null ? "" : request.telephone().trim());
        user.setRegion(request.region().trim());
        user.setCommune(request.commune().trim());
        user.setRole("customer");
        userRepository.save(user);
        activityLog.record("registro", "Nueva cuenta registrada: " + user.getName() + " (" + email + ")", user.getName());
        return Map.of("created", true);
    }

    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {
        GoogleIdentityVerifier.GoogleIdentity identity = googleIdentityVerifier.verify(request.credential());
        String email = identity.email().trim().toLowerCase(Locale.ROOT);
        User user = userRepository.findByEmail(email).orElseGet(() -> createGoogleUser(email, identity.name()));
        return tokenResponse(user);
    }

    public UserResponse currentUser(Long id) {
        return userRepository.findById(id)
                .map(UserResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "La cuenta ya no existe"));
    }

    private User createGoogleUser(String email, String name) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.setRole("customer");
        userRepository.save(user);
        activityLog.record("registro", "Nueva cuenta registrada con Google: " + name + " (" + email + ")", name);
        return user;
    }

    private AuthResponse tokenResponse(User user) {
        return new AuthResponse(
                jwtService.generateToken(user),
                "Bearer",
                jwtService.getExpirationSeconds(),
                UserResponse.from(user)
        );
    }
}
