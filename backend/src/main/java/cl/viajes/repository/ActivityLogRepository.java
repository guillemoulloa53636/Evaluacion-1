package cl.viajes.repository;

import cl.viajes.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findTop200ByCreatedAtGreaterThanEqualOrderByCreatedAtDescIdDesc(LocalDateTime from);
}
