// ============================================================
// SecureLens Chrome Extension - Helper Functions
// ============================================================

const Helpers = {

  /**
   * Get current tab URL
   */
  async getCurrentTabUrl() {
    return new Promise((resolve) => {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (tabs) => resolve(tabs[0]?.url || "")
      );
    });
  },

  /**
   * Format date to readable string
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  },

  /**
   * Truncate long text
   */
  truncate(text, maxLength = 50) {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  },

  /**
   * Get risk level badge color
   */
  getRiskColor(riskLevel) {
    return Constants.RISK_COLORS[riskLevel] || "#6c757d";
  },

  /**
   * Check if URL is valid
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Debounce function to limit API calls
   */
  debounce(func, delay = 500) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }
};