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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
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
        if (repository.existsBySlug(product.getSlug())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El slug ya existe");
        }
        if (product.getId() == null || product.getId().isBlank()) {
            product.setId("PROD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(product));
    }

    @PutMapping("/{slug}")
    public Product update(@PathVariable String slug, @Valid @RequestBody Product body) {
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
}
