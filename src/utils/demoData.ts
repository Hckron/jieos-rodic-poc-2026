import { DailyLog, MaterialItem, IssueItem, RiskItem } from '../types'

export const DEMO_PROJECT = {
  name: 'Pune–Nashik Highway Improvement Project',
  type: 'Road',
  location: 'Maharashtra, India',
  length: '45 km',
  chainageStart: 'Km 40+000',
  chainageEnd: 'Km 85+000',
  startDate: '2025-01-15',
  endDate: '2026-12-31',
  contractor: 'Rodic Infrastructure Ltd.',
  client: 'NHAI',
  status: 'In Progress',
}

export const DEMO_DAILY_LOGS: DailyLog[] = [
  {
    id: 'log-001',
    date: '2026-09-10',
    area: 'WMM',
    chainage: 'Km 42+500 – Km 43+200',
    activity: 'WMM laying',
    plannedQty: 420,
    actualQty: 310,
    unit: 'm³',
    manpower: 38,
    equipment: '2 graders, 3 rollers, 6 dumpers',
    material: 'WMM 310 m³',
    issue: 'Intermittent material supply caused stoppage.',
    weather: 'Sunny, 32°C',
    remarks: 'Work resumed at 14:00 after supply restored.',
  },
  {
    id: 'log-002',
    date: '2026-09-09',
    area: 'Asphalt',
    chainage: 'Km 40+000 – Km 41+000',
    activity: 'DBM laying',
    plannedQty: 380,
    actualQty: 375,
    unit: 'MT',
    manpower: 42,
    equipment: '2 pavers, 4 rollers, 8 dumpers',
    material: 'Bitumen 18.5 MT, Aggregate 356 MT',
    issue: '',
    weather: 'Cloudy, 28°C',
    remarks: 'Good progress achieved.',
  },
  {
    id: 'log-003',
    date: '2026-09-08',
    area: 'Bridge Works',
    chainage: 'Km 55+300 – Km 55+350',
    activity: 'Pier cap concreting',
    plannedQty: 120,
    actualQty: 85,
    unit: 'm³',
    manpower: 28,
    equipment: '1 batching plant, 2 transit mixers, 1 pump',
    material: 'M40 Concrete 85 m³',
    issue: 'Batch plant breakdown for 3 hours.',
    weather: 'Light rain, 26°C',
    remarks: 'Concrete placement delayed, cold joint risk monitored.',
  },
  {
    id: 'log-004',
    date: '2026-09-07',
    area: 'Drainage',
    chainage: 'Km 48+000 – Km 49+500',
    activity: 'RCC drain construction',
    plannedQty: 180,
    actualQty: 165,
    unit: 'm',
    manpower: 35,
    equipment: '1 excavator, 2 dumpers, 1 vibrator',
    material: 'M25 Concrete 110 m³, Steel 8.2 MT',
    issue: 'Heavy rain caused waterlogging in trench.',
    weather: 'Heavy rain, 24°C',
    remarks: 'Dewatering pumps deployed.',
  },
  {
    id: 'log-005',
    date: '2026-09-06',
    area: 'Subgrade',
    chainage: 'Km 60+000 – Km 61+500',
    activity: 'Subgrade preparation',
    plannedQty: 5000,
    actualQty: 4800,
    unit: 'm²',
    manpower: 45,
    equipment: '3 dozers, 2 graders, 4 rollers',
    material: '',
    issue: 'Soft patches encountered at Km 60+800.',
    weather: 'Sunny, 30°C',
    remarks: 'Additional compaction carried out.',
  },
  {
    id: 'log-006',
    date: '2026-09-05',
    area: 'Granular Sub-base',
    chainage: 'Km 62+000 – Km 63+000',
    activity: 'GSB laying',
    plannedQty: 600,
    actualQty: 580,
    unit: 'm³',
    manpower: 32,
    equipment: '2 graders, 3 rollers, 5 dumpers',
    material: 'GSB 580 m³',
    issue: '',
    weather: 'Sunny, 31°C',
    remarks: 'On schedule.',
  },
  {
    id: 'log-007',
    date: '2026-09-04',
    area: 'RCC Structures',
    chainage: 'Km 70+200 – Km 70+300',
    activity: 'Abutment wall concreting',
    plannedQty: 150,
    actualQty: 120,
    unit: 'm³',
    manpower: 30,
    equipment: '1 batching plant, 2 transit mixers, 1 pump',
    material: 'M35 Concrete 120 m³',
    issue: 'Reinforcement congestion delayed placement.',
    weather: 'Cloudy, 29°C',
    remarks: 'Rebar spacing adjusted.',
  },
  {
    id: 'log-008',
    date: '2026-09-03',
    area: 'Earthwork',
    chainage: 'Km 75+000 – Km 76+000',
    activity: 'Embankment filling',
    plannedQty: 8000,
    actualQty: 6200,
    unit: 'm³',
    manpower: 50,
    equipment: '4 excavators, 8 dumpers, 2 dozers',
    material: 'Borrow earth 6200 m³',
    issue: 'Borrow area access road damaged.',
    weather: 'Sunny, 33°C',
    remarks: 'Access road repair in progress.',
  },
]

export const DEMO_MATERIALS: MaterialItem[] = [
  { id: 'mat-001', material: 'Cement (OPC 53)', planned: 18500, consumed: 17200, unit: 'bags', variance: -1300, status: 'Under' },
  { id: 'mat-002', material: 'Aggregate (20mm)', planned: 125000, consumed: 132000, unit: 'm³', variance: 7000, status: 'Over' },
  { id: 'mat-003', material: 'WMM', planned: 45000, consumed: 42800, unit: 'm³', variance: -2200, status: 'Under' },
  { id: 'mat-004', material: 'Bitumen (VG-30)', planned: 3200, consumed: 3550, unit: 'MT', variance: 350, status: 'Critical' },
  { id: 'mat-005', material: 'Steel (TMT Fe500)', planned: 2800, consumed: 2950, unit: 'MT', variance: 150, status: 'Over' },
  { id: 'mat-006', material: 'Diesel', planned: 180000, consumed: 195000, unit: 'L', variance: 15000, status: 'Over' },
]

export const DEMO_ISSUES: IssueItem[] = [
  {
    id: 'iss-001',
    issue: 'WMM material supply intermittent — supplier truck breakdown',
    location: 'Km 42+500 – 43+200',
    category: 'Material',
    severity: 'High',
    status: 'Open',
    owner: 'Site Manager',
    action: 'Confirm next-day WMM dispatch quantity and maintain one-day buffer stock.',
    due: '2026-09-11',
  },
  {
    id: 'iss-002',
    issue: 'Batch plant breakdown at bridge pier location',
    location: 'Km 55+300 – 55+350',
    category: 'Equipment',
    severity: 'High',
    status: 'In Progress',
    owner: 'Plant Engineer',
    action: 'Arrange backup batching plant; inspect plant maintenance schedule.',
    due: '2026-09-10',
  },
  {
    id: 'iss-003',
    issue: 'Heavy rain caused waterlogging in drainage trench',
    location: 'Km 48+000 – 49+500',
    category: 'Weather',
    severity: 'Medium',
    status: 'Resolved',
    owner: 'Site Supervisor',
    action: 'Dewatering pumps deployed; resume work once trench dry.',
    due: '2026-09-08',
  },
  {
    id: 'iss-004',
    issue: 'Reinforcement congestion delaying abutment concreting',
    location: 'Km 70+200 – 70+300',
    category: 'Quality',
    severity: 'Medium',
    status: 'Open',
    owner: 'QC Engineer',
    action: 'Review rebar detailing; coordinate with design consultant.',
    due: '2026-09-12',
  },
  {
    id: 'iss-005',
    issue: 'Borrow area access road damaged — hauling disrupted',
    location: 'Km 75+000 – 76+000',
    category: 'Logistics',
    severity: 'High',
    status: 'In Progress',
    owner: 'Logistics Coordinator',
    action: 'Repair access road; identify alternate borrow source.',
    due: '2026-09-13',
  },
  {
    id: 'iss-006',
    issue: 'Soft subgrade patches at Km 60+800',
    location: 'Km 60+800',
    category: 'Geotechnical',
    severity: 'Medium',
    status: 'Open',
    owner: 'Geotech Engineer',
    action: 'CBR test on soft patches; consider geotextile or stabilization.',
    due: '2026-09-15',
  },
]

export const DEMO_RISKS: RiskItem[] = [
  {
    id: 'risk-001',
    category: 'Material Shortage',
    description: 'Bitumen consumption 11% above plan; stock may deplete before next supply.',
    severity: 'Critical',
    impact: 'Asphalt works stoppage; schedule slippage on DBM/BC layers.',
    action: 'Expedite bitumen procurement; place emergency order with 48-hr delivery.',
  },
  {
    id: 'risk-002',
    category: 'Equipment Downtime',
    description: 'Batch plant at bridge site unreliable — 2 breakdowns this week.',
    severity: 'High',
    impact: 'Bridge substructure delays; critical path impact.',
    action: 'Mobilize backup batching plant; enforce preventive maintenance.',
  },
  {
    id: 'risk-003',
    category: 'Productivity Decline',
    description: 'WMM laying 26% below plan (310 vs 420 m³) due to supply gaps.',
    severity: 'High',
    impact: 'Sub-base completion delayed; knock-on to asphalt schedule.',
    action: 'Negotiate dedicated truck allocation with supplier; build buffer stock.',
  },
  {
    id: 'risk-004',
    category: 'Weather Impact',
    description: 'Monsoon intensifying — drainage and earthwork at risk.',
    severity: 'Medium',
    impact: 'Waterlogging, access issues, compaction quality risk.',
    action: 'Accelerate drainage works; stock dewatering pumps; adjust schedule.',
  },
  {
    id: 'risk-005',
    category: 'Dependency Blocker',
    description: 'Borrow area access road damage halting embankment fill.',
    severity: 'High',
    impact: 'Earthwork chainage 75-76 km stalled; 6200 vs 8000 m³ achieved.',
    action: 'Priority repair access road; qualify alternate borrow area.',
  },
]

export function calculateOverallProgress(logs: DailyLog[]): number {
  const totalPlanned = logs.reduce((sum, l) => sum + l.plannedQty, 0)
  const totalActual = logs.reduce((sum, l) => sum + l.actualQty, 0)
  return totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0
}

export function calculateTodaysProgress(logs: DailyLog[]): number {
  const today = new Date().toISOString().split('T')[0]
  const todayLogs = logs.filter(l => l.date === today)
  if (todayLogs.length === 0) return 0
  const planned = todayLogs.reduce((s, l) => s + l.plannedQty, 0)
  const actual = todayLogs.reduce((s, l) => s + l.actualQty, 0)
  return planned > 0 ? Math.round((actual / planned) * 100) : 0
}

import {
  RoadInspection,
  Finding,
  ProjectInfo
} from '../types'
import { DEMO_DEFECT_FIXTURES } from './defectAnalysisService'

export const DEMO_PROJECT_INFO: ProjectInfo = {
  id: 'prj-pune-nashik-2026',
  name: 'Pune–Nashik Highway Improvement Project (NH-60)',
  identifier: 'NH60-MAH-PKG2',
  roadPackage: 'Package II (Km 40+000 to Km 85+000)',
  relevantSegments: ['Km 40+000 – Km 50+000 (Chakan Bypass)', 'Km 50+000 – Km 65+000 (Rajgurunagar)', 'Km 65+000 – Km 85+000 (Manchar-Alephata)'],
  client: 'National Highways Authority of India (NHAI)',
  location: 'Maharashtra, India',
  startDate: '2025-01-15',
  endDate: '2026-12-31',
  plannedProgress: 72,
  reportedProgress: 68,
  lengthKm: 45,
  totalInspections: 3,
  openFindingsCount: 4,
  highPriorityAwaitingReviewCount: 1,
  overdueActionsCount: 1
}

