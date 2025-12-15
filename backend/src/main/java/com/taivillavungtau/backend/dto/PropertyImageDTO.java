package com.taivillavungtau.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyImageDTO implements Serializable {
    private Long id;
    private String imageUrl;
    private Boolean isThumbnail;
}
