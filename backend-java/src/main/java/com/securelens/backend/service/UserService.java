package com.securelens.backend.service;

import com.securelens.backend.model.User;
import com.securelens.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * UserService - Handles user profile operations
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final LogService logService;

    // ── Get Current User Profile ───────────────────────────
    @Transactional(readOnly = true)
    public User getCurrentUserProfile() {
        return logService.getCurrentUser();
    }

    // ── Update Full Name ───────────────────────────────────
    @Transactional
    public User updateFullName(String newFullName) {
        var user = logService.getCurrentUser();
        user.setFullName(newFullName);
        return userRepository.save(user);
    }

    // ── Change Password ────────────────────────────────────
    @Transactional
    public void changePassword(String oldPassword, String newPassword) {
        var user = logService.getCurrentUser();

        // Verify old password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Validate new password
        if (newPassword.length() < 6) {
            throw new RuntimeException(
                "New password must be at least 6 characters");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // ── Get All Users (Admin only) ─────────────────────────
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ── Deactivate User (Admin only) ───────────────────────
    @Transactional
    public void deactivateUser(Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() ->
                    new RuntimeException("User not found with id: " + userId));
        user.setIsActive(false);
        userRepository.save(user);
    }
}