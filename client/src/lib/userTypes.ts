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
export type UserRole = 'user' | 'moderator' | 'admin' | 'business'

/**
 * Maps each UserRole to a numeric hierarchy level for permission comparisons.
 * @category Types
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 0,
  moderator: 1,
  admin: 2,
  business: 1, // Same level as moderator, different permissions
}

/* ── Account Status ── */
/**
 * Represents the current status of a user's account.
 * @category Types
 */
export type AccountStatus = 'active' | 'suspended' | 'banned' | 'deleted'

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
  id: string
  displayName: string
  email: string
  role: UserRole
  avatarColor: string
  avatarUrl?: string
}

/**
 * Extended lightweight entity for authenticated session context.
 * Stored client-side after login. Slightly more data than summary
 * but still safe for localStorage / memory.
 */
export interface UserSession extends UserSummary {
  joinedAt: string
  neighborhood?: string
  verified: boolean
  /** Computed client-side from role */
  permissions: UserPermissions
}

/* ── Permission Flags (derived from role) ── */
/**
 * Represents specific action capabilities granted to a user based on their role.
 * @category Types
 */
export interface UserPermissions {
  canLogActivity: boolean
  canSendKudos: boolean
  canEndorse: boolean
  canFlag: boolean
  canCreateEvent: boolean
  canPostPromotion: boolean
  canModerate: boolean
  canManageUsers: boolean
  canAccessAdmin: boolean
  canClaimBusiness: boolean
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
  }
}


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
  status: AccountStatus
  createdAt: string
  updatedAt: string

  /** Profile */
  bio?: string
  profileComplete: number // 0-100 percentage

  /** Gamification stats (aggregated server-side) */
  stats: UserStats

  /** Achievement badges earned */
  badges: UserBadge[]

  /** Active streak info */
  streak: UserStreak

  /** Tier progression */
  tier: UserTier
}

/**
 * Aggregated statistics and impact metrics for a specific user.
 * @category Types
 */
export interface UserStats {
  totalActivities: number
  totalCo2Saved: number   // lbs
  totalCredits: number
  totalSavings: number    // dollars
  totalKudosGiven: number
  totalKudosReceived: number
  totalEndorsements: number
  activeSince: string     // ISO date of first activity
  topCategory: string     // Most frequent action type
}

/**
 * Represents a gamification badge earned by a user.
 * @category Types
 */
export interface UserBadge {
  id: string
  name: string
  emoji: string
  description: string
  earnedAt: string
}

/**
 * Tracks a user's current and longest activity streaks in weeks.
 * @category Types
 */
export interface UserStreak {
  currentWeeks: number
  longestWeeks: number
  lastActivityDate: string | null
  freezesRemaining: number
}

/**
 * Represents the progressive tier levels users can achieve through activity.
 * @category Types
 */
export type TierLevel = 'seedling' | 'sprout' | 'tree' | 'forest'

/**
 * Represents a user's current tier status and progress towards the next tier.
 * @category Types
 */
export interface UserTier {
  current: TierLevel
  label: string
  emoji: string
  nextTier: TierLevel | null
  progressPercent: number // 0-100 toward next tier
  creditsToNext: number
}

/**
 * Configuration mapping each TierLevel to its display properties and credit threshold.
 * @category Types
 */
export const TIER_CONFIG: Record<TierLevel, { label: string; emoji: string; minCredits: number }> = {
  seedling: { label: 'Seedling',  emoji: '🌱', minCredits: 0 },
  sprout:   { label: 'Sprout',    emoji: '🌿', minCredits: 100 },
  tree:     { label: 'Tree',      emoji: '🌳', minCredits: 500 },
  forest:   { label: 'Forest',    emoji: '🌲', minCredits: 2000 },
}

/**
 * Computes a user's current tier and progress based on their total earned credits.
 * @category Types
 * @param totalCredits - The user's total accumulated credits.
 * @returns The user's computed tier and progress details.
 * @example
 * const tierInfo = computeTier(150);
 */
