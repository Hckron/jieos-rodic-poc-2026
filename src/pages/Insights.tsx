import { useMemo, useState } from 'react'
import { DailyLog } from '../types'
import { calculateOverallProgress, calculateTodaysProgress } from '../utils/demoData'
import { DEMO_PROJECT, DEMO_DAILY_LOGS } from '../utils/demoData'
import { DEMO_RISKS, DEMO_MATERIALS, DEMO_ISSUES } from '../utils/demoData'

function InsightsPage() {
  const [overallProgress] = useState(calculateOverallProgress(DEMO_DAILY_LOGS))
  const [todaysProgress] = useState(calculateTodaysProgress(DEMO_DAILY_LOGS))

  // Productivity trend
  const productivities = useMemo(() => {
    return DEMO_DAILY_LOGS.map(log => ({
      date: log.date,
      activity: log.activity,
      completion: log.plannedQty > 0 ? Math.round((log.actualQty / log.plannedQty) * 100) : 0,
      variance: log.actualQty - log.plannedQty,
    }))
  }, [])

  // Material variance
  const materialVariance = useMemo(() => {
    const over = DEMO_MATERIALS.filter(m => m.variance > 0)
    const under = DEMO_MATERIALS.filter(m => m.variance < 0)
    const critical = DEMO_MATERIALS.filter(m => m.status === 'Critical')
    return { over, under, critical }
  }, [])

  // Open high severity issues
  const openHighIssues = useMemo(() => {
    return DEMO_ISSUES.filter(i => 
      (i.status === 'Open' || i.status === 'In Progress') &&
      (i.severity === 'High' || i.severity === 'Critical')
    )
  }, [])

  // Schedule risk assessment
  const scheduleRisk = useMemo(() => {
    const criticalRisks = DEMO_RISKS.filter(r => r.severity === 'Critical').length
    const highRisks = DEMO_RISKS.filter(r => r.severity === 'High').length
    const riskFactors = []
    if (criticalRisks > 0) riskFactors.push(`⚠️ ${criticalRisks} critical risk(s) identified`)
    if (highRisks > 0) riskFactors.push(`⚠️ ${highRisks} high risk(s) identified`)
    
    let riskLevel = 'Low'
    if (criticalRisks >= 2) riskLevel = 'Critical'
    else if (criticalRisks >= 1 || highRisks >= 3) riskLevel = 'High'
    else if (criticalRisks >= 1 || highRisks >= 1) riskLevel = 'Medium'
    
    return { riskLevel, riskFactors }
  }, [])

  // Recommended actions summary
  const recommendedActions = useMemo(() => {
    return DEMO_RISKS.slice(0, 5).map(risk => ({
      category: risk.category,
      severity: risk.severity,
      action: risk.action,
    }))
  }, [])

  // Productivity stats
  const completedCount = productivities.filter(p => p.completion >= 80).length
  const onTrackCount = productivities.filter(p => p.completion >= 60 && p.completion < 80).length
  const behindCount = productivities.filter(p => p.completion < 60).length
  const avgCompletion = productivities.length > 0
    ? Math.round(productivities.reduce((sum, p) => sum + p.completion, 0) / productivities.length)
    : 0

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Project Insights</h1>
        <p className="page-subtitle">AI-generated or deterministic analysis of project data</p>
      </div>

      <div className="alert alert-warning" style={{ marginBottom: '1rem' }}>
        <strong>Demo data note:</strong> All insights are generated from synthetic PoC data. Real insights would be AI-assisted.
      </div>

      <div className="grid-3">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Schedule Risk</div>
          </div>
          <div style={{ fontSize: '0.95rem', color: 'var(--color-text)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: scheduleRisk.riskLevel === 'Critical' ? 'var(--color-danger)' : scheduleRisk.riskLevel === 'High' ? '#d97b2c' : 'var(--color-warning)' }}>
              {scheduleRisk.riskLevel}
            </div>
            {scheduleRisk.riskFactors.map((factor, idx) => (
              <div key={idx} style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{factor}</div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Productivity Trend</div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            <div>Completed 80%+: {completedCount}</div>
            <div>On Track 60-79%: {onTrackCount}</div>
            <div style={{ color: 'var(--color-danger)' }}>Behind &lt;60%: {behindCount}</div>
            <div style={{ marginTop: '0.5rem', color: 'var(--color-primary)' }}>{avgCompletion}% average completion</div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <div className="progress-bar" style={{ height: '10px', marginTop: '0.5rem' }}>
              <div className="progress-fill" style={{ width: `${avgCompletion}%`, background: avgCompletion >= 80 ? 'var(--color-success)' : avgCompletion >= 60 ? '#d97b2c' : 'var(--color-danger)' }}></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Material Variance</div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            <div>Over plan: {materialVariance.over.length}</div>
            <div>Under plan: {materialVariance.under.length}</div>
            <div style={{ color: 'var(--color-danger)' }}>{materialVariance.critical.length} Critical</div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            {materialVariance.over.slice(0, 3).map(m => (
              <div key={m.id} style={{ padding: '0.3rem 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.8rem' }}>
                {m.material}: +{m.variance.toLocaleString()} {m.unit}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Unresolved High-Severity Issues</div>
        </div>
        <div>
          {openHighIssues.slice(0, 5).map(issue => (
            <div key={issue.id} style={{ padding: '0.6rem 0', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{issue.issue}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{issue.location}</div>
              </div>
              <span className={`severity-badge ${issue.severity.toLowerCase()}`}>{issue.severity}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Recommended Management Actions</div>
        </div>
        <div>
          {recommendedActions.map((action, idx) => (
            <div key={idx} className={`risk-card severity-${action.severity.toLowerCase()}`}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                <strong>{action.category}</strong>: {action.action}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InsightsPage
