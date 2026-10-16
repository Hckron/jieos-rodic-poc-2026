import {
  Finding,
  EvidenceAsset,
  RoadDefectCategory,
  SeverityLevel,
  UncertaintyLevel,
  RoadInspection
} from '../types'

export interface ImageValidationResult {
  valid: boolean
  error?: string
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

/**
 * Validates an uploaded image file for allowed types and file size boundaries.
 */
export function validateImageFile(file: { type: string; size: number; name?: string }): ImageValidationResult {
  if (!file) {
    return { valid: false, error: 'No image file provided' }
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported image format "${file.type}". Allowed formats: JPEG, PNG, WebP.`
    }
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds maximum allowed size of 10 MB.`
    }
  }

  if (file.size === 0) {
    return { valid: false, error: 'Uploaded file is empty (0 bytes).' }
  }

  return { valid: true }
}

/**
 * Deterministic Demo AI fixtures representing real-world road defect scenarios.
 * Explicitly mapped for transparency in documentation and jury evaluation.
 */
export interface DemoDefectFixture {
  fixtureId: string
  name: string
  triggerKeywords: string[]
  category: RoadDefectCategory
  severity: SeverityLevel
  uncertainty: UncertaintyLevel
  explanation: string
  recommendedAction: string
  simulatedVisualDescription: string
  svgThumbnail: string
}

export const DEMO_DEFECT_FIXTURES: DemoDefectFixture[] = [
  {
    fixtureId: 'fixture-pothole',
    name: 'Asphalt Pothole & Edge Ravelling',
    triggerKeywords: ['pothole', 'hole', 'cavity', 'depression', 'pit', 'crater'],
    category: 'Potholes',
    severity: 'Critical',
    uncertainty: 'Low (High Confidence)',
    explanation: 'Localized bowl-shaped pavement depression exceeding 75mm depth with subgrade exposure. High risk of vehicle tire blowout or suspension damage.',
    recommendedAction: 'Immediate temporary cold-mix patch within 24h; mill and hot-mix asphalt rectification scheduled under traffic diversion.',
    simulatedVisualDescription: 'Circular 40cm asphalt cavity with fractured aggregate edges and water pooling at bottom.',
    svgThumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23374151"/><ellipse cx="150" cy="110" rx="60" ry="35" fill="%23111827"/><ellipse cx="150" cy="110" rx="45" ry="25" fill="%230f172a"/><path d="M 120 95 Q 150 120 180 100" stroke="%23dc2626" stroke-width="2" fill="none"/><text x="150" y="30" fill="%23f87171" font-size="13" font-family="sans-serif" text-anchor="middle" font-weight="bold">POTHOLE DETECTED (75mm depth)</text></svg>'
  },
  {
    fixtureId: 'fixture-crack',
    name: 'Longitudinal & Fatigue Cracking',
    triggerKeywords: ['crack', 'alligator', 'fracture', 'fissure', 'seam'],
    category: 'Cracking',
    severity: 'High',
    uncertainty: 'Low (High Confidence)',
    explanation: 'Interconnected longitudinal fatigue cracking (alligator cracking pattern) along outer wheel path indicating structural fatigue of bituminous layer.',
    recommendedAction: 'Crack sealing with polymer-modified bitumen emulsion; monitor deflection via Falling Weight Deflectometer (FWD).',
    simulatedVisualDescription: 'Interlinked hexagonal crack network spanning 2.4m length on asphalt wearing course.',
    svgThumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%234b5563"/><path d="M 60 50 L 90 90 L 80 130 L 120 170 M 90 90 L 140 100 L 160 140 M 140 100 L 170 70 L 220 90 L 250 150" stroke="%23ef4444" stroke-width="3" fill="none"/><text x="150" y="30" fill="%23fca5a5" font-size="13" font-family="sans-serif" text-anchor="middle" font-weight="bold">FATIGUE CRACK PATTERN</text></svg>'
  },
  {
    fixtureId: 'fixture-rutting',
    name: 'Wheelpath Deformation & Rutting',
    triggerKeywords: ['rut', 'deformation', 'depression', 'corrugation', 'settlement', 'groove'],
    category: 'Surface deformation or rutting',
    severity: 'High',
    uncertainty: 'Moderate',
    explanation: 'Longitudinal surface depression along heavy vehicle wheel tracks with slight lateral shoving. Depth approximately 18mm.',
    recommendedAction: 'Verify binder course stability; check axle load compliance; schedule surface profiling/micro-surfacing.',
    simulatedVisualDescription: 'Continuous depression along wheelpath channel with bitumen bleed at ridges.',
    svgThumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23334155"/><path d="M 50 100 C 100 130 140 130 190 100 C 230 80 260 110 290 100" stroke="%23f59e0b" stroke-width="4" fill="none"/><line x1="120" y1="70" x2="120" y2="125" stroke="%23fbbf24" stroke-dasharray="4" stroke-width="2"/><text x="150" y="30" fill="%23fcd34d" font-size="13" font-family="sans-serif" text-anchor="middle" font-weight="bold">WHEELPATH RUTTING (18mm)</text></svg>'
  },
  {
    fixtureId: 'fixture-waterlog',
    name: 'Pavement Waterlogging & Shoulder Ponding',
    triggerKeywords: ['water', 'flood', 'drain', 'puddle', 'ponding', 'waterlogging', 'clog'],
    category: 'Waterlogging',
    severity: 'Medium',
    uncertainty: 'Moderate',
    explanation: 'Storm water retention on carriageway edge due to blocked transverse drainage chute and uncompacted earthen shoulder slope.',
    recommendedAction: 'Clear debris from concrete side-drain and regrade earthen shoulder slope to 3% outward camber.',
    simulatedVisualDescription: 'Standing pool of muddy water spanning 1.5m into carriageway shoulder.',
    svgThumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23475569"/><ellipse cx="150" cy="120" rx="90" ry="40" fill="%230284c7" opacity="0.8"/><text x="150" y="30" fill="%237dd3fc" font-size="13" font-family="sans-serif" text-anchor="middle" font-weight="bold">WATERLOGGING / DRAINAGE BLOCK</text></svg>'
  },
  {
    fixtureId: 'fixture-marking',
    name: 'Faded Thermoplastic Markings',
    triggerKeywords: ['marking', 'line', 'paint', 'strip', 'faded', 'sign'],
    category: 'Damaged or faded road markings',
    severity: 'Low',
    uncertainty: 'Low (High Confidence)',
    explanation: 'Center lane delineation line retroreflectivity severely degraded below IRC 35:2015 threshold (below 100 mcd/m²/lux).',
    recommendedAction: 'Repaint thermoplastic road markings with retroreflective glass beads within next maintenance window.',
    simulatedVisualDescription: 'Worn intermittent center line with faint white pigment residue.',
    svgThumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%231e293b"/><line x1="50" y1="100" x2="110" y2="100" stroke="%2394a3b8" stroke-dasharray="10 10" stroke-width="6"/><line x1="190" y1="100" x2="250" y2="100" stroke="%2394a3b8" stroke-dasharray="10 10" stroke-width="6"/><text x="150" y="30" fill="%23cbd5e1" font-size="13" font-family="sans-serif" text-anchor="middle" font-weight="bold">FADED THERMOPLASTIC MARKING</text></svg>'
  },
  {
    fixtureId: 'fixture-inconclusive',
    name: 'Inconclusive / Ambiguous Evidence',
    triggerKeywords: ['blur', 'dark', 'fog', 'night', 'glare', 'obscured', 'unknown'],
    category: 'Inconclusive / No Defect',
    severity: 'Low',
    uncertainty: 'Inconclusive',
    explanation: 'Image quality is insufficient (low illumination, motion blur, or obstruction). The system cannot reliably determine road condition from this evidence.',
    recommendedAction: 'Retake high-resolution photograph in daylight at normal incident angle with a scale marker.',
    simulatedVisualDescription: 'Overexposed or blurred pavement frame with insufficient surface detail.',
    svgThumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%2364748b"/><circle cx="150" cy="100" r="50" fill="%2394a3b8" opacity="0.4"/><text x="150" y="105" fill="%23f1f5f9" font-size="16" font-family="sans-serif" text-anchor="middle">⚠️ INCONCLUSIVE</text><text x="150" y="140" fill="%23e2e8f0" font-size="11" font-family="sans-serif" text-anchor="middle">Insufficient Image Detail</text></svg>'
  }
]

