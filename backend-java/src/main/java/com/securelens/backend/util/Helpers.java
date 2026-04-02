package com.securelens.backend.util;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Helpers - Reusable utility methods
 */
public final class Helpers {

    private Helpers() {}  // Prevent instantiation

    /**
     * Extract JWT token from Authorization header
     * Returns null if header is missing or malformed
     */
    public static String extractTokenFromRequest(HttpServletRequest request) {
        String header = request.getHeader(Constants.AUTH_HEADER);
        if (header != null && header.startsWith(Constants.BEARER_PREFIX)) {
            return header.substring(Constants.BEARER_PREFIX.length());
        }
        return null;
    }

    /**
     * Mask sensitive data for safe logging
     * Example: "sk-abc123def456" → "sk-abc1****"
     */
    public static String maskSensitiveData(String data) {
        if (data == null || data.length() < 8) return "****";
        return data.substring(0, 4) + "****";
    }

    /**
     * Check if a string is null or empty
     */
    public static boolean isNullOrEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }

    /**
     * Get real client IP from request
     */
    public static String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}