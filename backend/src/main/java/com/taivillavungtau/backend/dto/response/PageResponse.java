package com.taivillavungtau.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor // <--- Bắt buộc phải có để Jackson deserialize được
@AllArgsConstructor
public class PageResponse<T> implements Serializable {


    private static final long serialVersionUID = 1L;
    private List<T> content;
    private int pageNo;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean last;
}