import { DailyLog } from '../types'

// Interface for AI response
export interface AIAnalysis {
  summary: string
  risks: Array<{
    category: string
    severity: 'Low' | 'Medium' | 'High' | 'Critical'
    impact: string
    action: string
  }>
  managementSummary: string[]
}

// Simple deterministic analysis for demo mode
export function analyzeDailyLogDemo(log: DailyLog): AIAnalysis {
  const risks: AIAnalysis['risks'] = []
  
  // Calculate completion percentage
  const completionPct = log.plannedQty > 0 ? (log.actualQty / log.plannedQty) * 100 : 0
  
  // Risk detection based on completion and issues
  if (log.issue.trim() !== '') {
    let severity: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium'
    if (log.issue.toLowerCase().includes('supply') || log.issue.toLowerCase().includes('breakdown')) {
      severity = 'High'
    }
    if (log.issue.toLowerCase().includes('heavy rain') || log.issue.toLowerCase().includes('waterlogging')) {
      severity = 'Medium'
    }
    
    risks.push({
      category: 'Site Issue',
      severity,
      impact: `Activity progress affected: ${completionPct.toFixed(0)}% of planned quantity completed`,
      action: `Address root cause: ${log.issue}. Monitor resolution and adjust resources accordingly.`
    })
  }
  
  // Productivity risk
  if (completionPct < 70) {
    risks.push({
      category: 'Productivity Decline',
      severity: completionPct < 50 ? 'High' : 'Medium',
      impact: `Only ${completionPct.toFixed(0)}% of planned quantity achieved`,
      action: 'Investigate root causes: manpower, equipment, material availability, or site conditions. Adjust plan for next shift.'
    })
  } else if (completionPct > 95) {
    // Over-achievement might indicate under-planning
    risks.push({
      category: 'Planning Variance',
      severity: 'Low',
      impact: `Achieved ${completionPct.toFixed(0)}% of planned quantity - consider adjusting future targets`,
      action: 'Review planning assumptions for similar activities to improve estimate accuracy.'
    })
  }
  
  // Material-specific risks
  if (log.material.includes('WMM') && completionPct < 75) {
    risks.push({
      category: 'Material Supply Risk',
      severity: 'High',
      impact: 'WMM supply inconsistent affecting sub-base progress',
      action: 'Confirm daily delivery schedule with supplier; maintain buffer stock at site.'
    })
  }
  
  if (log.material.includes('Bitumen') && completionPct < 80) {
    risks.push({
      category: 'Material Supply Risk',
      severity: 'Critical',
      impact: 'Bitumen supply disruption affects asphalt works',
      action: 'Secure alternative supplier; check tanker availability for emergency delivery.'
    })
  }
  
  // Weather risks
  if (log.weather.toLowerCase().includes('rain') || log.weather.toLowerCase().includes('waterlogging')) {
    risks.push({
      category: 'Weather Impact',
      severity: log.weather.toLowerCase().includes('heavy') ? 'High' : 'Medium',
      impact: 'Weather conditions affecting work progress and quality',
      action: 'Implement weather protection measures; adjust schedule based on forecast; ensure proper drainage.'
    })
  }
  
  // Equipment risks (inferred from issue or low completion with equipment mention)
  if ((log.issue.toLowerCase().includes('breakdown') || log.issue.toLowerCase().includes('plant')) && completionPct < 80) {
    risks.push({
      category: 'Equipment Reliability',
      severity: 'High',
      impact: 'Equipment downtime affecting production',
      action: 'Review maintenance schedules; ensure backup equipment availability; conduct root cause analysis.'
    })
  }
  
  // Default risk if none detected but still worth noting
  if (risks.length === 0) {
    risks.push({
      category: 'Progress Monitoring',
      severity: 'Low',
      impact: `Activity progressing at ${completionPct.toFixed(0)}% of plan`,
      action: 'Continue current execution; monitor for any deviations; report any emerging issues promptly.'
    })
  }
  
  // Generate management summary
  const managementSummary = [
    `Activity: ${log.activity} at ${log.chainage}`,
    `Progress: ${log.actualQty} ${log.unit} (${completionPct.toFixed(0)}% of planned ${log.plannedQty} ${log.unit})`,
    log.issue.trim() !== '' ? `Issue: ${log.issue}` : 'No significant issues reported',
    `Manpower: ${log.manpower} workers | Equipment: ${log.equipment}`,
    `Weather: ${log.weather}`
  ].filter(Boolean)
  
  // Generate executive summary
  let summary = `${log.activity} progress at ${completionPct.toFixed(0)}% of plan. `
  if (log.issue.trim() !== '') {
    summary += `Issue noted: ${log.issue}. `
  }
  summary += `Weather: ${log.weather}. `
  if (completionPct >= 90) {
    summary += 'Excellent progress maintained.'
  } else if (completionPct >= 70) {
    summary += 'Satisfactory progress with minor constraints.'
  } else if (completionPct >= 50) {
    summary += 'Progress below target requiring attention.'
  } else {
    summary += 'Significant shortfall requiring immediate intervention.'
  }
  
  return {
    summary,
    risks,
    managementSummary
  }
}

// Mock Gemini API call - in real implementation this would be a server-side call
export async function analyzeWithGemini(log: DailyLog): Promise<AIAnalysis> {
  // In production, this would make an actual API call to Gemini
  // For this PoC, we'll use the deterministic analysis but note it's demo mode
  // Real implementation would be in a backend service that keeps API key secure
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // For now, return demo analysis - real implementation would call Gemini
  return analyzeDailyLogDemo(log)
}

// Main analysis function that chooses mode based on API key availability
export async function analyzeDailyLog(log: DailyLog): Promise<AIAnalysis> {
  // PoC mode: server-side Gemini call is not implemented in this client-side build.
  // The secure architecture design is: frontend → /api/analyze → Gemini → validated response.
  // For this PoC submission, deterministic Demo AI Mode is always active (no secret in frontend).
  return analyzeDailyLogDemo(log)
}