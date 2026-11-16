package cl.viajes.service;

import cl.viajes.model.ActivityLog;
import cl.viajes.repository.ActivityLogRepository;
import org.springframework.stereotype.Service;

@Service
public class ActivityLogService {

    private final ActivityLogRepository repository;

    public ActivityLogService(ActivityLogRepository repository) {
        this.repository = repository;
    }

    public void record(String type, String description, String actor) {
        ActivityLog event = new ActivityLog();
        event.setType(type);
        event.setDescription(limit(description, 500));
        event.setActor(limit(actor == null || actor.isBlank() ? "Sistema" : actor, 150));
        repository.save(event);
    }

    private String limit(String value, int maxLength) {
        return value.length() <= maxLength ? value : value.substring(0, maxLength);
    }
}
