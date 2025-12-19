package com.taivillavungtau.backend.config;

import com.taivillavungtau.backend.service.impl.UserDetailsServiceImpl;
import com.taivillavungtau.backend.utils.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;

    // Public endpoints that don't require authentication
    private static final List<String> PUBLIC_ENDPOINTS = List.of(
            "/api/v1/auth/",
            "/api/v1/properties",
            "/api/v1/amenities",
            "/api/v1/locations",
            "/api/v1/property-types",
            "/v3/api-docs",
            "/swagger-ui",
            "/ws/");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Lấy Token từ Header (Authorization: Bearer <token>)
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // Nếu không có Token hoặc không bắt đầu bằng "Bearer ", cho qua
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Check if this is a public endpoint - if so, don't fail on bad tokens
        boolean isPublicEndpoint = isPublicEndpoint(request);

        try {
            // 2. Cắt bỏ chữ "Bearer " để lấy mã Token sạch
            jwt = authHeader.substring(7);

            // 3. Trích xuất Username từ Token
            username = jwtUtils.extractUsername(jwt);

            // 4. Nếu có username và chưa được xác thực trong Context hiện tại
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Lấy thông tin User từ DB
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                // 5. Kiểm tra Token có hợp lệ không
                if (jwtUtils.isTokenValid(jwt, userDetails)) {
                    // Tạo đối tượng xác thực
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // 6. Lưu vào SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    log.warn("Token invalid for user: {}", username);
                    if (!isPublicEndpoint) {
                        sendUnauthorizedError(response, "Token không hợp lệ");
                        return;
                    }
                    // For public endpoints, just continue without auth
                }
            }
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            // JWT đã hết hạn
            log.warn("JWT expired: {}", e.getMessage());
            if (!isPublicEndpoint) {
                // Protected endpoint - return 401 to trigger refresh token
                sendUnauthorizedError(response, "Token đã hết hạn");
                return;
            }
            // For public endpoints, just continue without auth (customer can still browse)
        } catch (io.jsonwebtoken.JwtException e) {
            // Các lỗi JWT khác (invalid signature, malformed, etc.)
            log.error("JWT validation failed: {}", e.getMessage());
            if (!isPublicEndpoint) {
                sendUnauthorizedError(response, "Token không hợp lệ");
                return;
            }
        } catch (Exception e) {
            log.error("Authentication failed: {}", e.getMessage());
            if (!isPublicEndpoint) {
                sendUnauthorizedError(response, "Xác thực thất bại");
                return;
            }
        }

        // Cho phép request đi tiếp
        filterChain.doFilter(request, response);
    }

    /**
     * Check if the request is for a public endpoint
     */
    private boolean isPublicEndpoint(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();

        // Auth endpoints are always public
        if (path.startsWith("/api/v1/auth/")) {
            return true;
        }

        // GET requests to these endpoints are public
        if ("GET".equals(method)) {
            for (String publicPath : PUBLIC_ENDPOINTS) {
                if (path.startsWith(publicPath)) {
                    return true;
                }
            }
        }

        // POST to customer requests is public
        if ("POST".equals(method) && "/api/v1/requests".equals(path)) {
            return true;
        }

        // Swagger and WebSocket
        if (path.startsWith("/v3/api-docs") || path.startsWith("/swagger-ui") || path.startsWith("/ws/")) {
            return true;
        }

        return false;
    }

    /**
     * Gửi response 401 Unauthorized với JSON body
     */
    private void sendUnauthorizedError(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(String.format(
                "{\"success\":false,\"message\":\"%s\",\"status\":401}",
                message));
    }
}