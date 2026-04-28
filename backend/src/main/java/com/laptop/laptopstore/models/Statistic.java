package com.laptop.laptopstore.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "statistics")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Statistic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private LocalDate date;

    @Column(name = "total_orders")
    private Integer totalOrders;

    @Column(name = "total_sales")
    private Double totalSales;

    @Column(name = "total_users")
    private Integer totalUsers;
}
