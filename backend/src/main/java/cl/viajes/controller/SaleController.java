package cl.viajes.controller;

import cl.viajes.dto.SaleCancellationRequest;
import cl.viajes.service.SaleService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@io.swagger.v3.oas.annotations.tags.Tag(name = "Ventas", description = "Anulación de boletos y ventas (administrador)")
@RestController
@RequestMapping("/api/v1/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping("/cancellations")
    public Map<String, Object> cancel(@Valid @RequestBody SaleCancellationRequest request) {
        return Map.of("cancelled", true, "sale_status", saleService.cancel(request));
    }
}
