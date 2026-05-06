package com.laptop.laptopstore.dtos;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ProductDTO {
    private Long id;
    private String productName;
    private String productDescription;
    private LocalDateTime createDate;
    private String categoryName;
}
