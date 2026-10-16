import { useState } from 'react'
import {
  Finding,
  RoadDefectCategory,
  SeverityLevel,
  ReviewStatus
} from '../types'

interface FindingsReviewProps {
  findings: Finding[]
  onUpdateFinding: (updated: Finding) => void
}

const DEFECT_CATEGORIES: RoadDefectCategory[] = [
  'Cracking',
  'Potholes',
  'Surface deformation or rutting',
  'Ravelling or surface deterioration',
  'Edge damage',
  'Waterlogging',
  'Damaged or faded road markings',
  'Debris or obstruction',
  'Inconclusive / No Defect'
]

const SEVERITIES: SeverityLevel[] = ['Low', 'Medium', 'High', 'Critical']

export default function FindingsReview({
  findings,
  onUpdateFinding
}: FindingsReviewProps) {
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(findings[0] || null)
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [filterSeverity, setFilterSeverity] = useState<string>('All')

  // Review modal / action states
  const [reviewerName, setReviewerName] = useState('Er. Rajesh Kulkarni (Quality Engineer)')
  const [adjustedCategory, setAdjustedCategory] = useState<RoadDefectCategory>(
    findings[0]?.category || 'Cracking'
  )
  const [adjustedSeverity, setAdjustedSeverity] = useState<SeverityLevel>(
    findings[0]?.severity || 'High'
  )
  const [engineeringNotes, setEngineeringNotes] = useState('')
  const [actionTitle, setActionTitle] = useState('')
  const [actionAssignee, setActionAssignee] = useState('Road Maintenance Crew Alpha')
  const [actionTargetDate, setActionTargetDate] = useState(
    new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0]
  )
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  const handleSelectFinding = (f: Finding) => {
    setSelectedFinding(f)
    setAdjustedCategory(f.humanReview ? f.humanReview.finalCategory : f.category)
    setAdjustedSeverity(f.humanReview ? f.humanReview.finalSeverity : f.severity)
    setEngineeringNotes(f.humanReview?.engineeringNotes || '')
    setActionTitle(f.correctiveAction?.title || f.recommendedAction || '')
    setActionAssignee(f.correctiveAction?.assignedTo || 'Road Maintenance Crew Alpha')
    setActionTargetDate(
      f.correctiveAction?.targetDate ||
      new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0]
    )
    setFeedbackMessage(null)
  }

  const handleExecuteReview = (
    decision:
      | 'Confirmed'
      | 'Category Corrected'
      | 'Severity Changed'
      | 'Marked False Positive'
      | 'Additional Evidence Requested'
  ) => {
    if (!selectedFinding) return

    const nowIso = new Date().toISOString()
    let newStatus: ReviewStatus = 'Confirmed'
    if (decision === 'Marked False Positive') newStatus = 'False Positive'
    else if (decision === 'Additional Evidence Requested') newStatus = 'Needs More Evidence'
    else if (decision === 'Category Corrected' || decision === 'Severity Changed') newStatus = 'Corrected'

    const auditEntry = {
      timestamp: nowIso,
      actor: reviewerName,
      action: `Human Review - ${decision}`,
      details: `Review decision: ${decision}. Category: ${adjustedCategory}, Severity: ${adjustedSeverity}. Notes: ${engineeringNotes || 'None'}`
    }

    const updatedFinding: Finding = {
      ...selectedFinding,
      humanReviewStatus: newStatus,
      humanReview: {
        reviewerName,
        reviewedAt: nowIso,
        originalCategory: selectedFinding.category,
        finalCategory: adjustedCategory,
        originalSeverity: selectedFinding.severity,
        finalSeverity: adjustedSeverity,
        engineeringNotes,
        decision
      },
      auditTrail: [...selectedFinding.auditTrail, auditEntry]
    }

    // If an action was assigned or updated
    if (actionTitle.trim() && decision !== 'Marked False Positive') {
      updatedFinding.correctiveAction = {
        id: selectedFinding.correctiveAction?.id || `act-${Date.now()}`,
        findingId: selectedFinding.id,
        title: actionTitle,
        priority: adjustedSeverity,
        assignedTo: actionAssignee,
        targetDate: actionTargetDate,
        status: selectedFinding.correctiveAction?.status === 'Verified Closed' ? 'Verified Closed' : 'Action Assigned',
        updatedAt: nowIso
      }
    }

    onUpdateFinding(updatedFinding)
    setSelectedFinding(updatedFinding)
    setFeedbackMessage(`Review recorded: ${decision} for Finding ${selectedFinding.id}.`)
  }

  const filteredFindings = findings.filter(f => {
    const statusMatch = filterStatus === 'All' || f.humanReviewStatus === filterStatus
    const severityMatch = filterSeverity === 'All' || (f.humanReview ? f.humanReview.finalSeverity : f.severity) === filterSeverity
    return statusMatch && severityMatch
  })

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">AI Findings & Human-in-the-Loop Review</h1>
        <p className="page-subtitle">
          Engineers review AI-flagged defects, validate or adjust severity, record technical observations, and assign corrective tasks.
        </p>
      </div>

      {feedbackMessage && (
        <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
          {feedbackMessage}
        </div>
      )}

      {/* Filter Row */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label className="form-label" style={{ marginBottom: '0.2rem' }}>Review Status</label>
            <select
              className="form-select"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{ width: '180px' }}
            >
              <option value="All">All Statuses ({findings.length})</option>
              <option value="Awaiting Review">Awaiting Review</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Corrected">Corrected</option>
              <option value="False Positive">False Positive</option>
              <option value="Needs More Evidence">Needs More Evidence</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ marginBottom: '0.2rem' }}>Severity</label>
            <select
              className="form-select"
              value={filterSeverity}
              onChange={e => setFilterSeverity(e.target.value)}
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
            Showing <strong>{filteredFindings.length}</strong> of <strong>{findings.length}</strong> findings
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Findings List */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Defect Candidate Queue</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '700px', overflowY: 'auto' }}>
            {filteredFindings.map(f => {
              const isSelected = selectedFinding?.id === f.id
              const displaySeverity = f.humanReview ? f.humanReview.finalSeverity : f.severity
              const displayCategory = f.humanReview ? f.humanReview.finalCategory : f.category

              return (
                <div
                  key={f.id}
                  onClick={() => handleSelectFinding(f)}
                  style={{
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    borderRadius: '6px',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    background: isSelected ? '#f8fafc' : '#ffffff',
                    transition: 'border 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600 }}>{displayCategory}</span>
                    <span
                      className="severity-badge"
                      style={{
                        background: displaySeverity === 'Critical' ? '#fee2e2' : displaySeverity === 'High' ? '#ffedd5' : '#f1f5f9',
                        color: displaySeverity === 'Critical' ? '#dc2626' : displaySeverity === 'High' ? '#ea580c' : '#475569'
                      }}
                    >
                      {displaySeverity}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                    <strong>{f.chainage}</strong> &bull; {f.segmentLane}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                    <span style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '3px',
                      background: f.humanReviewStatus === 'Confirmed' ? '#dcfce7' : f.humanReviewStatus === 'Awaiting Review' ? '#fef3c7' : '#f1f5f9',
                      color: f.humanReviewStatus === 'Confirmed' ? '#166534' : f.humanReviewStatus === 'Awaiting Review' ? '#92400e' : '#475569'
                    }}>
                      Status: {f.humanReviewStatus}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      Uncertainty: {f.uncertainty}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Selected Finding Details & Review Panel */}
        {selectedFinding ? (
          <div className="card">
            <div className="card-header">
              <div className="card-title">Inspection Finding: {selectedFinding.id}</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Chainage: {selectedFinding.chainage}
              </span>
            </div>

            {/* Visual Evidence Display */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>Visual Field Evidence:</div>
              <img
                src={selectedFinding.visualEvidence.url}
                alt={selectedFinding.visualEvidence.filename}
                style={{
                  width: '100%',
                  maxHeight: '220px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)'
                }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                Asset: {selectedFinding.visualEvidence.filename} | Uploaded: {new Date(selectedFinding.visualEvidence.uploadedAt).toLocaleString()}
              </div>
            </div>

            {/* Original AI Suggestion */}
            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '4px', borderLeft: '4px solid #3b82f6', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e40af' }}>AI Defect Detection Output:</div>
              <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Suggested Category: <strong>{selectedFinding.category}</strong> | Initial Severity: <strong>{selectedFinding.severity}</strong>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                <strong>Uncertainty:</strong> {selectedFinding.uncertainty} (non-calibrated qualitative indicator)
              </div>
              <p style={{ fontSize: '0.8rem', marginTop: '0.35rem', marginBottom: 0 }}>
                {selectedFinding.explanation}
              </p>
            </div>

            {/* Human Engineering Review Form */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>
                Engineering Verification & Decision
              </h3>

              <div className="form-group">
                <label className="form-label">Reviewing Engineer</label>
                <input
                  type="text"
                  className="form-input"
                  value={reviewerName}
                  onChange={e => setReviewerName(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Verified Defect Category</label>
                  <select
                    className="form-select"
                    value={adjustedCategory}
                    onChange={e => setAdjustedCategory(e.target.value as RoadDefectCategory)}
                  >
                    {DEFECT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Verified Severity</label>
                  <select
                    className="form-select"
                    value={adjustedSeverity}
                    onChange={e => setAdjustedSeverity(e.target.value as SeverityLevel)}
                  >
                    {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Engineering Observations & Justification</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Record structural observations, depth measurements, and reason for any change from AI recommendation..."
                  value={engineeringNotes}
                  onChange={e => setEngineeringNotes(e.target.value)}
                />
              </div>

              {/* Action Assignment */}
              <div style={{ background: '#f0fdf4', padding: '0.75rem', borderRadius: '4px', border: '1px solid #bbf7d0', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#166534', marginBottom: '0.5rem' }}>
                  Corrective Action Assignment
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Action Scope / Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={actionTitle}
                    onChange={e => setActionTitle(e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Assigned Contractor / Crew</label>
                    <input
                      type="text"
                      className="form-input"
                      value={actionAssignee}
                      onChange={e => setActionAssignee(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Target Rectification Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={actionTargetDate}
                      onChange={e => setActionTargetDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Decision Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleExecuteReview('Confirmed')}
                >
                  &check; Confirm Finding & Assign Action
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleExecuteReview('Category Corrected')}
                >
                  ✏️ Save Adjusted Category/Severity
                </button>
                <button
                  type="button"
                  style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '0.5rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => handleExecuteReview('Marked False Positive')}
                >
                  &cross; Mark False Positive
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleExecuteReview('Additional Evidence Requested')}
                >
                  📷 Request More Photos
                </button>
              </div>

              {/* Audit Trail Log */}
              <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                  Audit Trail & Lineage:
                </div>
                {selectedFinding.auditTrail.map((entry, idx) => (
                  <div key={idx} style={{ fontSize: '0.75rem', marginBottom: '0.35rem', color: '#475569' }}>
                    <strong>{new Date(entry.timestamp).toLocaleTimeString()}</strong> &bull; {entry.actor}: <em>{entry.action}</em> — {entry.details}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>Select a defect finding from the queue to conduct review.</p>
          </div>
        )}
      </div>
    </div>
  )
}
