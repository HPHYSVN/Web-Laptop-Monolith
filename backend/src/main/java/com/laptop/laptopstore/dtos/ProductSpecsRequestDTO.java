package com.laptop.laptopstore.dtos;

import lombok.Data;

@Data
public class ProductSpecsRequestDTO {
    private Long cpuId;
    private Long ramId;
    private Long storageId;
    private Long gpuId;
    private Long screenId;
    private String battery;
    private String weight;
    private String os;
}
