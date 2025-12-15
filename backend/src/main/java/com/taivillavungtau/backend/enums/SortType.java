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
    NEWEST("newest");

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
