import { DailyLog, Finding, RoadInspection } from '../types'
import {
  DEMO_PROJECT,
  DEMO_PROJECT_INFO,
  DEMO_MATERIALS,
  DEMO_ISSUES,
  DEMO_RISKS,
  calculateOverallProgress,
  calculateTodaysProgress
} from '../utils/demoData'

interface DashboardProps {
  logs: DailyLog[]
  findings?: Finding[]
  inspections?: RoadInspection[]
  onNavigate?: (page: string) => void
}

function Dashboard({ logs, findings = [], inspections = [], onNavigate }: DashboardProps) {
  const overallProgress = calculateOverallProgress(logs)
  const todaysProgress = calculateTodaysProgress(logs)

  // Quality Findings counts derived from actual records
  const awaitingReviewCount = findings.filter(f => f.humanReviewStatus === 'Awaiting Review').length
  const confirmedUnresolved = findings.filter(f => {
    const status = f.correctiveAction?.status || f.humanReviewStatus
    return status !== 'Verified Closed' && status !== 'False Positive'
  })
  const criticalDefects = findings.filter(f => (f.humanReview?.finalSeverity || f.severity) === 'Critical')

  const todayStr = new Date().toISOString().split('T')[0]
  const overdueActions = findings.filter(f => {
    const act = f.correctiveAction
    return act && act.targetDate < todayStr && act.status !== 'Verified Closed' && act.status !== 'Resolved'
  })

  // Findings by Category
  const findingsByCategory = findings.reduce((acc, f) => {
    const cat = f.humanReview?.finalCategory || f.category
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Operational metrics
  const progressData = logs.map(log => ({
    date: log.date,
    activity: log.activity,
    planned: log.plannedQty,
    actual: log.actualQty,
    completion: log.plannedQty > 0 ? Math.round((log.actualQty / log.plannedQty) * 100) : 0
  }))

  const openIssues = DEMO_ISSUES.filter(i => i.status === 'Open' || i.status === 'In Progress')

  return (
    <div>
      {/* Infrastructure Project Header */}
      <div className="hero-banner" style={{ borderLeft: '5px solid var(--color-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', fontWeight: 700 }}>
              {DEMO_PROJECT_INFO.identifier} &bull; {DEMO_PROJECT_INFO.client}
            </div>
            <h2 style={{ margin: '0.25rem 0' }}>{DEMO_PROJECT_INFO.name}</h2>
            <p style={{ margin: 0, color: '#334155' }}>
              <strong>Package:</strong> {DEMO_PROJECT_INFO.roadPackage} | <strong>Location:</strong> {DEMO_PROJECT_INFO.location} | <strong>Length:</strong> {DEMO_PROJECT_INFO.lengthKm} km
            </p>
          </div>
          <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', background: '#e0f2fe', color: '#0369a1', padding: '0.3rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>
              Planned: {DEMO_PROJECT_INFO.plannedProgress}% | Reported: {DEMO_PROJECT_INFO.reportedProgress}%
            </span>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (Derived from actual records) */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-label">Road Inspections</div>
          <div className="stat-card-value highlight">{inspections.length}</div>
          <div className="stat-card-change">Across 45 km corridor</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Awaiting Engineer Review</div>
          <div className="stat-card-value caution" style={{ color: '#d97b2c' }}>
            {awaitingReviewCount}
          </div>
          <div className="stat-card-change">AI candidate detections</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Unresolved Confirmed Defects</div>
          <div className="stat-card-value danger">
            {confirmedUnresolved.length}
          </div>
          <div className="stat-card-change">{criticalDefects.length} critical road hazard(s)</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Overdue Corrective Actions</div>
          <div className="stat-card-value" style={{ color: overdueActions.length > 0 ? '#dc2626' : '#16a34a' }}>
            {overdueActions.length}
          </div>
          <div className="stat-card-change">{overdueActions.length > 0 ? 'Requires immediate dispatch' : 'All actions on track'}</div>
        </div>
      </div>

      {/* Immediate Attention Callout */}
      {criticalDefects.length > 0 && (
        <div className="alert alert-warning" style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <strong>⚠️ Immediate Highway Safety Attention:</strong> {criticalDefects[0].chainage} ({criticalDefects[0].category}) is flagged as Critical severity.
          </div>
          {onNavigate && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem', marginTop: '0.25rem' }}
              onClick={() => onNavigate('findings')}
            >
              Review Defect Finding &rarr;
            </button>
          )}
        </div>
      )}

      {/* Road Defect Category Distribution & Quick Navigation */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="card-title">Pavement Defect Distribution</div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{findings.length} findings logged</span>
          </div>
          <div>
            {Object.entries(findingsByCategory).map(([cat, count]) => {
              const pct = findings.length > 0 ? Math.round((count / findings.length) * 100) : 0
              return (
                <div key={cat} style={{ marginBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                    <span>{cat}</span>
                    <span><strong>{count}</strong> ({pct}%)</span>
                  </div>
                  <div className="progress-bar" style={{ height: '10px' }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${pct}%`,
                        background: cat === 'Potholes' ? 'var(--color-danger)' : cat === 'Cracking' ? '#ea580c' : 'var(--color-primary)'
                      }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Core Inspection Workflows</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ textAlign: 'left', padding: '0.65rem 1rem' }}
              onClick={() => onNavigate && onNavigate('inspections')}
            >
              📸 Record Field Inspection & Upload Photos
              <div style={{ fontSize: '0.75rem', fontWeight: 'normal', opacity: 0.9 }}>
                Input chainage, lane, weather, and trigger AI defect analysis.
              </div>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ textAlign: 'left', padding: '0.65rem 1rem' }}
              onClick={() => onNavigate && onNavigate('findings')}
            >
              🔎 Review AI Findings ({awaitingReviewCount} Awaiting Review)
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Verify AI suggestions, correct categories, record engineering notes.
              </div>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ textAlign: 'left', padding: '0.65rem 1rem' }}
              onClick={() => onNavigate && onNavigate('chainage')}
            >
              📍 Corridor Chainage Strip Map
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Visualize defects and hot segments along Km 40+000 to Km 85+000.
              </div>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ textAlign: 'left', padding: '0.65rem 1rem' }}
              onClick={() => onNavigate && onNavigate('reports')}
            >
              📋 Executive Inspection Report & CSV Export
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Official evidence dossier with verified human sign-offs.
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Operational Construction Metrics (Preserved) */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Daily Construction Progress</div>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            {progressData.slice(0, 4).map(item => (
              <div key={item.date} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                  <span>{item.activity} ({item.date})</span>
                  <span>{item.actual} / {item.planned} m³ ({item.completion}%)</span>
                </div>
                <div className="progress-bar" style={{ height: '14px' }}>
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
            <div className="card-title">Material Variance & Critical Supplies</div>
          </div>
          <div>
            {DEMO_MATERIALS.slice(0, 4).map(material => (
              <div key={material.id} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                  <span>{material.material}</span>
                  <span style={{ color: material.status === 'Critical' || material.status === 'Over' ? 'var(--color-danger)' : '#16a34a' }}>
                    {material.status}: {material.consumed} / {material.planned} {material.unit}
                  </span>
                </div>
                <div className="progress-bar" style={{ height: '12px' }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(100, (material.consumed / material.planned) * 100)}%`,
                      background: material.status === 'Over' || material.status === 'Critical' ? 'var(--color-danger)' : '#16a34a'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard