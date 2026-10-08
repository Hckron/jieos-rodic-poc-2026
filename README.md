# JIEOS — Infrastructure Operations Copilot

**Rodic InfraAI Innovation Challenge 2026 — Proof-of-Concept**

Theme: **AI for Roads, Bridges & Tunnels**

## Overview

JIEOS converts daily site information into structured progress updates, material visibility, delay/risk detection, actionable recommendations, and management-ready summaries.

## Demo Project

**Pune–Nashik Highway Improvement Project** (illustrative synthetic data)

- Type: Road
- Length: 45 km
- Areas: Earthwork, Subgrade, GSB, WMM, Drainage, RCC, Bridge, Asphalt

## Key Features

- Dashboard with progress, issues, risks, materials
- Site Daily Log form with validation
- AI Site Copilot (analysis + risk detection + recommendations)
- Material Tracker with variance detection
- Issues & Actions dashboard
- Project Insights page
- Demo AI Mode clearly labeled when GEMINI_API_KEY unavailable

## Environment Variables

- `GEMINI_API_KEY` — for live AI analysis (optional; falls back to Demo AI Mode)

## Local Setup

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Testing

Tests verified: dashboard, form submission, calculations, material variance, risk classification, AI fallback, input validation, responsive UI.

## Deployment

Deploy to Vercel with environment variable `GEMINI_API_KEY` if live AI is desired.

## Data Privacy

Synthetic/illustrative data only. No real personal data required. No secrets in source.

## Limitations

- PoC only; no ERP integration
- Synthetic dataset for demonstration
- AI configured via backend abstraction

---

LIVE_DEMO_URL: BLOCKED (deployment credentials unavailable — build verified locally)
TESTING_REPORT_URL: /testing
DOCUMENTATION_URL: /docs
VIDEO: TODO
