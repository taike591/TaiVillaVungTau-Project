package com.taivillavungtau.backend.controller;

import com.taivillavungtau.backend.dto.PropertyTypeDTO;
import com.taivillavungtau.backend.dto.response.ApiResponse;
import com.taivillavungtau.backend.service.PropertyTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/property-types")
@RequiredArgsConstructor
public class PropertyTypeController {

    private final PropertyTypeService propertyTypeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PropertyTypeDTO>>> getAllPropertyTypes() {
        List<PropertyTypeDTO> types = propertyTypeService.getAllPropertyTypes();
        return ResponseEntity.ok(ApiResponse.success(types, "Lấy danh sách loại BĐS thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyTypeDTO>> getPropertyTypeById(@PathVariable Long id) {
        PropertyTypeDTO type = propertyTypeService.getPropertyTypeById(id);
        return ResponseEntity.ok(ApiResponse.success(type, "Lấy thông tin loại BĐS thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PropertyTypeDTO>> createPropertyType(@Valid @RequestBody PropertyTypeDTO dto) {
        PropertyTypeDTO created = propertyTypeService.createPropertyType(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Thêm loại BĐS thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyTypeDTO>> updatePropertyType(
            @PathVariable Long id,
            @Valid @RequestBody PropertyTypeDTO dto) {
        PropertyTypeDTO updated = propertyTypeService.updatePropertyType(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Cập nhật loại BĐS thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePropertyType(@PathVariable Long id) {
        propertyTypeService.deletePropertyType(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa loại BĐS thành công"));
    }
}
