package cl.viajes.controller;

import cl.viajes.dto.OrderSummaryResponse;
import cl.viajes.service.PurchaseService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ordenes")
public class OrderController {

    private final PurchaseService purchaseService;

    public OrderController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @GetMapping
    public List<OrderSummaryResponse> list() {
        return purchaseService.listOrders();
    }
}
