import { createContext, useContext, useState, useEffect } from 'react'
import AuthService from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {

  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = AuthService.getCurrentUser()
    if (savedUser && AuthService.isLoggedIn()) {
      setUser(savedUser)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const data = await AuthService.login(email, password)
    setUser({
      email:    data.email,
      fullName: data.fullName,
      role:     data.role,
      plan:     data.plan
    })
    return data
  }

  const register = async (fullName, email, password) => {
    const data = await AuthService.register(fullName, email, password)
    setUser({
      email:    data.email,
      fullName: data.fullName,
      role:     data.role,
      plan:     data.plan
    })
    return data
  }

  const logout = () => {
    AuthService.logout()
    setUser(null)
  }

  // Refreshes user state from localStorage
  const refreshUser = () => {
    const savedUser = AuthService.getCurrentUser()
    if (savedUser) {
      setUser({ ...savedUser })
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      refreshUser,
      isLoggedIn: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}