# Customer Journeys

This document describes how users discover and use circular economy services in Boston. It shapes UX design, API design, and feature planning. All user-facing modeling should reflect the patterns here.

---

## Core insight: users look for services, not just places

A user does not come to this app to find a generic place on a map. They come with a specific need:

- "Where can I repair my broken laptop?"
- "Where can I donate clothes near me?"
- "Where can I borrow tools?"
- "Where can I buy secondhand furniture?"

The primary unit of discovery is a **Service** (Activity + ItemCategory at a Location) — not just a Location. Design, filtering, search, and result display should reflect this.

---

## Journey 1: Find a service for a specific need

**User goal**: find somewhere to do a specific circular-economy activity with a specific type of item.

**Steps**:

1. User indicates what they want to do (Activity: repair, donate, borrow, buy secondhand, etc.)
2. User indicates what kind of item is involved (ItemCategory: electronics, clothing, tools, etc.)
3. App returns Locations that offer a matching Service, with relevant availability and trust signals.
4. User inspects a Location's details: address, contact, hours, and which Services are offered there.
5. User decides whether to go based on availability and confidence in the information.

**Domain modeling requirements**:
- Filter and search must operate on Services, not just on Location attributes.
- Results must surface Activity and ItemCategory for each match.
- Availability must be shown as a qualifier, not as a yes/no binary unless the data supports that.
- When data is uncertain or unverified, surface that uncertainty rather than hiding it.

---

## Journey 2: Explore what is available nearby

**User goal**: discover what circular economy options exist in their area without a specific activity or item in mind.

**Steps**:

1. User browses by location or general category.
2. App shows a range of Services offered in the area, grouped by Activity or ItemCategory.
3. User narrows down by selecting an Activity or ItemCategory.
4. App returns matching Locations with Service details and availability.

**Domain modeling requirements**:
- The browsing layer should organize options by Activity and ItemCategory taxonomies, not by generic place types.
- Do not present the taxonomy as a flat tag cloud — keep Activity and ItemCategory as separate dimensions.

---

## Journey 3: Assess trust and availability before going

**User goal**: decide whether a specific location is worth visiting given potentially stale or uncertain data.

**Steps**:

1. User finds a Location that matches their need.
2. User reviews availability (opening hours, event vs. permanent), contact information, and data freshness.
3. App communicates confidence level: when was this data last verified, and from which source?
4. User decides whether to verify directly (e.g. call ahead) or proceed.

**Domain modeling requirements**:
- Every result must carry provenance: which source(s) contributed the data.
- `last_verified` and `data_source` must be surfaced to users in a meaningful way.
- Do not show stale or single-source data as if it is confirmed and current.
- When a Location appears only in one source with no verification, communicate that clearly.

---

## Journey 4: Contribute or report a problem

**User goal**: notify maintainers that a listing is outdated, wrong, or missing.

**Steps**:

1. User finds a listing with incorrect or missing information.
2. User submits a correction or flags the record for review.
3. Maintainer reviews and, if appropriate, updates the curated record.

**Domain modeling requirements**:
- Corrections must be associated with a specific source record or curated Location, not applied globally without review.
- The provenance chain (source → normalized → canonical) should not be destroyed by a user correction — corrections should layer on top as a distinct signal.

---

## Design guardrails for all journeys

These apply to UX design, API design, and feature development:

- **Design around Services, not just Locations.** The primary filter axes are Activity and ItemCategory.
- **Keep Activity and ItemCategory separate.** Do not merge them into a single flat tag.
- **Surface provenance and confidence.** Tell users where the data came from and how fresh it is.
- **Do not present uncertain data as verified.** Use visual or textual signals to indicate low confidence.
- **Do not surface prototype routes in user-facing flows.** Pages under `/dev/` are experiments, not product features.
- **Availability qualifies Services.** A Location may be open but a specific Service may only be available at certain times or as a pop-up event.
