package com.laptop.laptopstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LabelValueDTO {
    private String label;
    private Long value;
}
