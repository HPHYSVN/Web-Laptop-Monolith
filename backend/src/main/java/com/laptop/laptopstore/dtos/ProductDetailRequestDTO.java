package com.laptop.laptopstore.dtos;

import lombok.Data;

@Data
public class ProductDetailRequestDTO {
    private Integer quantity;
    private Double price;
    private String color;
    private String imageDetail;
    private ProductSpecsRequestDTO specs;
}
