package cl.viajes.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Size;

public record SaleCancellationRequest(
        @JsonProperty("ticket_code") String ticketCode,
        @JsonProperty("sale_code") String saleCode,
        @Size(max = 300) String reason
) {
}
