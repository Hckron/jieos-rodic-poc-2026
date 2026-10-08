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
