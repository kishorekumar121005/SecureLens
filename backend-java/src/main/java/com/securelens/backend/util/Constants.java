package com.securelens.backend.util;

/**
 * Constants - All magic strings and numbers in one place
 * Never hardcode these values elsewhere in the code
 */
public final class Constants {

    private Constants() {}  // Prevent instantiation

    // ── JWT ────────────────────────────────────────────────
    public static final String BEARER_PREFIX = "Bearer ";
    public static final String AUTH_HEADER = "Authorization";

    // ── Roles ──────────────────────────────────────────────
    public static final String ROLE_USER = "ROLE_USER";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";

    // ── Plans ──────────────────────────────────────────────
    public static final String PLAN_FREE = "FREE";
    public static final String PLAN_PREMIUM = "PREMIUM";

    // ── Feature Flags ──────────────────────────────────────
    public static final String FEATURE_BASIC_PHISHING = "BASIC_PHISHING";
    public static final String FEATURE_PROMPT_INJECTION = "PROMPT_INJECTION";
    public static final String FEATURE_AI_DETECTION = "AI_DETECTION";
    public static final String FEATURE_FULL_LOGS = "FULL_LOGS";
    public static final String FEATURE_REALTIME = "REAL_TIME_MONITORING";

    // ── Rate Limiting ──────────────────────────────────────
    public static final int FREE_REQUESTS_PER_MINUTE = 60;
    public static final int PREMIUM_REQUESTS_PER_MINUTE = 300;

    // ── Threat Types ───────────────────────────────────────
    public static final String THREAT_PHISHING = "PHISHING";
    public static final String THREAT_INJECTION = "PROMPT_INJECTION";
    public static final String THREAT_SENSITIVE = "SENSITIVE_DATA";
}