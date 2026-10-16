import { DEMO_DEFECT_FIXTURES } from '../utils/defectAnalysisService'

function DatasetPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dataset Provenance, Schema & Evaluation Methodology</h1>
        <p className="page-subtitle">
          Transparent documentation of inspection datasets, synthetic fixtures, and engineering standards.
        </p>
      </div>

      <div className="alert alert-info" style={{ marginBottom: '1.25rem' }}>
        <strong>Data Authenticity Guarantee:</strong> In strict compliance with Rodic InfraAI Challenge guidelines, all records in this proof-of-concept are explicitly identified as curated synthetic fixtures. No confidential proprietary data is claimed or used without authorization.
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Dataset Overview & Provenance</div>
          </div>
          <table className="data-table">
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Dataset Name</td>
                <td>JIEOS-InfraAI Road Inspection & Defect Dataset (v1.0-synthetic)</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Provenance & Source</td>
                <td>Curated synthetic field observations modeled on Indian Roads Congress (IRC) road condition survey guidelines (IRC SP:19 & IRC 35:2015).</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>License</td>
                <td>Creative Commons Attribution 4.0 International (CC-BY-4.0)</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Road Corridor</td>
                <td>Pune–Nashik Highway Improvement Project (NH-60 Package II, Km 40+000 to Km 85+000)</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Total Records</td>
                <td>3 Road Inspection events, 5+ Photographic Defect Findings, 8 Daily Site Logs, 6 Material Items, 6 Operational Issues</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Defect Categories & Reference Standards</div>
          </div>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#334155', lineHeight: 1.8 }}>
            <li><strong>Potholes:</strong> Cavities exceeding 75mm depth with sub-base exposure (IRC 82:2015 criteria for emergency intervention).</li>
            <li><strong>Cracking:</strong> Longitudinal and fatigue alligator cracking patterns along vehicle wheelpaths.</li>
            <li><strong>Rutting / Surface Deformation:</strong> Permanent wheelpath depressions exceeding 20mm depth under heavy commercial vehicle loads.</li>
            <li><strong>Waterlogging / Drainage Distress:</strong> Carriageway ponding caused by blocked transverse drainage chutes and shoulder camber failure.</li>
            <li><strong>Damaged / Faded Markings:</strong> Thermoplastic delineation below IRC 35:2015 retroreflectivity threshold (100 mcd/m²/lux).</li>
            <li><strong>Inconclusive / Ambiguous:</strong> Low-lighting or blurred captures explicitly identified as requiring re-survey.</li>
          </ul>
        </div>
      </div>

      {/* Curated Demo Defect Fixtures Table */}
      <div className="card" style={{ marginTop: '1.25rem' }}>
        <div className="card-header">
          <div className="card-title">Curated Defect Fixtures (Demo AI Mode Mappings)</div>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          When running in Demo AI Mode, uploaded images and descriptions match against deterministic fixtures to ensure reproducible jury evaluation without hidden API rate limits.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Fixture ID</th>
                <th>Defect Name</th>
                <th>Category</th>
                <th>Severity</th>
                <th>Qualitative Uncertainty</th>
                <th>Visual Sample</th>
                <th>Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_DEFECT_FIXTURES.map(fixture => (
                <tr key={fixture.fixtureId}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{fixture.fixtureId}</td>
                  <td>{fixture.name}</td>
                  <td>{fixture.category}</td>
                  <td>
                    <span className="severity-badge" style={{
                      background: fixture.severity === 'Critical' ? '#fee2e2' : fixture.severity === 'High' ? '#ffedd5' : '#f1f5f9',
                      color: fixture.severity === 'Critical' ? '#dc2626' : fixture.severity === 'High' ? '#ea580c' : '#475569'
                    }}>
                      {fixture.severity}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{fixture.uncertainty}</td>
                  <td>
                    <img
                      src={fixture.svgThumbnail}
                      alt={fixture.name}
                      style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '3px', border: '1px solid var(--color-border)' }}
                    />
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>{fixture.recommendedAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DatasetPage
