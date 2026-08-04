# SPEC-016: Real Authentication Providers (Apple & Google Sign-In)

**Status**: BACKLOG
**Priority**: P2 (Not blocking current work)
**Epic**: Authentication & Security
**Last Updated**: 2026-07-29
**Related ADRs**: 

---

## Context
The Boston Circular Economy platform currently implements a custom email/password authentication system utilizing bcrypt/scrypt for password hashing and JWT/session tokens for session management. To improve user experience, reduce onboarding friction, and enhance security, we want to introduce social login providers. Specifically, Apple Sign-In and Google Sign-In.

**IMPORTANT NOTE**: We explicitly do NOT want a "dev mode login" or any bypass authentication mechanism. Security must be maintained in all environments.

## 1. Current State
The current authentication system is completely custom-built:
- **Server**: `authService.ts` handles scrypt-based password hashing (`hashPassword`, `verifyPassword`), session token generation (32-byte hex), and token hashing (SHA-256) for DB storage. `auth.ts` provides routes for `/register`, `/login`, `/refresh`, `/logout`, `/logout-all`, and `/me`.
- **Client**: `authApi.ts` manages API calls to the server and stores the session token in `localStorage` (`bce_token`). `auth.tsx` provides a React context (`AuthProvider`) that manages the local user state, roles, and derived permissions.
- **Database**: Users are stored in the `users` table with a `password_hash`, and active sessions in the `sessions` table using a `token_hash`.

## 2. Proposed Providers
We will implement the following OAuth 2.0 / OpenID Connect (OIDC) providers:
- **Google Sign-In**: Widely used and provides a seamless experience for most web users.
- **Apple Sign-In**: Required by Apple for iOS apps if other social logins are offered, and highly valued for privacy-conscious users.

## 3. Architecture
We will use standard OAuth 2.0 / OIDC Authorization Code Flow. 
1. The client initiates the login by redirecting the user to the provider's authorization URL.
2. The user authenticates and is redirected back to our server callback URL with an authorization code.
3. Our server exchanges the code for an ID token and access token.
4. Our server validates the ID token, extracts the user profile (email, name), and either links it to an existing account or creates a new one.
5. Our server issues a standard BCE session token (same as current email/password flow) and returns it to the client.

## 4. Server Changes Needed
- **OAuth Library**: Integrate Passport.js, `@fastify/oauth2` (if using Fastify), or directly use `oauth4webapi` / `openid-client` for handling the OIDC flows securely without boilerplate.
- **New Routes**:
  - `GET /api/v1/auth/google` (initiates flow)
  - `GET /api/v1/auth/google/callback` (handles code exchange and session creation)
  - `GET /api/v1/auth/apple`
  - `POST /api/v1/auth/apple/callback` (Apple often uses POST for callbacks)
- **Session bridging**: After successful OAuth authentication, use the existing `createSession` from `authService.ts` to generate our standard session token. Return this to the client (e.g., via a short-lived secure cookie to exchange for the token, or a postMessage flow if done in a popup).

## 5. Client Changes Needed
- **UI Components**: Add standard "Sign in with Google" and "Sign in with Apple" buttons on the Login and Register screens. Use official branding guidelines for both.
- **Flow Handling**: 
  - Update `auth.tsx` and `authApi.ts` to handle the callback redirection or popup flow.
  - If redirect-based: the callback page on the client reads the token from the URL or a secure cookie set by the server callback, calls `setToken()`, and updates the `AuthContext`.
- **Settings Page**: Add a section for users to view and manage linked social accounts.

## 6. Database Schema Changes
To support multiple login methods for a single user, we need to decouple authentication credentials from the core `users` table.

- **New Table: `oauth_providers`** (or `user_identities`)
  - `id` (UUID, primary key)
  - `user_id` (UUID, foreign key to `users.id`)
  - `provider` (string, e.g., 'google', 'apple')
  - `provider_user_id` (string, the unique ID from the provider)
  - `created_at` (timestamp)
  - *Unique constraint on `(provider, provider_user_id)`*
  - *Unique constraint on `(user_id, provider)` (Optional, if we limit 1 per provider)*

- **Updates to `users` table**:
  - Make `password_hash` nullable. Users who only use social login won't have a password.

## 7. Security Considerations
- **PKCE (Proof Key for Code Exchange)**: Must be used for the OAuth flow to prevent code interception attacks.
- **State Parameter**: Must be used and validated to prevent CSRF attacks during the OAuth callback.
- **Strict Redirect URIs**: Ensure OAuth providers only allow redirects to explicitly whitelisted URLs.
- **Token Storage**: Existing BCE session tokens remain the source of truth for authorization. Do not store Google/Apple access tokens in the DB unless we explicitly need to call their APIs later (we likely don't).
- **No Dev Mode Bypass**: Under no circumstances should a "dev mode" or "bypass" login be implemented. All authentication must go through real providers or local email/password in all environments.

## 8. Migration Path (Account Linking)
Handling existing users who log in with a new social provider:
1. When a user authenticates via Google/Apple, extract the email address from the verified ID token.
2. Check if a user with that email already exists in the `users` table.
3. If they exist:
   - Automatically link the account (create an `oauth_providers` record pointing to the existing `user_id`).
   - Log them in.
4. If they do not exist:
   - Create a new `users` record (with null password).
   - Create the `oauth_providers` record.
   - Log them in.
5. Users with existing email/password logins can continue using them, or switch to social login seamlessly as long as the email matches.

## Definition of Done
- [ ] OAuth integration complete for Google and Apple.
- [ ] Database schema updated (`oauth_providers` table created, `password_hash` made nullable).
- [ ] Client UI updated with compliant social login buttons.
- [ ] Account linking by email works seamlessly.
- [ ] Dev mode bypass is completely avoided.
- [ ] Automated security tests pass (state validation, CSRF protection).
