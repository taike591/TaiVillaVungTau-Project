package com.taivillavungtau.backend.constant;

public class AppConstants {


    // Private constructor để ngăn chặn việc khởi tạo class này
    private AppConstants() {}

    // Định nghĩa các đường dẫn Public (Không cần đăng nhập)
    public static final String[] PUBLIC_ENDPOINTS = {
            "/api/v1/auth/**",
            "/api/v1/properties/**",
            "/api/v1/amenities/**",
            "/api/v1/requests/**",
            // --- SWAGGER ENDPOINTS ---
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/ws/**"
    };
    
}
