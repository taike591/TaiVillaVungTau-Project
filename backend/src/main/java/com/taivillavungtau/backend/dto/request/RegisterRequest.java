package com.taivillavungtau.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "{validation.user.username.notblank}")
    @Size(min = 3, max = 50, message = "{validation.user.username.size}")
    private String username;

    @NotBlank(message = "{validation.user.password.notblank}")
    @Size(min = 6, max = 100, message = "{validation.user.password.size}")
    private String password;

    @NotBlank(message = "{validation.user.email.notblank}")
    @Email(message = "{validation.user.email.pattern}")
    private String email;

    @Size(max = 100, message = "{validation.user.fullName.size}")
    private String fullName;

    @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$", message = "{validation.user.phone.pattern}")
    private String phoneNumber;
}