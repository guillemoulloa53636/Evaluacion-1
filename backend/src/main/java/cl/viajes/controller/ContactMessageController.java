package cl.viajes.controller;

import cl.viajes.dto.ContactMessageCreateRequest;
import cl.viajes.dto.ContactMessageResponse;
import cl.viajes.dto.ContactMessageUpdateRequest;
import cl.viajes.service.ContactMessageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@io.swagger.v3.oas.annotations.tags.Tag(name = "Mensajes de contacto", description = "Mensajes y reclamos de clientes")
@RestController
@RequestMapping("/api/v1/contact-messages")
public class ContactMessageController {

    private final ContactMessageService service;

    public ContactMessageController(ContactMessageService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Map<String, Boolean>> create(@Valid @RequestBody ContactMessageCreateRequest request) {
        service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("sent", true));
    }

    @GetMapping
    public List<ContactMessageResponse> list(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type
    ) {
        return service.list(status, type);
    }

    @PutMapping("/{id}")
    public Map<String, ContactMessageResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ContactMessageUpdateRequest request
    ) {
        return Map.of("message", service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public Map<String, Boolean> delete(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean permanent
    ) {
        service.delete(id, permanent);
        return Map.of("deleted", true);
    }
}