export const INITIAL_FINDINGS: Finding[] = [
  {
    id: 'fnd-101',
    inspectionId: 'insp-001',
    chainage: 'Km 42+620',
    chainageKm: 42.62,
    segmentLane: 'Right Carriageway (Outer Lane)',
    category: 'Cracking',
    visualEvidence: {
      id: 'ev-101',
      url: DEMO_DEFECT_FIXTURES[1].svgThumbnail,
      filename: 'site_photo_km42_620_crack.jpg',
      sizeBytes: 2450000,
      mimeType: 'image/jpeg',
      uploadedAt: '2026-09-10T10:15:00Z',
      caption: 'Fatigue cracking network on asphalt wearing course'
    },
    severity: 'High',
    uncertainty: 'Low (High Confidence)',
    explanation: 'Interconnected longitudinal fatigue cracking (alligator cracking pattern) along outer wheel path indicating structural fatigue of bituminous layer.',
    recommendedAction: 'Crack sealing with polymer-modified bitumen emulsion; monitor deflection via Falling Weight Deflectometer (FWD).',
    humanReviewStatus: 'Confirmed',
    humanReview: {
      reviewerName: 'Er. Rajesh Kulkarni (Quality Engineer)',
      reviewedAt: '2026-09-10T14:30:00Z',
      originalCategory: 'Cracking',
      finalCategory: 'Cracking',
      originalSeverity: 'High',
      finalSeverity: 'High',
      engineeringNotes: 'Confirmed alligator cracking pattern. Depth does not penetrate WMM base yet. Sealing required before monsoon precipitation.',
      decision: 'Confirmed'
    },
    correctiveAction: {
      id: 'act-101',
      findingId: 'fnd-101',
      title: 'Seal fatigue cracks with polymer-modified emulsion at Km 42+620',
      priority: 'High',
      assignedTo: 'Road Maintenance Crew Alpha (Site Eng. S. Patil)',
      targetDate: '2026-09-18',
      status: 'Action Assigned',
      updatedAt: '2026-09-10T15:00:00Z'
    },
    auditTrail: [
      {
        timestamp: '2026-09-10T10:15:00Z',
        actor: 'JIEOS Vision Engine (Demo Mode)',
        action: 'AI Candidate Finding Flagged',
        details: 'Initial detection: Cracking (High severity, Low uncertainty).'
      },
      {
        timestamp: '2026-09-10T14:30:00Z',
        actor: 'Er. Rajesh Kulkarni (Quality Engineer)',
        action: 'Human Review - Confirmed',
        details: 'Confirmed severity High. Assigned to Maintenance Crew Alpha.'
      }
    ]
  },
  {
    id: 'fnd-102',
    inspectionId: 'insp-001',
    chainage: 'Km 43+150',
    chainageKm: 43.15,
    segmentLane: 'Right Carriageway (Shoulder Edge)',
    category: 'Potholes',
    visualEvidence: {
      id: 'ev-102',
      url: DEMO_DEFECT_FIXTURES[0].svgThumbnail,
      filename: 'site_photo_km43_150_pothole.jpg',
      sizeBytes: 3120000,
      mimeType: 'image/jpeg',
      uploadedAt: '2026-09-10T10:45:00Z',
      caption: 'Severe pothole with subgrade exposure at shoulder edge'
    },
    severity: 'Critical',
    uncertainty: 'Low (High Confidence)',
    explanation: 'Localized bowl-shaped pavement depression exceeding 75mm depth with subgrade exposure. High risk of vehicle tire blowout or suspension damage.',
    recommendedAction: 'Immediate temporary cold-mix patch within 24h; mill and hot-mix asphalt rectification scheduled under traffic diversion.',
    humanReviewStatus: 'Confirmed',
    humanReview: {
      reviewerName: 'Er. Rajesh Kulkarni (Quality Engineer)',
      reviewedAt: '2026-09-10T14:35:00Z',
      originalCategory: 'Potholes',
      finalCategory: 'Potholes',
      originalSeverity: 'Critical',
      finalSeverity: 'Critical',
      engineeringNotes: 'Critical hazard on high-speed corridor. Dispatched emergency maintenance team with cold-mix patching materials.',
      decision: 'Confirmed'
    },
    correctiveAction: {
      id: 'act-102',
      findingId: 'fnd-102',
      title: 'Emergency cold-mix patch & subsequent hot-mix asphalt inlay at Km 43+150',
      priority: 'Critical',
      assignedTo: 'Emergency Rapid Response Unit (Foreman M. Shinde)',
      targetDate: '2026-09-11',
      status: 'In Progress',
      resolutionNotes: 'Temporary cold mix patch installed on 2026-09-10 18:00. Permanent milling and DBM/BC inlay scheduled for night shift.',
      updatedAt: '2026-09-10T18:30:00Z'
    },
    auditTrail: [
      {
        timestamp: '2026-09-10T10:45:00Z',
        actor: 'JIEOS Vision Engine (Demo Mode)',
        action: 'AI Candidate Finding Flagged',
        details: 'Initial detection: Potholes (Critical severity, Low uncertainty).'
      },
      {
        timestamp: '2026-09-10T14:35:00Z',
        actor: 'Er. Rajesh Kulkarni (Quality Engineer)',
        action: 'Human Review - Confirmed',
        details: 'Severity Critical accepted. Emergency response dispatched.'
      },
      {
        timestamp: '2026-09-10T18:30:00Z',
        actor: 'Foreman M. Shinde',
        action: 'Status Update',
        details: 'Temporary cold-mix patch applied. Action marked In Progress.'
      }
    ]
  },
  {
    id: 'fnd-103',
    inspectionId: 'insp-002',
    chainage: 'Km 44+300',
    chainageKm: 44.30,
    segmentLane: 'Left Carriageway (Drain Side)',
    category: 'Waterlogging',
    visualEvidence: {
      id: 'ev-103',
      url: DEMO_DEFECT_FIXTURES[3].svgThumbnail,
      filename: 'site_photo_km44_300_waterlog.jpg',
      sizeBytes: 1980000,
      mimeType: 'image/jpeg',
      uploadedAt: '2026-09-09T11:20:00Z',
      caption: 'Shoulder water ponding and blocked side chute'
    },
    severity: 'Medium',
    uncertainty: 'Moderate',
    explanation: 'Storm water retention on carriageway edge due to blocked transverse drainage chute and uncompacted earthen shoulder slope.',
    recommendedAction: 'Clear debris from concrete side-drain and regrade earthen shoulder slope to 3% outward camber.',
    humanReviewStatus: 'Awaiting Review',
    auditTrail: [
      {
        timestamp: '2026-09-09T11:20:00Z',
        actor: 'JIEOS Vision Engine (Demo Mode)',
        action: 'AI Candidate Finding Flagged',
        details: 'Initial detection: Waterlogging (Medium severity, Moderate uncertainty). Awaiting human review.'
      }
    ]
  },
  {
    id: 'fnd-104',
    inspectionId: 'insp-002',
    chainage: 'Km 44+850',
    chainageKm: 44.85,
    segmentLane: 'Left Carriageway (Inner Lane)',
    category: 'Surface deformation or rutting',
    visualEvidence: {
      id: 'ev-104',
      url: DEMO_DEFECT_FIXTURES[2].svgThumbnail,
      filename: 'site_photo_km44_850_rutting.jpg',
      sizeBytes: 2890000,
      mimeType: 'image/jpeg',
      uploadedAt: '2026-09-09T12:00:00Z',
      caption: 'Wheelpath rutting (22mm measured depth)'
    },
    severity: 'High',
    uncertainty: 'Moderate',
    explanation: 'Longitudinal surface depression along heavy vehicle wheel tracks with slight lateral shoving. Depth approximately 22mm.',
    recommendedAction: 'Verify binder course stability; check axle load compliance; schedule surface profiling/micro-surfacing.',
    humanReviewStatus: 'Confirmed',
    humanReview: {
      reviewerName: 'Er. Rajesh Kulkarni (Quality Engineer)',
      reviewedAt: '2026-09-09T15:10:00Z',
      originalCategory: 'Surface deformation or rutting',
      finalCategory: 'Surface deformation or rutting',
      originalSeverity: 'High',
      finalSeverity: 'High',
      engineeringNotes: 'Straightedge test confirmed 22mm rut. Micro-surfacing executed under preventive maintenance schedule.',
      decision: 'Confirmed'
    },
    correctiveAction: {
      id: 'act-104',
      findingId: 'fnd-104',
      title: 'Micro-surfacing surface profiling at Km 44+850',
      priority: 'High',
      assignedTo: 'Specialized Surfacing Team (Eng. A. Deshmukh)',
      targetDate: '2026-09-14',
      status: 'Verified Closed',
      resolutionNotes: 'Micro-surfacing completed on 2026-09-13. Residual rut depth under 4mm. Straightedge test verified.',
      verifiedBy: 'Er. Rajesh Kulkarni (Quality Engineer)',
      verifiedAt: '2026-09-14T09:00:00Z',
      updatedAt: '2026-09-14T09:00:00Z'
    },
    auditTrail: [
      {
        timestamp: '2026-09-09T12:00:00Z',
        actor: 'JIEOS Vision Engine (Demo Mode)',
        action: 'AI Candidate Finding Flagged',
        details: 'Initial detection: Surface deformation or rutting (High severity).'
      },
      {
        timestamp: '2026-09-09T15:10:00Z',
        actor: 'Er. Rajesh Kulkarni (Quality Engineer)',
        action: 'Human Review - Confirmed',
        details: 'Confirmed and scheduled for micro-surfacing.'
      },
      {
        timestamp: '2026-09-14T09:00:00Z',
        actor: 'Er. Rajesh Kulkarni (Quality Engineer)',
        action: 'Action Verified Closed',
        details: 'Post-rectification inspection passed. Status verified closed.'
      }
    ]
  },
  {
    id: 'fnd-105',
    inspectionId: 'insp-003',
    chainage: 'Km 46+200',
    chainageKm: 46.20,
    segmentLane: 'Center Median Delineation',
    category: 'Damaged or faded road markings',
    visualEvidence: {
      id: 'ev-105',
      url: DEMO_DEFECT_FIXTURES[4].svgThumbnail,
      filename: 'site_photo_km46_200_markings.jpg',
      sizeBytes: 1650000,
      mimeType: 'image/jpeg',
      uploadedAt: '2026-09-08T16:00:00Z',
      caption: 'Thermoplastic center lane delineation worn below retroreflective threshold'
    },
    severity: 'Low',
    uncertainty: 'Low (High Confidence)',
    explanation: 'Center lane delineation line retroreflectivity severely degraded below IRC 35:2015 threshold (below 100 mcd/m²/lux).',
    recommendedAction: 'Repaint thermoplastic road markings with retroreflective glass beads within next maintenance window.',
    humanReviewStatus: 'Corrected',
    humanReview: {
      reviewerName: 'Er. Rajesh Kulkarni (Quality Engineer)',
      reviewedAt: '2026-09-08T18:00:00Z',
      originalCategory: 'Damaged or faded road markings',
      finalCategory: 'Damaged or faded road markings',
      originalSeverity: 'Medium',
      finalSeverity: 'Low',
      engineeringNotes: 'Adjusted severity to Low because street lighting along this bypass section provides sufficient nighttime visibility until next painting campaign.',
      decision: 'Severity Changed'
    },
    correctiveAction: {
      id: 'act-105',
      findingId: 'fnd-105',
      title: 'Thermoplastic repaint at Km 46+200 to Km 47+000',
      priority: 'Low',
      assignedTo: 'Road Safety & Furniture Contractor',
      targetDate: '2026-09-25',
      status: 'Action Assigned',
      updatedAt: '2026-09-08T18:30:00Z'
    },
    auditTrail: [
      {
        timestamp: '2026-09-08T16:00:00Z',
        actor: 'JIEOS Vision Engine (Demo Mode)',
        action: 'AI Candidate Finding Flagged',
        details: 'Initial detection: Damaged or faded road markings (Medium severity).'
      },
      {
        timestamp: '2026-09-08T18:00:00Z',
        actor: 'Er. Rajesh Kulkarni (Quality Engineer)',
        action: 'Human Review - Severity Corrected',
        details: 'Severity changed from Medium to Low with engineering justification.'
      }
    ]
  }
]

