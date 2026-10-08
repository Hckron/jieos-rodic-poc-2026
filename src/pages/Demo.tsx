function DemoPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Demo Script — 4-Minute Flow</h1>
        <p className="page-subtitle">Competition team guided demonstration</p>
      </div>
      <div className="docs-content">
        <ol style={{ paddingLeft: '1.5rem', fontSize: '0.95rem', lineHeight: 1.8 }}>
          <li><strong>Dashboard (0:00-0:30)</strong> — Show project name, progress %, open issues, critical risks. Highlight progress bars.</li>
          <li><strong>Open Site Daily Log (0:30-0:50)</strong> — Show form with date, area, chainage, activity, planned/actual quantities.</li>
          <li><strong>Show site activity (0:50-1:10)</strong> — Example entry: WMM laying at Km 42+500, planned 420 m³, actual 310 m³.</li>
          <li><strong>Click Analyze with JIEOS AI (1:10-1:30)</strong> — Show analysis loading, then results panel with summary, risks, actions.</li>
          <li><strong>Show detected risk (1:30-1:50)</strong> — Highlight material supply interruption (High), productivity decline (High), equipment reliability.</li>
          <li><strong>Show recommended action (1:50-2:10)</strong> — Confirm WMM dispatch, maintain buffer stock, investigate batch plant.</li>
          <li><strong>Open Material Tracker (2:10-2:30)</strong> — Show bitumen over plan (+350 MT), WMM under plan (-2,200 m³).</li>
          <li><strong>Show variance (2:30-2:50)</strong> — Emphasize critical bitumen variance, red status badges.</li>
          <li><strong>Open Project Insights (2:50-3:10)</strong> — Show schedule risk (High), productivity trend, open high-severity issues.</li>
          <li><strong>Show management summary (3:10-4:00)</strong> — 3-5 concise bullets summarizing risks and recommended actions for Project Manager.</li>
        </ol>
        <div className="alert alert-info" style={{ marginTop: '1rem' }}>
          <strong>Note:</strong> All features shown are functional and interactive. No fake screenshots — all data is live from synthetic demo dataset.
        </div>
      </div>
    </div>
  )
}
export default DemoPage
