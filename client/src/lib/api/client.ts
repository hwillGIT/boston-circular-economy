/**
 * Core HTTP layer for Boston Circular Economy API.
 * @module api/client
 */

export const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${res.statusText} — ${body}`);
  }
  return res.json();
}

/**
 * Checks the health of the API server by pinging the root endpoint.
 * @category Client
 * @returns A promise that resolves to true if the API is reachable, false otherwise.
 * @example
 * const isHealthy = await healthCheck();
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await fetchJSON(`${API_BASE.replace('/api/v1', '')}/`);
    return true;
  } catch {
    return false;
  }
}
