package com.laptop.laptopstore.dtos;

import lombok.Data;

@Data
public class ProductFilterDTO {
    private String keyword;
    private Long categoryId;
    private Double minPrice;
    private Double maxPrice;
    private String ramSize; // Ví dụ: "16GB"
    private String cpuBrand; // Ví dụ: "Intel", "AMD", "Apple"
    private String storageCapacity; // Ví dụ: "512GB"
}
