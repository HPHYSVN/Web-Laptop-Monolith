package com.laptop.laptopstore.dtos;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class OrderDTO {
    private Long id;
    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;
    private Double totalPrice;
    private String status;
    private LocalDateTime orderDate;
    private String username;
}
