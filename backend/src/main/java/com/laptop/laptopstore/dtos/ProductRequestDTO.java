package com.laptop.laptopstore.dtos;

import lombok.Data;
import java.util.List;

@Data
public class ProductRequestDTO {
    private String productName;
    private String productDescription;
    private Long categoryId;
    private List<ProductDetailRequestDTO> details;
}
