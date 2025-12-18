package com.taivillavungtau.backend.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taivillavungtau.backend.dto.request.CustomerRequestDTO;
import com.taivillavungtau.backend.dto.request.UpdateCustomerRequestDTO;
import com.taivillavungtau.backend.entity.CustomerRequest;
import com.taivillavungtau.backend.repository.CustomerRequestRepository;
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
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration test for customer request flow
 * Tests the complete flow: HTTP Request → Controller → Service → Repository →
 * Database
 * 
 * **Validates: Requirements 4.3**
 */
@SpringBootTest(classes = com.taivillavungtau.backend.BackendApplication.class, properties = {
        "spring.cache.type=none",
        "spring.data.redis.repositories.enabled=false",
        "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration,org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration"
})
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("Customer Request Integration Tests")
class CustomerRequestIntegrationTest {

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
    private SimpMessagingTemplate messagingTemplate;

    @MockBean
    private com.taivillavungtau.backend.service.RefreshTokenService refreshTokenService;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CustomerRequestRepository customerRequestRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private com.taivillavungtau.backend.repository.UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    private static final String TEST_CUSTOMER_NAME = "Nguyen Van A";
    private static final String TEST_PHONE = "0901234567";
    private static final String TEST_PROPERTY_CODE = "MS001";
    private static final String TEST_NOTE = "Tôi muốn thuê villa này vào cuối tuần";
    private static final String ADMIN_USERNAME = "admintest";
    private static final String ADMIN_PASSWORD = "admin123";

    private String adminToken;

    @BeforeEach
    void setUp() throws Exception {
        // Clean database
        customerRequestRepository.deleteAll();
        userRepository.deleteAll();

        // Create admin user
        com.taivillavungtau.backend.entity.User adminUser = com.taivillavungtau.backend.entity.User.builder()
                .username(ADMIN_USERNAME)
                .password(passwordEncoder.encode(ADMIN_PASSWORD))
                .email("admin@test.com")
                .fullName("Admin Test")
                .phoneNumber("0987654321")
                .role("ROLE_ADMIN")
                .build();
        userRepository.save(adminUser);

        // Mock RefreshTokenService to return a valid token
        com.taivillavungtau.backend.entity.RefreshToken mockRefreshToken = com.taivillavungtau.backend.entity.RefreshToken
                .builder()
                .token("mock-refresh-token-for-test")
                .expiryDate(java.time.Instant.now().plusSeconds(86400))
                .build();
        when(refreshTokenService.createRefreshToken(any(Long.class))).thenReturn(mockRefreshToken);

        // Login to get JWT token
        com.taivillavungtau.backend.dto.request.LoginRequest loginRequest = new com.taivillavungtau.backend.dto.request.LoginRequest();
        loginRequest.setUsername(ADMIN_USERNAME);
        loginRequest.setPassword(ADMIN_PASSWORD);

        org.springframework.test.web.servlet.MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        adminToken = objectMapper.readTree(responseBody).get("data").get("token").asText();

        // Configure mocks to do nothing (notifications are not critical for integration
        // test)
        doNothing().when(messagingTemplate).convertAndSend(eq("/topic/admin"), any(Object.class));
        doNothing().when(telegramNotificationService).sendNotification(anyString());
    }

    @Test
    @DisplayName("Should create customer request and trigger notifications")
    void testCreateRequestWithNotifications() throws Exception {
        // Given: Valid customer request data
        CustomerRequestDTO requestDTO = new CustomerRequestDTO();
        requestDTO.setCustomerName(TEST_CUSTOMER_NAME);
        requestDTO.setPhoneNumber(TEST_PHONE);
        requestDTO.setPropertyCode(TEST_PROPERTY_CODE);
        requestDTO.setNote(TEST_NOTE);

        // When: Execute HTTP POST request to create customer request
        MvcResult result = mockMvc.perform(post("/api/v1/requests")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value(200)) // API response status, not HTTP status
                .andExpect(jsonPath("$.data.customerName").value(TEST_CUSTOMER_NAME))
                .andExpect(jsonPath("$.data.phoneNumber").value(TEST_PHONE))
                .andExpect(jsonPath("$.data.propertyCode").value(TEST_PROPERTY_CODE))
                .andExpect(jsonPath("$.data.note").value(TEST_NOTE))
                .andExpect(jsonPath("$.message").value("Gửi yêu cầu thành công. Chúng tôi sẽ liên hệ sớm!"))
                .andReturn();

        // Then: Verify the request was saved to database
        List<CustomerRequest> savedRequests = customerRequestRepository.findAll();
        assertThat(savedRequests).hasSize(1);
        assertThat(savedRequests.get(0).getCustomerName()).isEqualTo(TEST_CUSTOMER_NAME);
        assertThat(savedRequests.get(0).getPhoneNumber()).isEqualTo(TEST_PHONE);
        assertThat(savedRequests.get(0).getPropertyCode()).isEqualTo(TEST_PROPERTY_CODE);
        assertThat(savedRequests.get(0).getStatus()).isEqualTo("NEW");

        // Verify notifications were triggered
        verify(messagingTemplate).convertAndSend(eq("/topic/admin"), any(Object.class));
        verify(telegramNotificationService).sendNotification(anyString());
    }

