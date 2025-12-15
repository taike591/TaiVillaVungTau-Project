package com.taivillavungtau.backend.controller;

import com.taivillavungtau.backend.dto.AmenityDTO;
import com.taivillavungtau.backend.dto.response.ApiResponse;
import com.taivillavungtau.backend.service.AmenityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/amenities")
@RequiredArgsConstructor
public class AmenityController {

    private final AmenityService amenityService;

    @PostMapping
    public ResponseEntity<ApiResponse<AmenityDTO>> createAmenity(@Valid @RequestBody AmenityDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(amenityService.createAmenity(dto), "Thêm tiện ích thành công"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AmenityDTO>>> getAllAmenities() {
        return ResponseEntity.ok(ApiResponse.success(amenityService.getAllAmenities(), "Lấy danh sách thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAmenity(@PathVariable Long id) {
        amenityService.deleteAmenity(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa thành công"));
    }
}