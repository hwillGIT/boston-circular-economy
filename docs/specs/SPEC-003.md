# SPEC-003: Impact Dashboard

**Status**: IN PROGRESS
**Priority**: SHOULD
**Epic**: Gamification & Impact
**Last Updated**: 2026-07-29
**Related ADRs**:

---

## Context

The Impact Dashboard provides users with a tangible visualization of their contributions to the circular economy. By tracking metrics like items diverted and CO2 prevented, it incentivizes continued participation.

## User Stories

### US-003.1: KPI Cards

**As a** user, **I want to** see high-level KPI cards summarizing my impact, **so that** I can quickly understand my overall contribution.

**Priority**: MUST
**Status**: In Progress

#### Acceptance Criteria

- [ ] **Given** I am on the dashboard, **When** it loads, **Then** I see distinct cards displaying: Items Diverted, CO2 Prevented, Money Saved, and Credits Earned.
- [ ] **Given** the KPI cards, **When** the values update, **Then** they display formatted numbers (e.g., "1,200 lbs", "$450").

### US-003.2: Animated Stat Counters

**As a** user, **I want to** see the stats animate when they load, **so that** the dashboard feels dynamic and rewarding.

**Priority**: SHOULD
**Status**: Not Started

#### Acceptance Criteria

- [ ] **Given** the dashboard loads, **When** the KPI values are displayed, **Then** the numbers count up from 0 to their target value over a short duration (e.g., 1-2 seconds).
- [ ] **Given** user prefers reduced motion, **When** the dashboard loads, **Then** the animation is skipped and final values are shown immediately.

### US-003.3: Activity Log Table

**As a** user, **I want to** view a detailed table of all my logged circular activities, **so that** I can review my past actions.

**Priority**: MUST
**Status**: In Progress

#### Acceptance Criteria

- [ ] **Given** I have logged activities, **When** I view the dashboard, **Then** a table lists them with columns for Date, Location, Action Type, Item, and Impact (CO2/Credits).
- [ ] **Given** the activity table, **When** I click a column header (e.g., Date), **Then** the table sorts by that column ascending/descending.

### US-003.4: Date Range Filtering

**As a** user, **I want to** filter my activity log and KPIs by date range, **so that** I can see my impact over specific periods (e.g., "This Month", "Last Year").

**Priority**: SHOULD
**Status**: Not Started

#### Acceptance Criteria

- [ ] **Given** the dashboard, **When** I interact with a date picker, **Then** I can select preset ranges (e.g., "Last 30 Days") or custom start/end dates.
- [ ] **Given** a date range is applied, **When** the dashboard updates, **Then** both the KPI cards and the Activity Log table reflect only data from that period.

### US-003.5: Data Export

**As a** user, **I want to** export my activity data as CSV or PDF, **so that** I can keep records or share my impact offline.

**Priority**: COULD
**Status**: Not Started

#### Acceptance Criteria

- [ ] **Given** the dashboard, **When** I click an "Export" button, **Then** I am offered options for CSV or PDF format.
- [ ] **Given** I select CSV, **When** the export finishes, **Then** a file downloads containing the currently filtered activity log data.

### US-003.6: SDG Badge Alignment

**As a** sustainability-minded user, **I want to** see how my actions align with UN Sustainable Development Goals (SDGs), **so that** I understand the broader global impact of my local actions.

**Priority**: SHOULD
**Status**: Not Started

#### Acceptance Criteria

- [ ] **Given** my activity data, **When** I view the dashboard, **Then** badges for SDG 11 (Sustainable Cities), 12 (Responsible Consumption), and 13 (Climate Action) are displayed.
- [ ] **Given** the SDG badges, **When** my activities contribute to a specific goal, **Then** that badge visually indicates progress or is highlighted.

### US-003.7: Tangible CO₂ Equivalencies

**As a** user, **I want to** see my impact translated into relatable equivalents, **so that** I better understand my contribution.

**Priority**: MUST
**Status**: Not Started
**Pattern Inspiration**: Too Good To Go

#### Acceptance Criteria

- [ ] **Given** my CO2 saved, **When** viewed on the dashboard, **Then** it shows an equivalent like "Equivalent to planting X trees" or "X miles not driven".

### US-003.8: Weekly Progress Visualization

**As a** user, **I want to** see my weekly activity progress, **so that** I can stay motivated to consistently contribute.

**Priority**: SHOULD
**Status**: Not Started
**Pattern Inspiration**: Strava

#### Acceptance Criteria

- [ ] **Given** the dashboard, **When** I view it, **Then** a bar chart or similar visual shows my activity over the current week compared to my goal.

### US-003.9: Eco-streak Tracking

**As a** user, **I want to** track my consecutive weeks of activity, **so that** I build a habit of participating in the circular economy.

**Priority**: SHOULD
**Status**: Not Started
**Pattern Inspiration**: Strava

#### Acceptance Criteria

- [ ] **Given** I log an activity, **When** it's a new week, **Then** my active week streak increases.
- [ ] **Given** I miss a week, **When** the next week starts, **Then** my streak resets or offers a streak freeze.

### US-003.10: Achievement Badges at Thresholds

**As a** user, **I want to** earn badges for reaching milestones, **so that** I feel rewarded for my cumulative impact.

**Priority**: SHOULD
**Status**: Not Started
**Pattern Inspiration**: Too Good To Go, iFixit

#### Acceptance Criteria

- [ ] **Given** I reach an impact milestone (e.g., 5 repairs, 100 lbs diverted), **When** achieved, **Then** I am awarded a unique visual badge.

### US-003.11: Neighborhood Leaderboard

**As a** user, **I want to** see how my neighborhood is performing compared to others, **so that** I feel a sense of community pride and friendly competition.

**Priority**: COULD
**Status**: Not Started
**Pattern Inspiration**: Strava, Olio

#### Acceptance Criteria

- [ ] **Given** the dashboard, **When** I navigate to the community tab, **Then** I see a leaderboard ranking Boston neighborhoods by total circular impact.

## Non-Functional Requirements

- **Performance**: Dashboard metrics must calculate efficiently, even with thousands of activity records. API endpoints should provide aggregated data to avoid massive payload sizes.
- **Accessibility**: Tables must be properly structured with semantic HTML. Charts/graphs (future) must have textual alternatives.
- **Security**: Users must only be able to view their own activity data unless specifically authorized for a team/organization view.

## Dependencies

- SPEC-004: Activity Logging (provides the data for this dashboard)
- SPEC-005: Credits & Incentives System (provides the credit balances)

## Definition of Done

- [ ] All acceptance criteria pass
- [ ] TypeScript compiles without errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessible (keyboard navigable, screen reader friendly)
- [ ] Code reviewed
