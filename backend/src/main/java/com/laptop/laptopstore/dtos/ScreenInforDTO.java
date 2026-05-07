package com.laptop.laptopstore.dtos;

import lombok.Data;

@Data
public class ScreenInforDTO {
    private Long id;
    private String size;
    private String resolution;
    private String panel;
    private String refreshRate;
    private String brightness;
}
