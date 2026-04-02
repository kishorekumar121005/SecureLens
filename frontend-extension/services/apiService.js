// ============================================================
// SecureLens Chrome Extension - API Service
// Handles all backend API calls with JWT token
// ============================================================

const ApiService = {

  /**
   * Make authenticated API request
   */
  async request(endpoint, method = "GET", body = null) {
    const token = await LocalStore.getToken();

    if (!token) {
      throw new Error("Not authenticated. Please login.");
    }

    const options = {
      method,
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${token}`
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(
      Constants.API_BASE_URL + endpoint,
      options
    );

    const data = await response.json();

    if (response.status === 401) {
      // Token expired - clear storage
      await LocalStore.clearAll();
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || "API request failed");
    }

    return data.data;
  },

  /**
   * Analyze content for threats
   */
  async analyze(url, content, threatType) {
    return this.request(
      Constants.ENDPOINTS.DETECT,
      "POST",
      { url, content, threatType }
    );
  },

  /**
   * Get detection logs
   */
  async getLogs() {
    return this.request(Constants.ENDPOINTS.LOGS);
  },

  /**
   * Get detection stats
   */
  async getStats() {
    return this.request(Constants.ENDPOINTS.STATS);
  },

  /**
   * Get user profile
   */
  async getProfile() {
    return this.request(Constants.ENDPOINTS.PROFILE);
  },

  /**
   * Get subscription status
   */
  async getSubscriptionStatus() {
    return this.request(Constants.ENDPOINTS.SUBSCRIPTION);
  }
};