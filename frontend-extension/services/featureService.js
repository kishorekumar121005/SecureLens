// ============================================================
// SecureLens Chrome Extension - Feature Service
// Controls which features are available based on plan
// ============================================================

const FeatureService = {

  /**
   * Check if user has premium plan
   */
  async isPremium() {
    try {
      const status = await ApiService.getSubscriptionStatus();
      return status.isPremium === true;
    } catch {
      return false;
    }
  },

  /**
   * Get available features for current user
   */
  async getAvailableFeatures() {
    const premium = await this.isPremium();

    return {
      basicPhishing:       true,        // Always available
      promptInjection:     true,        // Always available
      sensitiveData:       true,        // Always available
      aiDetection:         premium,     // Premium only
      fullLogs:            premium,     // Premium only
      realTimeMonitoring:  premium      // Premium only
    };
  }
};