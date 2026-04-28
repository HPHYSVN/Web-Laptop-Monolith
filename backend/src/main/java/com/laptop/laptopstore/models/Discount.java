package com.laptop.laptopstore.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "discounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Discount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(name = "discount_percent")
    private Double discountPercent;

    @Column(name = "max_percent")
    private Double maxPercent;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer quantity;
}
