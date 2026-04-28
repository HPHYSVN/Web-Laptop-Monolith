package com.laptop.laptopstore.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ram_infor")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RamInfor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String size;
    private String type;
    private String bus;
    private Integer slots;
}
