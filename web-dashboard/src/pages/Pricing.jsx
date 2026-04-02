import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { useState, useEffect } from 'react'

const styles = {
  container: {
    minHeight: 'calc(100vh - 60px)',
    background: '#0f0f1a',
    padding: '40px 24px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#e0e0e0',
    marginBottom: '8px'
  },
  subtitle: {
    color: '#888',
    fontSize: '15px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    maxWidth: '700px',
    margin: '0 auto'
  },
  card: (highlighted) => ({
    background: highlighted ? '#16213e' : '#1a1a2e',
    border: `2px solid ${highlighted ? '#00d4ff' : '#2a2a3e'}`,
    borderRadius: '16px',
    padding: '30px',
    position: 'relative'
  }),
  badge: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#00d4ff',
    color: '#0f0f1a',
    padding: '4px 16px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap'
  },
  planName: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#e0e0e0',
    marginBottom: '8px'
  },
  price: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: '4px'
  },
  period: {
    color: '#888',
    fontSize: '13px',
    marginBottom: '24px'
  },
  featureList: {
    listStyle: 'none',
    marginBottom: '24px'
  },
  feature: (included) => ({
    padding: '6px 0',
    fontSize: '14px',
    color: included ? '#e0e0e0' : '#555',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }),
  btn: (highlighted, disabled) => ({
    width: '100%',
    padding: '12px',
    background: disabled
      ? '#333'
      : highlighted
        ? 'linear-gradient(135deg, #00d4ff, #0099cc)'
        : 'transparent',
    border: highlighted ? 'none' : '1px solid #2a2a4e',
    borderRadius: '8px',
    color: disabled ? '#666' : highlighted ? '#0f0f1a' : '#888',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'opacity 0.2s'
  }),
  successMsg: {
    marginTop: '16px',
    padding: '12px',
    background: '#0d2e1a',
    border: '1px solid #28a745',
    borderRadius: '8px',
    color: '#28a745',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  errorMsg: {
    marginTop: '16px',
    padding: '12px',
    background: '#2e0d0d',
    border: '1px solid #dc3545',
    borderRadius: '8px',
    color: '#dc3545',
    textAlign: 'center'
  }
}

const FREE_FEATURES = [
  { text: 'Basic Phishing Detection',   included: true  },
  { text: 'Prompt Injection Detection', included: true  },
  { text: 'Basic Sensitive Data Scan',  included: true  },
  { text: 'Up to 60 API calls/min',     included: true  },
  { text: 'Advanced AI Detection',      included: false },
  { text: 'Full Detection History',     included: false },
  { text: 'Real-time Monitoring',       included: false }
]

const PREMIUM_FEATURES = [
  { text: 'Basic Phishing Detection',   included: true },
  { text: 'Prompt Injection Detection', included: true },
  { text: 'Basic Sensitive Data Scan',  included: true },
  { text: 'Up to 300 API calls/min',    included: true },
  { text: 'Advanced AI Detection',      included: true },
  { text: 'Full Detection History',     included: true },
  { text: 'Real-time Monitoring',       included: true }
]

export default function Pricing() {

  const { user, isLoggedIn, refreshUser } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading]         = useState(false)
  const [message, setMessage]         = useState('')
  const [isError, setIsError]         = useState(false)
  const [currentPlan, setCurrentPlan] = useState(null)

  // Load current plan from backend when page opens
  useEffect(() => {
    if (isLoggedIn) {
      loadCurrentPlan()
    } else {
      setCurrentPlan(null)
    }
  }, [isLoggedIn])

  const loadCurrentPlan = async () => {
    try {
      const res = await api.get('/subscription/status')
      setCurrentPlan(res.data.data.plan)
    } catch (err) {
      console.error('Failed to load plan:', err)
      setCurrentPlan(user?.plan || 'FREE')
    }
  }

  const handleUpgrade = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    // Not logged in
    if (!isLoggedIn) {
      navigate('/register')
      return
    }

    // Already premium
    if (currentPlan === 'PREMIUM') return

    setLoading(true)
    setMessage('')
    setIsError(false)

    try {
      const res = await api.post('/subscription/upgrade')
      console.log('Upgrade response:', res.data)

      if (res.data.success) {

        // Update localStorage
        const savedUser = JSON.parse(
          localStorage.getItem('securelens_user') || '{}'
        )
        savedUser.plan = 'PREMIUM'
        localStorage.setItem(
          'securelens_user',
          JSON.stringify(savedUser)
        )

        // Refresh context so navbar updates immediately
        refreshUser()

        // Update local state
        setCurrentPlan('PREMIUM')
        setIsError(false)
        setMessage('🎉 Successfully upgraded to Premium!')

        setTimeout(() => navigate('/dashboard'), 2000)
      }

    } catch (err) {
      console.error('Upgrade error:', err)
      setIsError(true)
      setMessage(
        err.response?.data?.message ||
        err.message ||
        'Upgrade failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDowngrade = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) return
    if (currentPlan === 'FREE') return

    setLoading(true)
    setMessage('')
    setIsError(false)

    try {
      const res = await api.post('/subscription/downgrade')

      if (res.data.success) {

        // Update localStorage
        const savedUser = JSON.parse(
          localStorage.getItem('securelens_user') || '{}'
        )
        savedUser.plan = 'FREE'
        localStorage.setItem(
          'securelens_user',
          JSON.stringify(savedUser)
        )

        // Refresh context
        refreshUser()

        setCurrentPlan('FREE')
        setIsError(false)
        setMessage('Downgraded to Free plan.')

        setTimeout(() => navigate('/dashboard'), 2000)
      }

    } catch (err) {
      setIsError(true)
      setMessage(
        err.response?.data?.message ||
        err.message ||
        'Downgrade failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const getPremiumBtnLabel = () => {
    if (!isLoggedIn)               return 'Get Started'
    if (loading)                   return 'Processing...'
    if (currentPlan === 'PREMIUM') return '✓ Current Plan'
    return 'Upgrade to Premium'
  }

  const getFreeBtnLabel = () => {
    if (!isLoggedIn)            return 'Get Started Free'
    if (loading)                return 'Processing...'
    if (currentPlan === 'FREE') return '✓ Current Plan'
    return 'Downgrade to Free'
  }

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>Simple, Transparent Pricing</div>
        <div style={styles.subtitle}>
          Start free. Upgrade when you need more protection.
        </div>

        {/* Success / Error Message */}
        {message && (
          <div style={isError ? styles.errorMsg : styles.successMsg}>
            {message}
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div style={styles.grid}>

        {/* Free Plan */}
        <div style={styles.card(false)}>
          <div style={styles.planName}>Free</div>
          <div style={styles.price}>$0</div>
          <div style={styles.period}>forever</div>

          <ul style={styles.featureList}>
            {FREE_FEATURES.map((f, i) => (
              <li key={i} style={styles.feature(f.included)}>
                <span>{f.included ? '✅' : '❌'}</span>
                {f.text}
              </li>
            ))}
          </ul>

          <button
            style={styles.btn(false, currentPlan === 'FREE' || loading)}
            onClick={
              currentPlan === 'PREMIUM'
                ? handleDowngrade
                : () => !isLoggedIn && navigate('/register')
            }
            disabled={currentPlan === 'FREE' || loading}
          >
            {getFreeBtnLabel()}
          </button>
        </div>

        {/* Premium Plan */}
        <div style={styles.card(true)}>
          <div style={styles.badge}>RECOMMENDED</div>
          <div style={styles.planName}>Premium</div>
          <div style={styles.price}>$9</div>
          <div style={styles.period}>per month</div>

          <ul style={styles.featureList}>
            {PREMIUM_FEATURES.map((f, i) => (
              <li key={i} style={styles.feature(f.included)}>
                <span>{f.included ? '✅' : '❌'}</span>
                {f.text}
              </li>
            ))}
          </ul>

          <button
            style={styles.btn(
              true,
              currentPlan === 'PREMIUM' || loading
            )}
            onClick={handleUpgrade}
            disabled={currentPlan === 'PREMIUM' || loading}
          >
            {getPremiumBtnLabel()}
          </button>
        </div>

      </div>
    </div>
  )
}