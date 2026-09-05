import { useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserSession, UserSummary, UserRole } from './userTypes';
import { createUserSession, toSummary, derivePermissions, hasRole } from './userTypes';
import { AuthContext } from './authContext';

/* ── Storage Key ── */
const STORAGE_KEY = 'bce_user';

/* ── Generate a stable avatar color from name ── */
function nameToColor(name: string): string {
  const colors = [
    '#059669',
    '#3B82F6',
    '#7C3AED',
    '#EC4899',
    '#F59E0B',
    '#EF4444',
    '#06B6D4',
    '#8B5CF6',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length]!;
}

/* ── Provider ── */
/**
 * Provides authentication state and methods to the application via Context.
 * Wraps the application to ensure auth state is available globally.
 * @category Auth
 * @param props - The component props.
 * @param props.children - The child components to render.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      // Re-derive permissions on load (in case role changed)
      if (parsed.role) {
        parsed.permissions = derivePermissions(parsed.role);
      }
      return parsed;
    } catch {
      return null;
    }
  });

  // Persist to localStorage on change
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const signIn = useCallback((displayName: string, email?: string) => {
    const session = createUserSession({
      id: crypto.randomUUID(),
      displayName: displayName.trim(),
      email: email?.trim() || '',
      role: 'user' as UserRole,
      avatarColor: nameToColor(displayName),
      joinedAt: new Date().toISOString(),
      verified: false,
    });
    setUser(session);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  // Derived lightweight summary (memoized via user reference)
  const summary = user ? toSummary(user) : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        summary,
        isLoggedIn: !!user,
        isAdmin: user?.role === 'admin',
        isModerator: user ? hasRole(user.role, 'moderator') : false,
        isBusiness: user?.role === 'business',
        hasRole: (role: UserRole) => (user ? hasRole(user.role, role) : false),
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ── Re-export types for convenience ── */
export type { UserSession, UserSummary, UserRole };
