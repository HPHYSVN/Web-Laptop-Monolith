package com.laptop.laptopstore.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class MergeCartRequestDTO {
    @NotNull(message = "User ID không được để trống")
    private Long userId;

    @Valid
    private List<CartItemDTO> items;

    @Data
    public static class CartItemDTO {
        @NotNull(message = "Product detail ID không được để trống")
        private Long productDetailId;

        @NotNull(message = "Số lượng không được để trống")
        @Min(value = 1, message = "Số lượng phải lớn hơn 0")
        private Integer quantity;
    }
}
