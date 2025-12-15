package com.taivillavungtau.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Thông tin khách nhập (Rất ít)
    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber; // Quan trọng nhất

    @Column(name = "note", columnDefinition = "TEXT")
    private String note; // Lời nhắn của khách

    // Thông tin hệ thống tự bắt (Frontend gửi ngầm)
    @Column(name = "property_code")
    private String propertyCode; // Khách đang quan tâm căn nào (VD: MS44)

    // --- PHẦN QUẢN LÝ CỦA ADMIN (MÔI GIỚI) ---
    // Bạn sẽ điền những cái này sau khi gọi điện
    @Column(name = "status")
    private String status; // NEW (Mới), CONTACTED (Đã gọi), CLOSED (Chốt), CANCELLED (Hủy)

    @Column(name = "admin_note", columnDefinition = "TEXT")
    private String adminNote; // Ghi chú nội bộ: "Khách đi 15 người, ngày 2/9, ngân sách 5tr"

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = "NEW";
    }
}