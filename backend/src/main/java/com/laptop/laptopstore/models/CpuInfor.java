package com.laptop.laptopstore.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cpu_infor")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CpuInfor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brands;
    private String speed;
    private String model;
    private Integer cores;
    private Integer threads;
    
    @Column(name = "base_clock")
    private String baseClock;
    
    @Column(name = "boost_clock")
    private String boostClock;
    
    private String cache;
}
