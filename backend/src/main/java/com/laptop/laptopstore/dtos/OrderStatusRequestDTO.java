package com.laptop.laptopstore.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class OrderStatusRequestDTO {
    @NotBlank(message = "Trạng thái đơn hàng không được để trống")
    @Pattern(regexp = "PENDING|PROCESSING|DELIVERED|CANCELLED|CANCELED", message = "Trạng thái đơn hàng không hợp lệ")
    private String status;
}
