// ============================================================
// SecureLens - Dashboard Page
// ============================================================

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const styles = {
  container: {
    minHeight: 'calc(100vh - 60px)',
    background: '#0f0f1a',
    padding: '24px'
  },
  header: {
    marginBottom: '24px'
  },
  title: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#e0e0e0'
  },
  subtitle: {
    color: '#888',
    fontSize: '14px',
    marginTop: '4px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  statCard: {
    background: '#1a1a2e',
    border: '1px solid #2a2a3e',
    borderRadius: '12px',
    padding: '20px'
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#00d4ff'
  },
  statLabel: {
    color: '#888',
    fontSize: '13px',
    marginTop: '4px'
  },
  section: {
    background: '#1a1a2e',
    border: '1px solid #2a2a3e',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#e0e0e0',
    marginBottom: '16px',
    paddingBottom: '10px',
    borderBottom: '1px solid #2a2a3e'
  },
  logItem: (riskLevel) => ({
    background: '#0f0f1a',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '10px',
    borderLeft: `4px solid ${
      riskLevel === 'CRITICAL' ? '#dc3545' :
      riskLevel === 'HIGH'     ? '#fd7e14' :
      riskLevel === 'MEDIUM'   ? '#ffc107' : '#28a745'
    }`
  }),
  logType: {
    fontWeight: 'bold',
    color: '#e0e0e0',
    fontSize: '13px'
  },
  logUrl: {
    color: '#888',
    fontSize: '12px',
    marginTop: '3px',
    wordBreak: 'break-all'
  },
  logTime: {
    color: '#555',
    fontSize: '11px',
    marginTop: '3px'
  },
  riskBadge: (riskLevel) => ({
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '10px',
    fontWeight: 'bold',
    marginLeft: '8px',
    background:
      riskLevel === 'CRITICAL' ? '#2e0d0d' :
      riskLevel === 'HIGH'     ? '#2e1a0d' :
      riskLevel === 'MEDIUM'   ? '#2e280d' : '#0d2e1a',
    color:
      riskLevel === 'CRITICAL' ? '#dc3545' :
      riskLevel === 'HIGH'     ? '#fd7e14' :
      riskLevel === 'MEDIUM'   ? '#ffc107' : '#28a745'
  }),
  emptyState: {
    textAlign: 'center',
    color: '#555',
    padding: '30px',
    fontSize: '14px'
  },
  loading: {
    textAlign: 'center',
    color: '#888',
    padding: '20px'
  }
}

export default function Dashboard() {
  const { user }          = useAuth()
  const [stats, setStats] = useState(null)
  const [logs, setLogs]   = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingLogs, setLoadingLogs]   = useState(true)

  useEffect(() => {
    fetchStats()
    fetchLogs()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await api.get('/detect/stats')
      setStats(res.data.data)
    } catch (err) {
      console.error('Failed to load stats:', err)
    } finally {
      setLoadingStats(false)
    }
  }

  const fetchLogs = async () => {
    try {
      const res = await api.get('/detect/logs')
      setLogs(res.data.data || [])
    } catch (err) {
      console.error('Failed to load logs:', err)
    } finally {
      setLoadingLogs(false)
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  const truncate = (str, n = 60) =>
    str?.length > n ? str.substring(0, n) + '...' : str

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          👋 Welcome, {user?.fullName}
        </div>
        <div style={styles.subtitle}>
          Here's your SecureLens security overview
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.grid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {loadingStats ? '...' : stats?.totalThreatsDetected ?? 0}
          </div>
          <div style={styles.statLabel}>Total Threats Detected</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {loadingLogs ? '...' : logs.length}
          </div>
          <div style={styles.statLabel}>Detection Logs</div>
        </div>

        <div style={styles.statCard}>
          <div style={{
            ...styles.statNumber,
            color: user?.plan === 'PREMIUM' ? '#ffc107' : '#00d4ff',
            fontSize: '22px'
          }}>
            {user?.plan || 'FREE'}
          </div>
          <div style={styles.statLabel}>Current Plan</div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, fontSize: '22px' }}>
            {loadingLogs ? '...' : (
              logs.filter(l => l.riskLevel === 'CRITICAL').length
            )}
          </div>
          <div style={styles.statLabel}>Critical Threats</div>
        </div>
      </div>

      {/* Detection Logs */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          🛡️ Recent Detection Logs
        </div>

        {loadingLogs ? (
          <div style={styles.loading}>Loading logs...</div>
        ) : logs.length === 0 ? (
          <div style={styles.emptyState}>
            No threats detected yet. Stay safe! ✅
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={styles.logItem(log.riskLevel)}>
              <div style={styles.logType}>
                {log.threatType.replace('_', ' ')}
                <span style={styles.riskBadge(log.riskLevel)}>
                  {log.riskLevel}
                </span>
              </div>
              <div style={styles.logUrl}>
                🌐 {truncate(log.url)}
              </div>
              <div style={styles.logUrl}>
                📝 {truncate(log.details)}
              </div>
              <div style={styles.logTime}>
                🕐 {formatDate(log.detectedAt)}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}