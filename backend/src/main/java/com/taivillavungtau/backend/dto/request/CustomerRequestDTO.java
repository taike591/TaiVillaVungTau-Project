package com.taivillavungtau.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CustomerRequestDTO {

    @Size(max = 100, message = "{validation.customerRequest.name.size}")
    private String customerName;

    @NotBlank(message = "{validation.customerRequest.phone.notblank}")
    @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$", message = "{validation.customerRequest.phone.pattern}")
    private String phoneNumber; // Bắt buộc

    @Size(max = 500, message = "{validation.customerRequest.note.size}")
    private String note;

    @Size(max = 50, message = "{validation.customerRequest.propertyCode.size}")
    private String propertyCode; // Frontend tự lấy từ URL và gửi kèm
}