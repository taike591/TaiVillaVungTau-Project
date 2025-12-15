package com.taivillavungtau.backend.dto.request;

import lombok.Data;

@Data
public class UpdateCustomerRequestDTO {

    private String status;    // NEW, CONTACTED, CLOSED, CANCELLED
    private String adminNote; // Ghi chú của bạn
    
}
