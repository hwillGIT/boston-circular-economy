/**
 * Locations API resource for Boston Circular Economy.
 * @module api/locations
 */

import type { LocationRaw, Location } from '../types';
import { normalizeLocation } from '../types';
import { API_BASE, fetchJSON, type PaginatedResponse } from './client';

/**
 * Optional filters for querying locations.
 * @category Client
 */
export interface LocationFilters {
  page?: number;
  limit?: number;
  activity?: string;
  category?: string;
  data_source?: string;
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
  filters: LocationFilters = {},
): Promise<{ data: Location[]; meta: { page: number; limit: number; total: number } }> {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.activity) params.set('activity', filters.activity);
  if (filters.category) params.set('category', filters.category);
  if (filters.data_source) params.set('data_source', filters.data_source);

  const qs = params.toString();
  const raw = await fetchJSON<PaginatedResponse<LocationRaw>>(
    `${API_BASE}/locations${qs ? '?' + qs : ''}`,
  );

  return {
    data: raw.data.map(normalizeLocation),
    meta: raw.meta,
  };
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
  const res = await getLocations({ limit: 100, page: 1 });
  const all: Location[] = [...res.data];
  const totalPages = Math.ceil(res.meta.total / 100);

  if (totalPages > 1) {
    const promises = Array.from({ length: totalPages - 1 }, (_, i) =>
      getLocations({ limit: 100, page: i + 2 }),
    );
    const results = await Promise.all(promises);
    for (const r of results) {
      all.push(...r.data);
    }
  }

  return all;
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
  const raw = await fetchJSON<{ data: LocationRaw }>(`${API_BASE}/locations/${id}`);
  return normalizeLocation(raw.data);
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
  radiusM: number = 2000,
): Promise<Location[]> {
  const raw = await fetchJSON<{ data: LocationRaw[] }>(
    `${API_BASE}/locations/nearby?lat=${lat}&lng=${lng}&radius_m=${radiusM}`,
  );
  return raw.data.map(normalizeLocation);
}
