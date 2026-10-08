import { useState } from 'react'
import { DailyLog } from '../types'
import { analyzeDailyLog } from '../utils/aiService'

interface DailyLogPageProps {
  onAddLog: (log: DailyLog) => void
  existingLogs: DailyLog[]
}

interface AIAnalysis {
  summary: string
  risks: Array<{
    category: string
    severity: 'Low' | 'Medium' | 'High' | 'Critical'
    impact: string
    action: string
  }>
  managementSummary: string[]
}

const ACTIVITIES = [
  'Earthwork', 'Subgrade', 'Granular Sub-base (GSB)', 'Water Bound Macadam (WBM)',
  'Water Mix Macadam (WMM)', 'Base Course', 'Primer Coat', 'Tack Coat',
  'DBM laying', 'BC laying', 'RCC drain construction', 'RCC structure work',
  'Pier cap concreting', 'Abutment wall work', 'Girder launching', 'Bridge deck',
]

const AREAS = [
  'Earthwork', 'Subgrade', 'Granular Sub-base', 'Water Bound Macadam (WBM)',
  'WMM', 'Base Course', 'Primer Coat', 'Tack Coat', 'Asphalt/ Bituminous works',
  'RCC structures', 'Bridge works', 'Drainage', 'Slope protection',
]

const WEATHERS = [
  'Sunny, 32°C', 'Partly cloudy, 30°C', 'Cloudy, 28°C', 'Light rain, 26°C',
  'Heavy rain, 24°C', 'Windy, 29°C', 'Humid, 31°C',
]

