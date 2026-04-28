package com.laptop.laptopstore.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "screen_infor")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScreenInfor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String size;
    private String resolution;
    private String panel;
    
    @Column(name = "refresh_rate")
    private String refreshRate;
    
    private String brightness;
}
