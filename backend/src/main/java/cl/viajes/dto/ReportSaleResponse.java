package cl.viajes.dto;

import cl.viajes.model.Sale;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

public record ReportSaleResponse(
        @JsonProperty("sale_code") String saleCode,
        @JsonProperty("total_amount") long totalAmount,
        String status,
        @JsonProperty("created_at") LocalDateTime createdAt,
        List<ReportTicketResponse> tickets
) {
    public static ReportSaleResponse from(Sale sale) {
        return new ReportSaleResponse(
                sale.getSaleCode(), sale.getTotalAmount(), sale.getStatus(), sale.getCreatedAt(),
                sale.getTickets().stream().map(ReportTicketResponse::from).toList()
        );
    }
}