function DailyLogPage({ onAddLog, existingLogs }: DailyLogPageProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    area: '',
    chainage: '',
    activity: '',
    plannedQty: '',
    actualQty: '',
    unit: 'm³',
    manpower: '',
    equipment: '',
    material: '',
    issue: '',
    weather: '',
    remarks: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [submittedLogs, setSubmittedLogs] = useState<DailyLog[]>([])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.date) newErrors.date = 'Date is required'
    if (!formData.area) newErrors.area = 'Area is required'
    if (!formData.chainage) newErrors.chainage = 'Chainage is required'
    if (!formData.activity) newErrors.activity = 'Activity is required'
    if (!formData.plannedQty || Number(formData.plannedQty) <= 0) newErrors.plannedQty = 'Valid planned quantity is required'
    if (!formData.actualQty || Number(formData.actualQty) < 0) newErrors.actualQty = 'Valid actual quantity is required'
    if (!formData.manpower || Number(formData.manpower) <= 0) newErrors.manpower = 'Manpower count is required'
    if (!formData.equipment) newErrors.equipment = 'Equipment is required'
    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsSubmitting(true)

    const newLog: DailyLog = {
      id: `log-${Date.now()}`,
      date: formData.date,
      area: formData.area,
      chainage: formData.chainage,
      activity: formData.activity,
      plannedQty: Number(formData.plannedQty),
      actualQty: Number(formData.actualQty),
      unit: formData.unit,
      manpower: Number(formData.manpower),
      equipment: formData.equipment,
      material: formData.material,
      issue: formData.issue,
      weather: formData.weather,
      remarks: formData.remarks,
    }

    onAddLog(newLog)
    setSubmittedLogs(prev => [newLog, ...prev])

    setFormData({
      date: new Date().toISOString().split('T')[0],
      area: '',
      chainage: '',
      activity: '',
      plannedQty: '',
      actualQty: '',
      unit: 'm³',
      manpower: '',
      equipment: '',
      material: '',
      issue: '',
      weather: '',
      remarks: '',
    })
    setIsSubmitting(false)
  }

  const handleAnalyze = async () => {
    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    const log: DailyLog = {
      id: `analyze-${Date.now()}`,
      date: formData.date,
      area: formData.area,
      chainage: formData.chainage,
      activity: formData.activity,
      plannedQty: Number(formData.plannedQty),
      actualQty: Number(formData.actualQty),
      unit: formData.unit,
      manpower: Number(formData.manpower),
      equipment: formData.equipment,
      material: formData.material,
      issue: formData.issue,
      weather: formData.weather,
      remarks: formData.remarks,
    }

    setIsAnalyzing(true)
    setAnalysis(null)

    try {
      const result = await analyzeDailyLog(log)
      setAnalysis(result)
    } catch (err) {
      console.error('Analysis failed:', err)
      setAnalysis({
        summary: 'Analysis temporarily unavailable.',
        risks: [],
        managementSummary: ['Analysis service unavailable.'],
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const completionPct = formData.plannedQty && formData.actualQty
    ? Math.round((Number(formData.actualQty) / Number(formData.plannedQty)) * 100)
    : 0

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Site Daily Log</h1>
        <p className="page-subtitle">Record daily site activities and analyze with JIEOS AI</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Daily Log Form</div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`form-input ${errors.date ? 'error' : ''}`}
                  style={errors.date ? { borderColor: 'var(--color-danger)' } : {}}
                />
                {errors.date && <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>{errors.date}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Project Area</label>
                <select name="area" value={formData.area} onChange={handleChange} className="form-select">
                  <option value="">Select area</option>
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                {errors.area && <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>{errors.area}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Chainage/Location</label>
                <input type="text" name="chainage" value={formData.chainage} onChange={handleChange} placeholder="e.g. Km 42+500 – Km 43+200" className="form-input" />
                {errors.chainage && <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>{errors.chainage}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Activity</label>
                <select name="activity" value={formData.activity} onChange={handleChange} className="form-select">
                  <option value="">Select activity</option>
                  {ACTIVITIES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                {errors.activity && <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>{errors.activity}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Planned Qty</label>
                <input type="number" name="plannedQty" value={formData.plannedQty} onChange={handleChange} placeholder="0" min="0" className="form-input" />
                {errors.plannedQty && <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>{errors.plannedQty}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Actual Qty</label>
                <input type="number" name="actualQty" value={formData.actualQty} onChange={handleChange} placeholder="0" min="0" className="form-input" />
                {errors.actualQty && <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>{errors.actualQty}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Unit</label>
                <select name="unit" value={formData.unit} onChange={handleChange} className="form-select">
                  <option value="m³">m³</option>
                  <option value="MT">MT</option>
                  <option value="m">m</option>
                  <option value="m²">m²</option>
                  <option value="bags">bags</option>
                  <option value="L">L</option>
                  <option value="nos">nos</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Manpower (no.)</label>
                <input type="number" name="manpower" value={formData.manpower} onChange={handleChange} placeholder="0" min="0" className="form-input" />
                {errors.manpower && <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>{errors.manpower}</span>}
              </div>
            </div>

            {formData.plannedQty && formData.actualQty && (
              <div className="form-group">
                <label className="form-label">Completion</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="progress-bar" style={{ flex: 1, height: '20px' }}>
                    <div className="progress-fill" style={{ width: `${Math.min(100, completionPct)}%`, background: completionPct >= 90 ? 'var(--color-success)' : completionPct >= 70 ? '#d97b2c' : 'var(--color-danger)' }}></div>
                  </div>
                  <span style={{ fontWeight: 600 }}>{completionPct}%</span>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Equipment</label>
              <input type="text" name="equipment" value={formData.equipment} onChange={handleChange} placeholder="e.g. 2 graders, 3 rollers" className="form-input" />
              {errors.equipment && <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>{errors.equipment}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Material Consumed</label>
              <input type="text" name="material" value={formData.material} onChange={handleChange} placeholder="e.g. WMM 310 m³" className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Site Issue</label>
              <textarea name="issue" value={formData.issue} onChange={handleChange} placeholder="Describe any issue or leave blank" rows={3} className="form-input" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Weather / Site Condition</label>
                <select name="weather" value={formData.weather} onChange={handleChange} className="form-select">
                  <option value="">Select weather</option>
                  {WEATHERS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Remarks</label>
                <textarea name="remarks" value={formData.remarks} onChange={handleChange} placeholder="Additional notes" rows={3} className="form-input" />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className={`btn ${isSubmitting ? 'disabled' : ''}`} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Daily Log'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? 'Analyzing...' : 'Analyze with JIEOS AI'}
              </button>
            </div>
          </form>
        </div>

        {analysis && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">AI Site Summary</div>
            </div>
            <div>
              <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
                <strong>Demo AI Mode — deterministic PoC fallback</strong>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--color-primary-light)', borderRadius: '6px' }}>
                {analysis.summary}
              </div>

              <h3 style={{ fontSize: '0.95rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>Detected Risks</h3>
              {analysis.risks.map((risk, idx) => (
                <div key={idx} className={`risk-card severity-${risk.severity.toLowerCase()}`}>
                  <div className="risk-header">
                    <div>
                      <div className="risk-category">{risk.category}</div>
                      <div className="risk-body">
                        <strong>Severity: </strong>{risk.severity}
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}><strong>Impact:</strong> {risk.impact}</p>
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

              <h3 style={{ fontSize: '0.95rem', color: 'var(--color-primary)', marginTop: '1rem', marginBottom: '0.75rem' }}>Management Summary</h3>
              <ul style={{ paddingLeft: '1.25rem' }}>
                {analysis.managementSummary.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '0.35rem', fontSize: '0.875rem' }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {!analysis && !isAnalyzing && submittedLogs.length > 0 && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">Recent Submissions</div>
            </div>
            <div>
              {submittedLogs.map(log => (
                <div key={log.id} style={{ padding: '0.6rem 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{log.activity} — {log.area}</strong>
                    <span style={{ color: 'var(--color-text-muted)' }}>{log.date}</span>
                  </div>
                  <div style={{ color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    {log.actualQty} / {log.plannedQty} {log.unit} completed
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DailyLogPage
