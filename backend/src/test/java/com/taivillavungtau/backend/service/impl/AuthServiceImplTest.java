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
import com.taivillavungtau.backend.service.RefreshTokenService;
import com.taivillavungtau.backend.util.TestDataBuilder;
import com.taivillavungtau.backend.utils.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthServiceImpl Unit Tests")
class AuthServiceImplTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private RefreshTokenService refreshTokenService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User testUser;
    private UserDetails userDetails;
    private RefreshToken refreshToken;

    @BeforeEach
    void setUp() {
        testUser = TestDataBuilder.validUser()
                .id(1L)
                .username("testuser")
                .email("testuser@test.com")
                .password("$2a$10$hashedPassword")
                .role("ROLE_USER")
                .build();

        userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(testUser.getUsername())
                .password(testUser.getPassword())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")))
                .build();

        refreshToken = TestDataBuilder.validRefreshToken()
                .userId(testUser.getId())
                .token("test-refresh-token")
                .expiryDate(Instant.now().plusSeconds(86400))
                .build();
    }

    @Nested
    @DisplayName("Login Operations")
    class LoginTests {

        @Test
        @DisplayName("Should login successfully when credentials are valid")
        void shouldLoginSuccessfully_whenCredentialsAreValid() {
            // Given
            LoginRequest request = TestDataBuilder.validLoginRequest();
            request.setUsername("testuser");
            request.setPassword("password123");

            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(null);
            when(userDetailsService.loadUserByUsername(request.getUsername()))
                    .thenReturn(userDetails);
            when(jwtUtils.generateToken(userDetails))
                    .thenReturn("test-jwt-token");
            when(userRepository.findByUsername(request.getUsername()))
                    .thenReturn(Optional.of(testUser));
            when(refreshTokenService.createRefreshToken(testUser.getId()))
                    .thenReturn(refreshToken);

            // When
            AuthResponse response = authService.login(request);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getToken()).isEqualTo("test-jwt-token");
            assertThat(response.getRefreshToken()).isEqualTo("test-refresh-token");
            assertThat(response.getUsername()).isEqualTo("testuser");
            assertThat(response.getRole()).isEqualTo("ROLE_USER");

            verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
            verify(userDetailsService).loadUserByUsername(request.getUsername());
            verify(jwtUtils).generateToken(userDetails);
            verify(refreshTokenService).createRefreshToken(testUser.getId());
        }

        @Test
        @DisplayName("Should throw exception when credentials are invalid")
        void shouldThrowException_whenCredentialsAreInvalid() {
            // Given
            LoginRequest request = TestDataBuilder.validLoginRequest();
            request.setUsername("testuser");
            request.setPassword("wrongpassword");

            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenThrow(new BadCredentialsException("Bad credentials"));

            // When & Then
            assertThatThrownBy(() -> authService.login(request))
                    .isInstanceOf(BadCredentialsException.class)
                    .hasMessageContaining("Bad credentials");

            verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
            verify(userDetailsService, never()).loadUserByUsername(anyString());
            verify(jwtUtils, never()).generateToken(any());
        }
    }

    @Nested
    @DisplayName("Registration Operations")
    class RegistrationTests {

        @Test
        @DisplayName("Should register successfully when username is unique")
        void shouldRegisterSuccessfully_whenUsernameIsUnique() {
            // Given
            RegisterRequest request = TestDataBuilder.validRegisterRequest();
            request.setUsername("newuser");
            request.setEmail("newuser@test.com");
            request.setPassword("password123");

            when(userRepository.existsByUsername(request.getUsername())).thenReturn(false);
            when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
            when(passwordEncoder.encode(request.getPassword())).thenReturn("$2a$10$encodedPassword");
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // When
            authService.register(request);

            // Then
            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(userCaptor.capture());

            User savedUser = userCaptor.getValue();
            assertThat(savedUser.getUsername()).isEqualTo("newuser");
            assertThat(savedUser.getEmail()).isEqualTo("newuser@test.com");
            assertThat(savedUser.getPassword()).isEqualTo("$2a$10$encodedPassword");
            assertThat(savedUser.getRole()).isEqualTo("ROLE_ADMIN");
            assertThat(savedUser.isActive()).isTrue();

            verify(userRepository).existsByUsername(request.getUsername());
            verify(userRepository).existsByEmail(request.getEmail());
            verify(passwordEncoder).encode(request.getPassword());
        }

        @Test
        @DisplayName("Should throw DuplicateResourceException when username already exists")
        void shouldThrowDuplicateResourceException_whenUsernameAlreadyExists() {
            // Given
            RegisterRequest request = TestDataBuilder.validRegisterRequest();
            request.setUsername("existinguser");

            when(userRepository.existsByUsername(request.getUsername())).thenReturn(true);

            // When & Then
            assertThatThrownBy(() -> authService.register(request))
                    .isInstanceOf(DuplicateResourceException.class)
                    .hasMessageContaining("Tên đăng nhập đã tồn tại");

            verify(userRepository).existsByUsername(request.getUsername());
            verify(userRepository, never()).existsByEmail(anyString());
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should throw DuplicateResourceException when email already exists")
        void shouldThrowDuplicateResourceException_whenEmailAlreadyExists() {
            // Given
            RegisterRequest request = TestDataBuilder.validRegisterRequest();
            request.setUsername("newuser");
            request.setEmail("existing@test.com");

            when(userRepository.existsByUsername(request.getUsername())).thenReturn(false);
            when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

            // When & Then
            assertThatThrownBy(() -> authService.register(request))
                    .isInstanceOf(DuplicateResourceException.class)
                    .hasMessageContaining("Email đã được sử dụng");

            verify(userRepository).existsByUsername(request.getUsername());
            verify(userRepository).existsByEmail(request.getEmail());
            verify(userRepository, never()).save(any(User.class));
        }
    }

    @Nested
    @DisplayName("Refresh Token Operations")
    class RefreshTokenTests {

        @Test
        @DisplayName("Should refresh token successfully when token is valid")
        void shouldRefreshTokenSuccessfully_whenTokenIsValid() {
            // Given
            TokenRefreshRequest request = new TokenRefreshRequest();
            request.setRefreshToken("valid-refresh-token");

            when(refreshTokenService.findByToken(request.getRefreshToken()))
                    .thenReturn(Optional.of(refreshToken));
            when(refreshTokenService.verifyExpiration(refreshToken))
                    .thenReturn(refreshToken);
            when(userRepository.findById(testUser.getId()))
                    .thenReturn(Optional.of(testUser));
            when(userDetailsService.loadUserByUsername(testUser.getUsername()))
                    .thenReturn(userDetails);
            when(jwtUtils.generateToken(userDetails))
                    .thenReturn("new-jwt-token");

            // When
            TokenRefreshResponse response = authService.refreshToken(request);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getAccessToken()).isEqualTo("new-jwt-token");
            assertThat(response.getRefreshToken()).isEqualTo("valid-refresh-token");

            verify(refreshTokenService).findByToken(request.getRefreshToken());
            verify(refreshTokenService).verifyExpiration(refreshToken);
            verify(userRepository).findById(testUser.getId());
            verify(jwtUtils).generateToken(userDetails);
        }

        @Test
        @DisplayName("Should throw TokenRefreshException when token is invalid")
        void shouldThrowTokenRefreshException_whenTokenIsInvalid() {
            // Given
            TokenRefreshRequest request = new TokenRefreshRequest();
            request.setRefreshToken("invalid-refresh-token");

            when(refreshTokenService.findByToken(request.getRefreshToken()))
                    .thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> authService.refreshToken(request))
                    .isInstanceOf(TokenRefreshException.class)
                    .hasMessageContaining("Refresh token is not in database!");

            verify(refreshTokenService).findByToken(request.getRefreshToken());
            verify(refreshTokenService, never()).verifyExpiration(any());
            verify(userRepository, never()).findById(anyLong());
        }
    }

    @Nested
    @DisplayName("Logout Operations")
    class LogoutTests {

        @Test
        @DisplayName("Should logout successfully and delete refresh token")
        void shouldLogoutSuccessfully_andDeleteRefreshToken() {
            // Given
            Long userId = 1L;
            when(refreshTokenService.deleteByUserId(userId)).thenReturn(1);

            // When
            authService.logout(userId);

            // Then
            verify(refreshTokenService).deleteByUserId(userId);
        }
    }

    @Nested
    @DisplayName("Property-Based Tests")
    class PropertyBasedTests {

        /**
         * Feature: backend-testing-improvement, Property 6: Null Input Rejection
         * Validates: Requirements 7.1
         * 
         * For any service method that accepts object parameters, passing null should result in
         * either IllegalArgumentException or a validation exception (never NullPointerException).
         */
        @Test
        @DisplayName("Should reject null input in login")
        void shouldRejectNullInput_inLogin() {
            // When & Then
            assertThatThrownBy(() -> authService.login(null))
                    .isNotInstanceOf(NullPointerException.class);
        }

        @Test
        @DisplayName("Should reject null input in register")
        void shouldRejectNullInput_inRegister() {
            // When & Then
            assertThatThrownBy(() -> authService.register(null))
                    .isNotInstanceOf(NullPointerException.class);
        }

        @Test
        @DisplayName("Should reject null input in refreshToken")
        void shouldRejectNullInput_inRefreshToken() {
            // When & Then
            assertThatThrownBy(() -> authService.refreshToken(null))
                    .isNotInstanceOf(NullPointerException.class);
        }

        @Test
        @DisplayName("Should reject null userId in logout")
        void shouldRejectNullUserId_inLogout() {
            // When & Then
            assertThatThrownBy(() -> authService.logout(null))
                    .isNotInstanceOf(NullPointerException.class);
        }
    }
}
