package com.securelens.backend.service;

import com.securelens.backend.dto.request.AuthRequest;
import com.securelens.backend.dto.request.RegisterRequest;
import com.securelens.backend.dto.response.AuthResponse;
import com.securelens.backend.model.User;
import com.securelens.backend.repository.UserRepository;
import com.securelens.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * AuthService - Business logic for register and login
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    // ── Register ───────────────────────────────────────────
    public AuthResponse register(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Build and save new user
        var user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .plan(User.Plan.FREE)
                .build();

        userRepository.save(user);

        // Generate JWT token
        var userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        var token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .plan(user.getPlan().name())
                .message("Registration successful")
                .build();
    }

    // ── Login ──────────────────────────────────────────────
    public AuthResponse login(AuthRequest request) {

        // Authenticate user (throws exception if wrong credentials)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Load user from DB
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate JWT token
        var userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        var token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .plan(user.getPlan().name())
                .message("Login successful")
                .build();
    }
}