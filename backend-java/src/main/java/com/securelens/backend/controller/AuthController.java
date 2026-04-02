package com.securelens.backend.controller;

import com.securelens.backend.dto.request.AuthRequest;
import com.securelens.backend.dto.request.RegisterRequest;
import com.securelens.backend.dto.response.ApiResponse;
import com.securelens.backend.dto.response.AuthResponse;
import com.securelens.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController - Handles register and login API endpoints
 *
 * POST /api/auth/register  ← Create new account
 * POST /api/auth/login     ← Login and get JWT token
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ── Register ───────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        var response = authService.register(request);
        return ResponseEntity.ok(
            ApiResponse.success("User registered successfully", response)
        );
    }

    // ── Login ──────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody AuthRequest request) {

        var response = authService.login(request);
        return ResponseEntity.ok(
            ApiResponse.success("Login successful", response)
        );
    }
}