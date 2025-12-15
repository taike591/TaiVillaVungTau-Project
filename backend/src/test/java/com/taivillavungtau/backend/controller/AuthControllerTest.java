package com.taivillavungtau.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taivillavungtau.backend.dto.request.LoginRequest;
import com.taivillavungtau.backend.dto.request.RegisterRequest;
import com.taivillavungtau.backend.dto.response.AuthResponse;
import com.taivillavungtau.backend.service.AuthService;
import com.taivillavungtau.backend.service.RefreshTokenService;
import com.taivillavungtau.backend.utils.JwtUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for simplicity in unit test
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtUtils jwtUtils; // Required because SecurityConfig might use it

    @MockBean
    private RefreshTokenService refreshTokenService; // Required if SecurityConfig uses it

    @MockBean
    private com.taivillavungtau.backend.service.impl.UserDetailsServiceImpl userDetailsService; // Required by JwtAuthenticationFilter

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void login_ShouldReturnOk_WhenCredentialsAreValid() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("password");

        AuthResponse response = AuthResponse.builder()
                .token("access-token")
                .refreshToken("refresh-token")
                .username("testuser")
                .role("ROLE_USER")
                .build();

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.token").value("access-token"))
                .andExpect(jsonPath("$.message").value("Đăng nhập thành công"));
    }

    @Test
    void register_ShouldReturnCreated_WhenRequestIsValid() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setPassword("password");
        request.setEmail("new@example.com");
        request.setFullName("New User");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Đăng ký tài khoản thành công"));
    }
}
