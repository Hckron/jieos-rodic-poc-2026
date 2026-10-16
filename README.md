# JIEOS–InfraAI — Road Quality & Inspection Decision-Support Platform

**Project:** `jieos-rodic-poc-2026`  
**Challenge:** Rodic InfraAI Innovation Challenge 2026  
**Theme:** AI for Roads, Bridges & Tunnels  
**Corridor:** Pune–Nashik Highway Improvement Project (NH-60 Package II, Km 40+000 to Km 85+000)  
**Primary Objective:** Deliver an honest, testable, demonstrable, and deployment-ready proof of concept that turns road-site photographs and chainage observations into traceable inspection findings, prioritized corrective actions, and evidence-backed project reports.

---

## 1. Executive Summary & Purpose

Highway authorities, concessionaires, and EPC contractors oversee hundreds of kilometers of road infrastructure where pavement defects (potholes, alligator cracking, wheelpath rutting, drainage waterlogging, worn thermoplastic markings) emerge continuously.

**JIEOS–InfraAI** is a domain-specific, AI-assisted road inspection platform designed to:
1. **Standardize Field Data Collection:** Capture chainage-validated road observations (`Km 42+500` to `Km 43+200`), carriageway lane data, surface conditions, and high-resolution photographic evidence.
2. **Accelerate Defect Screening:** Use computer vision models (with an honest, deterministic Demo AI Mode fallback) to generate preliminary candidate defect classifications, severity ratings, and qualitative uncertainty estimates.
3. **Enforce Human Engineering Authority:** Provide a human-in-the-loop review interface where quality engineers validate or correct AI suggestions, record structural observations, and approve punchlist items.
4. **Track Corrective Action Lifecycles:** Guide defect rectifications through an auditable workflow: `New → Awaiting Review → Confirmed → Action Assigned → In Progress → Resolved → Verified Closed`.
5. **Visualize Corridor Health:** Locate findings continuously along the 45-km highway corridor via an interactive linear chainage strip map.
6. **Generate Audit-Proof Evidence Reports:** Export formal CSV inspection registers and printable PDF dossiers with full photographic traceability.

> **Responsible AI Principle:** JIEOS is a **decision-support copilot**, not an autonomous engineering authority. It never declares a highway structurally safe or issues unverified road closures without certified human engineer sign-off.

---

## 2. Technology Stack & Prerequisites

- **Frontend & App Architecture:** React 18.3, TypeScript 5.5, Vite 5.4 (Single-Page Application).
- **Styling:** Modular CSS with CSS custom properties (clean, accessible light theme for site and office engineers).
- **Test Framework:** Vitest 2.1.9 (23 automated unit and integration tests across 14 challenge domains).
- **Build Output:** Production bundle via Vite (`dist/` ~285 kB gzip: 79 kB).
- **Prerequisites:**
  - Node.js `v20+` or `v24+` (verified on Node.js v24.18.1).
  - npm `v10+` or `v11+` (verified on npm 11.16.0).

---

## 3. Installation & Local Execution

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/jaydeepwayal/jieos-rodic-poc-2026.git
cd jieos-rodic-poc-2026

# Install dependencies (respecting package tree)
npm install --legacy-peer-deps

# Start local development server
npm run dev
# Accessible at: http://localhost:5173

# Run automated tests
npm test
# (Executes vitest run — 23 tests, 14 domains)

# Build production bundle
npm run build
# (Compiles to dist/ in ~2.8s)

# Preview production build locally
npm run preview
# Accessible at: http://localhost:4173
```

---

## 4. Environment Variables & Secret Separation

| Variable | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Secret (String) | Optional | Server-side API key for live Google Gemini Vision inference. |
| `GEMINI_MODEL` | String | Optional | Model identifier (defaults to `gemini-1.5-flash` or `gemini-2.0-flash`). |

### Safe Demo AI Mode Fallback
- If `GEMINI_API_KEY` is not provided, JIEOS automatically activates **Demo AI Mode**.
- In Demo AI Mode, the application uses **deterministic, explicitly mapped fixtures** based on real-world road defect standards (IRC SP:19 / IRC 35:2015).
- No API keys are embedded in frontend client code. `.env` and `.env.local` are strictly excluded in `.gitignore`.

---

## 5. Primary Application Workflows

1. **Project Overview (Dashboard):** Real-time metrics computed directly from inspection records: total inspections (3), open findings (4), awaiting review (1), critical pothole hazard callouts, and overdue corrective action alerts.
2. **Road Inspection Capture (`/inspections`):** Field form with Indian road chainage parsing (`parseChainageToMeters`, `formatChainageFromMeters`), start/end consistency checks, image format validation (JPEG/PNG/WebP &le; 10MB), and defect analysis dispatch.
3. **AI Findings & Human Review (`/findings`):** Human engineer review modal: confirms findings, modifies severity, marks false positives, requests more photos, inputs engineering notes, and records immutable audit entries.
4. **Corridor Chainage Strip Map (`/chainage`):** Continuous 45-km visual timeline (Km 40+000 to Km 85+000) showing defect density by 5-km bins and pinpointing high-risk clusters.
5. **Corrective Action Lifecycle (`/actions`):** Formal lifecycle tracker (`Action Assigned → In Progress → Resolved → Verified Closed`) with field repair notes and QA engineer verification.
6. **Executive Inspection Reports (`/reports`):** Printable evidence dossier and RFC-4180 CSV export download button.
7. **Operational Copilot Modules:** Site Daily Log, Material Tracker (variance calculations for Bitumen, Cement, Aggregate), and Project Insights.

---

## 6. Automated Testing Suite

All 23 tests are real, automated, and run headless in **1.1s** via `npm test`:

1. Application Data Structures & Constants (2 tests)
2. Chainage Parsing & Range Validation (6 tests)
3. Image Upload Format & Size Boundary Checks (4 tests)
4. AI Defect Detection Structured Output Schema (1 test)
5. Fallback Handling & Resilience (1 test)
6. Honest Demo AI Mode & Uncertainty Indicators (1 test)
7. Creation & Retrieval of Inspection Findings (1 test)
8. Human-in-the-Loop Review State Transitions (1 test)
9. Corrective Action Lifecycle Transitions (1 test)
10. Source Evidence & Audit Trail Lineage (1 test)
11. Dashboard Derived Intelligence Counts (1 test)
12. Report CSV Generation (1 test)
13. Security Boundaries & Secret Handling (1 test)
14. Full End-to-End Field Inspection Scenario (1 test)

---

## 7. Limitations & Honest Disclosures

- **PoC Scope:** Developed as an innovation proof-of-concept for the Rodic InfraAI Challenge 2026. Not connected to live Rodic or NHAI enterprise SAP/ERP databases.
- **Dataset:** Built on curated synthetic fixtures modeled after Indian Roads Congress (IRC) standards. No proprietary customer data is claimed.
- **State Persistence:** In-memory client state initialized from deterministic fixtures. Form submissions persist during the user session. Durable cloud persistence can be connected via a PostgreSQL/Supabase backend adapter.

---

## 8. Deployment Status

- **Build Status:** PASS (Vite v5.4.21, production bundle in `dist/`).
- **Tests Status:** 23/23 PASS (`npm test`).
- **Live Hosting Instructions:**
  - Run `npx vercel` to deploy to Vercel.
  - Or host `dist/` on any static provider (Netlify, AWS S3/CloudFront, Cloudflare Pages).
  - Configure `GEMINI_API_KEY` in host environment variables if live Gemini Vision calls are desired.
