package com.taivillavungtau.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabelDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    @NotBlank(message = "Tên label không được để trống")
    @Size(min = 2, max = 50, message = "Tên label phải từ 2-50 ký tự")
    private String name;

    @Size(max = 7, message = "Mã màu tối đa 7 ký tự")
    private String color;

    @Size(max = 50, message = "Icon code tối đa 50 ký tự")
    private String iconCode;
}
