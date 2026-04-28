package com.laptop.laptopstore.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products_specs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductsSpecs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cpu_id")
    private CpuInfor cpu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ram_id")
    private RamInfor ram;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "storage_id")
    private StorageInfor storage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gpu_id")
    private GpuInfor gpu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screen_id")
    private ScreenInfor screen;

    private String battery;
    private String weight;
    private String os;
}
