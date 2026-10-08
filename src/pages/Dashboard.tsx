import { DailyLog, MaterialItem, IssueItem, RiskItem } from '../types'
import { DEMO_PROJECT, DEMO_MATERIALS, DEMO_ISSUES, DEMO_RISKS, calculateOverallProgress, calculateTodaysProgress } from '../utils/demoData'

interface DashboardProps {
  logs: DailyLog[]
}

function Dashboard({ logs }: DashboardProps) {
  const overallProgress = calculateOverallProgress(logs)
  const todaysProgress = calculateTodaysProgress(logs)

  // Calculate progress data for charts
  const progressData = logs.map(log => ({
    date: log.date,
    activity: log.activity,
    planned: log.plannedQty,
    actual: log.actualQty,
    completion: log.plannedQty > 0 ? Math.round((log.actualQty / log.plannedQty) * 100) : 0
  }))

  // Material consumption
  const totalMaterialVariance = DEMO_MATERIALS.reduce((sum, m) => sum + Math.abs(m.variance), 0)
  const overMaterials = DEMO_MATERIALS.filter(m => m.variance > 0)
  const underMaterials = DEMO_MATERIALS.filter(m => m.variance < 0)

  // Issues by severity
  const issuesBySeverity = DEMO_ISSUES.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Open issues
  const openIssues = DEMO_ISSUES.filter(i => i.status === 'Open' || i.status === 'In Progress')
  const highSeverityIssues = openIssues.filter(i => i.severity === 'High' || i.severity === 'Critical')

  // Equipment utilization (simulated from logs)
  const equipmentEntries = logs.flatMap(log => {
    return log.equipment.split(', ').map(e => e.trim())
  })
  const uniqueEquipment = [...new Set(equipmentEntries)]

  // Latest activity trends
  const recentLogs = logs.slice(0, 5)

  return (
    <div>
      <div className="hero-banner">
        <h2>{DEMO_PROJECT.name}</h2>
        <p>Project Type: {DEMO_PROJECT.type} | Location: {DEMO_PROJECT.location} | Length: {DEMO_PROJECT.length}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-label">Overall Progress</div>
          <div className="stat-card-value highlight">{overallProgress}%</div>
          <div className="progress-bar" style={{ height: '6px', marginTop: '0.5rem' }}>
            <div className="progress-fill" style={{ width: `${overallProgress}%` }}></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Today's Progress</div>
          <div className="stat-card-value highlight">{todaysProgress}%</div>
          <div className="stat-card-change">
            <span>vs {logs[0]?.plannedQty ?? 0} m³ planned today</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Open Issues</div>
          <div className="stat-card-value danger">{openIssues.length}</div>
          <div className="stat-card-change">{highSeverityIssues.length} high/critical</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Critical Risks</div>
          <div className="stat-card-value caution" style={{ color: '#d97b2c' }}>{DEMO_RISKS.filter(r => r.severity === 'Critical' || r.severity === 'High').length}</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Planned vs Actual Progress</div>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            {progressData.map((item, idx) => (
              <div key={item.date} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                  <span>{item.activity} ({item.date})</span>
                  <span>{item.actual} / {item.planned} {logs.find(l => l.date === item.date)?.unit || 'm³'} ({item.completion}%)</span>
                </div>
                <div className="progress-bar" style={{ height: '16px' }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${item.completion}%`,
                      background: item.completion >= 90 ? 'var(--color-success)' : item.completion >= 70 ? '#d97b2c' : 'var(--color-danger)'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Material Consumption</div>
          </div>
          <div>
            {DEMO_MATERIALS.map(material => (
              <div key={material.id} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                  <span>{material.material}</span>
                  <span style={{ color: material.status === 'Critical' ? 'var(--color-danger)' : material.status === 'Over' ? 'var(--color-danger)' : material.status === 'Under' ? '#d97b2c' : 'var(--color-success)' }}>
                    {material.status}: {material.consumed} / {material.planned} {material.unit}
                  </span>
                </div>
                <div className="progress-bar" style={{ height: '14px' }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(100, (material.consumed / material.planned) * 100)}%`,
                      background: material.status === 'Over' ? 'var(--color-danger)' : material.status === 'Under' ? '#d97b2c' : 'var(--color-success)'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Open Issues by Severity</div>
          </div>
          <div>
            {Object.entries(issuesBySeverity).map(([severity, count]) => {
              const sevClass = `severity-${severity.toLowerCase()}`
              return (
                <div key={severity} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span className={`severity-badge ${sevClass}`}>{severity}</span>
                  <span style={{ fontWeight: 600 }}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Equipment Utilization</div>
          </div>
          <div>
            <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              {uniqueEquipment.length} unique equipment types detected in logs
            </div>
            {uniqueEquipment.slice(0, 8).map((eq, idx) => (
              <div key={idx} style={{ padding: '0.35rem 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
                {eq}
              </div>
            ))}
            {uniqueEquipment.length > 8 && (
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                +{uniqueEquipment.length - 8} more
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">High-Risk Items Detection</div>
        </div>
        <div>
          {DEMO_RISKS.filter(r => r.severity === 'Critical' || r.severity === 'High').map(risk => (
            <div key={risk.id} className={`risk-card severity-${risk.severity.toLowerCase()}`}>
              <div className="risk-header">
                <div>
                  <div className="risk-category">{risk.category}</div>
                  <div className="risk-body">
                    <h3 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>{risk.description}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      <strong>Impact:</strong> {risk.impact}
                    </p>
                  </div>
                </div>
                <span className={`severity-badge ${risk.severity.toLowerCase()}`}>{risk.severity}</span>
              </div>
              <div className="risk-actions">
                <strong>Recommended Action</strong>
                <p style={{ marginTop: '0.25rem', fontSize: '0.85rem' }}>{risk.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Issues Requiring Attention</div>
          </div>
          <div>
            {openIssues.slice(0, 5).map(issue => (
              <div key={issue.id} style={{ padding: '0.6rem 0', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{issue.issue.slice(0, 60)}...</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{issue.location}</div>
                </div>
                <span className={`severity-badge ${issue.severity.toLowerCase()}`}>{issue.severity}</span>
              </div>
            ))}
            {openIssues.length === 0 && (
              <div className="empty-state" style={{ padding: '1.5rem 1rem' }}>
                <p>No open issues</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Material Variance Summary</div>
          </div>
          <div>
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Materials over plan</span>
                <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>{overMaterials.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                <span>Materials under plan</span>
                <span style={{ color: '#d97b2c', fontWeight: 600 }}>{underMaterials.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                <span>Total variance</span>
                <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>±{totalMaterialVariance} units</span>
              </div>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              <div>Status legend: Critical = immediate action, Over = consumption exceeds plan, Under = potential shortfall</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard