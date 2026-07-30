/**
 * Admin Domain Types
 * @module admin.types
 */

import type { UserRole, AccountStatus } from './auth.types';

/* ════════════════════════════════════════════════════════════
   ADMIN ENTITIES — User management views
   ════════════════════════════════════════════════════════════ */

/**
 * Lightweight user row for admin user list tables.
 * Avoids loading full stats/badges for every row.
 */
export interface UserAdminRow {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  neighborhood?: string;
  totalActivities: number;
  createdAt: string;
  lastActiveAt: string | null;
}

/**
 * Session info for "Active Sessions" management page.
 */
export interface SessionInfo {
  id: string;
  ipAddress: string;
  userAgent: string;
  lastActive: string;
  createdAt: string;
  isCurrent: boolean;
}
