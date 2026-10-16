import { useState } from 'react'
import {
  RoadInspection,
  Finding,
  EvidenceAsset
} from '../types'
import { validateChainageRange, formatChainageFromMeters } from '../utils/chainage'
import {
  validateImageFile,
  DEMO_DEFECT_FIXTURES,
  analyzeInspectionEvidence,
  DemoDefectFixture
} from '../utils/defectAnalysisService'
import { DEMO_PROJECT_INFO } from '../utils/demoData'

interface RoadInspectionsPageProps {
  inspections: RoadInspection[]
  onAddInspection: (inspection: RoadInspection) => void
  onAddFinding: (finding: Finding) => void
}

const ROAD_SEGMENTS = [
  'Km 40+000 – Km 50+000 (Chakan Bypass)',
  'Km 50+000 – Km 65+000 (Rajgurunagar)',
  'Km 65+000 – Km 85+000 (Manchar-Alephata)'
]

const LANES = [
  'Right Carriageway (Outer Lane)',
  'Right Carriageway (Inner Lane)',
  'Right Carriageway (Shoulder Edge)',
  'Left Carriageway (Outer Lane)',
  'Left Carriageway (Inner Lane)',
  'Left Carriageway (Shoulder Edge)',
  'Center Median Delineation',
  'Both Carriageways'
]

const WEATHER_OPTIONS = [
  'Sunny, 32°C (Clear visibility)',
  'Cloudy, 28°C (Diffuse lighting)',
  'Light rain, 25°C (Damp surface)',
  'Heavy rain, 23°C (Active runoff)',
  'Early morning mist / fog'
]

const SURFACE_CONDITIONS = [
  'Dry asphalt wearing course',
  'Damp / wet surface with tire spray',
  'Waterlogged with ponding',
  'Dusty / unpaved diversion',
  'Milled asphalt surface'
]

