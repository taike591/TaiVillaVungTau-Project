package com.taivillavungtau.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taivillavungtau.backend.dto.response.ApiResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        // Khi chưa đăng nhập hoặc Token sai, trả về lỗi 401 chuẩn JSON
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ApiResponse<Object> apiResponse = ApiResponse.error(
                HttpServletResponse.SC_UNAUTHORIZED,
                "Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn",
                authException.getMessage()
        );

        ObjectMapper objectMapper = new ObjectMapper();
        // Thêm module JavaTime để parse LocalDateTime nếu cần
        objectMapper.findAndRegisterModules(); 
        
        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
    }
}