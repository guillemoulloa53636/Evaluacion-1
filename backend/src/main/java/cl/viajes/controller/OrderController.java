package cl.viajes.controller;

import cl.viajes.dto.OrderSummaryResponse;
import cl.viajes.dto.SaleDetailsResponse;
import cl.viajes.service.PurchaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Órdenes", description = "Consulta de órdenes de venta (vendedor y administrador)")
@RestController
@RequestMapping("/api/v1/ordenes")
public class OrderController {

    private final PurchaseService purchaseService;

    public OrderController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @Operation(summary = "Listar órdenes", description = "Devuelve el resumen de todas las órdenes. Requiere rol SELLER o ADMIN.")
    @GetMapping
    public List<OrderSummaryResponse> list() {
        return purchaseService.listOrders();
    }

    @Operation(summary = "Detalle de una orden", description = "Devuelve la orden con sus boletos. Requiere rol SELLER o ADMIN.")
    @GetMapping("/{saleCode}")
    public SaleDetailsResponse detail(@PathVariable String saleCode) {
        return purchaseService.getPurchase(saleCode);
    }
}
