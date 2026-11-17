package cl.viajes.controller;

import cl.viajes.dto.PurchaseRequest;
import cl.viajes.dto.PurchaseResponse;
import cl.viajes.dto.SaleDetailsResponse;
import cl.viajes.service.PurchaseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@io.swagger.v3.oas.annotations.tags.Tag(name = "Compras", description = "Compra de boletos, consulta por código e historial del usuario")
@RestController
@RequestMapping("/api/v1/purchases")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @PostMapping
    public ResponseEntity<PurchaseResponse> create(
            @Valid @RequestBody PurchaseRequest request,
            org.springframework.security.core.Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(purchaseService.createPurchase(request, userId(authentication)));
    }

    @GetMapping("/mine")
    public java.util.List<cl.viajes.dto.OrderSummaryResponse> mine(org.springframework.security.core.Authentication authentication) {
        return purchaseService.listMine(userId(authentication));
    }

    private Long userId(org.springframework.security.core.Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) return null;
        try {
            return Long.valueOf(authentication.getName());
        } catch (NumberFormatException exception) {
            return null;
        }
    }

    @GetMapping("/{saleCode}")
    public SaleDetailsResponse get(@PathVariable String saleCode) {
        return purchaseService.getPurchase(saleCode);
    }
}
