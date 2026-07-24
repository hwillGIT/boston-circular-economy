/* ── Auth API Client ── */
/* Handles all communication with /api/v1/auth endpoints */

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1'
const TOKEN_KEY = 'bce_token'

/**
 * Represents the response from authentication endpoints.
 * @category Auth
 */
export interface AuthResponse {
  user: {
    id: string
    email: string
    displayName: string
    role: string
    avatarColor: string | null
    joinedAt: string
    neighborhood?: string
    verified?: number
  }
  token: string
}

/**
 * Represents an error response from authentication endpoints.
 * @category Auth
 */
export interface AuthError {
  error: string | Array<{ message: string; path: string[] }>
}

/** 
 * Get the stored auth token.
 * Retrieves the authentication token from local storage.
 * @category Auth
 * @returns The stored token string, or null if not found.
 * @example
 * const token = getToken();
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/** 
 * Store the auth token.
 * Saves the given authentication token into local storage.
 * @category Auth
 * @param token - The authentication token to store.
 * @example
 * setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

/** 
 * Clear the auth token.
 * Removes the authentication token from local storage, effectively logging the user out locally.
 * @category Auth
 * @example
 * clearToken();
 */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

/** Parse error response into a user-friendly message */
function parseError(data: AuthError): string {
  if (typeof data.error === 'string') return data.error
  if (Array.isArray(data.error)) {
    return data.error.map(e => e.message).join('. ')
  }
  return 'An unexpected error occurred'
}

/** 
 * POST /api/v1/auth/login
 * Authenticates a user with email and password, storing the returned token.
 * @category Auth
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise that resolves to the authentication response containing user data and token.
 * @throws {Error} If the login request fails or returns an error response.
 * @example
 * const response = await loginApi('user@example.com', 'password123');
 */
export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(parseError(data))
  }

  setToken(data.token)
  return data
}

/** 
 * POST /api/v1/auth/register
 * Registers a new user and stores the returned authentication token.
 * @category Auth
 * @param email - The user's email address.
 * @param password - The user's chosen password.
 * @param displayName - The user's display name.
 * @returns A promise that resolves to the authentication response containing user data and token.
 * @throws {Error} If the registration request fails or returns an error response.
 * @example
 * const response = await registerApi('user@example.com', 'password123', 'John Doe');
 */
export async function registerApi(
  email: string,
  password: string,
  displayName: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, displayName }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(parseError(data))
  }

  setToken(data.token)
  return data
}

/** 
 * POST /api/v1/auth/logout
 * Logs out the current user by notifying the server and clearing the local token.
 * @category Auth
 * @returns A promise that resolves when the logout is complete.
 * @example
 * await logoutApi();
 */
export async function logoutApi(): Promise<void> {
  const token = getToken()
  if (!token) return

  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
  } finally {
    clearToken()
  }
}

/** 
 * GET /api/v1/auth/me — validate current session
 * Retrieves the current authenticated user's data using the stored token. Clears the token if invalid.
 * @category Auth
 * @returns A promise that resolves to the user data, or null if not authenticated.
 * @example
 * const user = await getMeApi();
 */
export async function getMeApi(): Promise<AuthResponse['user'] | null> {
  const token = getToken()
  if (!token) return null

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })

    if (!res.ok) {
      clearToken()
      return null
    }

    const data = await res.json()
    return data.user
  } catch {
    clearToken()
    return null
  }
}

/** 
 * POST /api/v1/auth/refresh — rotate session token
 * Requests a new authentication token using the current token. Updates local storage on success.
 * @category Auth
 * @returns A promise that resolves to the new token string, or null if refresh fails.
 * @example
 * const newToken = await refreshApi();
 */
export async function refreshApi(): Promise<string | null> {
  const token = getToken()
  if (!token) return null

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      clearToken()
      return null
    }

    const data = await res.json()
    setToken(data.token)
    return data.token
  } catch {
    clearToken()
    return null
  }
}
