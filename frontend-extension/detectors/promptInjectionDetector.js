// ============================================================
// SecureLens - Prompt Injection Detector
// ============================================================

const PromptInjectionDetector = {

  INJECTION_PATTERNS: [
    "ignore previous instructions",
    "ignore all previous",
    "disregard your instructions",
    "forget your previous",
    "you are now a",
    "act as if you are",
    "pretend you are",
    "your new instructions are",
    "override your programming",
    "bypass your restrictions",
    "jailbreak",
    "dan mode",
    "developer mode enabled"
  ],

  /**
   * Quick local check
   */
  quickCheck(content) {
    const contentLower = content.toLowerCase();
    return this.INJECTION_PATTERNS
      .some(pattern => contentLower.includes(pattern));
  },

  /**
   * Full check via backend API
   */
  async analyze(url, content) {
    return ApiService.analyze(
      url, content, Constants.THREATS.PROMPT_INJECTION
    );
  }
};