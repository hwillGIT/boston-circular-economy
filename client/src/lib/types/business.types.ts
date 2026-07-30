/**
 * Business Domain Types
 * @module business.types
 */

/* ════════════════════════════════════════════════════════════
   HEAVYWEIGHT BUSINESS ENTITIES
   Loaded only on business dashboard, claim review, admin panel.
   Never in JWT, never in list views.
   ════════════════════════════════════════════════════════════ */

/**
 * Allowed methods for verifying a business claim.
 * @category Types
 */
export type VerificationMethod = 'email_domain' | 'document' | 'phone' | 'gmb_link';
/**
 * Represents the approval status of a business claim.
 * @category Types
 */
export type ClaimStatus = 'pending' | 'approved' | 'rejected';
/**
 * Represents the lifecycle status of a business-hosted event.
 * @category Types
 */
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';
/**
 * Represents a user's response to an event RSVP.
 * @category Types
 */
export type RsvpStatus = 'going' | 'maybe' | 'cancelled';

/**
 * Business claim — heavyweight entity for claim submission + admin review.
 */
export interface BusinessClaim {
  id: string;
  userId: string;
  locationId: number;
  locationName: string;
  status: ClaimStatus;
  method: VerificationMethod;
  evidenceUrl?: string;
  /** Admin review fields */
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
}

/**
 * Business profile — heavyweight entity for verified business owners.
 * Extends their user profile with location management data.
 */
export interface BusinessProfile {
  userId: string;
  locationId: number;
  locationName: string;
  claimId: string;
  verifiedAt: string;
  /** Editable business info */
  description?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  photos: string[];
  /** Analytics (server-aggregated) */
  analytics: BusinessAnalytics;
}

/**
 * Aggregated engagement and impact analytics for a verified business profile.
 * @category Types
 */
export interface BusinessAnalytics {
  totalViews: number;
  viewsThisWeek: number;
  totalActivitiesLogged: number;
  totalRsvps: number;
  totalEndorsements: number;
  topActivity: string;
}

/**
 * Event — heavyweight entity for business-hosted events.
 */
export interface BusinessEvent {
  id: string;
  locationId: number;
  locationName: string;
  createdBy: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  capacity?: number;
  rsvpCount: number;
  status: EventStatus;
  createdAt: string;
}

/**
 * Event RSVP — lightweight link entity.
 */
export interface EventRsvp {
  eventId: string;
  userId: string;
  displayName: string;
  status: RsvpStatus;
  createdAt: string;
}

/**
 * Promotion — heavyweight entity for time-bound business offers.
 */
export interface BusinessPromotion {
  id: string;
  locationId: number;
  locationName: string;
  createdBy: string;
  title: string;
  description: string;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * Volunteer slot — heavyweight entity for community coordination.
 */
export interface VolunteerSlot {
  id: string;
  eventId: string;
  title: string;
  description: string;
  spotsTotal: number;
  spotsFilled: number;
  signups: VolunteerSignup[];
}

/**
 * Represents a user's sign-up for a volunteer slot.
 * @category Types
 */
export interface VolunteerSignup {
  userId: string;
  displayName: string;
  checkedIn: boolean;
  signedUpAt: string;
}
