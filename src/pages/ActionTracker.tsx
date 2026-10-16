import { useState } from 'react'
import {
  Finding,
  ActionStatus,
  SeverityLevel
} from '../types'

interface ActionTrackerProps {
  findings: Finding[]
  onUpdateFinding: (updated: Finding) => void
}

const LIFECYCLE_STAGES: ActionStatus[] = [
  'New',
  'Awaiting Review',
  'Confirmed',
  'Action Assigned',
  'In Progress',
  'Resolved',
  'Verified Closed'
]

export default function ActionTracker({
  findings,
  onUpdateFinding
}: ActionTrackerProps) {
  // Only display findings that have an assigned corrective action or confirmed defect
  const actionableFindings = findings.filter(f => f.correctiveAction || f.humanReviewStatus === 'Confirmed')

  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(actionableFindings[0] || null)
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [afterPhotoUrl, setAfterPhotoUrl] = useState('')
  const [verifierName, setVerifierName] = useState('Er. Rajesh Kulkarni (Quality Engineer)')
  const [notification, setNotification] = useState<string | null>(null)

  const handleSelect = (f: Finding) => {
    setSelectedFinding(f)
    setResolutionNotes(f.correctiveAction?.resolutionNotes || '')
    setAfterPhotoUrl(f.correctiveAction?.afterEvidenceUrl || '')
    setNotification(null)
  }

  const handleStatusTransition = (newStatus: ActionStatus) => {
    if (!selectedFinding) return
    const nowIso = new Date().toISOString()

    const currentAction = selectedFinding.correctiveAction || {
      id: `act-${Date.now()}`,
      findingId: selectedFinding.id,
      title: selectedFinding.recommendedAction,
      priority: (selectedFinding.humanReview?.finalSeverity || selectedFinding.severity) as SeverityLevel,
      assignedTo: 'Road Maintenance Crew Alpha',
      targetDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'Action Assigned',
      updatedAt: nowIso
    }

    const updatedAction = {
      ...currentAction,
      status: newStatus,
      resolutionNotes: resolutionNotes || currentAction.resolutionNotes,
      afterEvidenceUrl: afterPhotoUrl || currentAction.afterEvidenceUrl,
      updatedAt: nowIso
    }

    if (newStatus === 'Verified Closed') {
      updatedAction.verifiedBy = verifierName
      updatedAction.verifiedAt = nowIso
    }

    const auditEntry = {
      timestamp: nowIso,
      actor: verifierName,
      action: `Corrective Action State Change: ${newStatus}`,
      details: `Action "${updatedAction.title}" moved to ${newStatus}. Notes: ${resolutionNotes || 'None'}`
    }

    const updatedFinding: Finding = {
      ...selectedFinding,
      correctiveAction: updatedAction,
      auditTrail: [...selectedFinding.auditTrail, auditEntry]
    }

    onUpdateFinding(updatedFinding)
    setSelectedFinding(updatedFinding)
    setNotification(`Finding ${selectedFinding.id} transitioned to "${newStatus}".`)
  }

  const filtered = actionableFindings.filter(f => {
    if (filterStatus === 'All') return true
    return (f.correctiveAction?.status || 'Awaiting Review') === filterStatus
  })

  // Overdue check
  const todayStr = new Date().toISOString().split('T')[0]
  const overdueCount = actionableFindings.filter(f => {
    const act = f.correctiveAction
    return act && act.targetDate < todayStr && act.status !== 'Verified Closed' && act.status !== 'Resolved'
  }).length

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Corrective Action Lifecycle & Verification</h1>
        <p className="page-subtitle">
          Track road defect rectifications from assignment to field repair and quality engineer sign-off.
        </p>
      </div>

      {notification && (
        <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
          {notification}
        </div>
      )}

      {/* Stats Summary */}
      <div className="stats-grid" style={{ marginBottom: '1.25rem' }}>
        <div className="stat-card">
          <div className="stat-card-label">Active Actions</div>
          <div className="stat-card-value highlight">{actionableFindings.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">In Progress Rectifications</div>
          <div className="stat-card-value" style={{ color: '#2563eb' }}>
            {actionableFindings.filter(f => f.correctiveAction?.status === 'In Progress').length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Resolved / Awaiting Sign-off</div>
          <div className="stat-card-value caution" style={{ color: '#d97b2c' }}>
            {actionableFindings.filter(f => f.correctiveAction?.status === 'Resolved').length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Verified Closed</div>
          <div className="stat-card-value" style={{ color: '#16a34a' }}>
            {actionableFindings.filter(f => f.correctiveAction?.status === 'Verified Closed').length}
          </div>
        </div>
      </div>

      {overdueCount > 0 && (
        <div className="alert alert-warning" style={{ marginBottom: '1.25rem' }}>
          <strong>⚠️ Overdue Corrective Actions:</strong> {overdueCount} action(s) have passed their target completion date without field resolution.
        </div>
      )}

      {/* Filter */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>Lifecycle Filter:</label>
          <select
            className="form-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ width: '220px' }}
          >
            <option value="All">All Actions ({actionableFindings.length})</option>
            {LIFECYCLE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid-2">
        {/* Actions List */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Actionable Work Items</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '600px', overflowY: 'auto' }}>
            {filtered.map(f => {
              const act = f.correctiveAction
              const status = act?.status || 'Awaiting Review'
              const isSelected = selectedFinding?.id === f.id
              const isOverdue = act && act.targetDate < todayStr && status !== 'Verified Closed' && status !== 'Resolved'

              return (
                <div
                  key={f.id}
                  onClick={() => handleSelect(f)}
                  style={{
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    borderRadius: '6px',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    background: isSelected ? '#f8fafc' : '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600 }}>{f.chainage}: {f.category}</span>
                    <span className="status-badge" style={{
                      background: status === 'Verified Closed' ? '#dcfce7' : status === 'In Progress' ? '#dbeafe' : isOverdue ? '#fee2e2' : '#fef3c7',
                      color: status === 'Verified Closed' ? '#166534' : status === 'In Progress' ? '#1e40af' : isOverdue ? '#dc2626' : '#92400e'
                    }}>
                      {status} {isOverdue && '(OVERDUE)'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', marginTop: '0.35rem', color: '#1e293b' }}>
                    {act?.title || f.recommendedAction}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    <span>Assigned: {act?.assignedTo || 'Unassigned'}</span>
                    <span>Due: <strong>{act?.targetDate || 'TBD'}</strong></span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Selected Action Lifecycle Manager */}
        {selectedFinding ? (
          <div className="card">
            <div className="card-header">
              <div className="card-title">Manage Lifecycle: {selectedFinding.id}</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {selectedFinding.chainage} ({selectedFinding.segmentLane})
              </span>
            </div>

            {/* Lifecycle Progress Bar */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                CURRENT LIFECYCLE STAGE:
              </div>
              <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                {LIFECYCLE_STAGES.map((stage, idx) => {
                  const currentIdx = LIFECYCLE_STAGES.indexOf(selectedFinding.correctiveAction?.status || 'Confirmed')
                  const isDone = idx <= currentIdx
                  const isCurrent = idx === currentIdx

                  return (
                    <div
                      key={stage}
                      style={{
                        flex: 1,
                        padding: '0.4rem 0.2rem',
                        fontSize: '0.65rem',
                        textAlign: 'center',
                        borderRadius: '3px',
                        background: isCurrent ? 'var(--color-primary)' : isDone ? '#dcfce7' : '#f1f5f9',
                        color: isCurrent ? '#ffffff' : isDone ? '#166534' : '#64748b',
                        fontWeight: isCurrent ? 700 : 500
                      }}
                    >
                      {stage}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Rectification Details */}
            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.85rem' }}>
                <strong>Scope:</strong> {selectedFinding.correctiveAction?.title || selectedFinding.recommendedAction}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                <strong>Assigned Team:</strong> {selectedFinding.correctiveAction?.assignedTo || 'Unassigned'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                <strong>Target Date:</strong> {selectedFinding.correctiveAction?.targetDate || 'TBD'}
              </div>
              {selectedFinding.correctiveAction?.verifiedBy && (
                <div style={{ fontSize: '0.8rem', color: '#166534', marginTop: '0.4rem' }}>
                  &check; <strong>Verified by:</strong> {selectedFinding.correctiveAction.verifiedBy} on {new Date(selectedFinding.correctiveAction.verifiedAt!).toLocaleString()}
                </div>
              )}
            </div>

            {/* Field Resolution Notes */}
            <div className="form-group">
              <label className="form-label">Field Rectification Notes & Test Observations</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="E.g. Cold mix applied; milling completed to 40mm depth; bitumen emulsion tack coat sprayed at 0.25 kg/m²; straightedge deviation < 4mm..."
                value={resolutionNotes}
                onChange={e => setResolutionNotes(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sign-off Quality Engineer</label>
              <input
                type="text"
                className="form-input"
                value={verifierName}
                onChange={e => setVerifierName(e.target.value)}
              />
            </div>

            {/* State Transition Controls */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                Transition Lifecycle State:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleStatusTransition('In Progress')}
                >
                  🚀 Set In Progress
                </button>
                <button
                  type="button"
                  style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '0.5rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => handleStatusTransition('Resolved')}
                >
                  🔧 Mark Field Work Resolved
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleStatusTransition('Verified Closed')}
                >
                  &check; Verify & Close Action
                </button>
              </div>
            </div>

            {/* Audit History */}
            <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
                Audit History:
              </div>
              {selectedFinding.auditTrail.slice(-3).map((a, i) => (
                <div key={i} style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
                  <strong>{new Date(a.timestamp).toLocaleTimeString()}</strong> &bull; {a.actor}: {a.details}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>Select an action to update status or record verification.</p>
          </div>
        )}
      </div>
    </div>
  )
}
