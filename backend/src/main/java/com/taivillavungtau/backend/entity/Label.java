package com.taivillavungtau.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "labels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Label {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 7)
    private String color; // HEX color code (e.g., #FF6B6B)

    @Column(name = "icon_code")
    private String iconCode; // Lucide icon name (optional)
}
