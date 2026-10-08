import { useMemo, useState } from 'react'
import { MaterialItem } from '../types'
import { DEMO_MATERIALS } from '../utils/demoData'

function MaterialTracker() {
  const [search, setSearch] = useState('')
  const [materialList] = useState<MaterialItem[]>(DEMO_MATERIALS)

  const filtered = useMemo(() => {
    if (!search) return materialList
    return materialList.filter(m =>
      m.material.toLowerCase().includes(search.toLowerCase())
    )
  }, [materialList, search])

  const criticalOver = filtered.filter(m => m.status === 'Critical')
  const overPlan = filtered.filter(m => m.status === 'Over')

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Material Tracker</h1>
        <p className="page-subtitle">Material consumption vs plan for the demo project</p>
      </div>

      <div className="alert alert-warning" style={{ marginBottom: '1rem' }}>
        <strong>Demo data note:</strong> All quantities are illustrative synthetic values for PoC demonstration only. No live ERP integration.
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Variance Summary</div>
        </div>
        <div className="grid-2">
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Critical variances (immediate action required)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-danger)' }}>{criticalOver.length}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Materials over plan</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-danger)' }}>{overPlan.length}</div>
          </div>
        </div>
      </div>

      <div className="table-container" style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search materials..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-input"
          style={{ width: '100%', padding: '0.75rem' }}
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Planned</th>
              <th>Consumed</th>
              <th>Variance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(material => (
              <tr key={material.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{material.material}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{material.unit}</div>
                </td>
                <td>{material.planned.toLocaleString()}</td>
                <td>
                  <span style={{ fontWeight: 600 }}>{material.consumed.toLocaleString()}</span>
                </td>
                <td>
                  <div style={{ color: material.variance > 0 ? 'var(--color-danger)' : material.variance < 0 ? '#d97b2c' : 'var(--color-success)' }}>
                    {material.variance > 0 ? '+' : ''}{material.variance.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {material.variance > 0 ? `+${Math.round((material.variance / material.planned) * 100)}% over plan` :
                     material.variance < 0 ? `${Math.round((material.variance / material.planned) * 100)}% under plan` : 'On plan'}
                  </div>
                </td>
                <td>
                  <span className={`severity-badge ${material.status.toLowerCase()}`}>{material.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <p>No materials match your search</p>
        </div>
      )}
    </div>
  )
}

export default MaterialTracker
