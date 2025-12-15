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

@Component
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;

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

        try {
            // 2. Cắt bỏ chữ "Bearer " để lấy mã Token sạch
            jwt = authHeader.substring(7);

            // 3. Trích xuất Username từ Token
            username = jwtUtils.extractUsername(jwt);

            // log.info("Checking auth for username: {}", username); // Debug

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
                    // log.info("Auth successful for user: {}", username); // Debug
                } else {
                    log.warn("Token invalid for user: {}", username);
                }
            }
        } catch (Exception e) {
            log.error("Authentication failed: {}", e.getMessage());
        }

        // Cho phép request đi tiếp
        filterChain.doFilter(request, response);
    }
}