package com.taivillavungtau.backend.service.impl;

import com.taivillavungtau.backend.dto.response.AdminStatsResponse;
import com.taivillavungtau.backend.dto.response.MonthlyStatsResponse;
import com.taivillavungtau.backend.dto.response.TopPropertyResponse;
import com.taivillavungtau.backend.repository.CustomerRequestRepository;
import com.taivillavungtau.backend.repository.PropertyRepository;
import com.taivillavungtau.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final PropertyRepository propertyRepository;
    private final CustomerRequestRepository customerRequestRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminStatsResponse getOverallStats() {
        log.info("Fetching overall admin statistics");
        
        // 1. Tổng số Villa
        long totalProperties = propertyRepository.count();
        
        // 2. Tổng số yêu cầu tư vấn
        long totalRequests = customerRequestRepository.count();
        
        // 3. Số yêu cầu mới hôm nay
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().plusDays(1).atStartOfDay();
        long newRequestsToday = customerRequestRepository.countByCreatedAtBetween(startOfDay, endOfDay);
        
        // 4. Số Villa đang ACTIVE
        long activeProperties = propertyRepository.countByStatus("ACTIVE");
        
        return AdminStatsResponse.builder()
                .totalProperties(totalProperties)
                .totalRequests(totalRequests)
                .newRequestsToday(newRequestsToday)
                .activeProperties(activeProperties)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TopPropertyResponse> getTopProperties(int limit) {
        log.info("Fetching top {} properties by request count", limit);
        return customerRequestRepository.findTopPropertiesByRequestCount(limit);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MonthlyStatsResponse> getMonthlyStats(Integer year) {
        int targetYear = (year != null) ? year : LocalDate.now().getYear();
        log.info("Fetching monthly statistics for year: {}", targetYear);
        return customerRequestRepository.findMonthlyStats(targetYear);
    }
}