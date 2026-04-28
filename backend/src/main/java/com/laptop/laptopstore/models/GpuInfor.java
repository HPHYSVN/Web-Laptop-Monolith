package com.laptop.laptopstore.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gpu_infor")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GpuInfor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brand;
    private String model;
    
    @Column(name = "v_ram")
    private String vRam;
}
