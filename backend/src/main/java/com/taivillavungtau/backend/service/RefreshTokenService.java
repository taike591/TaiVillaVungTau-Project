package com.taivillavungtau.backend.service;

import com.taivillavungtau.backend.entity.RefreshToken;
import java.util.Optional;

public interface RefreshTokenService {
    Optional<RefreshToken> findByToken(String token);

    RefreshToken createRefreshToken(Long userId);

    RefreshToken verifyExpiration(RefreshToken token);

    int deleteByUserId(Long userId);

    void deleteByToken(String token);
}
