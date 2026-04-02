// ============================================================
// SecureLens Chrome Extension - Constants
// ============================================================

const Constants = {

  // ── Backend API Base URL ───────────────────────────────────
  API_BASE_URL: "http://localhost:8080/api",

  // ── API Endpoints ──────────────────────────────────────────
  ENDPOINTS: {
    LOGIN:      "/auth/login",
    REGISTER:   "/auth/register",
    DETECT:     "/detect",
    LOGS:       "/detect/logs",
    STATS:      "/detect/stats",
    PROFILE:    "/user/profile",
    SUBSCRIPTION: "/subscription/status"
  },

  // ── Storage Keys ───────────────────────────────────────────
  STORAGE_KEYS: {
    TOKEN:      "securelens_token",
    USER:       "securelens_user",
    SETTINGS:   "securelens_settings"
  },

  // ── Threat Types ───────────────────────────────────────────
  THREATS: {
    PHISHING:         "PHISHING",
    PROMPT_INJECTION: "PROMPT_INJECTION",
    SENSITIVE_DATA:   "SENSITIVE_DATA"
  },

  // ── Risk Levels ────────────────────────────────────────────
  RISK: {
    LOW:      "LOW",
    MEDIUM:   "MEDIUM",
    HIGH:     "HIGH",
    CRITICAL: "CRITICAL"
  },

  // ── Risk Colors ────────────────────────────────────────────
  RISK_COLORS: {
    LOW:      "#28a745",
    MEDIUM:   "#ffc107",
    HIGH:     "#fd7e14",
    CRITICAL: "#dc3545"
  }
};