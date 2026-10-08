import { useState } from 'react'
import { IssueItem } from '../types'
import { DEMO_ISSUES } from '../utils/demoData'

function IssuesPage() {
  const [issues, setIssues] = useState<IssueItem[]>(DEMO_ISSUES)
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [filterSeverity, setFilterSeverity] = useState<string>('All')

  const filtered = issues.filter(issue => {
    const statusMatch = filterStatus === 'All' || issue.status === filterStatus
    const severityMatch = filterSeverity === 'All' || issue.severity === filterSeverity
    return statusMatch && severityMatch
  })

  const handleStatusChange = (id: string, newStatus: IssueItem['status']) => {
    setIssues(prev => prev.map(issue =>
      issue.id === id ? { ...issue, status: newStatus } : issue
    ))
  }

  const statusCounts = {
    Open: issues.filter(i => i.status === 'Open').length,
    'In Progress': issues.filter(i => i.status === 'In Progress').length,
    Resolved: issues.filter(i => i.status === 'Resolved').length,
  }

  const severityCounts = {
    Low: issues.filter(i => i.severity === 'Low').length,
    Medium: issues.filter(i => i.severity === 'Medium').length,
    High: issues.filter(i => i.severity === 'High').length,
    Critical: issues.filter(i => i.severity === 'Critical').length,
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Issues & Actions</h1>
        <p className="page-subtitle">Track site issues, severity, owners, and recommended actions</p>
      </div>

      <div className="alert alert-warning" style={{ marginBottom: '1rem' }}>
        <strong>Demo data note:</strong> All issues are illustrative synthetic values for PoC demonstration only.
      </div>

      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Status Breakdown</div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} style={{ flex: 1, minWidth: '100px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{status}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{count}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Severity Breakdown</div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {Object.entries(severityCounts).map(([severity, count]) => (
              <div key={severity} style={{ flex: 1, minWidth: '100px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{severity}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-danger)' }}>{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-header">
          <div className="card-title">Filters</div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="form-select">
              <option value="All">All</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Severity</label>
            <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)} className="form-select">
              <option value="All">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Issue</th>
              <th>Location</th>
              <th>Category</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Due Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(issue => (
              <tr key={issue.id}>
                <td style={{ maxWidth: '200px' }}>{issue.issue}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{issue.location}</td>
                <td><span className="tag tag-issue">{issue.category}</span></td>
                <td><span className={`severity-badge ${issue.severity.toLowerCase()}`}>{issue.severity}</span></td>
                <td>
                  <select
                    value={issue.status}
                    onChange={e => handleStatusChange(issue.id, e.target.value as IssueItem['status'])}
                    className="form-select"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
                <td>{issue.owner}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{issue.due}</td>
                <td style={{ maxWidth: '200px', fontSize: '0.85rem' }}>{issue.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <p>No issues match the selected filters</p>
        </div>
      )}
    </div>
  )
}

export default IssuesPage
