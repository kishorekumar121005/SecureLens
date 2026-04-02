// ============================================================
// SecureLens - Register Page
// ============================================================

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const styles = {
  container: {
    minHeight: 'calc(100vh - 60px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f0f1a',
    padding: '20px'
  },
  card: {
    background: '#1a1a2e',
    border: '1px solid #2a2a3e',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: '8px'
  },
  subtitle: {
    color: '#888',
    marginBottom: '28px',
    fontSize: '14px'
  },
  label: {
    display: 'block',
    color: '#aaa',
    fontSize: '13px',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    background: '#0f0f1a',
    border: '1px solid #2a2a4e',
    borderRadius: '8px',
    color: '#e0e0e0',
    fontSize: '14px',
    outline: 'none',
    marginBottom: '16px'
  },
  btn: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
    border: 'none',
    borderRadius: '8px',
    color: '#0f0f1a',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px'
  },
  error: {
    background: '#2e0d0d',
    border: '1px solid #dc3545',
    borderRadius: '8px',
    padding: '10px',
    color: '#dc3545',
    fontSize: '13px',
    marginBottom: '16px',
    textAlign: 'center'
  },
  switchText: {
    textAlign: 'center',
    color: '#888',
    fontSize: '13px',
    marginTop: '20px'
  }
}

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const { register } = useAuth()
  const navigate     = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (!fullName || !email || !password) {
      setError('All fields are required')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await register(fullName, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Registration failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <div style={styles.title}>Create Account 🛡️</div>
        <div style={styles.subtitle}>
          Join SecureLens and stay protected
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleRegister}>
          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            style={styles.input}
            placeholder="Your full name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />

          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            style={styles.input}
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            style={styles.input}
            placeholder="Minimum 6 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button
            type="submit"
            style={styles.btn}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={styles.switchText}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{ color: '#00d4ff', textDecoration: 'none' }}
          >
            Login here
          </Link>
        </div>

      </div>
    </div>
  )
}