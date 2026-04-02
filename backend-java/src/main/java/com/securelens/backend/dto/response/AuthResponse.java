package com.securelens.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AuthResponse - Returned after successful login or register
 * Contains JWT token and basic user info
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;           // JWT token
    private String email;
    private String fullName;
    private String role;
    private String plan;
    private String message;
}