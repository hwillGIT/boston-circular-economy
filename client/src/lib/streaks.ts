/**
 * Represents the user's activity streak data over time.
 * @category Client
 */
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveWeek: string;
  weeklyHistory: string[];
}

const STREAK_KEY = 'bce_eco_streak';

/**
 * Calculates the current week formatted as a YYYY-Www string.
 * @category Client
 * @returns The ISO-like week string for the current date (e.g., "2026-W30").
 * @example
 * const week = getCurrentWeek();
 */
export function getCurrentWeek(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo}`;
}

/**
 * Retrieves the user's streak data from local storage.
 * @category Client
 * @returns The parsed streak data, or a default initialized object if not found.
 * @example
 * const streak = getStreakData();
 */
export function getStreakData(): StreakData {
  const data = localStorage.getItem(STREAK_KEY);
  if (data) {
    return JSON.parse(data);
  }
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveWeek: '',
    weeklyHistory: [],
  };
}

/**
 * Records an activity for the current week, updating and saving streak data.
 * Extends the current streak if consecutive, or resets it if a week was missed.
 * @category Client
 * @returns The newly updated streak data.
 * @see getStreakData
 * @example
 * const updatedStreak = recordActivity();
 */
export function recordActivity(): StreakData {
  const data = getStreakData();
  const currentWeek = getCurrentWeek();

  if (data.lastActiveWeek === currentWeek) {
    return data;
  }

  // Calculate if the streak continues
  let streakContinues = false;
  if (data.lastActiveWeek) {
    const [lastYear, lastWeek] = data.lastActiveWeek.split('-W').map(Number);
    const [currYear, currWeek] = currentWeek.split('-W').map(Number);
    
    // Very basic check for consecutive weeks
    if (currYear === lastYear && currWeek === lastWeek + 1) {
      streakContinues = true;
    } else if (currYear === lastYear + 1 && lastWeek >= 52 && currWeek === 1) {
      streakContinues = true;
    }
  }

  data.currentStreak = streakContinues ? data.currentStreak + 1 : 1;
  data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
  data.lastActiveWeek = currentWeek;
  
  if (!data.weeklyHistory.includes(currentWeek)) {
    data.weeklyHistory.push(currentWeek);
  }
  
  localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  return data;
}
