package cl.viajes.dto;

import cl.viajes.model.User;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String name,
        String email,
        String telephone,
        String region,
        String commune,
        String role,
        LocalDateTime createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getTelephone(),
                user.getRegion(),
                user.getCommune(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
