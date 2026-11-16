package cl.viajes.repository;

import cl.viajes.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    List<ContactMessage> findAllByOrderByCreatedAtDescIdDesc();
    long countByStatus(String status);
    long countByTypeAndStatusNotAndCreatedAtGreaterThanEqual(String type, String excludedStatus, LocalDateTime from);
}
