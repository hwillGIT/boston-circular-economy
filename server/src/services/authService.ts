import crypto from 'crypto'
import db from '../db/index.ts'

/**
 * Hashes a plaintext password using scrypt with a randomly generated salt.
 * 
 * @category Auth
 * @param {string} password The plaintext password to hash.
 * @returns {string} The resulting hash string in the format "salt:derivedKey".
 * @example
 * ```ts
 * const hashedPassword = hashPassword('mySecretPassword123!');
 * ```
 * @see {@link verifyPassword}
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${derivedKey}`
}

/**
 * Verifies a plaintext password against a stored hash.
 * 
 * @category Auth
 * @param {string} password The plaintext password to verify.
 * @param {string} stored The stored password hash string (expected format "salt:derivedKey").
 * @returns {boolean} True if the password matches the hash, false otherwise.
 * @example
 * ```ts
 * const isValid = verifyPassword('mySecretPassword123!', storedHash);
 * ```
 * @see {@link hashPassword}
 */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(':')
  if (!salt || !key) return false
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex')
  return key === derivedKey
}

/**
 * Generates a random 32-byte hexadecimal token for use as a session token.
 * 
 * @category Auth
 * @returns {string} A 64-character hexadecimal token string.
 * @example
 * ```ts
 * const token = generateToken();
 * ```
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Hashes a given token using SHA-256 to securely store and verify session tokens.
 * 
 * @category Auth
 * @param {string} token The raw session token to hash.
 * @returns {string} The SHA-256 hexadecimal hash of the token.
 * @example
 * ```ts
 * const hashed = hashToken(rawToken);
 * ```
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

/**
 * Creates and stores a new user session in the database.
 * Sets the session expiration to 7 days from the current time.
 * 
 * @category Auth
 * @param {string} userId The ID of the user creating the session.
 * @param {string} token The raw session token to be hashed and stored.
 * @param {string} [ip] The optional IP address of the user.
 * @param {string} [userAgent] The optional User-Agent string from the client.
 * @example
 * ```ts
 * createSession('user-123', rawToken, '192.168.1.1', 'Mozilla/5.0');
 * ```
 * @see {@link validateSession}
 */
export function createSession(userId: string, token: string, ip?: string, userAgent?: string): void {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const tokenHash = hashToken(token)

  db.prepare(`
    INSERT INTO sessions (id, user_id, token_hash, ip_address, user_agent, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    userId,
    tokenHash,
    ip ?? null,
    userAgent ?? null,
    expiresAt
  )
}

/**
 * Validates a session token, updates its last active timestamp, and retrieves the associated user.
 * If the session is expired, it is revoked and null is returned.
 * 
 * @category Auth
 * @param {string} token The raw session token to validate.
 * @returns {any | null} The associated user object if valid, or null if invalid or expired.
 * @example
 * ```ts
 * const user = validateSession(rawToken);
 * if (user) { // handle authenticated user }
 * ```
 * @see {@link revokeSession}
 */
export function validateSession(token: string): any | null {
  const tokenHash = hashToken(token)
  
  const session = db.prepare(`
    SELECT sessions.*, users.id as uid, users.email, users.display_name, users.avatar_url, users.role, users.neighborhood, users.verified, users.status, users.created_at as u_created_at
    FROM sessions
    JOIN users ON sessions.user_id = users.id
    WHERE sessions.token_hash = ?
  `).get(tokenHash) as any

  if (!session) return null

  // Check expiry
  if (new Date(session.expires_at) < new Date()) {
    revokeSession(tokenHash)
    return null
  }

  // Update last active
  db.prepare(`UPDATE sessions SET last_active = datetime('now') WHERE id = ?`).run(session.id)

  return {
    id: session.uid,
    email: session.email,
    displayName: session.display_name,
    avatarColor: session.avatar_url,
    role: session.role,
    neighborhood: session.neighborhood,
    verified: session.verified,
    status: session.status,
    joinedAt: session.u_created_at
  }
}

/**
 * Revokes a specific session by deleting it from the database based on its token hash.
 * 
 * @category Auth
 * @param {string} tokenHash The hashed session token to revoke.
 * @example
 * ```ts
 * revokeSession(hashedToken);
 * ```
 * @see {@link validateSession}
 */
export function revokeSession(tokenHash: string): void {
  db.prepare(`DELETE FROM sessions WHERE token_hash = ?`).run(tokenHash)
}

/**
 * Revokes all active sessions for a specific user by deleting them from the database.
 * 
 * @category Auth
 * @param {string} userId The ID of the user whose sessions should be revoked.
 * @example
 * ```ts
 * revokeAllSessions('user-123');
 * ```
 */
export function revokeAllSessions(userId: string): void {
  db.prepare(`DELETE FROM sessions WHERE user_id = ?`).run(userId)
}
