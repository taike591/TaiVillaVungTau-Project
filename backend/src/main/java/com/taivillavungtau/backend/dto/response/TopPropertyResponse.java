package com.taivillavungtau.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopPropertyResponse {
    private String propertyCode;    // Mã Villa (VD: MS44)
    private String propertyName;    // Tên Villa
    private String thumbnailUrl;    // Ảnh đại diện
    private long requestCount;      // Số lượng yêu cầu
}