package com.securelens.backend.controller;

import com.securelens.backend.dto.response.ApiResponse;
import com.securelens.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * AdminController - Admin only operations
 * All endpoints require ROLE_ADMIN
 *
 * GET    /api/admin/users           ← Get all users
 * DELETE /api/admin/users/{id}      ← Deactivate user
 * GET    /api/admin/stats           ← Platform statistics
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    // ── Get All Users ──────────────────────────────────────
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllUsers() {

        var users = userService.getAllUsers()
                .stream()
                .map(user -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", user.getId());
                    data.put("fullName", user.getFullName());
                    data.put("email", user.getEmail());
                    data.put("role", user.getRole().name());
                    data.put("plan", user.getPlan().name());
                    data.put("isActive", user.getIsActive());
                    data.put("createdAt", user.getCreatedAt());
                    return data;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(
            ApiResponse.success("Users retrieved", users)
        );
    }

    // ── Deactivate User ────────────────────────────────────
    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deactivateUser(
            @PathVariable Long id) {

        userService.deactivateUser(id);

        return ResponseEntity.ok(
            ApiResponse.success("User deactivated successfully", null)
        );
    }

    // ── Platform Stats ─────────────────────────────────────
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPlatformStats() {

        var users = userService.getAllUsers();

        long totalUsers = users.size();
        long premiumUsers = users.stream()
                .filter(u -> u.getPlan().name().equals("PREMIUM"))
                .count();
        long freeUsers = totalUsers - premiumUsers;
        long activeUsers = users.stream()
                .filter(u -> u.getIsActive())
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("premiumUsers", premiumUsers);
        stats.put("freeUsers", freeUsers);
        stats.put("activeUsers", activeUsers);

        return ResponseEntity.ok(
            ApiResponse.success("Platform stats retrieved", stats)
        );
    }
}