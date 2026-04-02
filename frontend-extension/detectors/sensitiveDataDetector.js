// ============================================================
// SecureLens - Sensitive Data Detector
// ============================================================

const SensitiveDataDetector = {

  PATTERNS: [
    /api[_-]?key\s*[:=]\s*[\w-]{20,}/i,
    /secret[_-]?key\s*[:=]\s*[\w-]{20,}/i,
    /password\s*[:=]\s*\S{6,}/i,
    /bearer\s+[\w-]{20,}/i,
    /[0-9]{4}[\s-]?[0-9]{4}[\s-]?[0-9]{4}[\s-]?[0-9]{4}/,
    /aws_access_key_id\s*[:=]\s*[A-Z0-9]{20}/i,
    /private_key\s*[:=]\s*[\w/+=]{20,}/i
  ],

  /**
   * Quick local check
   */
  quickCheck(content) {
    return this.PATTERNS.some(pattern => pattern.test(content));
  },

  /**
   * Full check via backend API
   */
  async analyze(url, content) {
    return ApiService.analyze(
      url, content, Constants.THREATS.SENSITIVE_DATA
    );
  }
};