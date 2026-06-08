package com.laptop.laptopstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductSalesDTO {
    private String productName;
    private Integer quantity;
    private Double revenue;
    private Double revenueShare;
}
