package com.laptop.laptopstore.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DiscountDTO {
    private Long id;
    private String code;
    private Double discountPercent;
    private Double maxPercent;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String description;
    private Integer quantity;
    private String status; // ACTIVE, EXPIRED, FUTURE
}
