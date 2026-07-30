# UXDR-001: Layout Architecture

**Status**: Accepted
**Date**: 2026-07-29
**Deciders**: Development team
**Informed by**: Competitive analysis of Airbnb, Yelp, Google Maps

## Context
The current implementation has a static sidebar with no hover sync and no mobile adaptation. This feels disconnected and loses spatial context on different devices. The layout must work well on both desktop and mobile while keeping spatial context clear.

## Decision
Adopt Airbnb-style bi-directional sync split view (desktop) + Google Maps bottom sheet (mobile).
- Desktop: 50/50 split, sidebar cards hover highlights map pin, map pin click scrolls to card
- Mobile (<768px): Full-bleed map with draggable bottom sheet (peek → half → full)
- 'Search this area' floating pill appears when user pans the map
- Map stays visible behind detail panels at all times (never navigate away)

## Platforms Researched
| Platform | Relevant Pattern | Why Applicable |
|---|---|---|
| Airbnb | 50/50 split with hover sync | Excellent bi-directional connection between list and map |
| Yelp | 50/50 + floating toggle | Good balance of map/list priority |
| Google Maps | Map-first + bottom sheet | Industry standard for mobile mapping |

## Implementation Details
- Desktop layout will use a side-by-side flexbox or grid.
- Mobile layout will use a fixed map with an absolutely positioned bottom sheet.
- State management needed for `hoveredLocationId`.
- Add 'Search this area' component that triggers on map bounds change.

## Alternatives Considered
- Full-page wizard (HomeAdvisor) — rejected as it's too high-intent, bad for browsing.
- List-only view — rejected as it loses spatial context.
- Side-by-side without sync — rejected as it matches the current state and feels disconnected.

## Consequences
### Positive
- Improved spatial awareness and connection between list and map.
- Better mobile experience matching user expectations.
### Negative/Trade-offs
- Increased complexity in state management for synchronized hover/selection.
- Mobile drag sheet requires careful touch interaction handling.
### Implementation Impact
- Need to implement `hoveredLocationId` bidirectional state.
- Need CSS/logic for bottom sheet with drag handle on mobile.
- `MapFacade` needs `highlightMarker()` and `clearHighlight()` methods.
