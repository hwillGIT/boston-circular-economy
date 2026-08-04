/**
 * Profile Domain Types
 * @module profile.types
 */

import type { UserSession, AccountStatus } from './auth.types';
import type { UserStats, UserBadge, UserStreak, UserTier } from './gamification.types';

/* ════════════════════════════════════════════════════════════
   HEAVYWEIGHT USER — Profile, Admin, Account Settings
   ════════════════════════════════════════════════════════════ */

/**
 * Full user entity loaded on demand. Used by:
 *  - UserProfile page (public or own)
 *  - Account Settings page
 *  - Admin UserManager panel
 *
 * Never stored in JWT. Fetched via GET /api/v1/users/:id
 */
export interface UserFull extends UserSession {
  /** Account management */
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;

  /** Profile */
  bio?: string;
  profileComplete: number; // 0-100 percentage

  /** Gamification stats (aggregated server-side) */
  stats: UserStats;

  /** Achievement badges earned */
  badges: UserBadge[];

  /** Active streak info */
  streak: UserStreak;

  /** Tier progression */
  tier: UserTier;
}
