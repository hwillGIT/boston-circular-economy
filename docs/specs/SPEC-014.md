# SPEC-014: Trust & Verification System

**Status**: NOT STARTED
**Priority**: MUST
**Epic**: Trust & Safety
**Last Updated**: 2026-07-29

---

## Context

A robust Trust & Verification System is essential to give users confidence in the circular economy resources they find. Verifying listings and incorporating social proof reduces the friction of trying new, community-run resources.

## User Stories

### US-014.1: 3-Tier Trust Badge System

**As a** user, **I want to** clearly see verification badges on listings, **so that** I know the reliability of the location.

**Priority**: MUST
**Status**: Not Started
**Pattern Inspiration**: HomeAdvisor, TaskRabbit

#### Acceptance Criteria

- [ ] **Given** a location is verified as a municipal resource, **When** viewed on the map or list, **Then** it displays a "Municipal Gold" badge.
- [ ] **Given** a location is an official partner, **When** viewed, **Then** it displays a "Partner Blue" badge.
- [ ] **Given** a location is community-verified, **When** viewed, **Then** it displays a "Community Green" badge.

### US-014.2: Data Source Indicators

**As a** skeptical user, **I want to** see where the location data came from, **so that** I can judge its trustworthiness.

**Priority**: SHOULD
**Status**: Not Started

#### Acceptance Criteria

- [ ] **Given** the location detail panel, **When** viewed, **Then** the original data source (e.g., "City of Boston Open Data", "Community Submitted") is explicitly cited.
- [ ] **Given** the data source indicator, **When** I click it, **Then** I am provided more context about how often this data is updated.

### US-014.3: Social Proof Counters

**As a** user exploring options, **I want to** see how many others have successfully used a location, **so that** I have confidence in visiting.

**Priority**: MUST
**Status**: Not Started
**Pattern Inspiration**: Nextdoor

#### Acceptance Criteria

- [ ] **Given** a location card or detail view, **When** it loads, **Then** it displays a counter such as "X neighbors visited this month" or "Verified by X locals".

### US-014.4: Community Contribution Flagging

**As a** proactive community member, **I want to** flag outdated or incorrect information, **so that** the database remains accurate for everyone.

**Priority**: MUST
**Status**: Not Started
**Pattern Inspiration**: Google Maps

#### Acceptance Criteria

- [ ] **Given** a location detail view, **When** I see an error, **Then** I can click "Suggest an Edit" or "Flag as Incorrect".
- [ ] **Given** the flagging form, **When** submitted, **Then** the change is queued for moderator review and I receive a thank you message.

## Non-Functional Requirements

- **Moderation**: Flags and edits must surface in an admin queue for review.
- **Transparency**: Changes in verification status must be logged for auditability.

## Dependencies

- SPEC-006: Location Detail (for UI integration)
- Admin Panel (for moderation queues)

## Definition of Done

- [ ] All acceptance criteria pass
- [ ] UI reflects new badge designs
- [ ] Admin workflow established for flagging
- [ ] Code reviewed
