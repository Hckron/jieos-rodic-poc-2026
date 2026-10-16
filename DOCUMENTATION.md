# JIEOS–InfraAI — Detailed System Architecture & Engineering Reference

**Document Version:** 2.0 (Post-Audit Build)  
**Project:** `jieos-rodic-poc-2026`  
**Challenge:** Rodic InfraAI Innovation Challenge 2026  
**Theme:** AI for Roads, Bridges & Tunnels  

---

## 1. System Overview & Core Philosophy

JIEOS–InfraAI is designed to address a critical operational failure in highway management: **the disconnect between field evidence and engineering decisions**.

In typical construction and maintenance operations, site engineers capture thousands of photographs across vast road corridors. However:
- Photos lack precise, validated chainage (e.g. `Km 42+620` vs vague notes like "near bridge approach").
- Defects are classified inconsistently across different field inspectors.
- Punchlist items get lost in email threads or messaging groups.
- Disagreements occur between contractors and supervising consultants regarding defect severity.

JIEOS addresses this through a **Human-in-the-Loop AI Copilot**. AI algorithms assist with candidate defect classification and severity scoring, but human quality engineers retain absolute decision authority and sign-off.

---

## 2. System Architecture & Component Hierarchy

```
[Browser Client: React 18 + TypeScript + Vite]
│
├── App.tsx (Main Shell, Global State, Role Navigation, Demo AI Banner)
│   ├── State:
│   │   ├── inspections: RoadInspection[]
│   │   ├── findings: Finding[]
│   │   ├── dailyLogs: DailyLog[]
│   │   └── isDemoMode: boolean
│   │
│   ├── Primary Road Quality Views:
│   │   ├── Dashboard.tsx (Executive KPIs, defect distribution, hotspot alert)
│   │   ├── RoadInspections.tsx (Field form, chainage validation, photo upload)
│   │   ├── FindingsReview.tsx (Engineering verification, adjustments, action creation)
│   │   ├── ChainageView.tsx (Linear corridor strip map, 5-km density bins)
│   │   ├── ActionTracker.tsx (State machine: Assigned -> Progress -> Resolved -> Closed)
│   │   └── ReportsView.tsx (Printable evidence dossier, CSV exporter)
│   │
│   ├── Operational Modules:
│   │   ├── DailyLog.tsx (Daily progress, manpower, equipment, materials)
│   │   ├── MaterialTracker.tsx (Bitumen, cement, aggregate variance tracking)
│   │   ├── Issues.tsx (Operational issue tracker)
│   │   └── Insights.tsx (Schedule risk analysis, delay detection)
│   │
│   └── Verification & Evidence Views:
│       ├── Dataset.tsx (Dataset provenance, IRC standards, demo fixture table)
│       ├── Testing.tsx (Real 23/23 Vitest automated test report)
│       ├── Docs.tsx (Architecture, safety guardrails, security rules)
│       └── Demo.tsx (4-minute competition jury runbook)
│
└── Utility & Engine Layer:
    ├── utils/chainage.ts (Indian road chainage regex, range checks, meter math)
    ├── utils/defectAnalysisService.ts (MIME validator, Demo AI fixtures, Gemini adapter)
    ├── utils/demoData.ts (Deterministic road fixtures, INITIAL_FINDINGS, CSV serializer)
    └── api/analyze.ts (Server-side Gemini Vision proxy endpoint)
```

---

## 3. Data Model & Schema Specification

### 3.1. RoadInspection Entity
Represents a field survey event along a road section.
```typescript
interface RoadInspection {
  id: string                   // e.g. "insp-001"
  projectId: string            // "prj-pune-nashik-2026"
  roadPackage: string          // "Package II (Km 40+000 to Km 85+000)"
  chainageStart: string        // "Km 42+500"
  chainageEnd: string          // "Km 43+500"
  chainageStartKm: number      // 42.5
  chainageEndKm: number        // 43.5
  roadSegment: string          // "Km 40+000 – Km 50+000 (Chakan Bypass)"
  lane: string                 // "Right Carriageway (Outer Lane)"
  date: string                 // "2026-09-10"
  time: string                 // "10:00"
  gpsCoordinates?: { lat: number; lng: number }
  weather: string              // "Sunny, 32°C"
  surfaceCondition: string     // "Dry asphalt wearing course"
  inspectorName: string        // "Er. Sneha Verma"
  description: string          // Detailed observation
  evidenceAssets: EvidenceAsset[]
  findings: Finding[]
  createdAt: string
}
```

