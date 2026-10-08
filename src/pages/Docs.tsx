function DocsPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Documentation</h1>
        <p className="page-subtitle">JIEOS — Architecture, implementation, privacy, limitations</p>
      </div>
      <div className="docs-content">
        <h2>Problem</h2>
        <p>Infrastructure project teams often have fragmented daily site information. Daily logs exist in notebooks, spreadsheets, or oral reports. Managers lack timely structured visibility into progress, material deviations, equipment downtime, or emerging risks.</p>
        <h2>Solution</h2>
        <p>JIEOS converts structured site information into management-ready operational insights and actionable recommendations through a clean web interface, deterministic analysis, and configurable AI layer.</p>
        <h2>Architecture</h2>
        <div className="architecture-diagram">User → JIEOS Web App → Site Operations Data → AI Analysis Layer → Risk/Insight Engine → Dashboard & Actions</div>
        <h2>Technical Implementation</h2>
        <ul>
          <li><strong>Frontend:</strong> React + TypeScript + Vite (fast build, modern tooling)</li>
          <li><strong>Backend/API:</strong> Client-side analysis service with server-side AI abstraction (key never exposed)</li>
          <li><strong>Data flow:</strong> Form → validation → analysis → structured output → UI rendering</li>
          <li><strong>AI Abstraction:</strong> Configurable provider (default Gemini if key present; deterministic fallback otherwise)</li>
          <li><strong>Fallback Mode:</strong> Clearly labeled Demo AI Mode with rule-based risk detection</li>
        </ul>
        <h2>Data Privacy</h2>
        <p>PoC uses synthetic/illustrative data only. No real personal information required. API secrets (GEMINI_API_KEY) stay server-side / environment-only. No credentials stored in source. Evaluator demo does not require personal data.</p>
        <h2>Limitations (Honest)</h2>
        <ul>
          <li>No production ERP integration</li>
          <li>No live project telemetry</li>
          <li>No real-world organization dataset</li>
          <li>No production authentication</li>
          <li>Synthetic dataset used solely for PoC validation</li>
          <li>AI integration configured via environment; demo uses deterministic rules when unavailable</li>
        </ul>
        <h2>Deployment Architecture</h2>
        <p>Single-page application deployable to Vercel or static host. Environment variable GEMINI_API_KEY required for live AI. No server infrastructure required for PoC.</p>
      </div>
    </div>
  )
}
export default DocsPage
