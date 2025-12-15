package com.taivillavungtau.backend.dto.request;

import java.math.BigDecimal;
import java.util.List;

import com.taivillavungtau.backend.enums.LocationType;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PropertySearchRequest {
    private String keyword;

    @Positive(message = "Giá tối thiểu phải lớn hơn 0")
    private BigDecimal minPrice;

    @Positive(message = "Giá tối đa phải lớn hơn 0")
    private BigDecimal maxPrice;

    @Min(value = 1, message = "Số phòng ngủ tối thiểu là 1")
    private Integer minBedroom;

    @Min(value = 1, message = "Số phòng tắm tối thiểu là 1")
    private Integer maxBathroom;

    @Min(value = 1, message = "Số khách tối thiểu là 1")
    private Integer maxGuests;

    @Min(value = 1, message = "Số khách tối thiểu là 1")
    private Integer minGuests;

    private String area;
    private LocationType location;
    private Long locationId; // Filter by Location entity ID
    private Boolean isFeatured;

    // --- Lọc theo Tiện ích ---
    private List<Long> amenityIds; // Danh sách ID tiện ích (VD: [1, 2] là Hồ bơi + Karaoke)

    private Long propertyTypeId; // Lọc theo loại hình (Villa, Homestay...)
    private List<String> statusList; // Lọc theo nhiều trạng thái (ACTIVE, SOLD, DELETED...)

    /**
     * Chế độ lọc tiện ích:
     * - "ANY": Villa có ít nhất 1 trong các tiện ích (OR logic) - Mặc định
     * - "ALL": Villa phải có đủ TẤT CẢ các tiện ích (AND logic)
     */
    private String amenityMatchMode = "ALL";

    // --- Sắp xếp ---
    private String sort; // "price_asc", "price_desc", "newest"

    // --- Phân trang ---
    @Min(value = 0, message = "Số trang phải >= 0")
    private Integer page = 0; // Mặc định trang đầu

    @Min(value = 1, message = "Kích thước trang phải >= 1")
    @Max(value = 100, message = "Kích thước trang tối đa là 100")
    private Integer size = 10; // Mặc định 10 căn/trang

    @Override
    public String toString() {
        return "PropertySearchRequest{" +
                "keyword='" + keyword + '\'' +
                ", minPrice=" + minPrice +
                ", maxPrice=" + maxPrice +
                ", minBedroom=" + minBedroom +
                ", maxGuests=" + maxGuests +
                ", minGuests=" + minGuests +
                ", location=" + location +
                ", locationId=" + locationId +
                ", propertyTypeId=" + propertyTypeId +
                ", statusList=" + statusList +
                ", isFeatured=" + isFeatured +
                ", amenityIds=" + amenityIds +
                ", amenityMatchMode='" + amenityMatchMode + '\'' +
                ", sort='" + sort + '\'' +
                ", page=" + page +
                ", size=" + size +
                '}';
    }
}