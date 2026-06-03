package com.laptop.laptopstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RevenueReportRowDTO {
    private Long orderId;
    private LocalDateTime orderDate;
    private String customerName;
    private String receiverName;
    private String status;
    private Double totalPrice;
}
