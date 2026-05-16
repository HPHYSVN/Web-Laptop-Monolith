package com.laptop.laptopstore.dtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class BulkDeleteRequestDTO {
    @NotEmpty(message = "Danh sách ID không được rỗng")
    private List<Long> ids;
}
