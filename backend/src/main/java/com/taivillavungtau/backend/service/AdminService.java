package com.taivillavungtau.backend.service;

import com.taivillavungtau.backend.dto.response.AdminStatsResponse;
import com.taivillavungtau.backend.dto.response.MonthlyStatsResponse;
import com.taivillavungtau.backend.dto.response.TopPropertyResponse;

import java.util.List;

public interface AdminService {
    
    /**
     * Lấy thống kê tổng quan cho Dashboard
     */
    AdminStatsResponse getOverallStats();
    
    /**
     * Lấy Top Villa được quan tâm nhiều nhất (dựa trên số lượng request)
     * @param limit Số lượng Villa muốn lấy (VD: Top 5)
     */
    List<TopPropertyResponse> getTopProperties(int limit);
    
    /**
     * Thống kê số yêu cầu theo từng tháng
     * @param year Năm cần thống kê (null = năm hiện tại)
     */
    List<MonthlyStatsResponse> getMonthlyStats(Integer year);
}