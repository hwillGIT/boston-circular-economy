# SPEC-012: User Info Center

**Status**: NOT STARTED
**Priority**: SHOULD
**Epic**: User Identity
**Last Updated**: 2026-07-29
**Related ADRs**: —
**Related Specs**: SPEC-011 (Auth), SPEC-003 (Dashboard), SPEC-005 (Credits)

---

## Context
Logged-in users need a central hub to view their profile, activity history, impact stats, earned credits, and account settings. This is the "My Account" experience — personal, motivating, and data-rich.

## User Stories

### US-012.1: Profile Overview
**As a** logged-in user, **I want to** see my profile page with my name, join date, and lifetime impact summary, **so that** I feel ownership of my contributions.

**Priority**: MUST
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** I navigate to my profile, **When** the page loads, **Then** I see my display name, avatar, and member-since date.
- [ ] **Given** I have logged activities, **When** I view my profile, **Then** I see lifetime stats: total items diverted, CO₂ prevented, credits earned.
- [ ] **Given** I have achievements, **When** I view my profile, **Then** I see earned badges (e.g., "First Repair", "10 Items Diverted").

### US-012.2: Activity History
**As a** user, **I want to** see a chronological list of all my logged activities, **so that** I can review what I've done and when.

**Priority**: MUST
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** I visit my activity history, **When** it loads, **Then** I see a reverse-chronological list of my activities.
- [ ] **Given** the list, **When** I view an entry, **Then** I see action type, item, location, date, CO₂ saved, and credits earned.
- [ ] **Given** many activities, **When** the list is long, **Then** it supports pagination or infinite scroll.
- [ ] **Given** the list, **When** I click a filter, **Then** I can filter by action type or date range.

### US-012.3: Credit Balance & History
**As a** user, **I want to** see my total credit balance and a breakdown of how I earned them, **so that** I can track my progress toward rewards.

**Priority**: SHOULD
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** my profile, **When** I view the credits section, **Then** I see my total balance prominently displayed.
- [ ] **Given** the credits section, **When** I expand it, **Then** I see a transaction log showing credits earned per activity.
- [ ] **Given** redemption is available (future), **When** I redeem credits, **Then** the transaction shows as a debit.

### US-012.4: Impact Visualization
**As a** user, **I want to** see visual charts of my impact over time, **so that** I can see my progress and feel motivated.

**Priority**: COULD
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** my profile, **When** I view impact charts, **Then** I see a line/bar chart of CO₂ saved per month.
- [ ] **Given** the charts, **When** I hover over data points, **Then** I see exact values.
- [ ] **Given** limited data, **When** I have fewer than 3 activities, **Then** I see an encouraging message instead of empty charts.

### US-012.5: Account Settings
**As a** user, **I want to** update my display name and preferences, **so that** my experience is personalized.

**Priority**: SHOULD
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** settings, **When** I change my display name, **Then** the header and profile update immediately.
- [ ] **Given** settings, **When** I toggle notifications (future), **Then** my preferences are saved.
- [ ] **Given** settings, **When** I click "Delete My Data", **Then** I get a confirmation dialog and all my activities are removed.

## Non-Functional Requirements
- **Performance**: Profile page must load in under 500ms.
- **Privacy**: Users can only see their own data. No user can see another user's profile (unless social features are added later).
- **Responsive**: Profile works on mobile as a single-column scrollable layout.

## Dependencies
- SPEC-011: Authentication (user identity required)
- SPEC-004: Activity Logging (data source for history)
- SPEC-005: Credits & Incentives (credit balance)

## Definition of Done
- [ ] All acceptance criteria pass
- [ ] TypeScript compiles without errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessible (keyboard navigable, screen reader friendly)
- [ ] Code reviewed
