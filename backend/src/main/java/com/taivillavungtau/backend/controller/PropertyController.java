package com.taivillavungtau.backend.controller;

import com.taivillavungtau.backend.dto.PropertyDTO;
import com.taivillavungtau.backend.dto.request.PropertySearchRequest;
import com.taivillavungtau.backend.dto.response.ApiResponse;
import com.taivillavungtau.backend.dto.response.PageResponse;
import com.taivillavungtau.backend.service.CloudinaryService;
import com.taivillavungtau.backend.service.PropertyService;
import com.taivillavungtau.backend.utils.Translator;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;
    private final CloudinaryService cloudinaryService;

    // 1. Tạo mới Villa
    @PostMapping
    public ResponseEntity<ApiResponse<PropertyDTO>> createProperty(@Valid @RequestBody PropertyDTO propertyDTO) {
        PropertyDTO createdProperty = propertyService.createProperty(propertyDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdProperty, Translator.toLocale("success.villa.create")));
    }

    // 2. Tìm kiếm & Lọc danh sách (với validation)
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PropertyDTO>>> getProperties(
            @Valid @ModelAttribute PropertySearchRequest request) {
        PageResponse<PropertyDTO> properties = propertyService.searchProperties(request);
        return ResponseEntity.ok(ApiResponse.success(properties, "Lấy danh sách thành công"));
    }

    // 3. Xem chi tiết Villa (MỚI)
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyDTO>> getPropertyById(@PathVariable Long id) {
        PropertyDTO property = propertyService.getPropertyById(id);
        return ResponseEntity.ok(ApiResponse.success(property, "Lấy thông tin chi tiết thành công"));
    }

    // 4. Cập nhật Villa (MỚI)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyDTO>> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyDTO propertyDTO) {
        PropertyDTO updatedProperty = propertyService.updateProperty(id, propertyDTO);
        return ResponseEntity.ok(ApiResponse.success(updatedProperty, "Cập nhật thông tin thành công"));
    }

    // 5. Xóa Villa (MỚI)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa Villa thành công"));
    }

    // 5.1 Partial update (PATCH) - for toggling featured, status, etc.
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyDTO>> patchProperty(
            @PathVariable Long id,
            @RequestBody PropertyDTO propertyDTO) {
        PropertyDTO updatedProperty = propertyService.patchProperty(id, propertyDTO);
        return ResponseEntity.ok(ApiResponse.success(updatedProperty, "Cập nhật thành công"));
    }

    // 6. Upload ảnh
    @PostMapping("/{id}/images")
    public ResponseEntity<ApiResponse<String>> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        String imageUrl = cloudinaryService.uploadImage(file);
        propertyService.addImageToProperty(id, imageUrl);
        return ResponseEntity.ok(ApiResponse.success(imageUrl, "Upload ảnh thành công"));
    }

    // 7. Xóa ảnh
    @DeleteMapping("/{id}/images/{imageId}")
    public ResponseEntity<ApiResponse<Void>> deleteImage(
            @PathVariable Long id,
            @PathVariable Long imageId) {
        propertyService.deleteImageFromProperty(id, imageId);
        return ResponseEntity.ok(ApiResponse.success("Xóa ảnh thành công"));
    }

    // 8. Đặt ảnh làm thumbnail
    @PutMapping("/{id}/images/{imageId}/thumbnail")
    public ResponseEntity<ApiResponse<Void>> setThumbnail(
            @PathVariable Long id,
            @PathVariable Long imageId) {
        propertyService.setThumbnail(id, imageId);
        return ResponseEntity.ok(ApiResponse.success("Đặt ảnh đại diện thành công"));
    }
}