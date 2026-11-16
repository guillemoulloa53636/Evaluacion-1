package cl.viajes.dto;

import cl.viajes.model.Sale;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

public record SaleDetailsResponse(
        @JsonProperty("sale_code") String saleCode,
        @JsonProperty("total_amount") long totalAmount,
        String status,
        @JsonProperty("created_at") LocalDateTime createdAt,
        List<TicketResponse> tickets
) {
    public static SaleDetailsResponse from(Sale sale, List<TicketResponse> tickets) {
        return new SaleDetailsResponse(
                sale.getSaleCode(), sale.getTotalAmount(), sale.getStatus(), sale.getCreatedAt(), tickets
        );
    }
}
