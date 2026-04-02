// ============================================================
// SecureLens - Phishing Detector
// Runs locally in browser before calling backend
// ============================================================

const PhishingDetector = {

  // Quick local check patterns
  SUSPICIOUS_KEYWORDS: [
    "verify your account",
    "confirm your identity",
    "account will be suspended",
    "click here to verify",
    "update your payment",
    "unusual activity detected",
    "account locked",
    "verify immediately"
  ],

  SUSPICIOUS_URL_PATTERNS: [
    "secure-login",
    "account-verify",
    "banking-secure",
    "paypal-confirm",
    "amazon-security",
    "apple-id-verify",
    "google-security-alert"
  ],

  /**
   * Quick local check before calling backend
   * Returns true if suspicious
   */
  quickCheck(url, content) {
    const urlLower = url.toLowerCase();
    const contentLower = content.toLowerCase();

    const suspiciousUrl = this.SUSPICIOUS_URL_PATTERNS
      .some(pattern => urlLower.includes(pattern));

    const suspiciousContent = this.SUSPICIOUS_KEYWORDS
      .some(keyword => contentLower.includes(keyword));

    return suspiciousUrl || suspiciousContent;
  },

  /**
   * Full check via backend API
   */
  async analyze(url, content) {
    return ApiService.analyze(url, content, Constants.THREATS.PHISHING);
  }
};