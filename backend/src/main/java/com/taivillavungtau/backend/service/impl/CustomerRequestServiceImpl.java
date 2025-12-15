package com.taivillavungtau.backend.service.impl;

import java.util.List;
import java.util.Objects;

import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taivillavungtau.backend.dto.request.CustomerRequestDTO;
import com.taivillavungtau.backend.dto.request.UpdateCustomerRequestDTO;
import com.taivillavungtau.backend.dto.response.NotificationDTO;
import com.taivillavungtau.backend.entity.CustomerRequest;
import com.taivillavungtau.backend.exception.ResourceNotFoundException;
import com.taivillavungtau.backend.mapper.CustomerRequestMapper;
import com.taivillavungtau.backend.repository.CustomerRequestRepository;
import com.taivillavungtau.backend.service.CustomerRequestService;
import com.taivillavungtau.backend.service.TelegramNotificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerRequestServiceImpl implements CustomerRequestService {
    private final CustomerRequestRepository requestRepository;
    private final CustomerRequestMapper requestMapper;

    // Inject WebSocket Template
    private final SimpMessagingTemplate messagingTemplate;
    private final TelegramNotificationService telegramNotificationService;

    @Override
    @Transactional
    public CustomerRequestDTO createRequest(CustomerRequestDTO dto) {
        log.info("Creating new customer request for property: {}", dto.getPropertyCode());
        CustomerRequest request = requestMapper.toEntity(dto);
        // Status mặc định là NEW do @PrePersist trong Entity xử lý
        CustomerRequest savedRequest = requestRepository.save(Objects.requireNonNull(request));

        // --- REAL-TIME NOTIFICATION ---
        try {
            NotificationDTO notification = NotificationDTO.builder()
                    .title("Khách hàng mới!")
                    .message("Khách " + savedRequest.getCustomerName() + " quan tâm căn "
                            + savedRequest.getPropertyCode())
                    .type("NEW_REQUEST")
                    .link("/admin/requests/" + savedRequest.getId())
                    .build();

            // Gửi đến topic chung cho Admin
            messagingTemplate.convertAndSend("/topic/admin", Objects.requireNonNull(notification));
            log.debug("Sent WebSocket notification for request ID: {}", savedRequest.getId());
        } catch (Exception e) {
            // Log lỗi nhưng không làm fail transaction chính
            log.error("Gửi thông báo WebSocket thất bại", e);
        }

        // --- TELEGRAM NOTIFICATION ---
        try {
            String telegramMessage = String.format(
                    "🔔 *Yêu cầu mới!*\n" +
                            "👤 Khách: %s\n" +
                            "📱 SĐT: %s\n" +
                            "🏠 Mã căn: %s\n" +
                            "📝 Ghi chú: %s",
                    savedRequest.getCustomerName(),
                    savedRequest.getPhoneNumber(),
                    savedRequest.getPropertyCode(),
                    savedRequest.getNote() != null ? savedRequest.getNote() : "Không có");
            telegramNotificationService.sendNotification(telegramMessage);
        } catch (Exception e) {
            log.error("Gửi thông báo Telegram thất bại", e);
        }
        // ------------------------------

        log.info("Customer request created successfully. ID: {}", savedRequest.getId());
        return requestMapper.toDTO(savedRequest);
    }

    @Override
    public List<CustomerRequest> getAllRequests() {
        // Sắp xếp ngày tạo mới nhất lên đầu
        return requestRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Override
    @Transactional
    public CustomerRequest updateRequest(Long id, UpdateCustomerRequestDTO dto) {
        Objects.requireNonNull(id, "Request ID must not be null");
        log.info("Updating customer request ID: {}", id);
        CustomerRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy yêu cầu với ID: " + id));

        // Chỉ cập nhật nếu có dữ liệu gửi lên
        if (dto.getStatus() != null && !dto.getStatus().isEmpty()) {
            request.setStatus(dto.getStatus());
        }
        if (dto.getAdminNote() != null) {
            request.setAdminNote(dto.getAdminNote());
        }

        return requestRepository.save(Objects.requireNonNull(request));
    }
}