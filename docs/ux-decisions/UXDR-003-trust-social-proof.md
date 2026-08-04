# UXDR-003: Trust & Social Proof

**Status**: Accepted
**Date**: 2026-07-29
**Deciders**: Development team
**Informed by**: Competitive analysis of HomeAdvisor, TaskRabbit, Nextdoor, Buy Nothing

## Context
The platform currently has no trust signals. Users need a reason to trust the listings provided on the platform.

## Decision
Adopt 3-tier trust badge system (Municipal → Partner → Community) + social proof counters.
- Tier 1 (Gold Checkmark): Official Municipal sources (City of Boston, BCYF) — automatically applied from data source.
- Tier 2 (Blue Shield): Verified Community Partners (Goodwill, Salvation Army, Habitat ReStore) — manually curated list.
- Tier 3 (Green Leaf): Community-contributed locations — flagged for review.
- Social proof counter on each card: 'X neighbors helped here'.
- Data source indicator: 'OpenStreetMap verified' or 'Community contributed'.

## Platforms Researched
| Platform | Relevant Pattern | Why Applicable |
|---|---|---|
| HomeAdvisor | Badges (Certified, Guarantee) | Establishes platform trust |
| TaskRabbit | Protection, verified profiles | Assures users of quality |
| Nextdoor | Address-verified endorsements | Local community trust |
| Buy Nothing | Gratitude feed | Organic social proof |

## Implementation Details
- Design SVGs or use icons for Gold Checkmark, Blue Shield, Green Leaf.
- Integrate trust badges into location cards.
- Display "X neighbors helped here" near the location rating/metadata.

## Alternatives Considered
- No badges (current state) — rejected because there is no reason to trust listings.
- Star ratings (Yelp model) — rejected because it requires a review system that is not yet implemented.
- Single badge type — rejected because it doesn't distinguish official vs community sources.

## Consequences
### Positive
- Increased user confidence in the locations and services.
- Clear distinction between official and crowd-sourced data.
### Negative/Trade-offs
- Requires ongoing moderation and curation for Tier 2 and Tier 3.
### Implementation Impact
- Add `trust_tier` field to Location type.
- Create `TrustBadge` component.
- Seed data needs activity counts per location.
