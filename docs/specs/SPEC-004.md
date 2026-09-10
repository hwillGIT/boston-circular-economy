# SPEC-004: Activity Logging

**Status**: NOT STARTED
**Priority**: MUST
**Epic**: Gamification & Impact
**Last Updated**: 2026-07-29
**Related ADRs**:

---

## Context

To track impact and award credits, users must be able to log their circular economy actions (e.g., dropping off clothes for donation, getting a bike repaired).

## User Stories

### US-004.1: 2-Field Quick Log

**As a** user on the go, **I want to** log an activity using only an action chip and an item text field, **so that** I can complete the process in under 30 seconds.

**Priority**: MUST
**Status**: Not Started

#### Acceptance Criteria

- [ ] **Given** I open the log activity form, **When** it appears, **Then** I only need to tap an action chip (e.g., Donate, Repair) and type/select the item name (e.g., "Sweater").
- [ ] **Given** the form, **When** filling it out, **Then** I am not required to enter exact weights or categories unless I choose to expand advanced options.

### US-004.2: Instant Impact Preview

**As a** user logging an action, **I want to** see an instant preview of the impact before I submit, **so that** I am motivated to complete the log.

**Priority**: MUST
**Status**: Not Started

#### Acceptance Criteria

- [ ] **Given** I have entered the action and item, **When** I pause typing, **Then** the form instantly shows an estimated CO2 savings and credits to be earned.

### US-004.3: Success Celebration with Tangible Equivalency

**As a** user who just logged an activity, **I want to** see a fun success celebration, **so that** the experience feels rewarding.

**Priority**: MUST
**Status**: Not Started

#### Acceptance Criteria

- [ ] **Given** I submit the log, **When** it succeeds, **Then** a celebratory animation (e.g., confetti) plays.
- [ ] **Given** the success screen, **When** viewed, **Then** it translates my impact into a tangible equivalency (e.g., "You saved enough water for 5 showers!").

### US-004.4: Auto-calculated Fields

**As a** user logging an activity, **I want to** have fields like location, CO2, and credits auto-calculated, **so that** I don't have to manually enter them.

**Priority**: MUST
**Status**: Not Started

#### Acceptance Criteria

- [ ] **Given** I log from a location page, **When** the form opens, **Then** the location is already linked.
- [ ] **Given** I select an item, **When** submitted, **Then** the backend automatically assigns average CO2 savings and standard credit values for that category.

## Non-Functional Requirements

- **Data Integrity**: The system must enforce foreign key constraints (e.g., location ID must exist) when logging activities.
- **UX**: The logging process should be as frictionless as possible (minimum number of clicks).

## Dependencies

- SPEC-006: Location Detail (entry point for logging)
- SPEC-003: Impact Dashboard (displays logged data)
- Database schema updates for foreign key constraints.

## Definition of Done

- [ ] All acceptance criteria pass
- [ ] TypeScript compiles without errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessible (keyboard navigable, screen reader friendly)
- [ ] Code reviewed
