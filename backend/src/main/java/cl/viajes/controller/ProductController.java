package cl.viajes.controller;

import cl.viajes.model.Product;
import cl.viajes.repository.ProductRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@Tag(name = "Productos", description = "Operaciones sobre las rutas disponibles")
public class ProductController {

    private final ProductRepository repository;

    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Product> list() {
        return repository.findAll();
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Obtener una ruta", description = "Busca una ruta por su identificador slug.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Ruta encontrada",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Product.class))),
            @ApiResponse(responseCode = "404", description = "No existe una ruta con ese slug",
                    content = @Content)
    })
    public Product get(@PathVariable String slug) {
        return repository.findBySlug(slug).orElseThrow(this::notFound);
    }

    @PostMapping
    public ResponseEntity<Product> create(@Valid @RequestBody Product product) {
        validateSchedules(product);
        if (repository.existsBySlug(product.getSlug())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El slug ya existe");
        }
        if (product.getId() == null || product.getId().isBlank()) {
            product.setId("PROD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        } else if (repository.existsById(product.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El identificador ya existe");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(product));
    }

    @PutMapping("/{slug}")
    public Product update(@PathVariable String slug, @Valid @RequestBody Product body) {
        validateSchedules(body);
        Product existing = repository.findBySlug(slug).orElseThrow(this::notFound);
        if (!slug.equals(body.getSlug()) && repository.existsBySlug(body.getSlug())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El slug ya existe");
        }
        body.setId(existing.getId());
        return repository.save(body);
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<Void> delete(@PathVariable String slug) {
        repository.delete(repository.findBySlug(slug).orElseThrow(this::notFound));
        return ResponseEntity.noContent().build();
    }

    private ResponseStatusException notFound() {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException exception) {
        Map<String, String> details = new LinkedHashMap<>();
        for (FieldError error : exception.getBindingResult().getFieldErrors()) {
            details.putIfAbsent(error.getField(), error.getDefaultMessage());
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("error", "Los datos del producto no son válidos");
        response.put("details", details);
        return ResponseEntity.unprocessableEntity().body(response);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataConflict() {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "El identificador o slug ya está en uso"));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleRequestError(ResponseStatusException exception) {
        return ResponseEntity.status(exception.getStatusCode())
                .body(Map.of("error", exception.getReason() == null ? "Solicitud no válida" : exception.getReason()));
    }

    private void validateSchedules(Product product) {
        int capacityLimit = switch (product.getType()) {
            case "Semi Cama" -> 44;
            case "Salón Cama" -> 56;
            default -> 100;
        };

        for (int index = 0; index < product.getSchedules().size(); index++) {
            Object value = product.getSchedules().get(index);
            if (!(value instanceof Map<?, ?> schedule)) {
                throw invalidSchedule(index, capacityLimit);
            }

            String id = stringValue(schedule.get("id"));
            String date = stringValue(schedule.get("date"));
            String time = stringValue(schedule.get("time"));
            String platform = stringValue(schedule.get("platform"));
            Object capacityValue = schedule.get("capacity");

            boolean validDate = date.matches("\\d{4}-\\d{2}-\\d{2}");
            if (validDate) {
                try {
                    LocalDate.parse(date);
                } catch (DateTimeParseException exception) {
                    validDate = false;
                }
            }

            if (id.isBlank() || !validDate ||
                    !time.matches("(?:[01]\\d|2[0-3]):[0-5]\\d") ||
                    platform.isBlank() ||
                    !(capacityValue instanceof Number capacityNumber) ||
                    capacityNumber.doubleValue() != capacityNumber.intValue() ||
                    capacityNumber.intValue() < 1 ||
                    capacityNumber.intValue() > capacityLimit) {
                throw invalidSchedule(index, capacityLimit);
            }
        }
    }

    private String stringValue(Object value) {
        return value instanceof String string ? string.trim() : "";
    }

    private ResponseStatusException invalidSchedule(int index, int capacityLimit) {
        return new ResponseStatusException(
                HttpStatus.UNPROCESSABLE_ENTITY,
                "Revisa la fecha, hora, andén, identificador y cupos de la salida " + (index + 1)
                        + ". El máximo permitido es " + capacityLimit + " asientos");
    }
}
