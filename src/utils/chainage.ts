/**
 * Chainage formatting, parsing, and validation utility for road infrastructure inspections.
 * Complies with standard Indian road construction notation (e.g., "Km 42+500").
 */

export interface ChainageValidationResult {
  valid: boolean
  error?: string
  startMeters?: number
  endMeters?: number
  startKm?: number
  endKm?: number
}

/**
 * Parses a chainage string into total meters.
 * Accepts formats like:
 * - "Km 42+500" or "km 42+500"
 * - "42+500"
 * - "42.5" (as km)
 * - "42500" (as meters if > 200, otherwise km)
 */
export function parseChainageToMeters(input: string): number | null {
  if (!input || typeof input !== 'string') return null
  const cleaned = input.trim().replace(/^km\s*/i, '').replace(/,/g, '')
  if (!cleaned) return null

  // Pattern: "42+500" or "42 + 500"
  const plusMatch = cleaned.match(/^(\d+)\s*\+\s*(\d+)$/)
  if (plusMatch) {
    const km = parseInt(plusMatch[1], 10)
    const m = parseInt(plusMatch[2], 10)
    if (isNaN(km) || isNaN(m) || m >= 1000) return null
    return km * 1000 + m
  }

  // Pattern: decimal km e.g. "42.5" -> 42500m
  const decimalMatch = cleaned.match(/^(\d+)\.(\d{1,3})$/)
  if (decimalMatch) {
    const km = parseInt(decimalMatch[1], 10)
    const fracStr = decimalMatch[2].padEnd(3, '0')
    const m = parseInt(fracStr, 10)
    return km * 1000 + m
  }

  // Pure integer meters e.g. "42500"
  const intMatch = cleaned.match(/^(\d+)$/)
  if (intMatch) {
    const val = parseInt(intMatch[1], 10)
    // If <= 150 assume km, else assume meters
    if (val <= 150) {
      return val * 1000
    }
    return val
  }

  return null
}

/**
 * Formats total meters into standard "Km 42+500" format.
 */
export function formatChainageFromMeters(meters: number): string {
  if (isNaN(meters) || meters < 0) return 'Km 0+000'
  const km = Math.floor(meters / 1000)
  const remainderM = Math.round(meters % 1000)
  return `Km ${km}+${remainderM.toString().padStart(3, '0')}`
}

/**
 * Validates a start and end chainage pair for road inspections.
 * Does not silently correct invalid measurements or accept inconsistent start and end values.
 */
export function validateChainageRange(startInput: string, endInput: string): ChainageValidationResult {
  if (!startInput || !startInput.trim()) {
    return { valid: false, error: 'Start chainage is required' }
  }
  if (!endInput || !endInput.trim()) {
    return { valid: false, error: 'End chainage is required' }
  }

  const startMeters = parseChainageToMeters(startInput)
  if (startMeters === null) {
    return {
      valid: false,
      error: `Invalid start chainage format "${startInput}". Expected format like "Km 42+500" or "42+500"`
    }
  }

  const endMeters = parseChainageToMeters(endInput)
  if (endMeters === null) {
    return {
      valid: false,
      error: `Invalid end chainage format "${endInput}". Expected format like "Km 42+750" or "42+750"`
    }
  }

  if (startMeters < 0) {
    return { valid: false, error: 'Start chainage cannot be negative' }
  }

  if (endMeters < startMeters) {
    return {
      valid: false,
      error: `End chainage (${formatChainageFromMeters(endMeters)}) cannot be before start chainage (${formatChainageFromMeters(startMeters)})`
    }
  }

  // Maximum single inspection segment length check (e.g. 5km)
  const maxSegmentMeters = 10000 // 10 km
  if (endMeters - startMeters > maxSegmentMeters) {
    return {
      valid: false,
      error: `Inspection segment length (${((endMeters - startMeters) / 1000).toFixed(2)} km) exceeds maximum single inspection limit of 10 km`
    }
  }

  return {
    valid: true,
    startMeters,
    endMeters,
    startKm: startMeters / 1000,
    endKm: endMeters / 1000
  }
}
