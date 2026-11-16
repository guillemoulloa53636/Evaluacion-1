package cl.viajes.service;

import cl.viajes.dto.UserCreateRequest;
import cl.viajes.dto.UserResponse;
import cl.viajes.dto.UserUpdateRequest;
import cl.viajes.model.User;
import cl.viajes.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponse> list() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    public UserResponse get(Long id) {
        return UserResponse.from(findUser(id));
    }

    public UserResponse create(UserCreateRequest request) {
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una cuenta con ese correo");
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setTelephone(normalizeOptional(request.telephone()));
        user.setRegion(normalizeOptional(request.region()));
        user.setCommune(normalizeOptional(request.commune()));
        user.setRole(request.role() == null ? "customer" : request.role());
        return UserResponse.from(userRepository.save(user));
    }

    public UserResponse update(Long id, UserUpdateRequest request) {
        User user = findUser(id);
        String email = normalizeEmail(request.email());
        if (!email.equals(user.getEmail()) && userRepository.existsByEmailAndIdNot(email, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una cuenta con ese correo");
        }
        if ("admin".equals(user.getRole()) && "customer".equals(request.role())
                && userRepository.countByRole("admin") <= 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No se puede quitar el último administrador");
        }

        user.setName(request.name().trim());
        user.setEmail(email);
        user.setTelephone(normalizeOptional(request.telephone()));
        user.setRegion(normalizeOptional(request.region()));
        user.setCommune(normalizeOptional(request.commune()));
        user.setRole(request.role());
        return UserResponse.from(userRepository.save(user));
    }

    public void delete(Long id, String authenticatedUserId) {
        if (id.toString().equals(authenticatedUserId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No puedes eliminar tu propia cuenta");
        }

        User user = findUser(id);
        if ("admin".equals(user.getRole()) && userRepository.countByRole("admin") <= 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No se puede eliminar el último administrador");
        }
        userRepository.delete(user);
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeOptional(String value) {
        return value == null ? "" : value.trim();
    }
}
