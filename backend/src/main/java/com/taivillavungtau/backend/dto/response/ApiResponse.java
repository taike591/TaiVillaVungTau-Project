package com.taivillavungtau.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Field nào null sẽ tự động ẩn đi giúp JSON gọn
public class ApiResponse<T> {

    private int status;          // HTTP Status Code
    private String message;      // Thông báo
    private T data;              // Dữ liệu thành công
    private Object errors;       // Chi tiết lỗi (nếu có)
    private LocalDateTime timestamp;

    // 1. Hàm tiện ích cho Thành công (Có data)
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .status(200)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    // 2. Hàm tiện ích cho Thành công (Không data - ví dụ Delete)
    public static <T> ApiResponse<T> success(String message) {
        return ApiResponse.<T>builder()
                .status(200)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }

    // 3. Hàm tiện ích cho Lỗi
    public static <T> ApiResponse<T> error(int status, String message, Object errors) {
        return ApiResponse.<T>builder()
                .status(status)
                .message(message)
                .errors(errors)
                .timestamp(LocalDateTime.now())
                .build();
    }
}