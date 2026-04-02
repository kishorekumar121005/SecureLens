// ============================================================
// SecureLens Chrome Extension - Local Storage Manager
// ============================================================

const LocalStore = {

  /**
   * Save JWT token
   */
  async saveToken(token) {
    return chrome.storage.local.set({
      [Constants.STORAGE_KEYS.TOKEN]: token
    });
  },

  /**
   * Get JWT token
   */
  async getToken() {
    const result = await chrome.storage.local.get(
      Constants.STORAGE_KEYS.TOKEN
    );
    return result[Constants.STORAGE_KEYS.TOKEN] || null;
  },

  /**
   * Save user info
   */
  async saveUser(user) {
    return chrome.storage.local.set({
      [Constants.STORAGE_KEYS.USER]: user
    });
  },

  /**
   * Get user info
   */
  async getUser() {
    const result = await chrome.storage.local.get(
      Constants.STORAGE_KEYS.USER
    );
    return result[Constants.STORAGE_KEYS.USER] || null;
  },

  /**
   * Check if user is logged in
   */
  async isLoggedIn() {
    const token = await this.getToken();
    return token !== null;
  },

  /**
   * Clear all stored data (logout)
   */
  async clearAll() {
    return chrome.storage.local.clear();
  },

  /**
   * Save settings
   */
  async saveSettings(settings) {
    return chrome.storage.local.set({
      [Constants.STORAGE_KEYS.SETTINGS]: settings
    });
  },

  /**
   * Get settings with defaults
   */
  async getSettings() {
    const result = await chrome.storage.local.get(
      Constants.STORAGE_KEYS.SETTINGS
    );
    return result[Constants.STORAGE_KEYS.SETTINGS] || {
      phishingDetection:    true,
      promptInjection:      true,
      sensitiveData:        true,
      showAlerts:           true
    };
  }
};