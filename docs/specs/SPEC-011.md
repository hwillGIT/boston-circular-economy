# SPEC-011: Authentication & User Identity

**Status**: IN PROGRESS
**Priority**: MUST
**Epic**: User Identity
**Last Updated**: 2026-07-29
**Related ADRs**: ADR-001

---

## Context
The platform needs user identity to track individual activity history, compute per-user impact metrics, and display aggregate vs personal dashboards. For the prototype phase, a mock auth system using localStorage provides the UX without backend complexity. This can be upgraded to real OAuth/JWT when moving to production.

## User Stories

### US-011.1: Mock Login
**As a** user, **I want to** log in with a display name and optional email, **so that** my activities are tracked under my identity.

**Priority**: MUST
**Status**: In Progress

#### Acceptance Criteria
- [ ] **Given** I am not logged in, **When** I visit the app, **Then** I see a "Sign In" button in the header.
- [ ] **Given** I click "Sign In", **When** a modal appears, **Then** I can enter a display name and optional email.
- [ ] **Given** I submit the form, **When** the data is valid, **Then** my identity is stored in localStorage and the UI reflects I am logged in.
- [ ] **Given** I am logged in, **When** I return to the app later, **Then** my session persists (localStorage).

### US-011.2: User Profile Display
**As a** logged-in user, **I want to** see my name/avatar in the header, **so that** I know I am identified.

**Priority**: MUST
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** I am logged in, **When** I look at the header, **Then** I see my display name and a generated avatar.
- [ ] **Given** I click my profile, **When** a dropdown appears, **Then** I can navigate to my profile or sign out.

### US-011.3: Sign Out
**As a** user, **I want to** sign out, **so that** I can switch identities or clear my session.

**Priority**: MUST
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** I am logged in, **When** I click "Sign Out", **Then** my session is cleared from localStorage.
- [ ] **Given** I sign out, **When** the page updates, **Then** the header shows "Sign In" again.

### US-011.4: User-Scoped Activities
**As a** logged-in user, **I want to** see only my own activities on the dashboard, **so that** my impact is personal and meaningful.

**Priority**: MUST
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** I am logged in, **When** I log an activity, **Then** it is tagged with my user ID.
- [ ] **Given** I visit the dashboard, **When** it loads, **Then** I see my personal activity history and stats.
- [ ] **Given** I am not logged in, **When** I visit the dashboard, **Then** I see aggregate community stats.

## Non-Functional Requirements
- **Performance**: Auth check must be synchronous (localStorage read, <1ms).
- **Upgrade Path**: Auth context must abstract the source (localStorage now, JWT later) so no component changes are needed when upgrading.
- **Privacy**: No real passwords stored. Display name only.

## Dependencies
- SPEC-004: Activity Logging (activities tagged with user_id)
- SPEC-003: Impact Dashboard (filtered by user)

## Definition of Done
- [ ] All acceptance criteria pass
- [ ] TypeScript compiles without errors
- [ ] Auth context is reusable across all pages
- [ ] Upgrade path to real auth is documented
