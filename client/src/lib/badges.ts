import { getStreakData } from './streaks';
// We don't have access to the full activities list here synchronously, so we will pass counts to getEarnedBadges

/**
 * Represents an achievable badge for user gamification.
 * @category Client
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  threshold: number;
  category: 'items' | 'streak' | 'co2' | 'special';
}

/**
 * List of all available badges in the system with their thresholds and categories.
 * @category Client
 */
export const BADGES: Badge[] = [
  {
    id: 'first_action',
    name: 'First Step',
    description: 'Log your first activity',
    emoji: '🌱',
    threshold: 1,
    category: 'items',
  },
  {
    id: 'five_items',
    name: 'Getting Started',
    description: 'Divert 5 items',
    emoji: '⭐',
    threshold: 5,
    category: 'items',
  },
  {
    id: 'ten_items',
    name: 'Eco Warrior',
    description: 'Divert 10 items',
    emoji: '🏅',
    threshold: 10,
    category: 'items',
  },
  {
    id: 'twenty_five',
    name: 'Community Hero',
    description: 'Divert 25 items',
    emoji: '🚀',
    threshold: 25,
    category: 'items',
  },
  {
    id: 'fifty_items',
    name: 'Circular Champion',
    description: 'Divert 50 items',
    emoji: '👑',
    threshold: 50,
    category: 'items',
  },
  {
    id: 'hundred_items',
    name: 'Legend',
    description: 'Divert 100 items',
    emoji: '🌟',
    threshold: 100,
    category: 'items',
  },
  {
    id: 'week_streak_4',
    name: 'Consistent',
    description: '4 week eco-streak',
    emoji: '🔥',
    threshold: 4,
    category: 'streak',
  },
  {
    id: 'week_streak_12',
    name: 'Dedicated',
    description: '12 week eco-streak',
    emoji: '🌋',
    threshold: 12,
    category: 'streak',
  },
  {
    id: 'co2_50',
    name: 'Carbon Cutter',
    description: 'Prevent 50 lbs CO₂',
    emoji: '🌍',
    threshold: 50,
    category: 'co2',
  },
  {
    id: 'repairer',
    name: 'Fix-It Pro',
    description: 'Log 5 repairs',
    emoji: '🔧',
    threshold: 5,
    category: 'special',
  },
];

/**
 * Calculates which badges a user has earned based on their activity totals.
 * @category Client
 * @param items - Total items diverted by the user.
 * @param co2 - Total CO2 prevented by the user in lbs.
 * @param repairs - Total repair actions logged by the user.
 * @returns An array of earned badge IDs.
 * @see BADGES
 * @example
 * const earned = getEarnedBadges(10, 55, 1);
 */
export function getEarnedBadges(items: number, co2: number, repairs: number): string[] {
  const streak = getStreakData().longestStreak;
  const earned: string[] = [];

  for (const badge of BADGES) {
    let value = 0;
    if (badge.category === 'items') value = items;
    if (badge.category === 'streak') value = streak;
    if (badge.category === 'co2') value = co2;
    if (badge.id === 'repairer') value = repairs;

    if (value >= badge.threshold) {
      earned.push(badge.id);
    }
  }
  return earned;
}

/**
 * Determines the next closest badge a user can earn based on their current progress.
 * @category Client
 * @param items - Total items diverted by the user.
 * @param co2 - Total CO2 prevented by the user in lbs.
 * @param repairs - Total repair actions logged by the user.
 * @returns The closest unearned badge with progress details, or null if all badges are earned.
 * @see getEarnedBadges
 * @example
 * const next = getNextBadge(10, 55, 1);
 */
export function getNextBadge(
  items: number,
  co2: number,
  repairs: number,
): { badge: Badge; progress: number; total: number } | null {
  const streak = getStreakData().longestStreak;
  const earnedIds = getEarnedBadges(items, co2, repairs);
  const unearned = BADGES.filter((b) => !earnedIds.includes(b.id));

  if (unearned.length === 0) return null;

  // Find the one closest to completion
  let best = null;
  let bestRatio = -1;

  for (const badge of unearned) {
    let value = 0;
    if (badge.category === 'items') value = items;
    if (badge.category === 'streak') value = streak;
    if (badge.category === 'co2') value = co2;
    if (badge.id === 'repairer') value = repairs;

    const ratio = value / badge.threshold;
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = { badge, progress: value, total: badge.threshold };
    }
  }

  return best;
}
