package com.laptop.laptopstore.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "storage_infor")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StorageInfor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String capacity;
    private String interfaceName; // Avoid using reserved keyword 'interface'
}
