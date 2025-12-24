package com.taivillavungtau.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.taivillavungtau.backend.enums.LocationType;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PropertyDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    @NotBlank(message = "{validation.property.code.notblank}")
    @Size(max = 50, message = "{validation.property.code.size}")
    private String code;

    @NotBlank(message = "{validation.property.name.notblank}")
    @Size(min = 10, max = 200, message = "{validation.property.name.size}")
    private String name;

    private Boolean isFeatured;

    private String slug;

    @Size(min = 50, max = 2000, message = "{validation.property.description.size}")
    private String description;

    @Size(max = 255, message = "{validation.property.address.size}")
    private String address;

    @Size(max = 100, message = "{validation.property.area.size}")
    private String area;

    private String mapUrl;
    private String facebookLink;

    // --- GIÁ & SỨC CHỨA ---

    @NotNull(message = "{validation.property.priceWeekday.notnull}")
    @Min(value = 0, message = "{validation.property.price.min}")
    private BigDecimal priceWeekday;

    @NotNull(message = "{validation.property.priceWeekend.notnull}")
    @Min(value = 0, message = "{validation.property.price.min}")
    private BigDecimal priceWeekend;

    @NotNull(message = "{validation.property.standardGuests.notnull}")
    @Min(value = 1, message = "{validation.property.guests.min}")
    private Integer standardGuests;

    @Min(value = 1, message = "{validation.property.guests.min}")
    private Integer maxGuests;

    @NotNull(message = "{validation.property.bedroomCount.notnull}")
    @Min(value = 1, message = "{validation.property.bedroomCount.min}")
    private Integer bedroomCount;

    @NotNull(message = "{validation.property.bathroomCount.notnull}")
    @Min(value = 1, message = "{validation.property.bathroomCount.min}")
    private Integer bathroomCount;

    // --- QUAN HỆ ---

    // Dùng để nhận ID tiện ích từ Frontend khi Thêm/Sửa (Input)
    private List<Long> amenityIds;

    // Dùng để trả về danh sách tiện ích đầy đủ (Output)
    private List<AmenityDTO> amenities;

    // Dùng để nhận ID labels từ Frontend khi Thêm/Sửa (Input)
    private List<Long> labelIds;

    // Dùng để trả về danh sách labels đầy đủ (Output)
    private List<LabelDTO> labels;

    // Dùng để trả về danh sách ảnh (Output)
    private List<PropertyImageDTO> images;

    private LocationType location; // Keep for backward compatibility

    // New dynamic location fields
    private Long locationId;
    private String locationName;

    // Property type fields (Villa, Homestay, etc.)
    private Long propertyTypeId;
    private String propertyTypeName;

    private Integer bedCount;
    private String bedConfig;
    private String distanceToSea;

    @Size(max = 200, message = "{validation.property.priceNote.size}")
    private String priceNote;

    // --- SEO META DATA ---
    @Size(max = 100, message = "{validation.property.metaTitle.size}")
    private String metaTitle;

    @Size(max = 500, message = "{validation.property.metaDescription.size}")
    private String metaDescription;

    // --- ADMIN MANAGEMENT FIELDS ---
    private String googleSheetsUrl; // URL Google Sheets để quản lý
    private String googleSheetsNote; // Ghi chú từ Google Sheets

    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private java.time.LocalDateTime createdAt;

    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private java.time.LocalDateTime updatedAt;

    // --- STATUS ---
    private String status; // ACTIVE, DELETED, etc.
}