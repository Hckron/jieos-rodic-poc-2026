import { useState, useEffect } from 'react'
import { DEMO_PROJECT_INFO, DEMO_DAILY_LOGS, DEMO_ROAD_INSPECTIONS, INITIAL_FINDINGS } from './utils/demoData'
import { DailyLog, RoadInspection, Finding } from './types'
import { isRealAIConfigured } from './utils/defectAnalysisService'

// Primary Road Inspection Workflow Pages
import Dashboard from './pages/Dashboard'
import RoadInspections from './pages/RoadInspections'
import FindingsReview from './pages/FindingsReview'
import ChainageView from './pages/ChainageView'
import ActionTracker from './pages/ActionTracker'
import ReportsView from './pages/ReportsView'

// Operational & Documentation Pages
import DailyLogPage from './pages/DailyLog'
import MaterialTracker from './pages/MaterialTracker'
import IssuesPage from './pages/Issues'
import InsightsPage from './pages/Insights'
import DatasetPage from './pages/Dataset'
import TestingPage from './pages/Testing'
import DocsPage from './pages/Docs'
import DemoPage from './pages/Demo'
import './styles/App.css'

export type Page =
  | 'dashboard'
  | 'inspections'
  | 'findings'
  | 'chainage'
  | 'actions'
  | 'reports'
  | 'daily-log'
  | 'materials'
  | 'issues'
  | 'insights'
  | 'dataset'
  | 'testing'
  | 'docs'
  | 'demo'

function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(DEMO_DAILY_LOGS)
  const [inspections, setInspections] = useState<RoadInspection[]>(DEMO_ROAD_INSPECTIONS)
  const [findings, setFindings] = useState<Finding[]>(INITIAL_FINDINGS)
  const [isDemoMode, setIsDemoMode] = useState(true)

  useEffect(() => {
    // Check if real AI provider is configured via environment
    setIsDemoMode(!isRealAIConfigured())
  }, [])

  const handleAddLog = (log: DailyLog) => {
    setDailyLogs(prev => [log, ...prev])
  }

  const handleAddInspection = (insp: RoadInspection) => {
    setInspections(prev => [insp, ...prev])
  }

  const handleAddFinding = (finding: Finding) => {
    setFindings(prev => [finding, ...prev])
  }

  const handleUpdateFinding = (updated: Finding) => {
    setFindings(prev => prev.map(f => (f.id === updated.id ? updated : f)))
  }

  const navLink = (target: Page, label: string) => (
    <button
      onClick={() => {
        setPage(target)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
      className={`nav-link ${page === target ? 'active' : ''}`}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        font: 'inherit',
        color: 'inherit',
        padding: '0.4rem 0.6rem',
        borderRadius: '4px'
      }}
    >
      {label}
    </button>
  )

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return (
          <Dashboard
            logs={dailyLogs}
            findings={findings}
            inspections={inspections}
            onNavigate={(p: any) => setPage(p)}
          />
        )
      case 'inspections':
        return (
          <RoadInspections
            inspections={inspections}
            onAddInspection={handleAddInspection}
            onAddFinding={handleAddFinding}
          />
        )
      case 'findings':
        return (
          <FindingsReview
            findings={findings}
            onUpdateFinding={handleUpdateFinding}
          />
        )
      case 'chainage':
        return <ChainageView findings={findings} />
      case 'actions':
        return (
          <ActionTracker
            findings={findings}
            onUpdateFinding={handleUpdateFinding}
          />
        )
      case 'reports':
        return <ReportsView findings={findings} inspections={inspections} />
      case 'daily-log':
        return <DailyLogPage onAddLog={handleAddLog} existingLogs={dailyLogs} />
      case 'materials':
        return <MaterialTracker />
      case 'issues':
        return <IssuesPage />
      case 'insights':
        return <InsightsPage />
      case 'dataset':
        return <DatasetPage />
      case 'testing':
        return <TestingPage />
      case 'docs':
        return <DocsPage />
      case 'demo':
        return <DemoPage />
      default:
        return (
          <Dashboard
            logs={dailyLogs}
            findings={findings}
            inspections={inspections}
            onNavigate={(p: any) => setPage(p)}
          />
        )
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1 className="app-title">
              <span>JIEOS — InfraAI</span>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>
                AI Operating System for Roads, Bridges & Tunnels
              </div>
            </h1>
            <span className="project-badge poc">Rodic InfraAI Challenge 2026 PoC</span>
          </div>
          <div className="header-right">
            {isDemoMode ? (
              <span className="mode-badge demo" title="Deterministic Demo AI Mode: Real-world fixtures mapped transparently without external API dependency">
                ⚙️ Demo AI Mode (Deterministic Fallback)
              </span>
            ) : (
              <span className="mode-badge live" title="Live Gemini Vision API adapter active">
                ⚡ Live Vision AI Connected
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Navigation Bar */}
      <nav className="app-nav">
        <ul className="nav-list" style={{ flexWrap: 'wrap', gap: '0.25rem' }}>
          {/* Primary Road Inspection Scope */}
          <li className="nav-item">{navLink('dashboard', '📊 Project Overview')}</li>
          <li className="nav-item">{navLink('inspections', '📷 Road Inspection Capture')}</li>
          <li className="nav-item">{navLink('findings', '🔎 AI Findings & Human Review')}</li>
          <li className="nav-item">{navLink('chainage', '📍 Chainage Corridor Map')}</li>
          <li className="nav-item">{navLink('actions', '🛠️ Corrective Action Lifecycle')}</li>
          <li className="nav-item">{navLink('reports', '📋 Reports & CSV Export')}</li>

          {/* Operational & Support Scope */}
          <li className="nav-item">{navLink('daily-log', '📝 Site Daily Log')}</li>
          <li className="nav-item">{navLink('materials', '📦 Material Tracker')}</li>
          <li className="nav-item">{navLink('dataset', '📂 Dataset & Provenance')}</li>
          <li className="nav-item">{navLink('testing', '🧪 Automated Testing')}</li>
          <li className="nav-item">{navLink('docs', '📚 Documentation')}</li>
          <li className="nav-item">{navLink('demo', '🎬 Jury Demo Script')}</li>
        </ul>
      </nav>

      <main className="main-content">
        {renderPage()}
      </main>

      <footer className="app-footer">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <strong>JIEOS–InfraAI</strong> &bull; Rodic InfraAI Innovation Challenge 2026 PoC
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Project: {DEMO_PROJECT_INFO.name} ({DEMO_PROJECT_INFO.identifier}) &bull; Human-in-the-Loop Decision Support
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
