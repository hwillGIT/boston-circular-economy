# UXDR-002: Activity Logging Flow

**Status**: Accepted
**Date**: 2026-07-29
**Deciders**: Development team
**Informed by**: Competitive analysis of Strava, Olio, Too Good To Go

## Context
The current form has 7+ fields requiring 60+ seconds. Industry benchmark is <30 seconds for any logging flow. The friction is too high for everyday use.

## Decision
Adopt Strava/Olio ultra-low friction pattern — 2 required fields, <15 seconds.
- Step 1: Tap action type chip (Repair, Donate, Swap, Recycle, Mend, Refurbish, Compost) — single tap, no dropdowns.
- Step 2: Type item name (with autocomplete from common items).
- Auto-calculated: CO₂ saved, credits earned, location (pre-filled from context).
- Optional accordion: Money saved, Notes.
- Instant impact preview BEFORE submit showing CO₂ + credits + tangible equivalency.
- Success: Celebration animation + 'Like charging your phone X times' equivalency.

## Platforms Researched
| Platform | Relevant Pattern | Why Applicable |
|---|---|---|
| Strava | 1-tap GPS record | Ultra-low friction logging |
| Olio | 3-step <30s | Quick item sharing flow |
| Too Good To Go | 3-tap checkout | Fast conversion |

## Implementation Details
- Redesign `ActivityLogForm` component.
- Build UI for type chips instead of selects.
- Create autocomplete input for item names.
- Implement celebration animations on submit.

## Alternatives Considered
- Full wizard (HomeAdvisor style) — rejected as there are too many steps for a simple log.
- Free-form text entry — rejected as it produces no structured data for analytics.
- Current 7-field form — proven to have too much friction.

## Consequences
### Positive
- Drastically reduced time to log.
- Higher engagement and completion rates.
### Negative/Trade-offs
- Less structured data upfront if users skip optional fields.
### Implementation Impact
- Redesign `ActivityLogForm` component.
- Add CO₂ equivalency calculator utility.
- Add autocomplete dictionary for common items.
