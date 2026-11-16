package cl.viajes.repository;

import cl.viajes.model.FleetEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FleetEventRepository extends JpaRepository<FleetEvent, Long> {
    List<FleetEvent> findAllByOrderByReportedAtDesc();
    long countByStatusNot(String status);
}