export const DEMO_ROAD_INSPECTIONS: RoadInspection[] = [
  {
    id: 'insp-001',
    projectId: 'prj-pune-nashik-2026',
    roadPackage: 'Package II (Km 40+000 to Km 85+000)',
    chainageStart: 'Km 42+500',
    chainageEnd: 'Km 43+500',
    chainageStartKm: 42.5,
    chainageEndKm: 43.5,
    roadSegment: 'Km 40+000 – Km 50+000 (Chakan Bypass)',
    lane: 'Right Carriageway (Both Lanes)',
    date: '2026-09-10',
    time: '10:00',
    gpsCoordinates: { lat: 18.7523, lng: 73.8564 },
    weather: 'Sunny, 32°C',
    surfaceCondition: 'Dry, asphalt wearing course under traffic',
    inspectorName: 'Er. Sneha Verma (Site Engineer)',
    description: 'Routine post-monsoon pavement condition survey along Chakan bypass section.',
    evidenceAssets: [INITIAL_FINDINGS[0].visualEvidence, INITIAL_FINDINGS[1].visualEvidence],
    findings: [INITIAL_FINDINGS[0], INITIAL_FINDINGS[1]],
    createdAt: '2026-09-10T10:15:00Z'
  },
  {
    id: 'insp-002',
    projectId: 'prj-pune-nashik-2026',
    roadPackage: 'Package II (Km 40+000 to Km 85+000)',
    chainageStart: 'Km 44+100',
    chainageEnd: 'Km 45+000',
    chainageStartKm: 44.1,
    chainageEndKm: 45.0,
    roadSegment: 'Km 40+000 – Km 50+000 (Chakan Bypass)',
    lane: 'Left Carriageway (Drain Side & Inner Lane)',
    date: '2026-09-09',
    time: '11:00',
    gpsCoordinates: { lat: 18.7611, lng: 73.8619 },
    weather: 'Cloudy, 28°C',
    surfaceCondition: 'Damp shoulder, dry carriageway',
    inspectorName: 'Er. Sneha Verma (Site Engineer)',
    description: 'Post-shower drainage and surface distress inspection.',
    evidenceAssets: [INITIAL_FINDINGS[2].visualEvidence, INITIAL_FINDINGS[3].visualEvidence],
    findings: [INITIAL_FINDINGS[2], INITIAL_FINDINGS[3]],
    createdAt: '2026-09-09T11:20:00Z'
  },
  {
    id: 'insp-003',
    projectId: 'prj-pune-nashik-2026',
    roadPackage: 'Package II (Km 40+000 to Km 85+000)',
    chainageStart: 'Km 46+000',
    chainageEnd: 'Km 47+000',
    chainageStartKm: 46.0,
    chainageEndKm: 47.0,
    roadSegment: 'Km 40+000 – Km 50+000 (Chakan Bypass)',
    lane: 'Median & Dual Lanes',
    date: '2026-09-08',
    time: '15:30',
    gpsCoordinates: { lat: 18.7754, lng: 73.8712 },
    weather: 'Sunny, 30°C',
    surfaceCondition: 'Dry',
    inspectorName: 'Er. Amit Sharma (Junior Engineer)',
    description: 'Road furniture, signboards, and thermoplastic marking compliance survey.',
    evidenceAssets: [INITIAL_FINDINGS[4].visualEvidence],
    findings: [INITIAL_FINDINGS[4]],
    createdAt: '2026-09-08T16:00:00Z'
  }
]

