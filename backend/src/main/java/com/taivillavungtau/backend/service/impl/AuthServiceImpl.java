package com.taivillavungtau.backend.service.impl;

import com.taivillavungtau.backend.dto.request.LoginRequest;
import com.taivillavungtau.backend.dto.request.RegisterRequest;
import com.taivillavungtau.backend.dto.request.TokenRefreshRequest;
import com.taivillavungtau.backend.dto.response.AuthResponse;
import com.taivillavungtau.backend.dto.response.TokenRefreshResponse;
import com.taivillavungtau.backend.entity.RefreshToken;
import com.taivillavungtau.backend.entity.User;
import com.taivillavungtau.backend.exception.DuplicateResourceException;
import com.taivillavungtau.backend.exception.TokenRefreshException;
import com.taivillavungtau.backend.repository.UserRepository;
import com.taivillavungtau.backend.service.AuthService;
import com.taivillavungtau.backend.service.RefreshTokenService;
import com.taivillavungtau.backend.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;

    @Override
    public AuthResponse login(LoginRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Login request cannot be null");
        }
        log.info("Attempting login for user: {}", request.getUsername());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        final String token = jwtUtils.generateToken(userDetails);

        // Get User entity to get ID
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();

        // Create Refresh Token
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        // Lấy role an toàn hơn
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(item -> item.getAuthority())
                .orElse("ROLE_USER");

        log.info("User logged in successfully: {}", request.getUsername());
        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken.getToken())
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(role)
                .build();
    }

    @Override
    public AuthResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    public void register(RegisterRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Register request cannot be null");
        }
        log.info("Attempting to register user: {}", request.getUsername());
        // 1. Check trùng
        if (userRepository.existsByUsername(request.getUsername())) {
            log.warn("Registration failed. Username already exists: {}", request.getUsername());
            throw new DuplicateResourceException("Tên đăng nhập đã tồn tại");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed. Email already exists: {}", request.getEmail());
            throw new DuplicateResourceException("Email đã được sử dụng");
        }

        // 2. Map dữ liệu
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setActive(true);

        // Mặc định set là ADMIN để bạn test (vì bạn là chủ sở hữu)
        // Sau này có thể sửa logic: nếu đăng ký tự do thì là USER
        user.setRole("ROLE_ADMIN");

        userRepository.save(user);
        log.info("User registered successfully: {}", request.getUsername());
    }

    @Override
    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Token refresh request cannot be null");
        }
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(refreshToken -> {
                    // Fetch User from DB using userId stored in Redis
                    Long userId = Objects.requireNonNull(refreshToken.getUserId(),
                            "User ID in refresh token must not be null");
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
                                    "User not found associated with token"));

                    // Generate new Access Token
                    UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
                    String token = jwtUtils.generateToken(userDetails);
                    return new TokenRefreshResponse(token, requestRefreshToken);
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
                        "Refresh token is not in database!"));
    }

    @Override
    public void logout(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        refreshTokenService.deleteByUserId(userId);
    }
}