    @Test
    @DisplayName("Should update customer request status correctly")
    void testUpdateRequestStatus() throws Exception {
        // Given: An existing customer request in database
        CustomerRequest existingRequest = CustomerRequest.builder()
                .customerName(TEST_CUSTOMER_NAME)
                .phoneNumber(TEST_PHONE)
                .propertyCode(TEST_PROPERTY_CODE)
                .note(TEST_NOTE)
                .status("NEW")
                .build();
        CustomerRequest savedRequest = customerRequestRepository.save(existingRequest);

        // Prepare update DTO
        UpdateCustomerRequestDTO updateDTO = new UpdateCustomerRequestDTO();
        updateDTO.setStatus("CONTACTED");
        updateDTO.setAdminNote("Đã liên hệ khách hàng qua điện thoại");

        // When: Execute HTTP PUT request to update request status (requires admin
        // authentication)
        MvcResult result = mockMvc.perform(put("/api/v1/requests/" + savedRequest.getId())
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.status").value("CONTACTED"))
                .andExpect(jsonPath("$.data.adminNote").value("Đã liên hệ khách hàng qua điện thoại"))
                .andExpect(jsonPath("$.message").value("Cập nhật yêu cầu thành công"))
                .andReturn();

        // Then: Verify the request was updated in database
        CustomerRequest updatedRequest = customerRequestRepository.findById(savedRequest.getId()).orElseThrow();
        assertThat(updatedRequest.getStatus()).isEqualTo("CONTACTED");
        assertThat(updatedRequest.getAdminNote()).isEqualTo("Đã liên hệ khách hàng qua điện thoại");
        assertThat(updatedRequest.getCustomerName()).isEqualTo(TEST_CUSTOMER_NAME); // Original data unchanged
    }

    @Test
    @DisplayName("Should retrieve all customer requests sorted by creation date")
    void testGetAllRequestsSortedByDate() throws Exception {
        // Given: Multiple customer requests in database
        CustomerRequest request1 = CustomerRequest.builder()
                .customerName("Customer 1")
                .phoneNumber("0901111111")
                .propertyCode("MS001")
                .note("First request")
                .status("NEW")
                .build();
        customerRequestRepository.save(request1);

        // Wait a bit to ensure different timestamps
        Thread.sleep(100);

        CustomerRequest request2 = CustomerRequest.builder()
                .customerName("Customer 2")
                .phoneNumber("0902222222")
                .propertyCode("MS002")
                .note("Second request")
                .status("NEW")
                .build();
        customerRequestRepository.save(request2);

        Thread.sleep(100);

        CustomerRequest request3 = CustomerRequest.builder()
                .customerName("Customer 3")
                .phoneNumber("0903333333")
                .propertyCode("MS003")
                .note("Third request")
                .status("CONTACTED")
                .build();
        customerRequestRepository.save(request3);

        // When: Execute HTTP GET request to retrieve all requests (requires admin
        // authentication)
        MvcResult result = mockMvc.perform(get("/api/v1/requests")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(3))
                .andExpect(jsonPath("$.message").value("Lấy danh sách yêu cầu thành công"))
                .andReturn();

        // Then: Verify requests are sorted by creation date (newest first)
        String responseBody = result.getResponse().getContentAsString();
        assertThat(responseBody).contains("Customer 3");
        assertThat(responseBody).contains("Customer 2");
        assertThat(responseBody).contains("Customer 1");

        // Verify the order: newest (Customer 3) should appear before oldest (Customer
        // 1)
        int indexCustomer3 = responseBody.indexOf("Customer 3");
        int indexCustomer2 = responseBody.indexOf("Customer 2");
        int indexCustomer1 = responseBody.indexOf("Customer 1");
        assertThat(indexCustomer3).isLessThan(indexCustomer2);
        assertThat(indexCustomer2).isLessThan(indexCustomer1);
    }
}
