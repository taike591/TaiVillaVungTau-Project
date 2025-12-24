package com.taivillavungtau.backend.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Request ID Filter - Tạo unique ID cho mỗi request để dễ trace log
 * 
 * Cách hoạt động:
 * 1. Mỗi request vào server sẽ được gán 1 requestId unique
 * 2. requestId được lưu vào MDC (Mapped Diagnostic Context) của SLF4J
 * 3. Tất cả log trong request đó sẽ có chung requestId
 * 4. Khi có lỗi, dùng requestId để grep tất cả log liên quan
 * 
 * Ví dụ log output:
 * 2024-12-24 10:30:15 [abc12345] INFO PropertyService - Fetching property
 * id=123
 * 2024-12-24 10:30:15 [abc12345] ERROR GlobalExceptionHandler - Property not
 * found
 * 
 * Để trace: grep "abc12345" app.log -> thấy toàn bộ flow của request đó
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE) // Chạy đầu tiên trong filter chain
public class RequestIdFilter extends OncePerRequestFilter {

    private static final String REQUEST_ID_HEADER = "X-Request-Id";
    private static final String REQUEST_ID_MDC_KEY = "requestId";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // Lấy requestId từ header (nếu client gửi) hoặc tạo mới
        String requestId = request.getHeader(REQUEST_ID_HEADER);
        if (requestId == null || requestId.isEmpty()) {
            requestId = generateRequestId();
        }

        // Lưu vào MDC - tất cả log trong thread này sẽ có requestId
        MDC.put(REQUEST_ID_MDC_KEY, requestId);

        // Trả requestId về client qua header (để client biết nếu cần report bug)
        response.setHeader(REQUEST_ID_HEADER, requestId);

        try {
            filterChain.doFilter(request, response);
        } finally {
            // Clear MDC sau khi request xong (tránh memory leak trong thread pool)
            MDC.clear();
        }
    }

    private String generateRequestId() {
        // Lấy 8 ký tự đầu của UUID - đủ unique cho production
        return UUID.randomUUID().toString().substring(0, 8);
    }
}
