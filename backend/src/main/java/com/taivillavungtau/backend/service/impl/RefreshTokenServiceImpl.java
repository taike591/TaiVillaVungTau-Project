package com.taivillavungtau.backend.service.impl;

import com.taivillavungtau.backend.entity.RefreshToken;
import com.taivillavungtau.backend.exception.TokenRefreshException;
import com.taivillavungtau.backend.repository.RefreshTokenRepository;
import com.taivillavungtau.backend.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenServiceImpl implements RefreshTokenService {

    @Value("${taivilla.app.jwtRefreshExpirationMs:2592000000}") // Default 30 days
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Override
    public RefreshToken createRefreshToken(Long userId) {
        log.info("Creating refresh token for user ID: {}", userId);

        // 1. Ensure only one refresh token per user (delete old one)
        // This enforces "Single Session" policy which is safer for this stage
        List<RefreshToken> oldTokens = refreshTokenRepository.findByUserId(userId);
        if (!oldTokens.isEmpty()) {
            refreshTokenRepository.deleteAll(oldTokens);
        }

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUserId(userId);
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());

        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            log.warn("Refresh token expired: {}", token.getToken());
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(),
                    "Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Override
    public int deleteByUserId(Long userId) {
        List<RefreshToken> tokens = refreshTokenRepository.findByUserId(userId);
        if (tokens.isEmpty()) {
            return 0;
        }
        refreshTokenRepository.deleteAll(tokens);
        return tokens.size();
    }

    @Override
    public void deleteByToken(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(refreshTokenRepository::delete);
    }
}
