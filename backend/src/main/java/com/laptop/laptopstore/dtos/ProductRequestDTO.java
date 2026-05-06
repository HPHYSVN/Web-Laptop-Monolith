package com.laptop.laptopstore.dtos;

import lombok.Data;

@Data
public class ProductRequestDTO {
    private String productName;
    private String productDescription;
    private Long categoryId;
}
