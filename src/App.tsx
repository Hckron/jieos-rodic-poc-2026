import { useState, useEffect } from 'react'
import { DEMO_PROJECT, DEMO_DAILY_LOGS } from './utils/demoData'
import { DailyLog } from './types'
import Dashboard from './pages/Dashboard'
import DailyLogPage from './pages/DailyLog'
import MaterialTracker from './pages/MaterialTracker'
import IssuesPage from './pages/Issues'
import InsightsPage from './pages/Insights'
import DatasetPage from './pages/Dataset'
import TestingPage from './pages/Testing'
import DocsPage from './pages/Docs'
import DemoPage from './pages/Demo'
import './styles/App.css'

type Page = 'dashboard' | 'daily-log' | 'materials' | 'issues' | 'insights' | 'dataset' | 'testing' | 'docs' | 'demo'

function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(DEMO_DAILY_LOGS)
  const [isDemoMode, setIsDemoMode] = useState(!import.meta.env.GEMINI_API_KEY)

  useEffect(() => {
    setIsDemoMode(!import.meta.env.GEMINI_API_KEY)
  }, [])

  const handleAddLog = (log: DailyLog) => {
    setDailyLogs(prev => [log, ...prev])
  }

  const navLink = (target: Page, label: string) => (
    <button
      onClick={() => { setPage(target); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      className={`nav-link ${page === target ? 'active' : ''}`}
      style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', color: 'inherit' }}
    >
      {label}
    </button>
  )

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard logs={dailyLogs} />
      case 'daily-log': return <DailyLogPage onAddLog={handleAddLog} existingLogs={dailyLogs} />
      case 'materials': return <MaterialTracker />
      case 'issues': return <IssuesPage />
      case 'insights': return <InsightsPage />
      case 'dataset': return <DatasetPage />
      case 'testing': return <TestingPage />
      case 'docs': return <DocsPage />
      case 'demo': return <DemoPage />
      default: return <Dashboard logs={dailyLogs} />
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1 className="app-title">
              <span>JIEOS</span>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>
                Infrastructure Operations Copilot
              </div>
            </h1>
            <span className="project-badge poc">Rodic InfraAI PoC</span>
          </div>
          <div className="header-right">
            {isDemoMode && (
              <span className="mode-badge demo">
                Demo AI Mode — deterministic PoC fallback
              </span>
            )}
            {!isDemoMode && (
              <span className="mode-badge live">
                Live AI Mode
              </span>
            )}
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <ul className="nav-list">
          <li className="nav-item">{navLink('dashboard', '📊 Dashboard')}</li>
          <li className="nav-item">{navLink('daily-log', '📝 Site Daily Log')}</li>
          <li className="nav-item">{navLink('materials', '📦 Material Tracker')}</li>
          <li className="nav-item">{navLink('issues', '⚠️ Issues & Actions')}</li>
          <li className="nav-item">{navLink('insights', '📈 Project Insights')}</li>
          <li className="nav-item">{navLink('dataset', '📂 Dataset')}</li>
          <li className="nav-item">{navLink('testing', '🧪 Testing')}</li>
          <li className="nav-item">{navLink('docs', '📚 Documentation')}</li>
        </ul>
      </nav>

      <main className="main-content">
        {renderPage()}
      </main>

      <footer className="app-footer">
        <p>JIEOS — Rodic InfraAI Innovation Challenge 2026 PoC</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>
          Demo Project — Illustrative Data | No real project data | No authentication required
        </p>
      </footer>
    </div>
  )
}

export default App