export function exportFindingsToCSV(findings: Finding[], project: typeof DEMO_PROJECT): string {
  const headers = [
    'Finding ID',
    'Project',
    'Road Package',
    'Chainage',
    'Segment/Lane',
    'Defect Category',
    'Severity',
    'Uncertainty Rating',
    'Review Status',
    'Reviewer Decision',
    'Reviewer Name',
    'Corrective Action',
    'Action Priority',
    'Assigned To',
    'Action Status',
    'Target Completion Date',
    'Evidence Filename',
    'Engineering Notes'
  ]

  const rows = findings.map(f => {
    const r = f.humanReview
    const a = f.correctiveAction
    return [
      `"${f.id}"`,
      `"${project.name}"`,
      `"${project.chainageStart} to ${project.chainageEnd}"`,
      `"${f.chainage}"`,
      `"${f.segmentLane}"`,
      `"${f.category}"`,
      `"${f.severity}"`,
      `"${f.uncertainty}"`,
      `"${f.humanReviewStatus}"`,
      `"${r?.decision || 'Pending Review'}"`,
      `"${r?.reviewerName || 'Unassigned'}"`,
      `"${(a?.title || f.recommendedAction || '').replace(/"/g, '""')}"`,
      `"${a?.priority || f.severity}"`,
      `"${a?.assignedTo || 'Unassigned'}"`,
      `"${a?.status || 'Awaiting Review'}"`,
      `"${a?.targetDate || 'TBD'}"`,
      `"${f.visualEvidence?.filename || 'N/A'}"`,
      `"${(r?.engineeringNotes || f.explanation || '').replace(/"/g, '""')}"`
    ].join(',')
  })

  return [headers.join(','), ...rows].join('\r\n')
}