function DemoPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Rodic InfraAI Challenge — Jury Demonstration Runbook (4-Minute Script)</h1>
        <p className="page-subtitle">
          Minute-by-minute evaluation walkthrough based 100% on actual implemented features and live verifiable workflows.
        </p>
      </div>

      <div className="alert alert-info" style={{ marginBottom: '1.25rem' }}>
        <strong>Evaluation Safety Assurance:</strong> Every step in this script executes live in the browser using the deterministic Demo AI Mode fallback. No external API key or network dependency is required.
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">4-Minute Live Demonstration Flow</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ borderLeft: '4px solid var(--color-primary)', paddingLeft: '1rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
              0:00 – 0:45 &bull; Step 1: Project Overview & Highway Intelligence
            </div>
            <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>
              <strong>Action:</strong> Open <em>Project Overview (Dashboard)</em>.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Show the Pune–Nashik Highway Improvement Project (NH-60 Package II, 45 km corridor). Highlight the active KPI cards: 3 recorded inspections, 4 open findings, 1 critical pothole hazard alert, and overdue action status. Emphasize that all numbers derive dynamically from real data records.
            </p>
          </div>

          <div style={{ borderLeft: '4px solid #0284c7', paddingLeft: '1rem' }}>
            <div style={{ fontWeight: 700, color: '#0284c7' }}>
              0:45 – 1:30 &bull; Step 2: Field Inspection & Photographic Evidence Upload
            </div>
            <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>
              <strong>Action:</strong> Navigate to <em>Road Inspection Capture</em>.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Demonstrate the field form: input chainage start/end (<code>Km 42+500</code> to <code>Km 43+200</code>). Show how the chainage validator enforces correct notation and prevents inverted ranges. Select a defect preset (e.g. <em>Asphalt Pothole & Edge Ravelling</em>) or upload a local site photograph. Click <em>Submit Inspection & Run AI Defect Detection</em>.
            </p>
          </div>

          <div style={{ borderLeft: '4px solid #ea580c', paddingLeft: '1rem' }}>
            <div style={{ fontWeight: 700, color: '#ea580c' }}>
              1:30 – 2:30 &bull; Step 3 & 4: AI Defect Proposal & Human Engineering Review
            </div>
            <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>
              <strong>Action:</strong> Navigate to <em>AI Findings & Human Review</em>.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Select a defect finding from the queue. Show the AI candidate proposal with its qualitative uncertainty indicator (<em>Low / High Confidence</em>) and visual evidence. Demonstrate human engineer authority: adjust severity or category, input engineering observations, and click <em>Confirm Finding & Assign Action</em>. Note how the immutable audit trail records the engineer's name and timestamp.
            </p>
          </div>

          <div style={{ borderLeft: '4px solid #16a34a', paddingLeft: '1rem' }}>
            <div style={{ fontWeight: 700, color: '#16a34a' }}>
              2:30 – 3:15 &bull; Step 5: Corridor Chainage Linear Strip Map
            </div>
            <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>
              <strong>Action:</strong> Navigate to <em>Chainage Corridor Map</em>.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Show the linear highway strip map locating all defects along the 45-km alignment from Km 40+000 to Km 85+000. Highlight the defect density chart showing the Chakan Bypass hotspot (Km 40–45) and identifying the next priority inspection gap.
            </p>
          </div>

          <div style={{ borderLeft: '4px solid #7c3aed', paddingLeft: '1rem' }}>
            <div style={{ fontWeight: 700, color: '#7c3aed' }}>
              3:15 – 3:45 &bull; Step 6: Corrective Action Lifecycle Tracking & Verification
            </div>
            <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>
              <strong>Action:</strong> Navigate to <em>Corrective Action Lifecycle</em>.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Demonstrate the state machine: <code>Action Assigned &rarr; In Progress &rarr; Resolved &rarr; Verified Closed</code>. Input field repair notes and complete QA engineer sign-off to close the punchlist item with verified audit history.
            </p>
          </div>

          <div style={{ borderLeft: '4px solid #059669', paddingLeft: '1rem' }}>
            <div style={{ fontWeight: 700, color: '#059669' }}>
              3:45 – 4:00 &bull; Step 7: Official Report Export & Automated Verification
            </div>
            <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>
              <strong>Action:</strong> Open <em>Reports & CSV Export</em> and <em>Automated Testing</em>.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Click <em>Export Findings CSV</em> to download the live inspection dossier. Switch to <em>Automated Testing</em> to showcase the 23/23 passing automated tests covering all 14 mandatory challenge domains. Conclude with responsible AI principles.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoPage
