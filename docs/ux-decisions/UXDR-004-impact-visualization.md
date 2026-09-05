# UXDR-004: Impact Visualization

**Status**: Accepted
**Date**: 2026-07-29
**Deciders**: Development team
**Informed by**: Competitive analysis of Too Good To Go, Strava, Olio, iFixit

## Context

Abstract metrics like '5.8 lbs CO₂' have no emotional resonance. We need ways to make the impact of circular economy actions tangible and motivating.

## Decision

Use tangible CO₂ equivalencies + weekly progress + streak tracking.

- Every CO₂ value accompanied by tangible equivalency: 'Like charging your phone X times', 'Like driving X miles', 'Like X hours of LED light'.
- Dashboard shows weekly progress bar (this week vs last week vs goal).
- Eco-streak: consecutive weeks with at least 1 activity (Strava weekly model, not daily — prevents burnout).
- Achievement badges at thresholds: First Activity, 5 Items, 10 Items, 25 Items, 50 Items, 100 Items.
- Neighborhood comparison: 'Your neighborhood (Jamaica Plain) diverted X lbs this month'.

CO₂ Equivalency formulas:

- 1 lb CO₂ = 7.5 smartphone charges
- 1 lb CO₂ = 1.1 miles driven
- 1 lb CO₂ = 2.3 hours of LED bulb use
- 1 lb CO₂ = 0.5 loads of laundry

## Platforms Researched

| Platform       | Relevant Pattern         | Why Applicable               |
| -------------- | ------------------------ | ---------------------------- |
| Too Good To Go | CO₂ = smartphone charges | Highly relatable tangibility |
| Strava         | Weekly bars, streaks     | Sustainable engagement       |
| Olio           | Karma points, tiers      | Status progression           |
| iFixit         | Repairability scores     | Clear, actionable metrics    |

## Implementation Details

- Build a utility to convert lbs CO₂ to various everyday equivalents.
- Integrate visual progress bars and badge icons into the user profile/dashboard.

## Alternatives Considered

- Raw numbers only (current state) — rejected due to no emotional impact.
- Daily streaks (Duolingo model) — rejected as too stressful, leading to high churn when broken.
- Points without tiers (generic gamification) — rejected because there is no progression feel.

## Consequences

### Positive

- Highly motivating for users due to relatable impact metrics.
- Gamification encourages continued participation without burnout.

### Negative/Trade-offs

- Formulas are approximations and might be scrutinized for exact scientific accuracy.

### Implementation Impact

- Create `co2Equivalency` utility module.
- Add streak tracking to user state.
- Design achievement badge system.
- Add `neighborhood` field to user profile.