export function computeTier(totalCredits: number): UserTier {
  const tiers: TierLevel[] = ['seedling', 'sprout', 'tree', 'forest']

  let currentIdx = 0
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (totalCredits >= TIER_CONFIG[tiers[i]!].minCredits) {
      currentIdx = i
      break
    }
  }

  const current = tiers[currentIdx]!
  const config = TIER_CONFIG[current]
  const nextTier = currentIdx < tiers.length - 1 ? tiers[currentIdx + 1]! : null
  const nextConfig = nextTier ? TIER_CONFIG[nextTier] : null

  return {
    current,
    label: config.label,
    emoji: config.emoji,
    nextTier,
    progressPercent: nextConfig
      ? Math.min(100, Math.round(((totalCredits - config.minCredits) / (nextConfig.minCredits - config.minCredits)) * 100))
      : 100,
    creditsToNext: nextConfig ? Math.max(0, nextConfig.minCredits - totalCredits) : 0,
  }
}


/* ════════════════════════════════════════════════════════════
   ADMIN ENTITIES — User management views
   ════════════════════════════════════════════════════════════ */

/**
 * Lightweight user row for admin user list tables.
 * Avoids loading full stats/badges for every row.
 */
export interface UserAdminRow {
  id: string
  displayName: string
  email: string
  role: UserRole
  status: AccountStatus
  neighborhood?: string
  totalActivities: number
  createdAt: string
  lastActiveAt: string | null
}

/**
 * Session info for "Active Sessions" management page.
 */
export interface SessionInfo {
  id: string
  ipAddress: string
  userAgent: string
  lastActive: string
  createdAt: string
  isCurrent: boolean
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
  }
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
  }
}

/**
 * Check if a role has at least the given privilege level.
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}


/* ════════════════════════════════════════════════════════════
   HEAVYWEIGHT BUSINESS ENTITIES
   Loaded only on business dashboard, claim review, admin panel.
   Never in JWT, never in list views.
   ════════════════════════════════════════════════════════════ */

/**
 * Allowed methods for verifying a business claim.
 * @category Types
 */
export type VerificationMethod = 'email_domain' | 'document' | 'phone' | 'gmb_link'
/**
 * Represents the approval status of a business claim.
 * @category Types
 */
export type ClaimStatus = 'pending' | 'approved' | 'rejected'
/**
 * Represents the lifecycle status of a business-hosted event.
 * @category Types
 */
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed'
/**
 * Represents a user's response to an event RSVP.
 * @category Types
 */
export type RsvpStatus = 'going' | 'maybe' | 'cancelled'

/**
 * Business claim — heavyweight entity for claim submission + admin review.
 */
export interface BusinessClaim {
  id: string
  userId: string
  locationId: number
  locationName: string
  status: ClaimStatus
  method: VerificationMethod
  evidenceUrl?: string
  /** Admin review fields */
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
  createdAt: string
}

/**
 * Business profile — heavyweight entity for verified business owners.
 * Extends their user profile with location management data.
 */
export interface BusinessProfile {
  userId: string
  locationId: number
  locationName: string
  claimId: string
  verifiedAt: string
  /** Editable business info */
  description?: string
  phone?: string
  website?: string
  openingHours?: string
  photos: string[]
  /** Analytics (server-aggregated) */
  analytics: BusinessAnalytics
}

/**
 * Aggregated engagement and impact analytics for a verified business profile.
 * @category Types
 */
export interface BusinessAnalytics {
  totalViews: number
  viewsThisWeek: number
  totalActivitiesLogged: number
  totalRsvps: number
  totalEndorsements: number
  topActivity: string
}

/**
 * Event — heavyweight entity for business-hosted events.
 */
export interface BusinessEvent {
  id: string
  locationId: number
  locationName: string
  createdBy: string
  title: string
  description: string
  startsAt: string
  endsAt: string
  capacity?: number
  rsvpCount: number
  status: EventStatus
  createdAt: string
}

/**
 * Event RSVP — lightweight link entity.
 */
export interface EventRsvp {
  eventId: string
  userId: string
  displayName: string
  status: RsvpStatus
  createdAt: string
}

/**
 * Promotion — heavyweight entity for time-bound business offers.
 */
export interface BusinessPromotion {
  id: string
  locationId: number
  locationName: string
  createdBy: string
  title: string
  description: string
  startsAt: string
  expiresAt: string
  isActive: boolean
  createdAt: string
}

/**
 * Volunteer slot — heavyweight entity for community coordination.
 */
export interface VolunteerSlot {
  id: string
  eventId: string
  title: string
  description: string
  spotsTotal: number
  spotsFilled: number
  signups: VolunteerSignup[]
}

/**
 * Represents a user's sign-up for a volunteer slot.
 * @category Types
 */
export interface VolunteerSignup {
  userId: string
  displayName: string
  checkedIn: boolean
  signedUpAt: string
}
