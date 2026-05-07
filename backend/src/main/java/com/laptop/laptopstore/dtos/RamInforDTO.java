package com.laptop.laptopstore.dtos;

import lombok.Data;

@Data
public class RamInforDTO {
    private Long id;
    private String size;
    private String type;
    private String bus;
    private Integer slots;
}
