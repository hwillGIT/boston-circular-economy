/* ── API Client for Boston Circular Economy ── */
/* Fetches raw data from backend, transforms to UI types */

import type { LocationRaw, Location, Activity, ImpactStats } from './types'
import { normalizeLocation } from './types'

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1'

interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
  }
}

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`API ${res.status}: ${res.statusText} — ${body}`)
  }
  return res.json()
}

/* ── Locations ── */

/**
 * Optional filters for querying locations.
 * @category Client
 */
export interface LocationFilters {
  page?: number
  limit?: number
  activity?: string
  category?: string
  data_source?: string
}

/**
 * Fetches a paginated list of locations based on provided filters.
 * @category Client
 * @param filters - The filters to apply (page, limit, activity, category, data_source).
 * @returns A promise that resolves to paginated locations and metadata.
 * @example
 * const { data, meta } = await getLocations({ page: 1, limit: 10, activity: 'repair' });
 */
export async function getLocations(
  filters: LocationFilters = {}
): Promise<{ data: Location[]; meta: { page: number; limit: number; total: number } }> {
  const params = new URLSearchParams()
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.activity) params.set('activity', filters.activity)
  if (filters.category) params.set('category', filters.category)
  if (filters.data_source) params.set('data_source', filters.data_source)

  const qs = params.toString()
  const raw = await fetchJSON<PaginatedResponse<LocationRaw>>(
    `${API_BASE}/locations${qs ? '?' + qs : ''}`
  )

  return {
    data: raw.data.map(normalizeLocation),
    meta: raw.meta,
  }
}

/**
 * Fetches all locations by iterating through all pages of the locations API.
 * @category Client
 * @returns A promise that resolves to an array of all locations.
 * @see getLocations
 * @example
 * const allLocations = await getAllLocations();
 */
export async function getAllLocations(): Promise<Location[]> {
  const res = await getLocations({ limit: 100, page: 1 })
  const all: Location[] = [...res.data]
  const totalPages = Math.ceil(res.meta.total / 100)

  if (totalPages > 1) {
    const promises = Array.from({ length: totalPages - 1 }, (_, i) =>
      getLocations({ limit: 100, page: i + 2 })
    )
    const results = await Promise.all(promises)
    for (const r of results) {
      all.push(...r.data)
    }
  }

  return all
}

/**
 * Fetches a single location by its unique ID.
 * @category Client
 * @param id - The unique identifier of the location.
 * @returns A promise that resolves to the normalized location.
 * @example
 * const location = await getLocation(123);
 */
export async function getLocation(id: number): Promise<Location> {
  const raw = await fetchJSON<{ data: LocationRaw }>(
    `${API_BASE}/locations/${id}`
  )
  return normalizeLocation(raw.data)
}

/**
 * Fetches locations within a specific radius of a given latitude and longitude.
 * @category Client
 * @param lat - The latitude coordinate.
 * @param lng - The longitude coordinate.
 * @param radiusM - The search radius in meters (defaults to 2000).
 * @returns A promise that resolves to an array of nearby locations.
 * @example
 * const nearby = await getNearbyLocations(42.3601, -71.0589, 5000);
 */
export async function getNearbyLocations(
  lat: number,
  lng: number,
  radiusM: number = 2000
): Promise<Location[]> {
  const raw = await fetchJSON<{ data: LocationRaw[] }>(
    `${API_BASE}/locations/nearby?lat=${lat}&lng=${lng}&radius_m=${radiusM}`
  )
  return raw.data.map(normalizeLocation)
}

/* ── Activities ── */

/**
 * Fetches all global activities from the API.
 * @category Client
 * @returns A promise that resolves to an array of activities.
 * @example
 * const activities = await getActivities();
 */
export async function getActivities(): Promise<Activity[]> {
  const res = await fetchJSON<{ data: Activity[] }>(`${API_BASE}/activities`)
  return res.data
}

/**
 * Logs a new activity to the API.
 * @category Client
 * @param activity - The activity data to log (without the ID).
 * @returns A promise that resolves to the created activity.
 * @example
 * const newActivity = await logActivity({ type: 'repair', co2_saved: 5 });
 */
export async function logActivity(activity: Omit<Activity, 'id'>): Promise<Activity> {
  const res = await fetchJSON<{ data: Activity }>(`${API_BASE}/activities`, {
    method: 'POST',
    body: JSON.stringify(activity),
  })
  return res.data
}

/* ── Impact Stats ── */

/**
 * Fetches aggregated impact statistics from the API.
 * @category Client
 * @returns A promise that resolves to the impact statistics.
 * @example
 * const stats = await getImpactStats();
 */
export async function getImpactStats(): Promise<ImpactStats> {
  const res = await fetchJSON<{ data: ImpactStats }>(`${API_BASE}/activities/stats`)
  return res.data
}

/**
 * Computes impact statistics locally from a given array of activities.
 * @category Client
 * @param activities - The array of activities to process.
 * @returns The computed impact statistics.
 * @example
 * const stats = computeImpactStats([{ items_diverted: 1, co2_prevented: 5, money_saved: 10, credits_earned: 5 }]);
 */
export function computeImpactStats(activities: Activity[]): ImpactStats {
  return activities.reduce(
    (acc, a) => ({
      items_diverted: acc.items_diverted + 1,
      co2_prevented: acc.co2_prevented + (a.co2_saved || 0),
      money_saved: acc.money_saved + (a.savings || 0),
      credits_earned: acc.credits_earned + (a.credits || 0),
    }),
    { items_diverted: 0, co2_prevented: 0, money_saved: 0, credits_earned: 0 }
  )
}

/* ── Health Check ── */

/**
 * Checks the health of the API server by pinging the root endpoint.
 * @category Client
 * @returns A promise that resolves to true if the API is reachable, false otherwise.
 * @example
 * const isHealthy = await healthCheck();
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await fetchJSON(`${API_BASE.replace('/api/v1', '')}/`)
    return true
  } catch {
    return false
  }
}
