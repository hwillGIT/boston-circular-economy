import { createContext, useContext } from 'react';
import type { UserSession, UserSummary, UserRole } from './userTypes';

interface AuthContextType {
  /** Identity and permissions for the current session. */
  user: UserSession | null;
  /** The name, avatar, and role shown by components that need only identity. */
  summary: UserSummary | null;
  /** Role flags derived from the session. */
  isLoggedIn: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isBusiness: boolean;
  /** Check whether the current user meets the required role level. */
  hasRole: (role: UserRole) => boolean;
  signIn: (displayName: string, email?: string) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Hook to access the authentication context.
 * Provides the current user, session summaries, permission flags, and auth actions (signIn, signOut).
 * @category Auth
 * @returns The authentication context object.
 * @throws {Error} If called outside of an AuthProvider.
 * @example
 * const { user, isLoggedIn, signIn, signOut } = useAuth();
 */
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
