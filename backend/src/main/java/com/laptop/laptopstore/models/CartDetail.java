package com.laptop.laptopstore.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_detail_id", nullable = false)
    private ProductDetail productDetail;

    private Integer quantity;
    private Double price;
    private String color;
}
