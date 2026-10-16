function DocsPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Technical Architecture & Engineering Safety Documentation</h1>
        <p className="page-subtitle">
          Comprehensive reference for system architecture, data models, responsible AI safeguards, and deployment.
        </p>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">1. Infrastructure Problem & Operational Context</div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
            Highway concessionaires, EPC contractors, and supervising authorities struggle with fragmented road quality monitoring across extensive corridors. Field inspections captured in paper logbooks, WhatsApp groups, or unstructured photos suffer from:
          </p>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
            <li><strong>Chainage Ambiguity:</strong> Defects lack verified kilometer/meter positioning.</li>
            <li><strong>Evidence Loss:</strong> Photographic evidence is disconnected from contractor punchlists.</li>
            <li><strong>Delayed Interventions:</strong> Critical potholes go unrepaired until vehicle accidents or pavement failure occur.</li>
            <li><strong>Audit Disconnect:</strong> Disagreements between contractor and independent engineer over defect severity.</li>
          </ul>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">2. JIEOS–InfraAI Solution Architecture</div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
            JIEOS bridges field observations and engineering decisions through an AI-assisted quality management platform:
          </p>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.75rem', lineHeight: 1.6, border: '1px solid var(--color-border)' }}>
            [Field Engineer Photo + Chainage]
                       &darr;
            [Client-Side Image & Chainage Validation]
                       &darr;
            [AI Defect Analysis Engine (Demo Mode / Gemini Vision)]
                       &darr;
            [Candidate Finding Proposal (Severity + Qualitative Uncertainty)]
                       &darr;
            [Human-in-the-Loop Review (Confirm / Correct / False Positive)]
                       &darr;
            [Corrective Action Lifecycle & Verification Sign-Off]
                       &darr;
            [Corridor Chainage Map & Audit-Proof Reports]
          </div>
        </div>
      </div>

      {/* Responsible AI & Engineering Safety Section */}
      <div className="card" style={{ marginTop: '1.25rem', borderLeft: '4px solid #ea580c' }}>
        <div className="card-header">
          <div className="card-title">3. Responsible AI & Engineering Safety Guardrails</div>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
          JIEOS is strictly designed as a <strong>decision-support system</strong>, not an autonomous structural authority. The following safety policies are embedded into the application logic:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '0.75rem' }}>
          <div style={{ background: '#fff7ed', padding: '0.75rem', borderRadius: '4px', border: '1px solid #fed7aa' }}>
            <strong style={{ color: '#9a3412', fontSize: '0.85rem' }}>Human-in-the-Loop Verification</strong>
            <p style={{ fontSize: '0.8rem', color: '#7c2d12', margin: '0.25rem 0 0 0' }}>
              No AI-flagged defect is treated as a contractual defect or closure notice without quality engineer confirmation and sign-off.
            </p>
          </div>
          <div style={{ background: '#fff7ed', padding: '0.75rem', borderRadius: '4px', border: '1px solid #fed7aa' }}>
            <strong style={{ color: '#9a3412', fontSize: '0.85rem' }}>No Automatic Structural Safety Claims</strong>
            <p style={{ fontSize: '0.8rem', color: '#7c2d12', margin: '0.25rem 0 0 0' }}>
              The system never declares a highway, bridge, or tunnel safe from photographs alone. Certified non-destructive tests (NDT) remain mandatory.
            </p>
          </div>
          <div style={{ background: '#fff7ed', padding: '0.75rem', borderRadius: '4px', border: '1px solid #fed7aa' }}>
            <strong style={{ color: '#9a3412', fontSize: '0.85rem' }}>Qualitative Uncertainty Reporting</strong>
            <p style={{ fontSize: '0.8rem', color: '#7c2d12', margin: '0.25rem 0 0 0' }}>
              Refuses to fabricate pseudo-calibrated confidence percentages (e.g. "97.4% pothole"). Uses clear qualitative indicators (Low, Moderate, High, Inconclusive).
            </p>
          </div>
          <div style={{ background: '#fff7ed', padding: '0.75rem', borderRadius: '4px', border: '1px solid #fed7aa' }}>
            <strong style={{ color: '#9a3412', fontSize: '0.85rem' }}>Immutable Audit Lineage</strong>
            <p style={{ fontSize: '0.8rem', color: '#7c2d12', margin: '0.25rem 0 0 0' }}>
              Every defect modification, category change, or status transition permanently records the actor name, timestamp, and engineering rationale.
            </p>
          </div>
        </div>
      </div>

      {/* Security & Deployment */}
      <div className="grid-2" style={{ marginTop: '1.25rem' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">4. Security & Privacy Architecture</div>
          </div>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
            <li><strong>Zero Secret Exposure:</strong> No API keys or tokens are stored in tracked frontend code.</li>
            <li><strong>Safe Fallback:</strong> Demo AI Mode is self-contained with deterministic fixtures, requiring no network connection or secrets.</li>
            <li><strong>File Boundary Checks:</strong> Uploaded images are checked for allowed MIME types (JPEG, PNG, WebP) and maximum 10MB limits.</li>
            <li><strong>Sanitized Git Remotes:</strong> Clean repository URLs without embedded credentials.</li>
          </ul>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">5. Production Deployment Guide</div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
            The proof-of-concept builds as a standalone single-page application with static asset distribution:
          </p>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.75rem' }}>
            npm run build &rarr; dist/ (HTML, CSS, JS bundles)<br />
            npm run preview &rarr; http://localhost:4173<br />
            npx vercel &rarr; Live cloud hosting
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocsPage
