package cl.viajes.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record PurchaseResponse(
        @JsonProperty("sale_code") String saleCode,
        @JsonProperty("total_amount") long totalAmount,
        List<TicketResponse> tickets
) {
}
