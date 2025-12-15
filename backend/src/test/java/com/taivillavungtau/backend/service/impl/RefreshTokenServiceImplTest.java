package com.taivillavungtau.backend.service.impl;

import com.taivillavungtau.backend.entity.RefreshToken;
import com.taivillavungtau.backend.exception.TokenRefreshException;
import com.taivillavungtau.backend.repository.RefreshTokenRepository;
import com.taivillavungtau.backend.util.TestDataBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RefreshTokenServiceImpl Unit Tests")
class RefreshTokenServiceImplTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @InjectMocks
    private RefreshTokenServiceImpl refreshTokenService;

    private RefreshToken testToken;
    private Long testUserId;

    @BeforeEach
    void setUp() {
        testUserId = 1L;
        testToken = TestDataBuilder.validRefreshToken()
                .id("test-id-123")
                .userId(testUserId)
                .token("test-refresh-token-abc123")
                .expiryDate(Instant.now().plusSeconds(86400))
                .build();

        // Set the refresh token duration (24 hours in milliseconds)
        ReflectionTestUtils.setField(refreshTokenService, "refreshTokenDurationMs", 86400000L);
    }

    @Nested
    @DisplayName("Create Refresh Token Operations")
    class CreateRefreshTokenTests {

        @Test
        @DisplayName("Should create refresh token and save to Redis")
        void shouldCreateRefreshToken_andSaveToRedis() {
            // Given
            when(refreshTokenRepository.findByUserId(testUserId))
                    .thenReturn(Collections.emptyList());
            when(refreshTokenRepository.save(any(RefreshToken.class)))
                    .thenAnswer(invocation -> invocation.getArgument(0));

            // When
            RefreshToken result = refreshTokenService.createRefreshToken(testUserId);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getUserId()).isEqualTo(testUserId);
            assertThat(result.getToken()).isNotNull();
            assertThat(result.getToken()).hasSize(36); // UUID format
            assertThat(result.getExpiryDate()).isAfter(Instant.now());

            verify(refreshTokenRepository).findByUserId(testUserId);
            verify(refreshTokenRepository).save(any(RefreshToken.class));
        }

        @Test
        @DisplayName("Should delete old tokens before creating new one")
        void shouldDeleteOldTokens_beforeCreatingNewOne() {
            // Given
            RefreshToken oldToken1 = TestDataBuilder.validRefreshToken()
                    .userId(testUserId)
                    .token("old-token-1")
                    .build();
            RefreshToken oldToken2 = TestDataBuilder.validRefreshToken()
                    .userId(testUserId)
                    .token("old-token-2")
                    .build();
            List<RefreshToken> oldTokens = List.of(oldToken1, oldToken2);

            when(refreshTokenRepository.findByUserId(testUserId))
                    .thenReturn(oldTokens);
            when(refreshTokenRepository.save(any(RefreshToken.class)))
                    .thenAnswer(invocation -> invocation.getArgument(0));

            // When
            RefreshToken result = refreshTokenService.createRefreshToken(testUserId);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getUserId()).isEqualTo(testUserId);

            verify(refreshTokenRepository).findByUserId(testUserId);
            verify(refreshTokenRepository).deleteAll(oldTokens);
            verify(refreshTokenRepository).save(any(RefreshToken.class));
        }

        @Test
        @DisplayName("Should set correct expiry date based on configuration")
        void shouldSetCorrectExpiryDate_basedOnConfiguration() {
            // Given
            Instant beforeCreation = Instant.now();
            when(refreshTokenRepository.findByUserId(testUserId))
                    .thenReturn(Collections.emptyList());
            when(refreshTokenRepository.save(any(RefreshToken.class)))
                    .thenAnswer(invocation -> invocation.getArgument(0));

            // When
            RefreshToken result = refreshTokenService.createRefreshToken(testUserId);

            // Then
            Instant afterCreation = Instant.now();
            Instant expectedMinExpiry = beforeCreation.plusMillis(86400000L);
            Instant expectedMaxExpiry = afterCreation.plusMillis(86400000L);

            assertThat(result.getExpiryDate())
                    .isAfterOrEqualTo(expectedMinExpiry)
                    .isBeforeOrEqualTo(expectedMaxExpiry);
        }
    }

    @Nested
    @DisplayName("Find Token Operations")
    class FindTokenTests {

        @Test
        @DisplayName("Should find token by token string from Redis")
        void shouldFindToken_byTokenString_fromRedis() {
            // Given
            String tokenString = "test-refresh-token-abc123";
            when(refreshTokenRepository.findByToken(tokenString))
                    .thenReturn(Optional.of(testToken));

            // When
            Optional<RefreshToken> result = refreshTokenService.findByToken(tokenString);

            // Then
            assertThat(result).isPresent();
            assertThat(result.get()).isEqualTo(testToken);
            assertThat(result.get().getToken()).isEqualTo(tokenString);
            assertThat(result.get().getUserId()).isEqualTo(testUserId);

            verify(refreshTokenRepository).findByToken(tokenString);
        }

        @Test
        @DisplayName("Should return empty when token not found")
        void shouldReturnEmpty_whenTokenNotFound() {
            // Given
            String nonExistentToken = "non-existent-token";
            when(refreshTokenRepository.findByToken(nonExistentToken))
                    .thenReturn(Optional.empty());

            // When
            Optional<RefreshToken> result = refreshTokenService.findByToken(nonExistentToken);

            // Then
            assertThat(result).isEmpty();

            verify(refreshTokenRepository).findByToken(nonExistentToken);
        }
    }

    @Nested
    @DisplayName("Verify Expiration Operations")
    class VerifyExpirationTests {

        @Test
        @DisplayName("Should return token when not expired")
        void shouldReturnToken_whenNotExpired() {
            // Given
            RefreshToken validToken = TestDataBuilder.validRefreshToken()
                    .userId(testUserId)
                    .token("valid-token")
                    .expiryDate(Instant.now().plusSeconds(3600)) // 1 hour from now
                    .build();

            // When
            RefreshToken result = refreshTokenService.verifyExpiration(validToken);

            // Then
            assertThat(result).isNotNull();
            assertThat(result).isEqualTo(validToken);
            assertThat(result.getExpiryDate()).isAfter(Instant.now());

            verify(refreshTokenRepository, never()).delete(any());
        }

        @Test
        @DisplayName("Should throw TokenRefreshException when token is expired")
        void shouldThrowTokenRefreshException_whenTokenIsExpired() {
            // Given
            RefreshToken expiredToken = TestDataBuilder.validRefreshToken()
                    .userId(testUserId)
                    .token("expired-token")
                    .expiryDate(Instant.now().minusSeconds(3600)) // 1 hour ago
                    .build();

            doNothing().when(refreshTokenRepository).delete(expiredToken);

            // When & Then
            assertThatThrownBy(() -> refreshTokenService.verifyExpiration(expiredToken))
                    .isInstanceOf(TokenRefreshException.class)
                    .hasMessageContaining("expired-token")
                    .hasMessageContaining("Refresh token was expired");

            verify(refreshTokenRepository).delete(expiredToken);
        }

        @Test
        @DisplayName("Should delete expired token from Redis")
        void shouldDeleteExpiredToken_fromRedis() {
            // Given
            RefreshToken expiredToken = TestDataBuilder.validRefreshToken()
                    .userId(testUserId)
                    .token("expired-token-to-delete")
                    .expiryDate(Instant.now().minusSeconds(1))
                    .build();

            doNothing().when(refreshTokenRepository).delete(expiredToken);

            // When & Then
            assertThatThrownBy(() -> refreshTokenService.verifyExpiration(expiredToken))
                    .isInstanceOf(TokenRefreshException.class);

            verify(refreshTokenRepository).delete(expiredToken);
        }

        @Test
        @DisplayName("Should handle token expiring at exact current time")
        void shouldHandleToken_expiringAtExactCurrentTime() {
            // Given - Token that expires at current instant (boundary case)
            RefreshToken boundaryToken = TestDataBuilder.validRefreshToken()
                    .userId(testUserId)
                    .token("boundary-token")
                    .expiryDate(Instant.now().minusMillis(1)) // Just expired
                    .build();

            doNothing().when(refreshTokenRepository).delete(boundaryToken);

            // When & Then
            assertThatThrownBy(() -> refreshTokenService.verifyExpiration(boundaryToken))
                    .isInstanceOf(TokenRefreshException.class);

            verify(refreshTokenRepository).delete(boundaryToken);
        }
    }

    @Nested
    @DisplayName("Delete Token Operations")
    class DeleteTokenTests {

        @Test
        @DisplayName("Should delete tokens by user ID from Redis")
        void shouldDeleteTokens_byUserId_fromRedis() {
            // Given
            RefreshToken token1 = TestDataBuilder.validRefreshToken()
                    .userId(testUserId)
                    .token("token-1")
                    .build();
            RefreshToken token2 = TestDataBuilder.validRefreshToken()
                    .userId(testUserId)
                    .token("token-2")
                    .build();
            List<RefreshToken> userTokens = List.of(token1, token2);

            when(refreshTokenRepository.findByUserId(testUserId))
                    .thenReturn(userTokens);
            doNothing().when(refreshTokenRepository).deleteAll(userTokens);

            // When
            int deletedCount = refreshTokenService.deleteByUserId(testUserId);

            // Then
            assertThat(deletedCount).isEqualTo(2);

            verify(refreshTokenRepository).findByUserId(testUserId);
            verify(refreshTokenRepository).deleteAll(userTokens);
        }

        @Test
        @DisplayName("Should return 0 when no tokens found for user")
        void shouldReturnZero_whenNoTokensFoundForUser() {
            // Given
            Long userIdWithNoTokens = 999L;
            when(refreshTokenRepository.findByUserId(userIdWithNoTokens))
                    .thenReturn(Collections.emptyList());

            // When
            int deletedCount = refreshTokenService.deleteByUserId(userIdWithNoTokens);

            // Then
            assertThat(deletedCount).isEqualTo(0);

            verify(refreshTokenRepository).findByUserId(userIdWithNoTokens);
            verify(refreshTokenRepository, never()).deleteAll(anyList());
        }

        @Test
        @DisplayName("Should delete single token by token string")
        void shouldDeleteSingleToken_byTokenString() {
            // Given
            String tokenString = "token-to-delete";
            RefreshToken tokenToDelete = TestDataBuilder.validRefreshToken()
                    .token(tokenString)
                    .build();

            when(refreshTokenRepository.findByToken(tokenString))
                    .thenReturn(Optional.of(tokenToDelete));
            doNothing().when(refreshTokenRepository).delete(tokenToDelete);

            // When
            refreshTokenService.deleteByToken(tokenString);

            // Then
            verify(refreshTokenRepository).findByToken(tokenString);
            verify(refreshTokenRepository).delete(tokenToDelete);
        }

        @Test
        @DisplayName("Should handle delete when token not found")
        void shouldHandleDelete_whenTokenNotFound() {
            // Given
            String nonExistentToken = "non-existent-token";
            when(refreshTokenRepository.findByToken(nonExistentToken))
                    .thenReturn(Optional.empty());

            // When
            refreshTokenService.deleteByToken(nonExistentToken);

            // Then
            verify(refreshTokenRepository).findByToken(nonExistentToken);
            verify(refreshTokenRepository, never()).delete(any());
        }
    }

}
