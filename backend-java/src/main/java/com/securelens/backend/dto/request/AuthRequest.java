package com.securelens.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * AuthRequest - Login request body
 * Example: { "email": "user@gmail.com", "password": "123456" }
 */
@Data
public class AuthRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}