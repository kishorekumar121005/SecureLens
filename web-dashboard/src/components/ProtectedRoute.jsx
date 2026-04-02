// ============================================================
// SecureLens - Protected Route Component
// Redirects to login if not authenticated
// ============================================================

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth()

  if (loading) return null

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}