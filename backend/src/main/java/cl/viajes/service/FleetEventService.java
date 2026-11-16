package cl.viajes.service;

import cl.viajes.dto.FleetEventCreateRequest;
import cl.viajes.dto.FleetEventResponse;
import cl.viajes.dto.FleetEventUpdateRequest;
import cl.viajes.model.FleetEvent;
import cl.viajes.repository.FleetEventRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FleetEventService {

    private final FleetEventRepository repository;
    private final ActivityLogService activityLog;

    public FleetEventService(FleetEventRepository repository, ActivityLogService activityLog) {
        this.repository = repository;
        this.activityLog = activityLog;
    }

    public List<FleetEventResponse> list() {
        return repository.findAllByOrderByReportedAtDesc().stream()
                .map(FleetEventResponse::from)
                .toList();
    }

    public FleetEventResponse create(FleetEventCreateRequest request) {
        String status = request.status() == null ? "con_falla" : request.status();
        FleetEvent event = new FleetEvent();
        event.setVehicle(request.vehicle().trim());
        event.setDescription(request.description().trim());
        event.setStatus(status);
        if ("reparado".equals(status)) {
            event.setResolvedAt(LocalDateTime.now());
        }
        repository.save(event);
        activityLog.record("flota", "Reporte de bus " + event.getVehicle() + ": " + event.getDescription(), "Administrador");
        return FleetEventResponse.from(event);
    }

    public FleetEventResponse update(Long id, FleetEventUpdateRequest request) {
        FleetEvent event = findEvent(id);
        String previousStatus = event.getStatus();
        if (request.status() != null) {
            event.setStatus(request.status());
            event.setResolvedAt("reparado".equals(request.status()) ? LocalDateTime.now() : null);
        }
        if (request.description() != null && !request.description().isBlank()) {
            event.setDescription(request.description().trim());
        }
        if (request.adminNotes() != null) {
            event.setAdminNotes(request.adminNotes().trim());
        }
        boolean hasChanges = request.status() != null
                || (request.description() != null && !request.description().isBlank())
                || request.adminNotes() != null;
        if (!hasChanges) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "No hay cambios que guardar");
        }

        repository.save(event);
        if (request.status() != null && !previousStatus.equals(request.status())) {
            activityLog.record("flota",
                    "Bus " + event.getVehicle() + ": estado cambiado de " + previousStatus + " a " + request.status(),
                    "Administrador");
        }
        return FleetEventResponse.from(event);
    }

    public void delete(Long id) {
        FleetEvent event = findEvent(id);
        repository.delete(event);
        activityLog.record("flota", "Evento de flota eliminado: bus " + event.getVehicle() + " - " + event.getDescription(), "Administrador");
    }

    private FleetEvent findEvent(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento de flota no encontrado"));
    }
}
