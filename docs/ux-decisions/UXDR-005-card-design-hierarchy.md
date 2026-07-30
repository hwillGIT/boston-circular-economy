# UXDR-005: Card Design Hierarchy

**Status**: Accepted
**Date**: 2026-07-29
**Deciders**: Development team
**Informed by**: Competitive analysis of Yelp, Google Maps, Airbnb

## Context
Current cards show name, address, and type only. This is not enough information to make decisions without clicking into details.

## Decision
Adopt Google Maps / Yelp card hierarchy with quick action row.
Information hierarchy top to bottom:
1. Location Name (bold, 1.125rem) + Trust Badge
2. Type chip + Open/Closed status
3. Address (secondary text)
4. Activity tags (colored chips: Repair, Donate, Swap...)
5. Social proof: 'X neighbors helped' + MBTA proximity '🚶 5 min from [Station]'
6. Quick Action Row: 📍 Directions | 📞 Call | 🌐 Website (pill buttons)

Hover state: subtle scale(1.02) + shadow elevation (Airbnb pattern).
Selected state: green left border accent + elevated shadow.
Synced state: when corresponding map pin is hovered, card gets highlighted.

## Platforms Researched
| Platform | Relevant Pattern | Why Applicable |
|---|---|---|
| Yelp | Photo, name, stars, category, actions | Dense but scannable info |
| Google Maps | Name, stars, status, action pills | Best-in-class utility |
| Airbnb | Photo, price, name, rating | Clean hover/interaction model |

## Implementation Details
- Update CSS/styled-components for the location card.
- Incorporate `TrustBadge` component into the card title row.
- Add quick action button row.

## Alternatives Considered
- Minimal card (current) — rejected because there's not enough info to make decisions without clicking.
- Photo-first card (Yelp) — rejected because photos are not available for most locations.
- Price-first card (Airbnb) — rejected because it's not relevant for free community services.

## Consequences
### Positive
- Users can take actions directly from the list view without opening details.
- Richer information scent improves decision making.
### Negative/Trade-offs
- Cards take up more vertical space, showing fewer items at once.
### Implementation Impact
- Redesign `LocationCard` component.
- Add hours/phone/website to Location API response.
- Add activity count aggregation query.
