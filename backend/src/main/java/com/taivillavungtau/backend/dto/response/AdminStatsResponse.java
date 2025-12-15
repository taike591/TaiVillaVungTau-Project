package com.taivillavungtau.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalProperties;           // Tổng số Villa
    private long totalRequests;             // Tổng số yêu cầu tư vấn
    private long newRequestsToday;          // Yêu cầu mới hôm nay
    private long activeProperties;          // Số Villa đang ACTIVE
}