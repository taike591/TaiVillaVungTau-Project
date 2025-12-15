package com.taivillavungtau.backend.service.impl;

import com.taivillavungtau.backend.dto.request.CustomerRequestDTO;
import com.taivillavungtau.backend.dto.request.UpdateCustomerRequestDTO;
import com.taivillavungtau.backend.dto.response.NotificationDTO;
import com.taivillavungtau.backend.entity.CustomerRequest;
import com.taivillavungtau.backend.exception.ResourceNotFoundException;
import com.taivillavungtau.backend.mapper.CustomerRequestMapper;
import com.taivillavungtau.backend.repository.CustomerRequestRepository;
import com.taivillavungtau.backend.service.TelegramNotificationService;
import com.taivillavungtau.backend.util.TestDataBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CustomerRequestServiceImpl Unit Tests")
class CustomerRequestServiceImplTest {

    @Mock
    private CustomerRequestRepository requestRepository;

    @Mock
    private CustomerRequestMapper requestMapper;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Mock
    private TelegramNotificationService telegramNotificationService;

    @InjectMocks
    private CustomerRequestServiceImpl customerRequestService;

    private CustomerRequest testRequest;
    private CustomerRequestDTO testRequestDTO;

    @BeforeEach
    void setUp() {
        testRequest = TestDataBuilder.validCustomerRequest()
                .id(1L)
                .customerName("John Doe")
                .phoneNumber("0987654321")
                .propertyCode("MS123")
                .note("Interested in booking")
                .status("NEW")
                .adminNote("")
                .createdAt(LocalDateTime.now())
                .build();

        testRequestDTO = TestDataBuilder.validCustomerRequestDTO();
        testRequestDTO.setCustomerName("John Doe");
        testRequestDTO.setPhoneNumber("0987654321");
        testRequestDTO.setPropertyCode("MS123");
        testRequestDTO.setNote("Interested in booking");
    }

    @Nested
    @DisplayName("Create Request Operations")
    class CreateRequestTests {

        @Test
        @DisplayName("Should create request and return DTO")
        void shouldCreateRequest_andReturnDTO() {
            // Given
            when(requestMapper.toEntity(testRequestDTO)).thenReturn(testRequest);
            when(requestRepository.save(any(CustomerRequest.class))).thenReturn(testRequest);
            when(requestMapper.toDTO(testRequest)).thenReturn(testRequestDTO);

            // When
            CustomerRequestDTO result = customerRequestService.createRequest(testRequestDTO);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getCustomerName()).isEqualTo("John Doe");
            assertThat(result.getPhoneNumber()).isEqualTo("0987654321");
            assertThat(result.getPropertyCode()).isEqualTo("MS123");

            verify(requestMapper).toEntity(testRequestDTO);
            verify(requestRepository).save(any(CustomerRequest.class));
            verify(requestMapper).toDTO(testRequest);
        }

        @Test
        @DisplayName("Should send WebSocket notification to admin topic")
        void shouldSendWebSocketNotification_toAdminTopic() {
            // Given
            when(requestMapper.toEntity(testRequestDTO)).thenReturn(testRequest);
            when(requestRepository.save(any(CustomerRequest.class))).thenReturn(testRequest);
            when(requestMapper.toDTO(testRequest)).thenReturn(testRequestDTO);

            // When
            customerRequestService.createRequest(testRequestDTO);

            // Then
            ArgumentCaptor<NotificationDTO> notificationCaptor = ArgumentCaptor.forClass(NotificationDTO.class);
            verify(messagingTemplate).convertAndSend(eq("/topic/admin"), notificationCaptor.capture());

            NotificationDTO notification = notificationCaptor.getValue();
            assertThat(notification).isNotNull();
            assertThat(notification.getTitle()).isEqualTo("Khách hàng mới!");
            assertThat(notification.getMessage()).contains("John Doe");
            assertThat(notification.getMessage()).contains("MS123");
            assertThat(notification.getType()).isEqualTo("NEW_REQUEST");
            assertThat(notification.getLink()).isEqualTo("/admin/requests/1");
        }

        @Test
        @DisplayName("Should trigger Telegram notification")
        void shouldTriggerTelegramNotification() {
            // Given
            when(requestMapper.toEntity(testRequestDTO)).thenReturn(testRequest);
            when(requestRepository.save(any(CustomerRequest.class))).thenReturn(testRequest);
            when(requestMapper.toDTO(testRequest)).thenReturn(testRequestDTO);

            // When
            customerRequestService.createRequest(testRequestDTO);

            // Then
            ArgumentCaptor<String> messageCaptor = ArgumentCaptor.forClass(String.class);
            verify(telegramNotificationService).sendNotification(messageCaptor.capture());

            String telegramMessage = messageCaptor.getValue();
            assertThat(telegramMessage).contains("Yêu cầu mới!");
            assertThat(telegramMessage).contains("John Doe");
            assertThat(telegramMessage).contains("0987654321");
            assertThat(telegramMessage).contains("MS123");
            assertThat(telegramMessage).contains("Interested in booking");
        }

