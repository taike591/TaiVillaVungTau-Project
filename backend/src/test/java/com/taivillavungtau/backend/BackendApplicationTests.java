package com.taivillavungtau.backend;

import com.taivillavungtau.backend.repository.RefreshTokenRepository;
import com.taivillavungtau.backend.service.impl.UserDetailsServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
class BackendApplicationTests {

	// Mock UserDetailsServiceImpl to satisfy JwtAuthenticationFilter dependency
	@MockitoBean
	private UserDetailsServiceImpl userDetailsService;

	// Mock RefreshTokenRepository since Redis is disabled in tests
	@MockitoBean
	private RefreshTokenRepository refreshTokenRepository;

	@Test
	void contextLoads() {
	}

}
