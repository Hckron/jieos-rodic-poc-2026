import { useState } from 'react'
import {
  Finding,
  RoadDefectCategory,
  SeverityLevel
} from '../types'
import { DEMO_PROJECT_INFO } from '../utils/demoData'

interface ChainageViewProps {
  findings: Finding[]
}

export default function ChainageView({ findings }: ChainageViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All')

  // Total highway bounds for Package II: Km 40 to Km 85 (45 km length)
  const minKm = 40.0
  const maxKm = 85.0
  const totalRange = maxKm - minKm

  const filtered = findings.filter(f => {
    const catMatch = selectedCategory === 'All' || f.category === selectedCategory
    const sevMatch = selectedSeverity === 'All' || (f.humanReview?.finalSeverity || f.severity) === selectedSeverity
    return catMatch && sevMatch
  })

  // Sort findings by chainageKm ascending
  const sortedFindings = [...filtered].sort((a, b) => a.chainageKm - b.chainageKm)

  // Segment density analysis (5-km bins)
  const bins = [
    { label: 'Km 40–45 (Chakan Bypass)', start: 40, end: 45, items: [] as Finding[] },
    { label: 'Km 45–50 (Bypass North)', start: 45, end: 50, items: [] as Finding[] },
    { label: 'Km 50–55 (Peth Naka)', start: 50, end: 55, items: [] as Finding[] },
    { label: 'Km 55–65 (Rajgurunagar)', start: 55, end: 65, items: [] as Finding[] },
    { label: 'Km 65–75 (Manchar)', start: 65, end: 75, items: [] as Finding[] },
    { label: 'Km 75–85 (Alephata)', start: 75, end: 85, items: [] as Finding[] },
  ]

  findings.forEach(f => {
    for (const bin of bins) {
      if (f.chainageKm >= bin.start && f.chainageKm < bin.end) {
        bin.items.push(f)
        break
      }
    }
  })

  const hotSegment = [...bins].sort((a, b) => b.items.length - a.items.length)[0]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Chainage-Oriented Spatial Findings & Corridor Timeline</h1>
        <p className="page-subtitle">
          Locate road defects, pavement distress, and corrective actions continuously along the 45-km highway package.
        </p>
      </div>

      {/* Spatial Intelligence Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.25rem' }}>
        <div className="stat-card">
          <div className="stat-card-label">Road Corridor Length</div>
          <div className="stat-card-value highlight">{DEMO_PROJECT_INFO.lengthKm} km</div>
          <div className="stat-card-change">Km 40+000 to Km 85+000</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Distress Hotspot</div>
          <div className="stat-card-value caution" style={{ fontSize: '1.2rem', color: '#ea580c' }}>
            {hotSegment.label}
          </div>
          <div className="stat-card-change">{hotSegment.items.length} defects identified</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Critical Defects Along Alignment</div>
          <div className="stat-card-value danger">
            {findings.filter(f => (f.humanReview?.finalSeverity || f.severity) === 'Critical').length}
          </div>
          <div className="stat-card-change">Potholes & severe rutting</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Next Target Inspection Area</div>
          <div className="stat-card-value" style={{ fontSize: '1.1rem', color: '#2563eb' }}>
            Km 43+500 – 44+100
          </div>
          <div className="stat-card-change">Unsurveyed gap between inspection 1 & 2</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label className="form-label" style={{ marginBottom: '0.2rem' }}>Filter by Defect Category</label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              style={{ width: '220px' }}
            >
              <option value="All">All Categories ({findings.length})</option>
              <option value="Cracking">Cracking</option>
              <option value="Potholes">Potholes</option>
              <option value="Surface deformation or rutting">Rutting / Deformation</option>
              <option value="Waterlogging">Waterlogging</option>
              <option value="Damaged or faded road markings">Road Markings</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ marginBottom: '0.2rem' }}>Filter by Severity</label>
            <select
              className="form-select"
              value={selectedSeverity}
              onChange={e => setSelectedSeverity(e.target.value)}
              style={{ width: '160px' }}
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Showing <strong>{sortedFindings.length}</strong> findings along alignment
          </div>
        </div>
      </div>

      {/* Visual Chainage Linear Strip Map */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div className="card-title">Highway Corridor Linear Strip Map (Km 40+000 to Km 85+000)</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Package II Corridor</span>
        </div>

        <div style={{ position: 'relative', margin: '2rem 1rem 3rem 1rem' }}>
          {/* Main Highway Road Strip */}
          <div style={{ height: '24px', background: '#334155', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '11px', left: 0, right: 0, height: '2px', background: '#e2e8f0', borderTop: '2px dashed #94a3b8' }}></div>
          </div>

          {/* Major Milestones */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
            <span><strong>Km 40+000</strong> (Start PKG II)</span>
            <span>Km 50+000</span>
            <span>Km 60+000</span>
            <span>Km 70+000</span>
            <span><strong>Km 85+000</strong> (End PKG II)</span>
          </div>

          {/* Finding Pin Markers positioned along the line */}
          {sortedFindings.map(f => {
            const leftPct = Math.min(100, Math.max(0, ((f.chainageKm - minKm) / totalRange) * 100))
            const sev = f.humanReview?.finalSeverity || f.severity
            const pinColor = sev === 'Critical' ? '#dc2626' : sev === 'High' ? '#ea580c' : '#0284c7'

            return (
              <div
                key={f.id}
                title={`${f.chainage}: ${f.category} (${sev})`}
                style={{
                  position: 'absolute',
                  top: '-26px',
                  left: `${leftPct}%`,
                  transform: 'translateX(-50%)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  background: pinColor,
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 5px',
                  borderRadius: '3px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {f.chainage}
                </div>
                <div style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: `6px solid ${pinColor}`, margin: '0 auto' }}></div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Segment Distribution & Findings Table */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Defect Density by 5-km Segment</div>
          </div>
          <div>
            {bins.map(bin => {
              const count = bin.items.length
              const pct = findings.length > 0 ? (count / findings.length) * 100 : 0

              return (
                <div key={bin.label} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                    <span>{bin.label}</span>
                    <span><strong>{count}</strong> defects</span>
                  </div>
                  <div className="progress-bar" style={{ height: '12px' }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${pct}%`,
                        background: count >= 2 ? 'var(--color-danger)' : count === 1 ? '#d97b2c' : '#94a3b8'
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
            <div className="card-title">Continuous Alignment Timeline</div>
          </div>
          <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {sortedFindings.map(f => {
              const sev = f.humanReview?.finalSeverity || f.severity
              const cat = f.humanReview?.finalCategory || f.category
              const status = f.correctiveAction?.status || f.humanReviewStatus

              return (
                <div
                  key={f.id}
                  style={{
                    borderLeft: `4px solid ${sev === 'Critical' ? '#dc2626' : sev === 'High' ? '#ea580c' : '#0284c7'}`,
                    paddingLeft: '0.75rem',
                    marginBottom: '0.75rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid var(--color-border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{f.chainage}</span>
                    <span className="severity-badge" style={{
                      background: sev === 'Critical' ? '#fee2e2' : sev === 'High' ? '#ffedd5' : '#f1f5f9',
                      color: sev === 'Critical' ? '#dc2626' : sev === 'High' ? '#ea580c' : '#475569'
                    }}>
                      {sev}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
                    <strong>{cat}</strong> &bull; {f.segmentLane}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    Status: <strong>{status}</strong> | Action: {f.correctiveAction?.title || f.recommendedAction}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
