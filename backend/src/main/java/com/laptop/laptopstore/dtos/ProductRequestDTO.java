package com.laptop.laptopstore.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class ProductRequestDTO {
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String productName;
    private String productDescription;
    private Long categoryId;
    @Valid
    private List<ProductDetailRequestDTO> details;
}
