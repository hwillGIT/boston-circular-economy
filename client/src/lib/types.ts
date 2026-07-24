/* ── Shared Types for Boston Circular Economy ── */
/* Data-driven: the app renders whatever the API returns */

/** Raw location record from the API */
export interface LocationRaw {
  id: number
  data_source_id: string
  data_source: string
  name: string
  lat: number
  lon: number
  street?: string
  city?: string
  state?: string
  postcode?: string
  phone?: string
  website?: string
  opening_hours?: string
  rating?: number
  review_count?: number
  is_active: number
  created_at: string
  updated_at: string
  // Joined from services table on detail endpoint
  services?: Service[]
}

/** Service record from the API */
export interface Service {
  id: number
  location_id: number
  activity: string
  item_category: string
  cost_tier?: string
  description?: string
}

/** Normalized location for the UI (transformed from LocationRaw) */
export interface Location {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  type: string
  activities: string[]
  cost_tier?: string
  hours?: string
  phone?: string
  website?: string
  rating?: number
  review_count?: number
  description?: string
  features?: string[]
  source?: string
  co2_saved?: number
  credits?: number
  helped_count?: number
  mbta_line?: string
  mbta_station?: string
  walk_minutes?: number
  material_categories?: string[]
}

/** Transform a raw API location to the UI location type */
export function normalizeLocation(raw: LocationRaw): Location {
  const addressParts = [raw.street, raw.city, raw.state, raw.postcode].filter(Boolean)
  const activities = raw.services
    ? [...new Set(raw.services.map(s => s.activity))]
    : []
  const costTier = raw.services?.find(s => s.cost_tier)?.cost_tier

  return {
    id: raw.id,
    name: raw.name || 'Unknown Location',
    address: addressParts.join(', ') || 'Address not available',
    lat: raw.lat,
    lng: raw.lon, // API uses 'lon', UI uses 'lng'
    type: inferType(raw),
    activities,
    cost_tier: costTier,
    hours: raw.opening_hours,
    phone: raw.phone,
    website: raw.website,
    rating: raw.rating,
    review_count: raw.review_count,
    source: raw.data_source,
  }
}

/** Infer location type from data source */
function inferType(raw: LocationRaw): string {
  if (raw.data_source === 'bcyf' || raw.name?.toLowerCase().includes('bcyf')) {
    return 'bcyf'
  }
  // Check if any service is free
  if (raw.services?.some(s => s.cost_tier === 'free')) {
    return 'community'
  }
  if (raw.services?.some(s => s.cost_tier === 'paid')) {
    return 'professional'
  }
  // Default based on data source
  if (raw.data_source === 'openstreetmap') return 'community'
  return 'community'
}

/** An activity log entry */
export interface Activity {
  id: number
  date: string
  action: string
  item: string
  location_id?: number
  location_name?: string
  co2_saved: number
  savings: number
  credits: number
  notes?: string
}

/** Aggregated impact statistics */
export interface ImpactStats {
  items_diverted: number
  co2_prevented: number
  money_saved: number
  credits_earned: number
}

/** MBTA transit line filter option */
export interface MBTALine {
  key: string
  label: string
  color: string
}

export const MBTA_LINES: MBTALine[] = [
  { key: 'all', label: 'All MBTA Lines', color: '#64748B' },
  { key: 'orange', label: 'Orange Line', color: '#ED8B00' },
  { key: 'red', label: 'Red Line', color: '#DA291C' },
  { key: 'green', label: 'Green Line', color: '#00843D' },
  { key: 'blue', label: 'Blue Line', color: '#003DA5' },
  { key: 'mattapan', label: 'Mattapan Trolley', color: '#DA291C' },
]

/** Map marker color scheme by location type */
export const MARKER_COLORS: Record<string, string> = {
  community: '#059669',
  professional: '#3B82F6',
  bcyf: '#7C3AED',
  default: '#64748B',
}

/** Map marker labels for legend */
export const MARKER_LABELS: Record<string, string> = {
  community: 'Free / Community',
  professional: 'Paid / Professional',
  bcyf: 'BCYF Center',
}
