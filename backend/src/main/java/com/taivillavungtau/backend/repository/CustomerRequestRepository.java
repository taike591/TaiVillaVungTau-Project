package com.taivillavungtau.backend.repository;

import com.taivillavungtau.backend.dto.response.MonthlyStatsResponse;
import com.taivillavungtau.backend.dto.response.TopPropertyResponse;
import com.taivillavungtau.backend.entity.CustomerRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CustomerRequestRepository extends JpaRepository<CustomerRequest, Long> {
    
    /**
     * Đếm số yêu cầu trong khoảng thời gian
     */
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    /**
     * Lấy Top Villa được quan tâm nhiều nhất (dựa trên số lượng request)
     * Join với bảng properties để lấy tên và ảnh
     */
    @Query("""
        SELECT new com.taivillavungtau.backend.dto.response.TopPropertyResponse(
            p.code,
            p.name,
            (SELECT MIN(pi.imageUrl) FROM PropertyImage pi WHERE pi.property.id = p.id AND pi.isThumbnail = true),
            COUNT(cr.id)
        )
        FROM CustomerRequest cr
        JOIN Property p ON cr.propertyCode = p.code
        WHERE cr.propertyCode IS NOT NULL
        GROUP BY p.id, p.code, p.name
        ORDER BY COUNT(cr.id) DESC
        LIMIT :limit
    """)
    List<TopPropertyResponse> findTopPropertiesByRequestCount(@Param("limit") int limit);
    
    /**
     * Thống kê số yêu cầu theo từng tháng trong năm
     */
    @Query("""
        SELECT new com.taivillavungtau.backend.dto.response.MonthlyStatsResponse(
            YEAR(cr.createdAt),
            MONTH(cr.createdAt),
            COUNT(cr.id)
        )
        FROM CustomerRequest cr
        WHERE YEAR(cr.createdAt) = :year
        GROUP BY YEAR(cr.createdAt), MONTH(cr.createdAt)
        ORDER BY MONTH(cr.createdAt)
    """)
    List<MonthlyStatsResponse> findMonthlyStats(@Param("year") int year);
}