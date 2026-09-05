# SPEC-015: Gamification & Engagement

**Status**: NOT STARTED
**Priority**: SHOULD
**Epic**: Gamification & Impact
**Last Updated**: 2026-07-29

---

## Context

Gamification increases long-term retention and motivates continuous participation in the circular economy by rewarding sustainable habits through social validation and achievement tracking.

## User Stories

### US-015.1: Weekly Eco-Streak Tracking

**As a** user, **I want to** track my consecutive weeks of sustainable actions, **so that** I am motivated to keep my streak alive.

**Priority**: MUST
**Status**: Not Started
**Pattern Inspiration**: Strava

#### Acceptance Criteria

- [ ] **Given** I complete a logged activity, **When** it's a new week, **Then** my eco-streak increments by one.
- [ ] **Given** I am on a streak, **When** I view my profile, **Then** my current and longest streak is prominently displayed.

### US-015.2: Achievement Badges System

**As a** user, **I want to** unlock badges for specific milestones, **so that** my diverse contributions are recognized.

**Priority**: MUST
**Status**: Not Started
**Pattern Inspiration**: Too Good To Go, iFixit

#### Acceptance Criteria

- [ ] **Given** I hit specific thresholds (e.g., 5 repairs, 50 lbs donated), **When** achieved, **Then** I receive a push notification and unlock a visual badge.
- [ ] **Given** my profile, **When** viewed, **Then** all earned badges are displayed in a trophy case format.

### US-015.3: Eco-Kudos 1-Tap Social Feedback

**As a** user viewing others' activities, **I want to** give quick positive feedback, **so that** I can encourage my neighbors without writing a comment.

**Priority**: SHOULD
**Status**: Not Started
**Pattern Inspiration**: Strava Kudos

#### Acceptance Criteria

- [ ] **Given** a community activity feed, **When** I see a neighbor's action, **Then** I can tap a leaf icon to give "Eco-Kudos".
- [ ] **Given** someone gives me kudos, **When** it happens, **Then** I receive a brief notification celebrating my impact.

### US-015.4: Neighborhood Leaderboard

**As a** competitive user, **I want to** see how my neighborhood ranks against others in Boston, **so that** we can rally together for greater impact.

**Priority**: COULD
**Status**: Not Started
**Pattern Inspiration**: Strava, Olio

#### Acceptance Criteria

- [ ] **Given** the leaderboard tab, **When** viewed, **Then** Boston neighborhoods are ranked by total activities or CO2 saved this month.
- [ ] **Given** the leaderboard, **When** I participate, **Then** my points contribute to my home neighborhood's score.

### US-015.5: Karma/Tier Progression

**As a** dedicated user, **I want to** level up my community status based on my lifetime impact, **so that** my long-term commitment is acknowledged.

**Priority**: SHOULD
**Status**: Not Started
**Pattern Inspiration**: Olio

#### Acceptance Criteria

- [ ] **Given** I accumulate impact points, **When** I cross defined thresholds, **Then** I progress through tiers (e.g., Seed, Sprout, Tree, Forest).
- [ ] **Given** my tier status, **When** I interact in the community, **Then** my tier is visible next to my name.

### US-015.6: Gratitude Feed

**As a** user who gave away an item, **I want to** see a feed of thank you messages, **so that** I feel the human impact of my donation.

**Priority**: SHOULD
**Status**: Not Started
**Pattern Inspiration**: Buy Nothing

#### Acceptance Criteria

- [ ] **Given** the community tab, **When** viewed, **Then** there is a "Gratitude Feed" where users can post photos and thanks for items they received.

## Non-Functional Requirements

- **Performance**: Gamification calculations (streaks, leaderboards) should be cached or calculated asynchronously to avoid slowing down primary logging flows.
- **Privacy**: Users must have granular privacy settings to opt-out of leaderboards or public feeds.

## Dependencies

- SPEC-004: Activity Logging (data source)
- SPEC-003: Impact Dashboard (visualization integration)

## Definition of Done

- [ ] All acceptance criteria pass
- [ ] UI/UX for badges and tier progression implemented
- [ ] Privacy controls added
- [ ] Code reviewed
