export interface DailyLog {
  id: string
  date: string
  area: string
  chainage: string
  activity: string
  plannedQty: number
  actualQty: number
  unit: string
  manpower: number
  equipment: string
  material: string
  issue: string
  weather: string
  remarks: string
}

export interface MaterialItem {
  id: string
  material: string
  planned: number
  consumed: number
  unit: string
  variance: number
  status: 'On Plan' | 'Under' | 'Over' | 'Critical'
}

export interface IssueItem {
  id: string
  issue: string
  location: string
  category: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  status: 'Open' | 'In Progress' | 'Resolved'
  owner: string
  action: string
  due: string
}

export interface RiskItem {
  id: string
  category: string
  description: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  impact: string
  action: string
}

export type RoadDefectCategory =
  | 'Cracking'
  | 'Potholes'
  | 'Surface deformation or rutting'
  | 'Ravelling or surface deterioration'
  | 'Edge damage'
  | 'Waterlogging'
  | 'Damaged or faded road markings'
  | 'Debris or obstruction'
  | 'Inconclusive / No Defect'

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical'
export type UncertaintyLevel = 'Low (High Confidence)' | 'Moderate' | 'High (Uncertain)' | 'Inconclusive'
export type ReviewStatus = 'New' | 'Awaiting Review' | 'Confirmed' | 'Corrected' | 'False Positive' | 'Needs More Evidence'
export type ActionStatus = 'New' | 'Awaiting Review' | 'Confirmed' | 'Action Assigned' | 'In Progress' | 'Resolved' | 'Verified Closed'

export interface EvidenceAsset {
  id: string
  url: string
  filename: string
  sizeBytes: number
  mimeType: string
  uploadedAt: string
  caption?: string
}

export interface HumanReview {
  reviewerName: string
  reviewedAt: string
  originalCategory: RoadDefectCategory
  finalCategory: RoadDefectCategory
  originalSeverity: SeverityLevel
  finalSeverity: SeverityLevel
  engineeringNotes: string
  decision: 'Confirmed' | 'Category Corrected' | 'Severity Changed' | 'Marked False Positive' | 'Additional Evidence Requested'
}

export interface CorrectiveAction {
  id: string
  findingId: string
  title: string
  priority: SeverityLevel
  assignedTo: string
  targetDate: string
  status: ActionStatus
  resolutionNotes?: string
  beforeEvidenceUrl?: string
  afterEvidenceUrl?: string
  verifiedBy?: string
  verifiedAt?: string
  updatedAt: string
}

export interface FindingAuditEntry {
  timestamp: string
  actor: string
  action: string
  details: string
}

export interface Finding {
  id: string
  inspectionId: string
  chainage: string
  chainageKm: number
  segmentLane: string
  category: RoadDefectCategory
  visualEvidence: EvidenceAsset
  severity: SeverityLevel
  uncertainty: UncertaintyLevel
  explanation: string
  recommendedAction: string
  humanReviewStatus: ReviewStatus
  humanReview?: HumanReview
  correctiveAction?: CorrectiveAction
  auditTrail: FindingAuditEntry[]
}

export interface RoadInspection {
  id: string
  projectId: string
  roadPackage: string
  chainageStart: string
  chainageEnd: string
  chainageStartKm: number
  chainageEndKm: number
  roadSegment: string
  lane: string
  date: string
  time: string
  gpsCoordinates?: { lat: number; lng: number }
  weather: string
  surfaceCondition: string
  inspectorName: string
  description: string
  evidenceAssets: EvidenceAsset[]
  findings: Finding[]
  createdAt: string
}

export interface ProjectInfo {
  id: string
  name: string
  identifier: string
  roadPackage: string
  relevantSegments: string[]
  client: string
  location: string
  startDate: string
  endDate: string
  plannedProgress: number
  reportedProgress: number
  lengthKm: number
  totalInspections: number
  openFindingsCount: number
  highPriorityAwaitingReviewCount: number
  overdueActionsCount: number
}

