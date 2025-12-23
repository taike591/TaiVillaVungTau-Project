package com.taivillavungtau.backend.controller;

import com.taivillavungtau.backend.dto.LabelDTO;
import com.taivillavungtau.backend.dto.response.ApiResponse;
import com.taivillavungtau.backend.service.LabelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/labels")
@RequiredArgsConstructor
public class LabelController {

    private final LabelService labelService;

    @PostMapping
    public ResponseEntity<ApiResponse<LabelDTO>> createLabel(@Valid @RequestBody LabelDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(labelService.createLabel(dto), "Thêm label thành công"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LabelDTO>>> getAllLabels() {
        return ResponseEntity.ok(ApiResponse.success(labelService.getAllLabels(), "Lấy danh sách label thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LabelDTO>> updateLabel(
            @PathVariable Long id,
            @Valid @RequestBody LabelDTO dto) {
        return ResponseEntity.ok(ApiResponse.success(labelService.updateLabel(id, dto), "Cập nhật label thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLabel(@PathVariable Long id) {
        labelService.deleteLabel(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa label thành công"));
    }
}