export default function RoadInspections({
  inspections,
  onAddInspection,
  onAddFinding
}: RoadInspectionsPageProps) {
  const [formData, setFormData] = useState({
    roadPackage: DEMO_PROJECT_INFO.roadPackage,
    chainageStart: 'Km 42+500',
    chainageEnd: 'Km 43+200',
    roadSegment: ROAD_SEGMENTS[0],
    lane: LANES[0],
    date: new Date().toISOString().split('T')[0],
    time: '11:00',
    weather: WEATHER_OPTIONS[0],
    surfaceCondition: SURFACE_CONDITIONS[0],
    inspectorName: 'Er. Sneha Verma (Site Engineer)',
    description: 'Pavement inspection along outer lane; multiple distress locations noted near Km 42+600.',
    gpsLat: '18.7523',
    gpsLng: '73.8564'
  })

  const [selectedPresetFixture, setSelectedPresetFixture] = useState<string>('fixture-pothole')
  const [uploadedFiles, setUploadedFiles] = useState<EvidenceAsset[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [recentFindings, setRecentFindings] = useState<Finding[]>([])

  const handlePresetSelect = (fixture: DemoDefectFixture) => {
    setSelectedPresetFixture(fixture.fixtureId)
    const asset: EvidenceAsset = {
      id: `ev-preset-${Date.now()}`,
      url: fixture.svgThumbnail,
      filename: `${fixture.fixtureId}.jpg`,
      sizeBytes: 2150000,
      mimeType: 'image/jpeg',
      uploadedAt: new Date().toISOString(),
      caption: fixture.simulatedVisualDescription
    }
    setUploadedFiles([asset])
    setFormData(prev => ({
      ...prev,
      description: `Observed ${fixture.name.toLowerCase()} requiring AI defect classification.`
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      setErrors(prev => ({ ...prev, image: validation.error || 'Invalid image' }))
      return
    }

    setErrors(prev => {
      const next = { ...prev }
      delete next.image
      return next
    })

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const asset: EvidenceAsset = {
        id: `ev-${Date.now()}`,
        url: dataUrl,
        filename: file.name,
        sizeBytes: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
        caption: `Site photograph uploaded by ${formData.inspectorName}`
      }
      setUploadedFiles(prev => [...prev, asset])
    }
    reader.readAsDataURL(file)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.roadPackage.trim()) newErrors.roadPackage = 'Road package is required'
    if (!formData.inspectorName.trim()) newErrors.inspectorName = 'Inspector name is required'
    if (!formData.description.trim()) newErrors.description = 'Inspection description is required'

    // Validate chainage
    const chainageRes = validateChainageRange(formData.chainageStart, formData.chainageEnd)
    if (!chainageRes.valid) {
      newErrors.chainage = chainageRes.error || 'Invalid chainage range'
    }

    if (uploadedFiles.length === 0) {
      newErrors.image = 'At least one inspection photograph or demo evidence asset is required'
    }

    setErrors(newErrors)
    return { valid: Object.keys(newErrors).length === 0, chainageRes }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { valid, chainageRes } = validateForm()
    if (!valid || !chainageRes.startKm || !chainageRes.endKm) return

    setIsSubmitting(true)
    setStatusMessage(null)

    try {
      const inspectionId = `insp-${Date.now()}`
      const startKm = chainageRes.startKm
      const endKm = chainageRes.endKm

      // Generate AI Finding from the primary evidence asset
      const primaryAsset = uploadedFiles[0]
      const finding = await analyzeInspectionEvidence({
        inspectionId,
        chainage: formatChainageFromMeters((chainageRes.startMeters! + chainageRes.endMeters!) / 2),
        chainageKm: (startKm + endKm) / 2,
        segmentLane: formData.lane,
        description: formData.description,
        evidenceAsset: primaryAsset,
        preferredFixtureId: selectedPresetFixture
      })

      const newInspection: RoadInspection = {
        id: inspectionId,
        projectId: DEMO_PROJECT_INFO.id,
        roadPackage: formData.roadPackage,
        chainageStart: formData.chainageStart,
        chainageEnd: formData.chainageEnd,
        chainageStartKm: startKm,
        chainageEndKm: endKm,
        roadSegment: formData.roadSegment,
        lane: formData.lane,
        date: formData.date,
        time: formData.time,
        gpsCoordinates: {
          lat: parseFloat(formData.gpsLat) || 18.7523,
          lng: parseFloat(formData.gpsLng) || 73.8564
        },
        weather: formData.weather,
        surfaceCondition: formData.surfaceCondition,
        inspectorName: formData.inspectorName,
        description: formData.description,
        evidenceAssets: uploadedFiles,
        findings: [finding],
        createdAt: new Date().toISOString()
      }

      onAddInspection(newInspection)
      onAddFinding(finding)
      setRecentFindings(prev => [finding, ...prev])
      setStatusMessage(`Inspection ${inspectionId} recorded successfully with AI Defect Proposal (${finding.category}).`)

      // Reset form file list
      setUploadedFiles([])
    } catch (err: any) {
      setErrors(prev => ({ ...prev, submit: err?.message || 'Failed to submit inspection' }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Road Field Inspection & Evidence Capture</h1>
        <p className="page-subtitle">
          Capture chainage-based road site observations, upload photographic evidence, and trigger AI defect classification.
        </p>
      </div>

      <div className="alert alert-info" style={{ marginBottom: '1.25rem' }}>
        <strong>Engineering Safety Rule:</strong> AI defect suggestions are decision-support hypotheses, not approved structural conclusions. All findings require quality engineer verification.
      </div>

      {statusMessage && (
        <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
          {statusMessage}
        </div>
      )}

      <div className="grid-2">
        {/* Form Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">New Road Inspection Record</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Road Package</label>
              <input
                type="text"
                className="form-input"
                value={formData.roadPackage}
                onChange={e => setFormData({ ...formData, roadPackage: e.target.value })}
              />
              {errors.roadPackage && <div className="form-error">{errors.roadPackage}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Chainage Start (e.g. Km 42+500)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.chainageStart}
                  onChange={e => setFormData({ ...formData, chainageStart: e.target.value })}
                  placeholder="Km 42+500"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Chainage End (e.g. Km 43+200)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.chainageEnd}
                  onChange={e => setFormData({ ...formData, chainageEnd: e.target.value })}
                  placeholder="Km 43+200"
                />
              </div>
            </div>
            {errors.chainage && <div className="form-error" style={{ marginBottom: '0.75rem' }}>{errors.chainage}</div>}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Road Segment</label>
                <select
                  className="form-select"
                  value={formData.roadSegment}
                  onChange={e => setFormData({ ...formData, roadSegment: e.target.value })}
                >
                  {ROAD_SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Lane / Corridor</label>
                <select
                  className="form-select"
                  value={formData.lane}
                  onChange={e => setFormData({ ...formData, lane: e.target.value })}
                >
                  {LANES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Inspection Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Inspector / Site Engineer</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.inspectorName}
                  onChange={e => setFormData({ ...formData, inspectorName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Weather Condition</label>
                <select
                  className="form-select"
                  value={formData.weather}
                  onChange={e => setFormData({ ...formData, weather: e.target.value })}
                >
                  {WEATHER_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Pavement Surface State</label>
                <select
                  className="form-select"
                  value={formData.surfaceCondition}
                  onChange={e => setFormData({ ...formData, surfaceCondition: e.target.value })}
                >
                  {SURFACE_CONDITIONS.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Field Observation Notes</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
              {errors.description && <div className="form-error">{errors.description}</div>}
            </div>

            {/* Presets and Upload */}
            <div className="form-group">
              <label className="form-label">
                Select Road Defect Preset (Demo AI Mode Fixtures) or Upload Real Site Photo
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {DEMO_DEFECT_FIXTURES.map(fixture => (
                  <button
                    key={fixture.fixtureId}
                    type="button"
                    onClick={() => handlePresetSelect(fixture)}
                    style={{
                      padding: '0.5rem',
                      border: selectedPresetFixture === fixture.fixtureId ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      borderRadius: '4px',
                      background: selectedPresetFixture === fixture.fixtureId ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.8rem'
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{fixture.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{fixture.severity} Severity</div>
                  </button>
                ))}
              </div>

              <div style={{ border: '1px dashed var(--color-border)', padding: '1rem', borderRadius: '4px', textAlign: 'center' }}>
                <input
                  type="file"
                  id="site-photo-upload"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="site-photo-upload"
                  className="btn btn-secondary"
                  style={{ cursor: 'pointer', display: 'inline-block' }}
                >
                  📷 Browse Local Image (JPEG, PNG, WebP &le; 10MB)
                </label>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
                  Images processed locally or via server adapter without storing private credentials.
                </div>
              </div>
              {errors.image && <div className="form-error">{errors.image}</div>}
            </div>

            {/* Uploaded Evidence Preview */}
            {uploadedFiles.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Selected Photographic Evidence:</div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} style={{ border: '1px solid var(--color-border)', borderRadius: '4px', padding: '0.5rem', width: '160px' }}>
                      <img
                        src={file.url}
                        alt="Evidence preview"
                        style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '3px' }}
                      />
                      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {file.filename}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                        {(file.sizeBytes / 1024).toFixed(0)} KB
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', padding: '0.75rem' }}
            >
              {isSubmitting ? 'Analyzing Evidence...' : '⚡ Submit Inspection & Run AI Defect Detection'}
            </button>
            {errors.submit && <div className="form-error" style={{ marginTop: '0.5rem' }}>{errors.submit}</div>}
          </form>
        </div>

        {/* Existing Inspections Summary */}
        <div>
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div className="card-header">
              <div className="card-title">Recent Inspection Log ({inspections.length} total)</div>
            </div>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {inspections.map(insp => (
                <div
                  key={insp.id}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    padding: '0.75rem 0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{insp.id}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{insp.date} {insp.time}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    <strong>Chainage:</strong> {insp.chainageStart} &rarr; {insp.chainageEnd} ({insp.lane})
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    Inspector: {insp.inspectorName} | Weather: {insp.weather}
                  </div>
                  <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    Findings generated: <strong>{insp.findings.length}</strong> (
                    {insp.findings.map(f => f.category).join(', ')})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {recentFindings.length > 0 && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">Latest AI Defect Output</div>
              </div>
              {recentFindings.slice(0, 2).map(f => (
                <div key={f.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="severity-badge" style={{
                      background: f.severity === 'Critical' ? '#fee2e2' : f.severity === 'High' ? '#ffedd5' : '#f1f5f9',
                      color: f.severity === 'Critical' ? '#dc2626' : f.severity === 'High' ? '#ea580c' : '#475569'
                    }}>
                      {f.category} ({f.severity})
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{f.chainage}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', margin: '0.4rem 0' }}>{f.explanation}</p>
                  <div style={{ fontSize: '0.75rem', color: '#166534', background: '#dcfce7', padding: '0.25rem 0.5rem', borderRadius: '3px' }}>
                    <strong>Action:</strong> {f.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
