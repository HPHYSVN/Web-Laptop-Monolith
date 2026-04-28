package com.laptop.laptopstore.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "products_specs_id")
    private ProductsSpecs productsSpecs;

    private Integer quantity;

    private Double price;

    @Column(name = "image_detail")
    private String imageDetail;

    private String color;
}
