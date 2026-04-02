package com.securelens.backend.controller;

import com.securelens.backend.dto.response.ApiResponse;
import com.securelens.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * UserController - User profile management
 *
 * GET   /api/user/profile          ← Get profile
 * PUT   /api/user/profile          ← Update name
 * PUT   /api/user/change-password  ← Change password
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ── Get Profile ────────────────────────────────────────
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile() {

        var user = userService.getCurrentUserProfile();

        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getId());
        data.put("fullName", user.getFullName());
        data.put("email", user.getEmail());
        data.put("role", user.getRole().name());
        data.put("plan", user.getPlan().name());
        data.put("isActive", user.getIsActive());
        data.put("createdAt", user.getCreatedAt());

        return ResponseEntity.ok(
            ApiResponse.success("Profile retrieved", data)
        );
    }

    // ── Update Name ────────────────────────────────────────
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(
            @RequestBody Map<String, String> request) {

        String newFullName = request.get("fullName");

        if (newFullName == null || newFullName.isBlank()) {
            return ResponseEntity.badRequest().body(
                ApiResponse.error("Full name is required")
            );
        }

        var user = userService.updateFullName(newFullName);

        Map<String, Object> data = new HashMap<>();
        data.put("fullName", user.getFullName());
        data.put("email", user.getEmail());

        return ResponseEntity.ok(
            ApiResponse.success("Profile updated", data)
        );
    }

    // ── Change Password ────────────────────────────────────
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @RequestBody Map<String, String> request) {

        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        if (oldPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body(
                ApiResponse.error("Old and new password are required")
            );
        }

        userService.changePassword(oldPassword, newPassword);

        return ResponseEntity.ok(
            ApiResponse.success("Password changed successfully", null)
        );
    }
}