package com.laptop.laptopstore.dtos;

import lombok.Data;

@Data
public class StorageInforDTO {
    private Long id;
    private String type;
    private String capacity;
    private String interfaceName;
}
