package com.taivillavungtau.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyStatsResponse {
    private int year;           // Năm (VD: 2024)
    private int month;          // Tháng (1-12)
    private long requestCount;  // Số yêu cầu trong tháng đó
}