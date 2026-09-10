# SPEC-005: Credits & Incentives System

**Status**: NOT STARTED
**Priority**: COULD
**Epic**: Gamification & Impact
**Last Updated**: 2026-07-29
**Related ADRs**:

---

## Context

To encourage ongoing participation, users earn digital credits for circular actions. This system defines how credits are issued, balanced, and potentially redeemed.

## User Stories

### US-005.1: Earn Credits for Actions

**As a** user, **I want to** earn credits automatically when I log circular actions, **so that** my contributions are recognized and rewarded.

**Priority**: MUST
**Status**: Not Started

#### Acceptance Criteria

- [ ] **Given** a user successfully logs an activity (e.g., clothing donation), **When** the system processes it, **Then** a predefined amount of credits is added to their account.
- [ ] **Given** the credit system rules, **When** determining amounts, **Then** different actions yield different credits based on their environmental impact.

### US-005.2: Credit Tiers

**As a** platform administrator, **I want to** configure credit tiers based on action type and impact, **so that** higher-impact actions (like repair) are incentivized more than lower-impact ones.

**Priority**: SHOULD
**Status**: Not Started

#### Acceptance Criteria

- [ ] **Given** administrative access, **When** I view the credit configuration, **Then** I can assign specific credit values to different action categories.
- [ ] **Given** the configuration is updated, **When** new activities are logged, **Then** they award credits based on the new tier values.

### US-005.3: Credit Balance Display

**As a** user, **I want to** see my total credit balance clearly displayed in the dashboard, **so that** I can track my accumulated rewards.

**Priority**: MUST
**Status**: Not Started

#### Acceptance Criteria

- [ ] **Given** I am logged in, **When** I view the Impact Dashboard, **Then** my total available credit balance is prominently displayed.
- [ ] **Given** my credit balance updates, **When** new credits are earned, **Then** the display reflects the new total immediately.

### US-005.4: Future Redemption System

**As a** user, **I want to** know how I can redeem credits, **so that** the points have tangible value.

**Priority**: COULD
**Status**: Not Started (Research phase)

#### Acceptance Criteria

- [ ] **Given** the application UI, **When** I view my credits, **Then** there is information outlining future redemption options (e.g., discounts at partner locations).

## Non-Functional Requirements

- **Security**: Credit issuance logic must be secure to prevent unauthorized manipulation of balances.
- **Scalability**: The system must efficiently handle high volumes of transaction records as user base grows.

## Dependencies

- SPEC-004: Activity Logging (triggers credit issuance)
- SPEC-003: Impact Dashboard (displays balances)

## Definition of Done

- [ ] All acceptance criteria pass
- [ ] TypeScript compiles without errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessible (keyboard navigable, screen reader friendly)
- [ ] Code reviewed
