# SPEC-006: Location Detail

**Status**: IN PROGRESS
**Priority**: MUST
**Epic**: Discovery
**Last Updated**: 2026-07-29
**Related ADRs**: 

---

## Context
When a user wants more information about a specific circular economy resource, the Location Detail view provides comprehensive data, contact info, and actions for that location.

## User Stories

### US-006.1: Full Location Information
**As a** user, **I want to** view full details about a location (name, address, hours, phone, website), **so that** I can determine if and when I can visit it.

**Priority**: MUST
**Status**: In Progress

#### Acceptance Criteria
- [ ] **Given** a selected location, **When** the detail panel opens, **Then** it displays the location's official name and full street address.
- [ ] **Given** the location has contact info, **When** the panel is viewed, **Then** clickable phone number and website links are available.
- [ ] **Given** the location has hours of operation, **When** viewed, **Then** the current day's hours are displayed, with an option to see all days.

### US-006.2: Available Activities
**As a** user, **I want to** see a clear list of activities available at the location (e.g., "Accepts Clothing", "Electronics Repair"), **so that** I know exactly what services they offer.

**Priority**: MUST
**Status**: In Progress

#### Acceptance Criteria
- [ ] **Given** the location detail panel, **When** viewed, **Then** it displays a list of specific circular economy activities supported at that site.
- [ ] **Given** the activities list, **When** displayed, **Then** they are presented as distinct tags or list items for easy scanning.

### US-006.3: Impact Metrics Display
**As a** user interested in sustainability, **I want to** view aggregate impact metrics for the location (e.g., total CO2 saved by community actions here), **so that** I can see the collective impact of the community.

**Priority**: SHOULD
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** the location detail view, **When** it loads, **Then** it fetches and displays aggregated impact metrics associated with that specific location.
- [ ] **Given** the metrics are displayed, **When** viewed, **Then** they include total items diverted and estimated CO2 saved.

### US-006.4: Feature Chips
**As a** user with specific needs, **I want to** see feature chips (e.g., wheelchair accessible, parking available), **so that** I can plan my visit accordingly.

**Priority**: SHOULD
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** the location data includes accessibility features, **When** the detail panel is viewed, **Then** visual chips indicate these features clearly.

### US-006.5: Get Directions CTA
**As a** user ready to go, **I want to** easily get directions, **so that** I can navigate to the location without manually copying the address.

**Priority**: MUST
**Status**: In Progress

#### Acceptance Criteria
- [ ] **Given** the location detail panel, **When** I click the "Get Directions" button, **Then** a new tab opens Google Maps (or equivalent native map app on mobile) with the destination pre-filled.

### US-006.6: Slide-in Drawer Animation
**As a** user, **I want to** see the location details smoothly slide into view, **so that** the transition feels premium and connected to my previous action.

**Priority**: SHOULD
**Status**: In Progress

#### Acceptance Criteria
- [ ] **Given** I am on desktop, **When** I select a location, **Then** the detail panel slides in from the side over the list view.
- [ ] **Given** I am on mobile, **When** I select a location, **Then** the detail panel slides up as a modal or new sheet.

### US-006.7: Quick Action Pill Row
**As a** user looking at a location, **I want to** see a quick action pill row, **so that** I can easily access primary actions like Directions, Call, and Website.

**Priority**: MUST
**Status**: Not Started
**Pattern Inspiration**: Google Maps

#### Acceptance Criteria
- [ ] **Given** the location detail panel, **When** it loads, **Then** a horizontal row of pill-shaped buttons (Directions, Call, Website) is prominently displayed below the title.

### US-006.8: Open/Closed Status Display
**As a** user, **I want to** immediately see if a location is currently open or closed, **so that** I don't waste time going to a closed business.

**Priority**: MUST
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** the location detail panel, **When** viewed, **Then** it clearly states "Open now" (in green) or "Closed" (in red) based on current time and operating hours.

### US-006.9: Social Proof Counter
**As a** user, **I want to** see how many other people have used this location, **so that** I feel confident in my choice and connected to the community.

**Priority**: SHOULD
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** the location detail view, **When** it loads, **Then** a social proof counter (e.g., "42 neighbors helped here this month") is displayed near the top.

## Non-Functional Requirements
- **Performance**: The detail panel must open rapidly (<100ms) utilizing locally cached data where possible before fetching fresh details.
- **Accessibility**: Focus must be managed properly when the drawer opens (e.g., focus moved into the drawer, trap focus if modal).

## Dependencies
- SPEC-001: Search & Discovery (entry point)
- SPEC-002: Interactive Map (entry point via markers)
- SPEC-004: Activity Logging (CTA exists in this view)

## Definition of Done
- [ ] All acceptance criteria pass
- [ ] TypeScript compiles without errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessible (keyboard navigable, screen reader friendly)
- [ ] Code reviewed
