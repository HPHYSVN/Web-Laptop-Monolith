package com.laptop.laptopstore.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductSpecsDTO {
    private Long id;
    private CpuInforDTO cpu;
    private RamInforDTO ram;
    private StorageInforDTO storage;
    private GpuInforDTO gpu;
    private ScreenInforDTO screen;
    private String battery;
    private String weight;
    private String os;
}
