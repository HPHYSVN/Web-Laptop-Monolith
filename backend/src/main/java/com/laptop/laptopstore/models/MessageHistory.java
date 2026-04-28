package com.laptop.laptopstore.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "message_histories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id", nullable = false)
    private Message message;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime timestamp;

    @Column(name = "is_read")
    private Boolean isRead;
}
