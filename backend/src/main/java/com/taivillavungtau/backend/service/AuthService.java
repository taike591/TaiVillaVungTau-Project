package com.taivillavungtau.backend.service;

import com.taivillavungtau.backend.dto.request.LoginRequest;
import com.taivillavungtau.backend.dto.request.RegisterRequest;
import com.taivillavungtau.backend.dto.request.TokenRefreshRequest;
import com.taivillavungtau.backend.dto.response.AuthResponse;
import com.taivillavungtau.backend.dto.response.TokenRefreshResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);

    void register(RegisterRequest request);

    TokenRefreshResponse refreshToken(TokenRefreshRequest request);

    AuthResponse getCurrentUser(String username);

    void logout(Long userId);
}