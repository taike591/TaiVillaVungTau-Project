package com.taivillavungtau.backend.controller;

import com.taivillavungtau.backend.dto.response.ApiResponse;
import com.taivillavungtau.backend.dto.response.AdminStatsResponse;
import com.taivillavungtau.backend.dto.response.MonthlyStatsResponse;
import com.taivillavungtau.backend.dto.response.TopPropertyResponse;
import com.taivillavungtau.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // Chỉ ADMIN mới truy cập được toàn bộ controller này
public class AdminController {

    private final AdminService adminService;

    /**
     * API 1: Lấy thống kê tổng quan (Dashboard)
     * GET /api/v1/admin/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getOverallStats() {
        AdminStatsResponse stats = adminService.getOverallStats();
        return ResponseEntity.ok(ApiResponse.success(stats, "Lấy thống kê tổng quan thành công"));
    }

    /**
     * API 2: Lấy Top Villa được quan tâm nhiều nhất
     * GET /api/v1/admin/top-properties?limit=5
     */
    @GetMapping("/top-properties")
    public ResponseEntity<ApiResponse<List<TopPropertyResponse>>> getTopProperties(
            @RequestParam(defaultValue = "5") int limit) {
        List<TopPropertyResponse> topProperties = adminService.getTopProperties(limit);
        return ResponseEntity.ok(ApiResponse.success(topProperties, "Lấy danh sách Villa hàng đầu thành công"));
    }

    /**
     * API 3: Thống kê theo tháng (Số yêu cầu tư vấn theo từng tháng)
     * GET /api/v1/admin/monthly-stats?year=2024
     */
    @GetMapping("/monthly-stats")
    public ResponseEntity<ApiResponse<List<MonthlyStatsResponse>>> getMonthlyStats(
            @RequestParam(required = false) Integer year) {
        List<MonthlyStatsResponse> monthlyStats = adminService.getMonthlyStats(year);
        return ResponseEntity.ok(ApiResponse.success(monthlyStats, "Lấy thống kê theo tháng thành công"));
    }
}