package com.laptop.laptopstore.dtos;

import lombok.Data;

@Data
public class CpuInforDTO {
    private Long id;
    private String brands;
    private String speed;
    private String model;
    private Integer cores;
    private Integer threads;
    private String baseClock;
    private String boostClock;
    private String cache;
}
