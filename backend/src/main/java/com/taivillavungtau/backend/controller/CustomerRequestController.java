package com.taivillavungtau.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taivillavungtau.backend.dto.request.CustomerRequestDTO;
import com.taivillavungtau.backend.dto.request.UpdateCustomerRequestDTO;
import com.taivillavungtau.backend.dto.response.ApiResponse;
import com.taivillavungtau.backend.entity.CustomerRequest;
import com.taivillavungtau.backend.service.CustomerRequestService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/requests")
@RequiredArgsConstructor
public class CustomerRequestController {

    private final CustomerRequestService requestService;

    // 1. Khách hàng gửi yêu cầu (Public)
    @PostMapping
    public ResponseEntity<ApiResponse<CustomerRequestDTO>> createRequest(@Valid @RequestBody CustomerRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(requestService.createRequest(dto), "Gửi yêu cầu thành công. Chúng tôi sẽ liên hệ sớm!"));
    }

    // 2. Admin xem danh sách (Cần bảo mật sau này)
    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomerRequest>>> getAllRequests() {
        return ResponseEntity.ok(ApiResponse.success(requestService.getAllRequests(), "Lấy danh sách yêu cầu thành công"));
    }

    // 3. Admin cập nhật trạng thái/ghi chú
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerRequest>> updateRequest(
            @PathVariable Long id,
            @RequestBody UpdateCustomerRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.success(requestService.updateRequest(id, dto), "Cập nhật yêu cầu thành công"));
    }
}