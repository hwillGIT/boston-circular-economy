# SPEC-002: Interactive Map

**Status**: IN PROGRESS
**Priority**: MUST
**Epic**: Discovery
**Last Updated**: 2026-07-29
**Related ADRs**: [ADR-004 Map Provider Abstraction](../ADR-004.md)

---

## Context
The interactive map is a primary way users will discover circular economy locations in Boston. It needs to be responsive, accessible, and synchronized with the search and filter sidebar.

## User Stories

### US-002.1: Split-screen Layout
**As a** desktop user, **I want to** see a split-screen view with a list of locations on the side and a map taking up the rest of the screen, **so that** I can easily browse both visually and textually.

**Priority**: MUST
**Status**: In Progress

#### Acceptance Criteria
- [ ] **Given** I am on a desktop device, **When** I view the discovery page, **Then** the screen is split with the list on the left (or right) and the map occupying the remaining space.
- [ ] **Given** I resize the window, **When** the viewport width changes, **Then** the split layout maintains appropriate proportions.

### US-002.2: Map Provider Abstraction
**As a** developer, **I want to** use a MapFacade to load CartoDB or OSM tiles, **so that** we can easily switch map providers in the future without rewriting application logic.

**Priority**: MUST
**Status**: In Progress (MapFacade + LeafletProvider implemented)

#### Acceptance Criteria
- [ ] **Given** the application configuration, **When** the map loads, **Then** it uses the configured map provider through the MapFacade interface.
- [ ] **Given** I change the provider configuration, **When** the app restarts, **Then** the map loads tiles from the new provider seamlessly.

### US-002.3: Color-coded Markers
**As a** user, **I want to** see map markers color-coded by location type, **so that** I can quickly distinguish between community organizations, professional businesses, and municipal facilities (BCYF).

**Priority**: MUST
**Status**: In Progress

#### Acceptance Criteria
- [ ] **Given** a map with locations, **When** I view it, **Then** community organization markers are green.
- [ ] **Given** a map with locations, **When** I view it, **Then** professional business markers are blue.
- [ ] **Given** a map with locations, **When** I view it, **Then** BCYF (Boston Centers for Youth & Families) markers are purple.

### US-002.4: Marker Interaction
**As a** user exploring the map, **I want to** click a marker to open location details, **so that** I can learn more about a specific place.

**Priority**: MUST
**Status**: In Progress

#### Acceptance Criteria
- [ ] **Given** I see a marker, **When** I click it, **Then** a location detail panel or popup opens displaying the location's name and info.
- [ ] **Given** the location detail is open, **When** I click outside or click a close button, **Then** the detail view closes.

### US-002.5: Bidirectional Hover Sync
**As a** user browsing the list and map, **I want to** see a marker highlighted when I hover over its card in the sidebar, and vice versa, **so that** I can easily correlate the two views.

**Priority**: SHOULD
**Status**: Not Started
**Pattern Inspiration**: Airbnb

#### Acceptance Criteria
- [ ] **Given** the split-screen view, **When** I hover over a location card in the sidebar, **Then** the corresponding map marker visually indicates it is highlighted (e.g., changes size or adds an outline).
- [ ] **Given** the split-screen view, **When** I hover over a map marker, **Then** the corresponding card in the sidebar scrolls into view and visually highlights.

### US-002.6: Floating Glassmorphic Legend
**As a** user, **I want to** see a floating legend over the map, **so that** I know what the different colored markers mean.

**Priority**: SHOULD
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** the map view, **When** it loads, **Then** a floating legend with a glassmorphic style is visible, explaining the marker colors.
- [ ] **Given** I am on a mobile device, **When** I view the map, **Then** the legend is either collapsible or positioned to not obscure the map excessively.

### US-002.7: Route Directions
**As a** user who wants to visit a location, **I want to** get route directions, **so that** I know how to get there.

**Priority**: SHOULD
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** a selected location, **When** I click "Get Directions", **Then** a route from my current location (if permitted) or a default center to the destination is displayed on the map using OSRM.

### US-002.8: Mobile Bottom Sheet (3 Snap Points)
**As a** mobile user, **I want to** interact with a bottom sheet that has distinct snap points, **so that** I can easily switch between map-focused and list-focused views.

**Priority**: MUST
**Status**: Not Started
**Pattern Inspiration**: Google Maps

#### Acceptance Criteria
- [ ] **Given** I am on a mobile device, **When** I view the discovery page, **Then** the location list is housed in a bottom sheet with 3 snap points (collapsed/hidden, half-screen, full-screen).
- [ ] **Given** the bottom sheet, **When** I drag it, **Then** it smoothly snaps to the nearest logical point.

### US-002.9: Skeleton Shimmer Loading
**As a** user waiting for the map to load, **I want to** see a skeleton shimmer effect, **so that** the UI feels responsive and I know content is coming.

**Priority**: SHOULD
**Status**: Not Started
**Pattern Inspiration**: Airbnb

#### Acceptance Criteria
- [ ] **Given** the map and list are fetching data, **When** they are loading, **Then** a skeleton shimmer placeholder is displayed for the cards and map area.
- [ ] **Given** data loading completes, **When** the content is ready, **Then** the shimmer smoothly transitions to the actual content.

## Non-Functional Requirements
- **Performance**: Map panning and zooming should maintain 60fps. Marker rendering should be efficient (e.g., using Canvas or SVG appropriately) to support hundreds of points without lag.
- **Accessibility**: Map controls (zoom, pan) must be keyboard accessible. Markers should have descriptive alt text or aria-labels for screen readers.
- **Design**: The map style should align with the project's design system (colors, typography).

## Dependencies
- SPEC-001: Search & Discovery (for data filtering)
- SPEC-006: Location Detail (for opening details on click)
- ADR-004: Map Provider Abstraction

## Definition of Done
- [ ] All acceptance criteria pass
- [ ] TypeScript compiles without errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessible (keyboard navigable, screen reader friendly)
- [ ] Code reviewed
