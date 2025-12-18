package com.taivillavungtau.backend.enums;

import lombok.Getter;

@Getter
public enum SortType {

    PRICE_ASC("price_asc"),
    PRICE_DESC("price_desc"),
    NAME_ASC("name_asc"),
    NAME_DESC("name_desc"),
    CODE_ASC("code_asc"),
    CODE_DESC("code_desc"),
    STATUS_ASC("status_asc"),
    STATUS_DESC("status_desc"),
    CREATED_AT_ASC("created_at_asc"),
    CREATED_AT_DESC("created_at_desc"),
    UPDATED_AT_ASC("updated_at_asc"),
    UPDATED_AT_DESC("updated_at_desc"),
    NEWEST("newest"),
    TYPE_ASC("type_asc"),
    TYPE_DESC("type_desc"),
    LOCATION_ASC("location_asc"),
    LOCATION_DESC("location_desc"),
    FEATURED_ASC("featured_asc"),
    FEATURED_DESC("featured_desc"),
    IMAGE_COUNT_ASC("image_count_asc"),
    IMAGE_COUNT_DESC("image_count_desc");

    private final String value;

    SortType(String value) {
        this.value = value;
    }

    // Hàm helper để convert từ String sang Enum an toàn
    public static SortType fromValue(String value) {
        for (SortType type : SortType.values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        return NEWEST; // Mặc định nếu không tìm thấy hoặc null
    }

}
