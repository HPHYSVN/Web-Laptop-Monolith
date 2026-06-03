package com.laptop.laptopstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RevenuePointDTO {
    private String label;
    private Double revenue;
    private Long orderCount;
}
