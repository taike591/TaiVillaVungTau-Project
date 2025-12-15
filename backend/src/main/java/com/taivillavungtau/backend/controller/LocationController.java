package com.taivillavungtau.backend.controller;

import com.taivillavungtau.backend.dto.LocationDTO;
import com.taivillavungtau.backend.dto.response.ApiResponse;
import com.taivillavungtau.backend.service.LocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LocationDTO>>> getAllLocations() {
        List<LocationDTO> locations = locationService.getAllLocations();
        return ResponseEntity.ok(ApiResponse.success(locations, "Lấy danh sách khu vực thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LocationDTO>> getLocationById(@PathVariable Long id) {
        LocationDTO location = locationService.getLocationById(id);
        return ResponseEntity.ok(ApiResponse.success(location, "Lấy thông tin khu vực thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LocationDTO>> createLocation(@Valid @RequestBody LocationDTO dto) {
        LocationDTO created = locationService.createLocation(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Thêm khu vực thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LocationDTO>> updateLocation(
            @PathVariable Long id,
            @Valid @RequestBody LocationDTO dto) {
        LocationDTO updated = locationService.updateLocation(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Cập nhật khu vực thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLocation(@PathVariable Long id) {
        locationService.deleteLocation(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa khu vực thành công"));
    }
}
