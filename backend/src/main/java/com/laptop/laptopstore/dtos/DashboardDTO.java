package com.laptop.laptopstore.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardDTO {
    private long totalUsers;
    private long totalOrders;
    private double totalRevenue;
    private long totalProducts;
}
