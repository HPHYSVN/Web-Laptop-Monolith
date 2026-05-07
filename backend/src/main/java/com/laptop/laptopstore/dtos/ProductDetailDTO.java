package com.laptop.laptopstore.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductDetailDTO {
    private Long id;
    private Integer quantity;
    private Double price;
    private String color;
    private String imageDetail;
    private ProductSpecsDTO specs;
}
