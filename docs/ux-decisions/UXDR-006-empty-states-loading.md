# UXDR-006: Empty States & Loading

**Status**: Accepted
**Date**: 2026-07-29
**Deciders**: Development team
**Informed by**: Competitive analysis of Airbnb, Buy Nothing, TaskRabbit

## Context
The app currently shows basic 'No results' text or nothing when there is no data. This provides a poor experience and leads to dead ends.

## Decision
Friendly conversational empty states with recovery actions + skeleton shimmer loading.
- Loading state: skeleton shimmer cards (1.5s pulse, gray gradient) matching card dimensions.
- Empty search: 'No locations match your filters in this area' + 'Clear all filters' button + 'Search a wider area' radius expansion.
- Empty dashboard: 'No activities logged yet' + encouraging illustration + 'Find your first repair option →' CTA.
- Error state: friendly message + retry button + fallback to cached data.
- Never show a blank dead-end screen.

## Platforms Researched
| Platform | Relevant Pattern | Why Applicable |
|---|---|---|
| Airbnb | Clear filters + suggestions | Prevents dead ends |
| Buy Nothing | Interactive radius slider | User agency in empty state |
| TaskRabbit | Solution-oriented copy | Helpful tone |

## Implementation Details
- Implement `SkeletonCard` mimicking `LocationCard` structure.
- Build generic `EmptyState` component taking icon, title, description, and action button.

## Alternatives Considered
- Basic "No results" (current) - rejected as it creates dead-ends.
- Spinners for loading - rejected as skeleton screens provide better perceived performance.

## Consequences
### Positive
- Reduced user frustration.
- Better perceived performance during loading.
### Negative/Trade-offs
- More UI states to design and implement.
### Implementation Impact
- Create `SkeletonCard` component.
- Create `EmptyState` component (reusable with different copy/CTAs).
- Add error boundary with retry capability.