        @Test
        @DisplayName("Should succeed even when WebSocket notification fails")
        void shouldSucceed_evenWhenWebSocketNotificationFails() {
            // Given
            when(requestMapper.toEntity(testRequestDTO)).thenReturn(testRequest);
            when(requestRepository.save(any(CustomerRequest.class))).thenReturn(testRequest);
            when(requestMapper.toDTO(testRequest)).thenReturn(testRequestDTO);
            doThrow(new RuntimeException("WebSocket error"))
                    .when(messagingTemplate).convertAndSend(anyString(), any(NotificationDTO.class));

            // When
            CustomerRequestDTO result = customerRequestService.createRequest(testRequestDTO);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getCustomerName()).isEqualTo("John Doe");
            verify(requestRepository).save(any(CustomerRequest.class));
            verify(requestMapper).toDTO(testRequest);
        }

        @Test
        @DisplayName("Should succeed even when Telegram notification fails")
        void shouldSucceed_evenWhenTelegramNotificationFails() {
            // Given
            when(requestMapper.toEntity(testRequestDTO)).thenReturn(testRequest);
            when(requestRepository.save(any(CustomerRequest.class))).thenReturn(testRequest);
            when(requestMapper.toDTO(testRequest)).thenReturn(testRequestDTO);
            doThrow(new RuntimeException("Telegram error"))
                    .when(telegramNotificationService).sendNotification(anyString());

            // When
            CustomerRequestDTO result = customerRequestService.createRequest(testRequestDTO);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getCustomerName()).isEqualTo("John Doe");
            verify(requestRepository).save(any(CustomerRequest.class));
            verify(requestMapper).toDTO(testRequest);
        }
    }

    @Nested
    @DisplayName("Get All Requests Operations")
    class GetAllRequestsTests {

        @Test
        @DisplayName("Should return all requests sorted by createdAt descending")
        void shouldReturnAllRequests_sortedByCreatedAtDescending() {
            // Given
            CustomerRequest request1 = TestDataBuilder.validCustomerRequest()
                    .id(1L)
                    .createdAt(LocalDateTime.now().minusDays(2))
                    .build();
            CustomerRequest request2 = TestDataBuilder.validCustomerRequest()
                    .id(2L)
                    .createdAt(LocalDateTime.now().minusDays(1))
                    .build();
            CustomerRequest request3 = TestDataBuilder.validCustomerRequest()
                    .id(3L)
                    .createdAt(LocalDateTime.now())
                    .build();

            List<CustomerRequest> requests = Arrays.asList(request3, request2, request1);
            when(requestRepository.findAll(any(Sort.class))).thenReturn(requests);

            // When
            List<CustomerRequest> result = customerRequestService.getAllRequests();

            // Then
            assertThat(result).hasSize(3);
            assertThat(result.get(0).getId()).isEqualTo(3L);
            assertThat(result.get(1).getId()).isEqualTo(2L);
            assertThat(result.get(2).getId()).isEqualTo(1L);

            ArgumentCaptor<Sort> sortCaptor = ArgumentCaptor.forClass(Sort.class);
            verify(requestRepository).findAll(sortCaptor.capture());

            Sort sort = sortCaptor.getValue();
            assertThat(sort.getOrderFor("createdAt")).isNotNull();
            assertThat(sort.getOrderFor("createdAt").getDirection()).isEqualTo(Sort.Direction.DESC);
        }
    }

    @Nested
    @DisplayName("Update Request Operations")
    class UpdateRequestTests {

        @Test
        @DisplayName("Should update request status correctly")
        void shouldUpdateRequestStatus_correctly() {
            // Given
            UpdateCustomerRequestDTO updateDTO = new UpdateCustomerRequestDTO();
            updateDTO.setStatus("CONTACTED");

            when(requestRepository.findById(1L)).thenReturn(Optional.of(testRequest));
            when(requestRepository.save(any(CustomerRequest.class))).thenReturn(testRequest);

            // When
            CustomerRequest result = customerRequestService.updateRequest(1L, updateDTO);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getStatus()).isEqualTo("CONTACTED");

            verify(requestRepository).findById(1L);
            verify(requestRepository).save(any(CustomerRequest.class));
        }

        @Test
        @DisplayName("Should update admin note correctly")
        void shouldUpdateAdminNote_correctly() {
            // Given
            UpdateCustomerRequestDTO updateDTO = new UpdateCustomerRequestDTO();
            updateDTO.setAdminNote("Customer called back");

            when(requestRepository.findById(1L)).thenReturn(Optional.of(testRequest));
            when(requestRepository.save(any(CustomerRequest.class))).thenReturn(testRequest);

            // When
            CustomerRequest result = customerRequestService.updateRequest(1L, updateDTO);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getAdminNote()).isEqualTo("Customer called back");

            verify(requestRepository).findById(1L);
            verify(requestRepository).save(any(CustomerRequest.class));
        }

        @Test
        @DisplayName("Should throw ResourceNotFoundException when request does not exist")
        void shouldThrowResourceNotFoundException_whenRequestDoesNotExist() {
            // Given
            UpdateCustomerRequestDTO updateDTO = new UpdateCustomerRequestDTO();
            updateDTO.setStatus("CONTACTED");

            when(requestRepository.findById(999L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> customerRequestService.updateRequest(999L, updateDTO))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Không tìm thấy yêu cầu với ID: 999");

            verify(requestRepository).findById(999L);
            verify(requestRepository, never()).save(any(CustomerRequest.class));
        }
    }

    @Nested
    @DisplayName("Property-Based Tests")
    class PropertyBasedTests {

        /**
         * Feature: backend-testing-improvement, Property 7: Empty Collection Handling
         * Validates: Requirements 7.2
         * 
         * For any service method that accepts collection parameters, passing an empty collection
         * should either return an empty result or handle gracefully without throwing exceptions.
         */
        @Test
        @DisplayName("Should handle empty collection gracefully when no requests exist")
        void shouldHandleEmptyCollection_whenNoRequestsExist() {
            // Given
            when(requestRepository.findAll(any(Sort.class))).thenReturn(Collections.emptyList());

            // When
            List<CustomerRequest> result = customerRequestService.getAllRequests();

            // Then
            assertThat(result).isNotNull();
            assertThat(result).isEmpty();
            verify(requestRepository).findAll(any(Sort.class));
        }
    }
}