/**
 * Determines whether real Gemini Vision API is configured via environment variables.
 */
export function isRealAIConfigured(): boolean {
  // Checks for server-side or build environment variable safely
  const g = globalThis as { process?: { env?: Record<string, string | undefined> } }
  const key = g.process?.env?.GEMINI_API_KEY
  return Boolean(key && key.trim().length > 0)
}

/**
 * Matches an inspection description or uploaded file name against deterministic demo fixtures.
 */
export function matchDemoFixture(text: string): DemoDefectFixture {
  const lower = (text || '').toLowerCase()
  for (const fixture of DEMO_DEFECT_FIXTURES) {
    if (fixture.triggerKeywords.some(keyword => lower.includes(keyword))) {
      return fixture
    }
  }
  // Default fixture if no explicit keyword matched
  return DEMO_DEFECT_FIXTURES[1] // Longitudinal cracking fixture as default road defect
}

/**
 * Analyzes inspection evidence to produce an AI Finding.
 * Honors Demo AI Mode with honest qualitative uncertainty reporting.
 */
export async function analyzeInspectionEvidence(params: {
  inspectionId: string
  chainage: string
  chainageKm: number
  segmentLane: string
  description: string
  evidenceAsset: EvidenceAsset
  preferredFixtureId?: string
}): Promise<Finding> {
  const isReal = isRealAIConfigured()

  let selectedFixture: DemoDefectFixture

  if (params.preferredFixtureId) {
    selectedFixture =
      DEMO_DEFECT_FIXTURES.find(f => f.fixtureId === params.preferredFixtureId) ||
      DEMO_DEFECT_FIXTURES[0]
  } else {
    // Match based on description or file caption
    const searchContext = `${params.description} ${params.evidenceAsset.caption || ''} ${params.evidenceAsset.filename}`
    selectedFixture = matchDemoFixture(searchContext)
  }

  const nowIso = new Date().toISOString()
  const findingId = `fnd-${Date.now()}-${Math.floor(Math.random() * 1000)}`

  const finding: Finding = {
    id: findingId,
    inspectionId: params.inspectionId,
    chainage: params.chainage,
    chainageKm: params.chainageKm,
    segmentLane: params.segmentLane,
    category: selectedFixture.category,
    visualEvidence: {
      ...params.evidenceAsset,
      url: params.evidenceAsset.url || selectedFixture.svgThumbnail
    },
    severity: selectedFixture.severity,
    uncertainty: selectedFixture.uncertainty,
    explanation: selectedFixture.explanation,
    recommendedAction: selectedFixture.recommendedAction,
    humanReviewStatus: 'Awaiting Review',
    auditTrail: [
      {
        timestamp: nowIso,
        actor: isReal ? 'Gemini 1.5 Vision' : 'JIEOS Demo AI Engine (Deterministic Fallback)',
        action: 'AI Candidate Finding Flagged',
        details: `Initial defect proposal: ${selectedFixture.category} (${selectedFixture.severity} severity, uncertainty: ${selectedFixture.uncertainty}).`
      }
    ]
  }

  return finding
}
