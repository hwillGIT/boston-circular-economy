/**
 * Activities and Impact Stats API resource for Boston Circular Economy.
 * @module api/activities
 */

import type { Activity, ImpactStats } from '../types';
import { API_BASE, fetchJSON } from './client';

/* ── Activities ── */

/**
 * Fetches all global activities from the API.
 * @category Client
 * @returns A promise that resolves to an array of activities.
 * @example
 * const activities = await getActivities();
 */
export async function getActivities(): Promise<Activity[]> {
  const res = await fetchJSON<{ data: Activity[] }>(`${API_BASE}/activities`);
  return res.data;
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
  });
  return res.data;
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
  const res = await fetchJSON<{ data: ImpactStats }>(`${API_BASE}/activities/stats`);
  return res.data;
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
    { items_diverted: 0, co2_prevented: 0, money_saved: 0, credits_earned: 0 },
  );
}
