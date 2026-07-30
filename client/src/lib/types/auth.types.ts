/**
 * Auth Domain Types
 * @module auth.types
 */

import type { UserFull } from './profile.types';

/**
 * User Entity Objects — Lightweight / Heavyweight Pattern
 *
 * Lightweight: Minimal projection for session tokens, sidebar lists,
 *              leaderboards, card attribution. Cheap to serialize,
 *              safe to embed in JWTs.
 *
 * Heavyweight: Full entity with relationships for profile pages,
 *              admin panels, account settings. Loaded on demand.
 *
 * This separation keeps JWT payloads small, API responses efficient,
 * and component props explicit about what data they actually need.
 */

/* ── Roles ── */
/**
 * Represents the hierarchical role of a user in the system.
 * @category Types
 */
export type UserRole = 'user' | 'moderator' | 'admin' | 'business';

/**
 * Maps each UserRole to a numeric hierarchy level for permission comparisons.
 * @category Types
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 0,
  moderator: 1,
  admin: 2,
  business: 1, // Same level as moderator, different permissions
};

/* ── Account Status ── */
/**
 * Represents the current status of a user's account.
 * @category Types
 */
export type AccountStatus = 'active' | 'suspended' | 'banned' | 'deleted';

/* ════════════════════════════════════════════════════════════
   LIGHTWEIGHT USER — Session, Lists, Cards, JWT payload
   ════════════════════════════════════════════════════════════ */

/**
 * The minimum user identity needed for most UI surfaces.
 * Embedded in JWT access tokens. Used by:
 *  - AppHeader (avatar + name)
 *  - ActivityLogForm (user attribution)
 *  - LeaderboardRow (rank + name + avatar)
 *  - LocationCard (social proof: "logged by X")
 *  - EcoKudos (sender identity)
 *  - GratitudeFeed (who thanked whom)
 */
export interface UserSummary {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
  avatarColor: string;
  avatarUrl?: string;
}

/**
 * Extended lightweight entity for authenticated session context.
 * Stored client-side after login. Slightly more data than summary
 * but still safe for localStorage / memory.
 */
export interface UserSession extends UserSummary {
  joinedAt: string;
  neighborhood?: string;
  verified: boolean;
  /** Computed client-side from role */
  permissions: UserPermissions;
}

/* ── Permission Flags (derived from role) ── */
/**
 * Represents specific action capabilities granted to a user based on their role.
 * @category Types
 */
export interface UserPermissions {
  canLogActivity: boolean;
  canSendKudos: boolean;
  canEndorse: boolean;
  canFlag: boolean;
  canCreateEvent: boolean;
  canPostPromotion: boolean;
  canModerate: boolean;
  canManageUsers: boolean;
  canAccessAdmin: boolean;
  canClaimBusiness: boolean;
}

/**
 * Derives a full set of granular permissions based on a user's role.
 * @category Types
 * @param role - The role to evaluate.
 * @returns An object containing boolean flags for each permission.
 * @example
 * const perms = derivePermissions('moderator');
 */
export function derivePermissions(role: UserRole): UserPermissions {
  return {
    // All authenticated users
    canLogActivity: true,
    canSendKudos: true,
    canEndorse: true,
    canFlag: true,

    // Business role
    canCreateEvent: role === 'business' || role === 'admin',
    canPostPromotion: role === 'business' || role === 'admin',
    canClaimBusiness: role === 'user' || role === 'business',

    // Moderator+
    canModerate: role === 'moderator' || role === 'admin',

    // Admin only
    canManageUsers: role === 'admin',
    canAccessAdmin: role === 'admin',
  };
}

/* ════════════════════════════════════════════════════════════
   FACTORY HELPERS
   ════════════════════════════════════════════════════════════ */

/**
 * Create a UserSession from registration/login API response.
 * Automatically derives permissions from role.
 */
export function createUserSession(data: Omit<UserSession, 'permissions'>): UserSession {
  return {
    ...data,
    permissions: derivePermissions(data.role),
  };
}

/**
 * Extract a lightweight UserSummary from a full session or profile.
 * Use when passing user data to components that only need identity.
 */
export function toSummary(user: UserSession | UserFull): UserSummary {
  return {
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    role: user.role,
    avatarColor: user.avatarColor,
    avatarUrl: user.avatarUrl,
  };
}

/**
 * Check if a role has at least the given privilege level.
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
