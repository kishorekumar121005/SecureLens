// ============================================================
// SecureLens - Navigation Bar
// ============================================================

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const styles = {
  nav: {
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    borderBottom: '1px solid #2a2a3e',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '60px',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#00d4ff',
    textDecoration: 'none',
    letterSpacing: '0.5px'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  link: {
    color: '#aaa',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.2s'
  },
  planBadge: (plan) => ({
    background: plan === 'PREMIUM' ? '#3d2b00' : '#1e3a5f',
    color: plan === 'PREMIUM' ? '#ffc107' : '#00d4ff',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 'bold'
  }),
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #dc3545',
    color: '#dc3545',
    padding: '5px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s'
  }
}

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <Link to="/" style={styles.logo}>
        🔐 SecureLens
      </Link>

      {/* Nav Links */}
      <div style={styles.navLinks}>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" style={styles.link}>
              Dashboard
            </Link>
            <Link to="/pricing" style={styles.link}>
              Pricing
            </Link>
            <span style={styles.planBadge(user?.plan)}>
              {user?.plan || 'FREE'}
            </span>
            <span style={{ color: '#aaa', fontSize: '13px' }}>
              {user?.fullName}
            </span>
            <button
              style={styles.logoutBtn}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/pricing" style={styles.link}>
              Pricing
            </Link>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/register" style={{
              ...styles.link,
              background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
              color: '#0f0f1a',
              padding: '6px 16px',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}