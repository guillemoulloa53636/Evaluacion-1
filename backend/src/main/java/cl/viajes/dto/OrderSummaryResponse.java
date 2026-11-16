package cl.viajes.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public record OrderSummaryResponse(
        @JsonProperty("sale_code") String saleCode,
        @JsonProperty("total_amount") long totalAmount,
        String status,
        @JsonProperty("created_at") LocalDateTime createdAt,
        @JsonProperty("ticket_count") long ticketCount
) {
}