### 3.2. Finding Entity
Represents a potential or confirmed road defect linked to visual evidence.
```typescript
interface Finding {
  id: string                   // e.g. "fnd-101"
  inspectionId: string         // Links to parent RoadInspection
  chainage: string             // e.g. "Km 42+620"
  chainageKm: number           // 42.62 (used for spatial sorting and map plotting)
  segmentLane: string          // "Right Carriageway (Outer Lane)"
  category: RoadDefectCategory // "Cracking" | "Potholes" | "Rutting" | ...
  visualEvidence: EvidenceAsset
  severity: SeverityLevel      // "Low" | "Medium" | "High" | "Critical"
  uncertainty: UncertaintyLevel// "Low (High Confidence)" | "Moderate" | "Inconclusive"
  explanation: string          // Engineering rationale for defect flag
  recommendedAction: string    // Recommended intervention
  humanReviewStatus: ReviewStatus // "Awaiting Review" | "Confirmed" | "Corrected" | ...
  humanReview?: HumanReview    // Engineer verification record
  correctiveAction?: CorrectiveAction // Punchlist task
  auditTrail: FindingAuditEntry[] // Immutable lineage
}
```

---

## 4. Chainage Parsing & Range Validation Mechanics

The `src/utils/chainage.ts` module enforces standard Indian highway chainage notation:

1. **Parsing (`parseChainageToMeters`):**
   - Strips prefixes (`km`, commas, whitespace).
   - Extracts kilometers and meters via regex: `^(\d+)\s*\+\s*(\d+)$` (e.g. `42+500` &rarr; `42500` meters).
   - Handles decimal inputs (e.g. `42.5` &rarr; `42500` meters).
   - Enforces meter sub-values must be `< 1000`.

2. **Validation (`validateChainageRange`):**
   - Validates that start and end strings parse into non-negative integers.
   - Enforces $StartMeters \le EndMeters$. Inverted ranges are rejected with descriptive messages.
   - Enforces a maximum single inspection segment limit (10,000 meters / 10 km) to prevent data entry blunders.

---

## 5. AI Defect Detection & Honest Demo AI Mode

### 5.1. Live Gemini Vision Architecture
When `GEMINI_API_KEY` is present in the host environment:
1. Uploaded photographs are converted to base64.
2. A structured prompt requests defect categorization against IRC candidate labels.
3. Responses are parsed against strict TypeScript schemas.
4. If rate limits, timeouts (5000ms), or network failures occur, the engine safely fails over to Demo AI Mode.

### 5.2. Deterministic Demo AI Mode (Competition Fallback)
When `GEMINI_API_KEY` is not present:
1. The application displays a prominent **⚙️ Demo AI Mode** badge in the header.
2. Form observations and selected presets match against curated deterministic fixtures:
   - `fixture-pothole`: 75mm cavity, Critical severity, Low uncertainty.
   - `fixture-crack`: Fatigue alligator cracking, High severity, Low uncertainty.
   - `fixture-rutting`: 18mm wheelpath rutting, High severity, Moderate uncertainty.
   - `fixture-waterlog`: Blocked drainage chute, Medium severity, Moderate uncertainty.
   - `fixture-marking`: Faded thermoplastic markings, Low severity, Low uncertainty.
   - `fixture-inconclusive`: Blurred/glare capture, Inconclusive category, High uncertainty.
3. Every fixture includes an embedded SVG visual thumbnail, preventing broken image links during offline evaluation.

---

## 6. Corrective Action State Machine & Verification

Corrective actions follow an immutable lifecycle:

$$\text{New} \longrightarrow \text{Awaiting Review} \longrightarrow \text{Confirmed} \longrightarrow \text{Action Assigned} \longrightarrow \text{In Progress} \longrightarrow \text{Resolved} \longrightarrow \text{Verified Closed}$$

- **No Auto-Closure Rule:** Uploading an image or marking a form does not close a defect.
- **Engineer Sign-off:** Moving an item to `Verified Closed` requires entering the verifying quality engineer's name, timestamp, and field straightedge / compaction test observations.
- **Audit Lineage:** Every state change appends a new entry to the finding's `auditTrail` array containing `{ timestamp, actor, action, details }`.

---

## 7. Security, Privacy & Integrity Verification

1. **Zero Credential Exposure:** Verified via `git grep` and automated test domain 13. Neither frontend code nor git history contains hardcoded API keys.
2. **Gitignore Protection:** Fixed gitignore excludes `.env`, `.env.local`, `dist/`, `node_modules/`, and `*.log`.
3. **MIME & Size Validation:** Blocks file uploads other than `image/jpeg`, `image/png`, `image/webp` or files $> 10$ MB.
4. **Sanitized Git Origin:** Remote URL uses clean HTTPS without embedded credentials.
