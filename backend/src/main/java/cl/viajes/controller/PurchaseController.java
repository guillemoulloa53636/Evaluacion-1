package cl.viajes.controller;

import cl.viajes.dto.PurchaseRequest;
import cl.viajes.dto.PurchaseResponse;
import cl.viajes.dto.SaleDetailsResponse;
import cl.viajes.service.PurchaseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/purchases")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @PostMapping
    public ResponseEntity<PurchaseResponse> create(@Valid @RequestBody PurchaseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(purchaseService.createPurchase(request));
    }

    @GetMapping("/{saleCode}")
    public SaleDetailsResponse get(@PathVariable String saleCode) {
        return purchaseService.getPurchase(saleCode);
    }
}
