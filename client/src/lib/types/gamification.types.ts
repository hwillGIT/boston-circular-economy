/**
 * Gamification Domain Types
 * @module gamification.types
 */

/**
 * Aggregated statistics and impact metrics for a specific user.
 * @category Types
 */
export interface UserStats {
  totalActivities: number;
  totalCo2Saved: number; // lbs
  totalCredits: number;
  totalSavings: number; // dollars
  totalKudosGiven: number;
  totalKudosReceived: number;
  totalEndorsements: number;
  activeSince: string; // ISO date of first activity
  topCategory: string; // Most frequent action type
}

/**
 * Represents a gamification badge earned by a user.
 * @category Types
 */
export interface UserBadge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earnedAt: string;
}

/**
 * Tracks a user's current and longest activity streaks in weeks.
 * @category Types
 */
export interface UserStreak {
  currentWeeks: number;
  longestWeeks: number;
  lastActivityDate: string | null;
  freezesRemaining: number;
}

/**
 * Represents the progressive tier levels users can achieve through activity.
 * @category Types
 */
export type TierLevel = 'seedling' | 'sprout' | 'tree' | 'forest';

/**
 * Represents a user's current tier status and progress towards the next tier.
 * @category Types
 */
export interface UserTier {
  current: TierLevel;
  label: string;
  emoji: string;
  nextTier: TierLevel | null;
  progressPercent: number; // 0-100 toward next tier
  creditsToNext: number;
}

/**
 * Configuration mapping each TierLevel to its display properties and credit threshold.
 * @category Types
 */
export const TIER_CONFIG: Record<TierLevel, { label: string; emoji: string; minCredits: number }> =
  {
    seedling: { label: 'Seedling', emoji: '🌱', minCredits: 0 },
    sprout: { label: 'Sprout', emoji: '🌿', minCredits: 100 },
    tree: { label: 'Tree', emoji: '🌳', minCredits: 500 },
    forest: { label: 'Forest', emoji: '🌲', minCredits: 2000 },
  };

/**
 * Computes a user's current tier and progress based on their total earned credits.
 * @category Types
 * @param totalCredits - The user's total accumulated credits.
 * @returns The user's computed tier and progress details.
 * @example
 * const tierInfo = computeTier(150);
 */
export function computeTier(totalCredits: number): UserTier {
  const tiers: TierLevel[] = ['seedling', 'sprout', 'tree', 'forest'];

  let currentIdx = 0;
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (totalCredits >= TIER_CONFIG[tiers[i]!].minCredits) {
      currentIdx = i;
      break;
    }
  }

  const current = tiers[currentIdx]!;
  const config = TIER_CONFIG[current];
  const nextTier = currentIdx < tiers.length - 1 ? tiers[currentIdx + 1]! : null;
  const nextConfig = nextTier ? TIER_CONFIG[nextTier] : null;

  return {
    current,
    label: config.label,
    emoji: config.emoji,
    nextTier,
    progressPercent: nextConfig
      ? Math.min(
          100,
          Math.round(
            ((totalCredits - config.minCredits) / (nextConfig.minCredits - config.minCredits)) *
              100,
          ),
        )
      : 100,
    creditsToNext: nextConfig ? Math.max(0, nextConfig.minCredits - totalCredits) : 0,
  };
}
