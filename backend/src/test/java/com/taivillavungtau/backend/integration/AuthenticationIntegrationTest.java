package com.taivillavungtau.backend.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taivillavungtau.backend.dto.request.LoginRequest;
import com.taivillavungtau.backend.dto.request.TokenRefreshRequest;
import com.taivillavungtau.backend.entity.RefreshToken;
import com.taivillavungtau.backend.entity.User;
import com.taivillavungtau.backend.repository.RefreshTokenRepository;
import com.taivillavungtau.backend.repository.UserRepository;
import com.taivillavungtau.backend.service.TelegramNotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cache.CacheManager;
import org.springframework.cache.support.NoOpCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration test for authentication flow
 * Tests the complete flow: HTTP Request → Controller → Service → Repository → Database
 * 
 * **Validates: Requirements 4.2**
 */
@SpringBootTest(
    classes = com.taivillavungtau.backend.BackendApplication.class,
    properties = {
        "spring.cache.type=none",
        "spring.data.redis.repositories.enabled=false",
        "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration,org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration"
    }
)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("Authentication Integration Tests")
class AuthenticationIntegrationTest {
    
    @Configuration
    static class TestCacheConfig {
        @Bean
        @Primary
        public CacheManager cacheManager() {
            return new NoOpCacheManager();
        }
    }
    
    @MockBean
    private TelegramNotificationService telegramNotificationService;
    
    @MockBean
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;
    private static final String TEST_USERNAME = "testuser";
    private static final String TEST_PASSWORD = "password123";
    private static final String TEST_EMAIL = "test@example.com";

    @BeforeEach
    void setUp() {
        // Clean database
        userRepository.deleteAll();

        // Create test user
        testUser = User.builder()
                .username(TEST_USERNAME)
                .password(passwordEncoder.encode(TEST_PASSWORD))
                .email(TEST_EMAIL)
                .fullName("Test User")
                .phoneNumber("0123456789")
                .role("ROLE_USER")
                .build();
        testUser = userRepository.save(testUser);
        
        // Configure mock refresh token repository to return a token when save is called
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(invocation -> {
            RefreshToken token = invocation.getArgument(0);
            return token;
        });
    }

    @Test
    @DisplayName("Should complete full login flow and return JWT and refresh token")
    void testCompleteLoginFlow() throws Exception {
        // Given: Valid login credentials
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(TEST_USERNAME);
        loginRequest.setPassword(TEST_PASSWORD);

        // When: Execute HTTP POST request to login endpoint
        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.token").exists())
                .andExpect(jsonPath("$.data.refreshToken").exists())
                .andExpect(jsonPath("$.data.username").value(TEST_USERNAME))
                .andExpect(jsonPath("$.data.role").value("ROLE_USER"))
                .andReturn();

        // Then: Verify the response contains valid tokens
        String responseBody = result.getResponse().getContentAsString();
        assertThat(responseBody).contains("token");
        assertThat(responseBody).contains("refreshToken");
        assertThat(responseBody).contains(TEST_USERNAME);
    }

    @Test
    @DisplayName("Should accept valid JWT for protected endpoint")
    void testJwtAuthentication() throws Exception {
        // Given: Create an admin user with proper role
        User adminUser = User.builder()
                .username("adminuser")
                .password(passwordEncoder.encode(TEST_PASSWORD))
                .email("admin@example.com")
                .fullName("Admin User")
                .phoneNumber("0987654321")
                .role("ROLE_ADMIN")
                .build();
        userRepository.save(adminUser);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("adminuser");
        loginRequest.setPassword(TEST_PASSWORD);

        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseBody).get("data").get("token").asText();

        // When: Access protected endpoint with valid JWT
        mockMvc.perform(get("/api/v1/admin/stats")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
        
        // Then: Request should be successful (verified by status check above)
    }

    @Test
    @DisplayName("Should reject invalid JWT for protected endpoint")
    void testInvalidJwtRejection() throws Exception {
        // Given: No JWT token or invalid authorization header
        
        // When: Access protected endpoint without JWT
        // Then: Request should be rejected with 401 Unauthorized (no authentication)
        mockMvc.perform(get("/api/v1/admin/stats"))
                .andExpect(status().isUnauthorized());
        
        // When: Access protected endpoint with malformed Authorization header
        // Then: Request should be rejected with 401 Unauthorized
        mockMvc.perform(get("/api/v1/admin/stats")
                        .header("Authorization", "InvalidHeader"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should refresh access token with valid refresh token")
    void testRefreshTokenFlow() throws Exception {
        // Given: User is logged in and has a refresh token
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(TEST_USERNAME);
        loginRequest.setPassword(TEST_PASSWORD);

        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        String refreshTokenString = objectMapper.readTree(responseBody).get("data").get("refreshToken").asText();

        // Configure mock to return the refresh token when queried
        RefreshToken refreshToken = RefreshToken.builder()
                .token(refreshTokenString)
                .userId(testUser.getId())
                .expiryDate(Instant.now().plusMillis(120000))
                .build();
        when(refreshTokenRepository.findByToken(refreshTokenString)).thenReturn(java.util.Optional.of(refreshToken));

        // When: Request new access token using refresh token
        TokenRefreshRequest refreshRequest = new TokenRefreshRequest();
        refreshRequest.setRefreshToken(refreshTokenString);

        MvcResult refreshResult = mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.accessToken").exists())
                .andExpect(jsonPath("$.data.refreshToken").value(refreshTokenString))
                .andReturn();

        // Then: Verify new access token is returned
        String refreshResponseBody = refreshResult.getResponse().getContentAsString();
        assertThat(refreshResponseBody).contains("accessToken");
        assertThat(refreshResponseBody).contains(refreshTokenString);
    }
}
