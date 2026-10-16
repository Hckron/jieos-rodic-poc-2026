import { useState } from 'react'
import {
  Finding,
  RoadInspection
} from '../types'
import { DEMO_PROJECT_INFO, exportFindingsToCSV, DEMO_PROJECT } from '../utils/demoData'

interface ReportsViewProps {
  findings: Finding[]
  inspections: RoadInspection[]
}

export default function ReportsView({ findings, inspections }: ReportsViewProps) {
  const [filterSeverity, setFilterSeverity] = useState<string>('All')
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null)

  const handleDownloadCSV = () => {
    const csvContent = exportFindingsToCSV(findings, DEMO_PROJECT)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `JIEOS_Inspection_Report_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setDownloadNotice('Official CSV Inspection Report downloaded successfully.')
  }

  const handlePrint = () => {
    window.print()
  }

  const filteredFindings = findings.filter(f => {
    if (filterSeverity === 'All') return true
    return (f.humanReview?.finalSeverity || f.severity) === filterSeverity
  })

  const openCritical = findings.filter(f => {
    const sev = f.humanReview?.finalSeverity || f.severity
    const status = f.correctiveAction?.status || f.humanReviewStatus
    return (sev === 'Critical' || sev === 'High') && status !== 'Verified Closed'
  })

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">Executive Inspection Report & Evidence Dossier</h1>
          <p className="page-subtitle">
            Formal technical report of road quality surveys, AI defect classifications, engineer sign-offs, and corrective actions.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={handlePrint}>
            🖨️ Print / Save as PDF
          </button>
          <button type="button" className="btn btn-primary" onClick={handleDownloadCSV}>
            📥 Export Findings CSV
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
          {downloadNotice}
        </div>
      )}

      {/* Official Project Metadata Header Card */}
      <div className="card" style={{ marginBottom: '1.5rem', borderTop: '4px solid var(--color-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{DEMO_PROJECT_INFO.name}</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Identifier: <strong>{DEMO_PROJECT_INFO.identifier}</strong> &bull; Package: <strong>{DEMO_PROJECT_INFO.roadPackage}</strong>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            <div>Client: <strong>{DEMO_PROJECT_INFO.client}</strong></div>
            <div>Report Generated: <strong>{new Date().toLocaleDateString()}</strong></div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
          <div>
            <div style={{ color: 'var(--color-text-muted)' }}>Corridor Length:</div>
            <div style={{ fontWeight: 600 }}>{DEMO_PROJECT_INFO.lengthKm} km</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-text-muted)' }}>Total Inspections:</div>
            <div style={{ fontWeight: 600 }}>{inspections.length} recorded</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-text-muted)' }}>Total Findings:</div>
            <div style={{ fontWeight: 600 }}>{findings.length} findings</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-text-muted)' }}>High/Critical Open:</div>
            <div style={{ fontWeight: 600, color: 'var(--color-danger)' }}>{openCritical.length} pending</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-text-muted)' }}>AI Operating Mode:</div>
            <div style={{ fontWeight: 600 }}>Demo AI Mode (Deterministic)</div>
          </div>
        </div>
      </div>

      {/* Unresolved High Priority Items Notice */}
      {openCritical.length > 0 && (
        <div className="alert alert-warning" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', margin: '0 0 0.5rem 0', color: '#92400e' }}>
            ⚠️ High-Priority Unresolved Safety & Structural Findings ({openCritical.length})
          </h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem' }}>
            {openCritical.map(f => (
              <li key={f.id} style={{ marginBottom: '0.25rem' }}>
                <strong>{f.chainage} ({f.segmentLane}):</strong> {f.category} — {f.severity} severity &bull; Action: <em>{f.correctiveAction?.title || f.recommendedAction}</em> (Status: {f.correctiveAction?.status || f.humanReviewStatus})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Findings Table */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="card-title">Comprehensive Inspection Findings & Verification Register</div>
          <div>
            <select
              className="form-select"
              value={filterSeverity}
              onChange={e => setFilterSeverity(e.target.value)}
              style={{ width: '150px', fontSize: '0.8rem' }}
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical Only</option>
              <option value="High">High Only</option>
              <option value="Medium">Medium Only</option>
              <option value="Low">Low Only</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Finding ID</th>
                <th>Chainage</th>
                <th>Defect Category</th>
                <th>Evidence</th>
                <th>Severity</th>
                <th>AI Uncertainty</th>
                <th>Review Outcome</th>
                <th>Corrective Action & Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredFindings.map(f => {
                const r = f.humanReview
                const act = f.correctiveAction
                const sev = r ? r.finalSeverity : f.severity
                const cat = r ? r.finalCategory : f.category
                const status = act ? act.status : f.humanReviewStatus

                return (
                  <tr key={f.id}>
                    <td style={{ fontWeight: 600 }}>{f.id}</td>
                    <td>
                      <div><strong>{f.chainage}</strong></div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{f.segmentLane}</div>
                    </td>
                    <td>{cat}</td>
                    <td>
                      <img
                        src={f.visualEvidence.url}
                        alt="Evidence"
                        style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '3px', border: '1px solid var(--color-border)' }}
                      />
                    </td>
                    <td>
                      <span className="severity-badge" style={{
                        background: sev === 'Critical' ? '#fee2e2' : sev === 'High' ? '#ffedd5' : '#f1f5f9',
                        color: sev === 'Critical' ? '#dc2626' : sev === 'High' ? '#ea580c' : '#475569'
                      }}>
                        {sev}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {f.uncertainty}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>
                        {r?.decision || 'Pending Review'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                        {r ? r.reviewerName.split(' ')[1] : 'QA Team'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem' }}>{act?.title || f.recommendedAction}</div>
                      <div style={{ marginTop: '0.2rem' }}>
                        <span className="status-badge" style={{
                          background: status === 'Verified Closed' ? '#dcfce7' : status === 'In Progress' ? '#dbeafe' : '#fef3c7',
                          color: status === 'Verified Closed' ? '#166534' : status === 'In Progress' ? '#1e40af' : '#92400e'
                        }}>
                          {status}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Source & Responsible AI Disclosure Footer */}
      <div className="card" style={{ marginTop: '1.5rem', background: '#f8fafc', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
        <div style={{ fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
          Data Source, Ethical Safeguards & Methodology Statement:
        </div>
        <p style={{ margin: '0 0 0.35rem 0' }}>
          <strong>Demonstration Environment Notice:</strong> Inspection and finding records in this report originate from curated synthetic fixtures representing the Pune–Nashik Highway Improvement Project (Package II).
        </p>
        <p style={{ margin: 0 }}>
          <strong>Decision-Support Limitation:</strong> AI outputs are advisory hypotheses subject to human engineer review under IRC SP:19 / MoRTH quality guidelines. No automatic structural certification or lane closure authorization is generated.
        </p>
      </div>
    </div>
  )
}
