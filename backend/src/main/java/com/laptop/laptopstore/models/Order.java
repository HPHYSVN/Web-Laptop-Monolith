package com.laptop.laptopstore.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "discount_id")
    private Discount discount;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    private String status;

    @Column(name = "total_price")
    private Double totalPrice;

    @Column(name = "receiver_name")
    private String receiverName;

    @Column(name = "receiver_address", columnDefinition = "TEXT")
    private String receiverAddress;

    @Column(name = "receiver_phone")
    private String receiverPhone;
}
