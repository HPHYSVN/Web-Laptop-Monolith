package com.laptop.laptopstore.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserStatusRequestDTO {
    @NotBlank(message = "Trạng thái người dùng không được để trống")
    @Pattern(regexp = "ACTIVE|INACTIVE|BANNED", message = "Trạng thái người dùng không hợp lệ")
    private String status;
}
