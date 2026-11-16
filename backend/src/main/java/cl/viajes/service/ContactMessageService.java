package cl.viajes.service;

import cl.viajes.dto.ContactMessageCreateRequest;
import cl.viajes.dto.ContactMessageResponse;
import cl.viajes.dto.ContactMessageUpdateRequest;
import cl.viajes.model.ContactMessage;
import cl.viajes.repository.ContactMessageRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class ContactMessageService {

    private static final Set<String> STATUSES = Set.of("no_leido", "leido", "aplicado", "archivado", "eliminado");
    private static final Set<String> TYPES = Set.of("mensaje", "reclamo");

    private final ContactMessageRepository repository;
    private final ActivityLogService activityLog;

    public ContactMessageService(ContactMessageRepository repository, ActivityLogService activityLog) {
        this.repository = repository;
        this.activityLog = activityLog;
    }

    public List<ContactMessageResponse> list(String status, String type) {
        if (status != null && !STATUSES.contains(status)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Estado no válido");
        }
        if (type != null && !TYPES.contains(type)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Tipo no válido");
        }

        return repository.findAllByOrderByCreatedAtDescIdDesc().stream()
                .filter(message -> status != null ? status.equals(message.getStatus()) : !"eliminado".equals(message.getStatus()))
                .filter(message -> type == null || type.equals(message.getType()))
                .map(ContactMessageResponse::from)
                .toList();
    }

    public void create(ContactMessageCreateRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.name().trim());
        message.setEmail(request.email().trim().toLowerCase(Locale.ROOT));
        message.setMessage(request.message().trim());
        message.setType(request.isComplaint() ? "reclamo" : "mensaje");
        message.setStatus("no_leido");
        repository.save(message);
        activityLog.record(message.getType(),
                (request.isComplaint() ? "Nuevo reclamo" : "Nuevo mensaje de contacto") + " de " + message.getName(),
                message.getName());
    }

    public ContactMessageResponse update(Long id, ContactMessageUpdateRequest request) {
        if (request.status() == null && request.adminNotes() == null) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "No hay cambios que guardar");
        }
        ContactMessage message = findMessage(id);
        if (request.status() != null) {
            message.setStatus(request.status());
        }
        if (request.adminNotes() != null) {
            message.setAdminNotes(request.adminNotes().trim());
        }
        repository.save(message);
        if (request.status() != null) {
            String label = "reclamo".equals(message.getType()) ? "Reclamo" : "Mensaje";
            activityLog.record(message.getType(),
                    label + " de " + message.getName() + ": estado cambiado a " + message.getStatus().replace('_', ' '),
                    "Administrador");
        }
        return ContactMessageResponse.from(message);
    }

    public void delete(Long id, boolean permanent) {
        ContactMessage message = findMessage(id);
        if (permanent) {
            repository.delete(message);
        } else {
            message.setStatus("eliminado");
            repository.save(message);
        }
    }

    private ContactMessage findMessage(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mensaje no encontrado"));
    }
}
