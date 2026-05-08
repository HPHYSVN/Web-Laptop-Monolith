package com.laptop.laptopstore.dtos;

import lombok.Data;
import java.util.List;

@Data
public class MergeCartRequestDTO {
    private Long userId;
    private List<CartItemDTO> items;

    @Data
    public static class CartItemDTO {
        private Long productDetailId;
        private Integer quantity;
    }
}
