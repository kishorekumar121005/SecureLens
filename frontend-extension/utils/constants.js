const Constants = {

  // ✅ Now points to live Railway backend
  API_BASE_URL: "https://securelens.up.railway.app/api",

  ENDPOINTS: {
    LOGIN:        "/auth/login",
    REGISTER:     "/auth/register",
    DETECT:       "/detect",
    LOGS:         "/detect/logs",
    STATS:        "/detect/stats",
    PROFILE:      "/user/profile",
    SUBSCRIPTION: "/subscription/status"
  },

  STORAGE_KEYS: {
    TOKEN:    "securelens_token",
    USER:     "securelens_user",
    SETTINGS: "securelens_settings"
  },

  THREATS: {
    PHISHING:         "PHISHING",
    PROMPT_INJECTION: "PROMPT_INJECTION",
    SENSITIVE_DATA:   "SENSITIVE_DATA"
  },

  RISK: {
    LOW:      "LOW",
    MEDIUM:   "MEDIUM",
    HIGH:     "HIGH",
    CRITICAL: "CRITICAL"
  },

  RISK_COLORS: {
    LOW:      "#28a745",
    MEDIUM:   "#ffc107",
    HIGH:     "#fd7e14",
    CRITICAL: "#dc3545"
  }
};