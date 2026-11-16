package cl.viajes.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record PurchaseRequest(@NotEmpty List<@NotNull @Valid PurchaseItem> items) {
}
