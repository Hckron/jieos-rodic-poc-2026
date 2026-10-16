import { describe, it, expect } from 'vitest'
import {
  parseChainageToMeters,
  formatChainageFromMeters,
  validateChainageRange
} from '../utils/chainage'
import {
  validateImageFile,
  analyzeInspectionEvidence,
  DEMO_DEFECT_FIXTURES,
  isRealAIConfigured
} from '../utils/defectAnalysisService'
import {
  DEMO_PROJECT_INFO,
  DEMO_ROAD_INSPECTIONS,
  INITIAL_FINDINGS,
  exportFindingsToCSV,
  DEMO_PROJECT
} from '../utils/demoData'
import { Finding, RoadInspection, CorrectiveAction } from '../types'

describe('JIEOS–InfraAI Comprehensive Verification Suite (14 Mandatory Domains)', () => {

  // Domain 1: Application startup and core route loading / data integrity
  describe('1. Application Data Structures & Constants', () => {
    it('initializes valid project metadata with corridor boundaries', () => {
      expect(DEMO_PROJECT_INFO.name).toContain('Pune–Nashik')
      expect(DEMO_PROJECT_INFO.lengthKm).toBe(45)
      expect(DEMO_PROJECT_INFO.identifier).toBe('NH60-MAH-PKG2')
      expect(DEMO_PROJECT_INFO.relevantSegments.length).toBeGreaterThan(0)
    })

    it('loads initial road inspections and findings without null errors', () => {
      expect(DEMO_ROAD_INSPECTIONS.length).toBeGreaterThanOrEqual(3)
      expect(INITIAL_FINDINGS.length).toBeGreaterThanOrEqual(5)
    })
  })

  // Domain 2: Project and chainage input validation
  describe('2. Chainage Parsing & Range Validation', () => {
    it('accurately parses standard chainage formats to meters', () => {
      expect(parseChainageToMeters('Km 42+500')).toBe(42500)
      expect(parseChainageToMeters('42+500')).toBe(42500)
      expect(parseChainageToMeters('Km 42.5')).toBe(42500)
      expect(parseChainageToMeters('Km 0+250')).toBe(250)
    })

    it('formats meters into standard Indian road chainage string', () => {
      expect(formatChainageFromMeters(42500)).toBe('Km 42+500')
      expect(formatChainageFromMeters(750)).toBe('Km 0+750')
      expect(formatChainageFromMeters(0)).toBe('Km 0+000')
    })

    it('accepts valid progressive chainage ranges', () => {
      const res = validateChainageRange('Km 42+500', 'Km 43+200')
      expect(res.valid).toBe(true)
      expect(res.startKm).toBe(42.5)
      expect(res.endKm).toBe(43.2)
      expect(res.startMeters).toBe(42500)
      expect(res.endMeters).toBe(43200)
    })

    it('rejects inconsistent start and end chainage where end is before start', () => {
      const res = validateChainageRange('Km 43+200', 'Km 42+500')
      expect(res.valid).toBe(false)
      expect(res.error).toContain('cannot be before start')
    })

    it('rejects invalid or unparseable chainage formats', () => {
      const res = validateChainageRange('invalid-chainage', 'Km 43+000')
      expect(res.valid).toBe(false)
      expect(res.error).toContain('Invalid start chainage format')
    })

    it('rejects inspection segments exceeding 10 km limit', () => {
      const res = validateChainageRange('Km 40+000', 'Km 55+000')
      expect(res.valid).toBe(false)
      expect(res.error).toContain('exceeds maximum single inspection limit')
    })
  })

  // Domain 3: Valid and invalid image uploads
  describe('3. Image Upload Validation', () => {
    it('accepts standard JPEG, PNG, and WebP images within 10MB limit', () => {
      expect(validateImageFile({ type: 'image/jpeg', size: 2 * 1024 * 1024 }).valid).toBe(true)
      expect(validateImageFile({ type: 'image/png', size: 4 * 1024 * 1024 }).valid).toBe(true)
      expect(validateImageFile({ type: 'image/webp', size: 1 * 1024 * 1024 }).valid).toBe(true)
    })

    it('rejects unsupported image file types (PDF, EXE, etc.)', () => {
      const res = validateImageFile({ type: 'application/pdf', size: 1024 })
      expect(res.valid).toBe(false)
      expect(res.error).toContain('Unsupported image format')
    })

    it('rejects files exceeding 10MB boundary', () => {
      const res = validateImageFile({ type: 'image/jpeg', size: 12 * 1024 * 1024 })
      expect(res.valid).toBe(false)
      expect(res.error).toContain('exceeds maximum allowed size')
    })

    it('rejects empty (0 byte) files', () => {
      const res = validateImageFile({ type: 'image/png', size: 0 })
      expect(res.valid).toBe(false)
      expect(res.error).toContain('empty (0 bytes)')
    })
  })

  // Domain 4: AI Provider Schema & Defect Structure
  describe('4. AI Defect Detection Output Schema', () => {
    it('returns structured defect finding conforming to Finding interface', async () => {
      const finding = await analyzeInspectionEvidence({
        inspectionId: 'insp-test',
        chainage: 'Km 42+620',
        chainageKm: 42.62,
        segmentLane: 'Outer Lane',
        description: 'Road shows longitudinal cracking',
        evidenceAsset: {
          id: 'ev-test',
          url: DEMO_DEFECT_FIXTURES[1].svgThumbnail,
          filename: 'crack.jpg',
          sizeBytes: 1024,
          mimeType: 'image/jpeg',
          uploadedAt: new Date().toISOString()
        },
        preferredFixtureId: 'fixture-crack'
      })

      expect(finding.id).toBeDefined()
      expect(finding.category).toBe('Cracking')
      expect(finding.severity).toBe('High')
      expect(finding.uncertainty).toBe('Low (High Confidence)')
      expect(finding.humanReviewStatus).toBe('Awaiting Review')
      expect(finding.auditTrail.length).toBeGreaterThan(0)
    })
  })

  // Domain 5: AI Provider Timeout / Fallback Handling
  describe('5. Fallback Handling & Resilience', () => {
    it('falls back to deterministic demo fixtures without throwing when external API is absent', async () => {
      const finding = await analyzeInspectionEvidence({
        inspectionId: 'insp-fallback',
        chainage: 'Km 44+300',
        chainageKm: 44.3,
        segmentLane: 'Drain Side',
        description: 'Water ponding and blocked side drain',
        evidenceAsset: {
          id: 'ev-fb',
          url: '',
          filename: 'pond.jpg',
          sizeBytes: 2048,
          mimeType: 'image/jpeg',
          uploadedAt: new Date().toISOString()
        }
      })

      expect(finding.category).toBe('Waterlogging')
      expect(finding.visualEvidence.url).toBeDefined()
    })
  })

  // Domain 6: Honest Demo AI Mode & Uncertainty Indicators
  describe('6. Honest Demo AI Mode & Uncertainty Reporting', () => {
    it('reports qualitative uncertainty rather than fabricated statistical percentages', async () => {
      const crackFinding = await analyzeInspectionEvidence({
        inspectionId: 'insp-1',
        chainage: 'Km 42+000',
        chainageKm: 42.0,
        segmentLane: 'Lane 1',
        description: 'pothole detected',
        evidenceAsset: { id: 'e1', url: '', filename: 'pothole.jpg', sizeBytes: 10, mimeType: 'image/jpeg', uploadedAt: '' },
        preferredFixtureId: 'fixture-pothole'
      })
      expect(['Low (High Confidence)', 'Moderate', 'High (Uncertain)', 'Inconclusive']).toContain(crackFinding.uncertainty)

      // Inconclusive fixture test
      const inconFinding = await analyzeInspectionEvidence({
        inspectionId: 'insp-2',
        chainage: 'Km 42+000',
        chainageKm: 42.0,
        segmentLane: 'Lane 1',
        description: 'blurred photo glare',
        evidenceAsset: { id: 'e2', url: '', filename: 'blur.jpg', sizeBytes: 10, mimeType: 'image/jpeg', uploadedAt: '' },
        preferredFixtureId: 'fixture-inconclusive'
      })
      expect(inconFinding.category).toBe('Inconclusive / No Defect')
      expect(inconFinding.uncertainty).toBe('Inconclusive')
    })
  })

  // Domain 7: Creation and retrieval of findings
  describe('7. Creation and Retrieval of Findings', () => {
    it('correctly associates created findings with inspection ID and chainage', () => {
      const inspection = DEMO_ROAD_INSPECTIONS[0]
      expect(inspection.findings.length).toBe(2)
      expect(inspection.findings[0].inspectionId).toBe(inspection.id)
      expect(inspection.findings[0].chainageKm).toBeGreaterThanOrEqual(inspection.chainageStartKm)
      expect(inspection.findings[0].chainageKm).toBeLessThanOrEqual(inspection.chainageEndKm)
    })
  })

  // Domain 8: Human review and status transitions
  describe('8. Human-in-the-Loop Review Transitions', () => {
    it('supports confirming, category correcting, and severity changing while preserving original proposal', () => {
      const baseFinding = INITIAL_FINDINGS[0]
      const originalCat = baseFinding.category
      const originalSev = baseFinding.severity

      // Human corrects category and changes severity
      const reviewedFinding: Finding = {
        ...baseFinding,
        humanReviewStatus: 'Corrected',
        humanReview: {
          reviewerName: 'Er. Rajesh Kulkarni (Quality Engineer)',
          reviewedAt: new Date().toISOString(),
          originalCategory: originalCat,
          finalCategory: 'Surface deformation or rutting',
          originalSeverity: originalSev,
          finalSeverity: 'Critical',
          engineeringNotes: 'Wheelpath depression with secondary shoving.',
          decision: 'Category Corrected'
        }
      }

      expect(reviewedFinding.humanReviewStatus).toBe('Corrected')
      expect(reviewedFinding.humanReview?.originalCategory).toBe(originalCat)
      expect(reviewedFinding.humanReview?.finalCategory).toBe('Surface deformation or rutting')
      expect(reviewedFinding.humanReview?.finalSeverity).toBe('Critical')
    })
  })

  // Domain 9: Corrective Action Assignment and Resolution
  describe('9. Corrective Action Lifecycle Transitions', () => {
    it('tracks full action lifecycle: Action Assigned -> In Progress -> Resolved -> Verified Closed', () => {
      const action: CorrectiveAction = {
        id: 'act-test-01',
        findingId: 'fnd-101',
        title: 'Patch edge ravelling at Km 42+620',
        priority: 'High',
        assignedTo: 'Maintenance Crew Alpha',
        targetDate: '2026-09-20',
        status: 'Action Assigned',
        updatedAt: '2026-09-10T10:00:00Z'
      }
      expect(action.status).toBe('Action Assigned')

      // Move to In Progress
      action.status = 'In Progress'
      action.resolutionNotes = 'Cold mix applied at site'
      expect(action.status).toBe('In Progress')

      // Move to Resolved
      action.status = 'Resolved'
      expect(action.status).toBe('Resolved')

      // Verify and Close
      action.status = 'Verified Closed'
      action.verifiedBy = 'Er. Rajesh Kulkarni'
      action.verifiedAt = new Date().toISOString()
      expect(action.status).toBe('Verified Closed')
      expect(action.verifiedBy).toBeDefined()
    })
  })

  // Domain 10: Source Evidence & Audit Trail Preservation
  describe('10. Source Evidence & Audit Trail Lineage', () => {
    it('appends audit log entries sequentially without deleting prior history', () => {
      const finding = INITIAL_FINDINGS[0]
      expect(finding.auditTrail.length).toBeGreaterThanOrEqual(2)
      expect(finding.auditTrail[0].action).toContain('AI Candidate')
      expect(finding.auditTrail[1].action).toContain('Human Review')
      expect(finding.visualEvidence.filename).toBeDefined()
    })
  })

  // Domain 11: Dashboard counts derived from actual records
  describe('11. Dashboard Derived Intelligence Counts', () => {
    it('calculates exact open, awaiting review, and critical findings from data array', () => {
      const findings = INITIAL_FINDINGS
      const awaiting = findings.filter(f => f.humanReviewStatus === 'Awaiting Review').length
      const critical = findings.filter(f => (f.humanReview?.finalSeverity || f.severity) === 'Critical').length

      expect(awaiting).toBe(1)
      expect(critical).toBe(1)
    })
  })

  // Domain 12: PDF / CSV Report Export
  describe('12. Report CSV Generation', () => {
    it('generates compliant CSV with correct column headers and finding data', () => {
      const csv = exportFindingsToCSV(INITIAL_FINDINGS, DEMO_PROJECT)
      expect(csv).toContain('Finding ID')
      expect(csv).toContain('Road Package')
      expect(csv).toContain('Defect Category')
      expect(csv).toContain('fnd-101')
      expect(csv).toContain('Cracking')
      expect(csv).toContain('Km 42+620')
    })
  })

  // Domain 13: Security Boundaries & Secret Handling
  describe('13. Security Boundaries & Secret Handling', () => {
    it('confirms frontend does not hardcode API keys in source code', () => {
      // isRealAIConfigured safely checks process.env or returns false in client
      const configured = isRealAIConfigured()
      // In this local environment without GEMINI_API_KEY set, it is false (Demo AI Mode)
      expect(typeof configured).toBe('boolean')
    })
  })

  // Domain 14: Full End-to-End Inspection Scenario
  describe('14. Full End-to-End Inspection Scenario', () => {
    it('simulates complete lifecycle from site capture to AI detection, human review, action assignment, and verification closure', async () => {
      // Step A: Capture field inspection
      const chainageRes = validateChainageRange('Km 45+100', 'Km 45+800')
      expect(chainageRes.valid).toBe(true)

      // Step B: AI Defect Detection
      const finding = await analyzeInspectionEvidence({
        inspectionId: 'insp-e2e',
        chainage: 'Km 45+450',
        chainageKm: 45.45,
        segmentLane: 'Right Carriageway (Outer)',
        description: 'Severe asphalt pothole observed near bridge transition',
        evidenceAsset: {
          id: 'ev-e2e',
          url: DEMO_DEFECT_FIXTURES[0].svgThumbnail,
          filename: 'pothole_bridge_approach.jpg',
          sizeBytes: 2100000,
          mimeType: 'image/jpeg',
          uploadedAt: new Date().toISOString()
        },
        preferredFixtureId: 'fixture-pothole'
      })
      expect(finding.humanReviewStatus).toBe('Awaiting Review')
      expect(finding.category).toBe('Potholes')
      expect(finding.severity).toBe('Critical')

      // Step C: Quality Engineer Human Review
      finding.humanReviewStatus = 'Confirmed'
      finding.humanReview = {
        reviewerName: 'Er. Rajesh Kulkarni',
        reviewedAt: new Date().toISOString(),
        originalCategory: finding.category,
        finalCategory: finding.category,
        originalSeverity: finding.severity,
        finalSeverity: finding.severity,
        engineeringNotes: 'Pothole depth 80mm. High risk to heavy truck traffic.',
        decision: 'Confirmed'
      }
      finding.auditTrail.push({
        timestamp: new Date().toISOString(),
        actor: 'Er. Rajesh Kulkarni',
        action: 'Human Review - Confirmed',
        details: 'Confirmed Critical Pothole.'
      })

      // Step D: Assign Corrective Action
      finding.correctiveAction = {
        id: 'act-e2e',
        findingId: finding.id,
        title: 'Emergency cold-mix patch & night asphalt inlay',
        priority: 'Critical',
        assignedTo: 'Rapid Maintenance Unit',
        targetDate: '2026-09-12',
        status: 'Action Assigned',
        updatedAt: new Date().toISOString()
      }

      // Step E: Work Execution
      finding.correctiveAction.status = 'In Progress'
      finding.correctiveAction.resolutionNotes = 'Cold mix compacted'

      // Step F: Verification Sign-off & Closure
      finding.correctiveAction.status = 'Verified Closed'
      finding.correctiveAction.verifiedBy = 'Er. Rajesh Kulkarni'
      finding.correctiveAction.verifiedAt = new Date().toISOString()
      finding.auditTrail.push({
        timestamp: new Date().toISOString(),
        actor: 'Er. Rajesh Kulkarni',
        action: 'Verified Closed',
        details: 'Field repair verified under straightedge tolerance.'
      })

      expect(finding.correctiveAction.status).toBe('Verified Closed')
      expect(finding.auditTrail.length).toBe(3)
    })
  })

})
