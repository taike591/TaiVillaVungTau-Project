package com.taivillavungtau.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private String title;
    private String message;
    private String type; // NEW_REQUEST
    private String link; // Link để Admin bấm vào
}