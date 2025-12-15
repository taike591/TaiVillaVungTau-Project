package com.taivillavungtau.backend.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtils {

    // 1. Khóa bí mật (Secret Key) - Lấy từ application.properties
    @Value("${taivilla.app.jwtSecret}")
    private String secret;

    // 2. Thời gian hết hạn - Lấy từ application.properties
    @Value("${taivilla.app.jwtExpirationMs}")
    private long expirationTime; 

    // Lấy Key chuẩn mã hóa
    private Key getSignKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // --- CHỨC NĂNG CHÍNH: TẠO TOKEN ---
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        // Có thể thêm thông tin phụ vào claims nếu muốn (ví dụ: email, id...)
        return createToken(claims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject) // Chủ sở hữu (Username)
                .setIssuedAt(new Date(System.currentTimeMillis())) // Ngày tạo
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime)) // Ngày hết hạn
                .signWith(getSignKey(), SignatureAlgorithm.HS256) // Ký tên bằng thuật toán HS256
                .compact();
    }

    // --- CÁC HÀM HỖ TRỢ LẤY THÔNG TIN TỪ TOKEN ---

    // Lấy Username từ Token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Lấy ngày hết hạn
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Kiểm tra Token có hợp lệ không (đúng user và chưa hết hạn)
    public Boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}