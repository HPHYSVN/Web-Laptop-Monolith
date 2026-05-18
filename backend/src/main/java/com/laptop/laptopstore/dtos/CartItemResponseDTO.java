package com.laptop.laptopstore.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItemResponseDTO {
    private Long id;
    private Long productDetailId;
    private String productName;
    private Integer quantity;
    private Double price;
    private String color;
    private String image;
}
