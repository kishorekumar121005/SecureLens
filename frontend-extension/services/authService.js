// ============================================================
// SecureLens Chrome Extension - Auth Service
// ============================================================

const AuthService = {

  /**
   * Login user and save token
   */
  async login(email, password) {
    const response = await fetch(
      Constants.API_BASE_URL + Constants.ENDPOINTS.LOGIN,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Login failed");
    }

    // Save token and user info
    await LocalStore.saveToken(data.data.token);
    await LocalStore.saveUser({
      email:    data.data.email,
      fullName: data.data.fullName,
      role:     data.data.role,
      plan:     data.data.plan
    });

    return data.data;
  },

  /**
   * Register new user
   */
  async register(fullName, email, password) {
    const response = await fetch(
      Constants.API_BASE_URL + Constants.ENDPOINTS.REGISTER,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Registration failed");
    }

    // Save token and user info
    await LocalStore.saveToken(data.data.token);
    await LocalStore.saveUser({
      email:    data.data.email,
      fullName: data.data.fullName,
      role:     data.data.role,
      plan:     data.data.plan
    });

    return data.data;
  },

  /**
   * Logout user
   */
  async logout() {
    await LocalStore.clearAll();
  },

  /**
   * Check if logged in
   */
  async isLoggedIn() {
    return LocalStore.isLoggedIn();
  }
};