# SPEC-001: Search & Discovery

**Status**: IN PROGRESS
**Priority**: MUST
**Epic**: Discovery
**Last Updated**: 2026-07-29
**Related ADRs**: 

---

## Context
Users need an efficient way to find circular economy resources (repair shops, donation centers, recycling facilities, etc.) in Boston. This spec covers the core text search and filtering capabilities.

## User Stories

### US-001.1: Text Search
**As a** resident, **I want to** search across location names, addresses, and activity types, **so that** I can quickly find specific places or services I know about.

**Priority**: MUST
**Status**: In Progress

#### Acceptance Criteria
- [ ] **Given** the search bar is visible, **When** I type "Bikes Not Bombs", **Then** the location list and map update to show only that location.
- [ ] **Given** I am searching, **When** I type an address snippet like "Jamaica Plain", **Then** locations in that area are returned.
- [ ] **Given** the search bar, **When** I type a keyword like "repair", **Then** locations offering repair services are displayed.
- [ ] **Given** a slow network connection, **When** I type, **Then** search results are debounced to prevent excessive re-renders/API calls.

### US-001.2: Category Browsing
**As a** user exploring options, **I want to** browse by primary categories (repair, clothing, donate, resell, recycle, learn), **so that** I can see what circular economy activities are available.

**Priority**: MUST
**Status**: In Progress

#### Acceptance Criteria
- [ ] **Given** the search sidebar, **When** I click the "Repair" category pill, **Then** only locations offering repair are shown.
- [ ] **Given** a selected category, **When** I click it again, **Then** the filter is cleared and all locations are shown.
- [ ] **Given** category pills, **When** I select multiple categories, **Then** the results show locations matching any of the selected categories (OR logic).

### US-001.3: Dynamic Activity Filtering
**As a** user with a specific need, **I want to** filter by specific activity types dynamically derived from data, **so that** I can find exactly what I need (e.g., "electronics repair" vs just "repair").

**Priority**: SHOULD
**Status**: In Progress

#### Acceptance Criteria
- [ ] **Given** the filter menu, **When** I open it, **Then** I see a list of activity types populated dynamically from the available API data.
- [ ] **Given** I select "electronics repair", **When** the list updates, **Then** only locations specifically tagged with that activity are shown.

### US-001.4: Transit Line Filtering
**As a** transit-dependent resident, **I want to** filter locations by MBTA transit line, **so that** I can find places easily accessible to me.

**Priority**: SHOULD
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** the filter options, **When** I select "Orange Line", **Then** only locations near Orange Line stations are displayed.
- [ ] **Given** transit filters, **When** I select multiple lines, **Then** locations near any of the selected lines are shown.

### US-001.5: UI Synchronization
**As a** user interacting with the app, **I want to** see the map and sidebar update simultaneously when I search or filter, **so that** I have a consistent view of the data.

**Priority**: MUST
**Status**: In Progress

#### Acceptance Criteria
- [ ] **Given** I apply a filter, **When** the sidebar list updates, **Then** the map markers also instantly update to reflect the filtered set.
- [ ] **Given** the map is zoomed into a specific neighborhood, **When** I clear a filter, **Then** the map bounds remain unchanged but new markers appear if they fit the viewport.

### US-001.6: Empty State Handling
**As a** user performing a highly specific search, **I want to** see a helpful message if no results are found, **so that** I know I need to adjust my search criteria.

**Priority**: MUST
**Status**: In Progress

#### Acceptance Criteria
- [ ] **Given** I search for "spaceships", **When** no locations match, **Then** a friendly empty state message is displayed in the sidebar.
- [ ] **Given** an empty state, **When** it is visible, **Then** a button to "Clear all filters" is provided.

### US-001.7: Zero-query Category Discovery
**As a** user, **I want to** see category chips visible immediately without clicking, **so that** I can instantly discover and apply filters.

**Priority**: MUST
**Status**: Not Started
**Pattern Inspiration**: Google Maps

#### Acceptance Criteria
- [ ] **Given** the search bar, **When** it loads, **Then** horizontally scrollable category chips are visible below it.
- [ ] **Given** visible category chips, **When** I tap one, **Then** the map and list instantly filter.

### US-001.8: 'Search this area' Floating Button
**As a** user panning the map, **I want to** easily search the new visible area, **so that** I can explore locations outside my initial search bounds.

**Priority**: SHOULD
**Status**: Not Started
**Pattern Inspiration**: Airbnb

#### Acceptance Criteria
- [ ] **Given** the map view, **When** I pan significantly from the original center, **Then** a floating "Search this area" button appears.
- [ ] **Given** the floating button is visible, **When** I click it, **Then** the results refresh to show locations in the current map bounds.

### US-001.9: Empty State with Recovery Actions
**As a** user finding no results, **I want to** see helpful recovery actions, **so that** I can easily adjust my search or find alternatives.

**Priority**: MUST
**Status**: Not Started
**Pattern Inspiration**: Airbnb, Buy Nothing

#### Acceptance Criteria
- [ ] **Given** a search yields zero results, **When** the empty state is shown, **Then** it offers 1-tap buttons to clear specific filters or broaden the search radius.
- [ ] **Given** an empty state, **When** appropriate, **Then** it suggests related categories or nearby hubs.

## Non-Functional Requirements
- **Performance**: Search filtering must execute in under 100ms on the client side for up to 5,000 locations.
- **Accessibility**: Search input must have proper aria-labels. Filter buttons must be keyboard accessible and communicate state (aria-pressed).
- **Responsive**: Search bar and filters must remain accessible and usable on mobile devices, potentially moving into a collapsible bottom sheet.

## Dependencies
- SPEC-002: Interactive Map (for UI synchronization)
- SPEC-007: Data Pipeline & ETL (for data model and category derivation)

## Definition of Done
- [ ] All acceptance criteria pass
- [ ] TypeScript compiles without errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessible (keyboard navigable, screen reader friendly)
- [ ] Code reviewed
