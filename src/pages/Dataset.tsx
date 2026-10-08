function DatasetPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">PoC Dataset</h1>
        <p className="page-subtitle">Synthetic illustrative dataset description</p>
      </div>

      <div className="docs-content">
        <h2>Dataset Description</h2>
        <p>
          <strong>Source:</strong> Synthetic demo dataset created for PoC validation
        </p>
        <p>
          <strong>Purpose:</strong> Illustrate how structured site information can be converted into management-ready operational insights for the JIEOS Infrastructure Operations Copilot.
        </p>
        <p>
          <strong>Project:</strong> Pune–Nashik Highway Improvement Project (Illustrative)
        </p>
        <p>
          <strong>Records:</strong> 8 site daily logs, 6 material tracker entries, 6 issues, 5 critical risk items
        </p>

        <h3>Fields / Features</h3>
        <ul>
          <li><strong>Activity information:</strong> Type, chainage, planned and actual quantities</li>
          <li><strong>Quantities:</strong> Actual vs planned for productivity tracking</li>
          <li><strong>Manpower & equipment:</strong> Resource visibility per activity</li>
          <li><strong>Materials:</strong> Consumption tracking with variance detection</li>
          <li><strong>Issues:</strong> Description, location, category, severity, owner, action</li>
          <li><strong>Progress:</strong> Overall and daily progress percentages</li>
          <li><strong>Location / chainage:</strong> Chainage format (Km X+Y – Km Z+W)</li>
        </ul>

        <h3>Data Integrity Note</h3>
        <p>
          All data in this dataset is synthetic and clearly labeled as illustrative. No government datasets, no company proprietary data, and no personal information are included. This dataset is designed solely for demonstration purposes for the Rodic InfraAI Innovation Challenge 2026.
        </p>

        <h3>Structure</h3>
        <ul>
          <li>Daily logs: Activity, chainage, planned/actual quantity, manpower, equipment, material, weather, remarks, issues</li>
          <li>Materials: Material name, planned quantity, consumed quantity, unit, variance, status (Critical/Over/Under/On Plan)</li>
          <li>Issues: Issue text, location, category, severity (Low/Medium/High/Critical), status (Open/In Progress/Resolved), owner, due date, recommended action</li>
          <li>Risks: Category, description, severity, impact, recommended action</li>
        </ul>
      </div>
    </div>
  )
}

export default DatasetPage
