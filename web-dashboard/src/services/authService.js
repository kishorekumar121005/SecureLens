// ============================================================
// SecureLens Dashboard - Auth Service
// ============================================================

import api from './api'

const AuthService = {

  // ── Login ──────────────────────────────────────────────
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    const data = response.data.data

    // Save to localStorage
    localStorage.setItem('securelens_token', data.token)
    localStorage.setItem('securelens_user', JSON.stringify({
      email:    data.email,
      fullName: data.fullName,
      role:     data.role,
      plan:     data.plan
    }))

    return data
  },

  // ── Register ───────────────────────────────────────────
  async register(fullName, email, password) {
    const response = await api.post('/auth/register',
      { fullName, email, password }
    )
    const data = response.data.data

    // Save to localStorage
    localStorage.setItem('securelens_token', data.token)
    localStorage.setItem('securelens_user', JSON.stringify({
      email:    data.email,
      fullName: data.fullName,
      role:     data.role,
      plan:     data.plan
    }))

    return data
  },

  // ── Logout ─────────────────────────────────────────────
  logout() {
    localStorage.removeItem('securelens_token')
    localStorage.removeItem('securelens_user')
  },

  // ── Get Current User ───────────────────────────────────
  getCurrentUser() {
    const user = localStorage.getItem('securelens_user')
    return user ? JSON.parse(user) : null
  },

  // ── Check if Logged In ─────────────────────────────────
  isLoggedIn() {
    return !!localStorage.getItem('securelens_token')
  }
}

export default AuthService