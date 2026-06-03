package com.laptop.laptopstore.dtos;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardSummaryDTO {
    private long totalUsers;
    private long totalOrders;
    private long totalProducts;
    private double totalRevenue;
    private long deliveredOrders;
    private long newUsers;
    private double averageOrderValue;
    private List<LabelValueDTO> ordersByStatus;
}
