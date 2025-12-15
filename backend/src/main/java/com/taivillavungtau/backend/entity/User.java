package com.taivillavungtau.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter // Lombok sẽ tự sinh getter
@Setter // Lombok sẽ tự sinh setter (setEmail, setPhoneNumber...)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String fullName;

    private String role;

    // --- CÁC TRƯỜNG MỚI ---
    @Column(unique = true)
    private String email;

    private String phoneNumber;

    @Column(columnDefinition = "boolean default true")
    @Builder.Default
    private boolean active = true;
}