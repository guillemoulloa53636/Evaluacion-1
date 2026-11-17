package cl.viajes.controller;

import cl.viajes.dto.FleetEventCreateRequest;
import cl.viajes.dto.FleetEventResponse;
import cl.viajes.dto.FleetEventUpdateRequest;
import cl.viajes.service.FleetEventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@io.swagger.v3.oas.annotations.tags.Tag(name = "Flota", description = "Eventos de flota y buses (administrador)")
@RestController
@RequestMapping("/api/v1/fleet-events")
public class FleetEventController {

    private final FleetEventService service;

    public FleetEventController(FleetEventService service) {
        this.service = service;
    }

    @GetMapping
    public List<FleetEventResponse> list() {
        return service.list();
    }

    @PostMapping
    public ResponseEntity<FleetEventResponse> create(@Valid @RequestBody FleetEventCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public Map<String, Boolean> update(@PathVariable Long id, @Valid @RequestBody FleetEventUpdateRequest request) {
        service.update(id, request);
        return Map.of("updated", true);
    }

    @DeleteMapping("/{id}")
    public Map<String, Boolean> delete(@PathVariable Long id) {
        service.delete(id);
        return Map.of("deleted", true);
    }
}
