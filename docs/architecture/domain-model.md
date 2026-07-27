# Domain Model

This document is the canonical reference for the concepts, relationships, and distinctions that govern this project. All code, schemas, UML diagrams, ADRs, and documentation must use these meanings consistently. If a design changes the meaning of any term here, document that change in an ADR and update this file.

---

## Core concepts

### Location

A place or organization that users can physically interact with. A Location has an address, contact information, and offers one or more Services. It is the unit of physical presence, not the unit of user-facing discovery.

A Location is a domain entity with stable identity across sources. It is distinct from a `RawLocation` (a source-specific observation) and a `NormalizedLocation` (a pipeline-processed record). Do not conflate these.

### Service

A Service is an offering at a Location. It is defined by an **Activity** and an **ItemCategory**. Services are the primary unit users care about — a user is looking for *what they can do* and *with what kind of item*, not just *where a building is*.

A Location offers one or more Services. A Service always belongs to exactly one Location.

### Activity

What a person does at a location. Activities are defined from the visitor's perspective:

| Value | Meaning |
|---|---|
| `repair_free` | Repair your items here for free |
| `repair_paid` | Repair your items here for a fee |
| `donation_drop` | Drop off items you no longer need |
| `donation_pick` | Pick up free items |
| `resale_buy` | Buy secondhand items |
| `resale_sell` | Sell or consign your items |
| `refill` | Refill your own container |
| `borrowing` | Borrow items for free |
| `renting` | Rent items for a fee |
| `lending` | Lend your items out through this location |

An Activity is not an ItemCategory. Do not collapse them. `repair` + `electronics` is a Service; neither value alone is a Service.

### ItemCategory

The kind of item involved in a Service:

| Value | Examples |
|---|---|
| `shoes` | footwear |
| `electronics` | devices, appliances |
| `clothing` | garments, textiles |
| `books` | printed media |
| `furniture` | household goods |
| `tools` | hand tools, power tools |

ItemCategories are classification labels, not actions. Adding a new category requires updating both the enum and any category-dependent UI, filters, or queries.

### Service (as composite)

A Service is always `Activity × ItemCategory`. Both dimensions are required. Do not store or display a service with only one dimension populated unless the other is explicitly unknown — and if unknown, represent it as such rather than leaving it implicit.

### Availability

Whether and when a Service or Location is accessible. Availability includes opening hours and a persistence flag (whether the location is a permanent fixture vs. a pop-up or occasional event). Availability is a qualifier on a Service at a Location, not an intrinsic property of the Location itself.

### Address

Physical location details: street, city, state, postcode. Belongs to a Location.

### Contact

How to reach a Location: phone, email, website, social. Belongs to a Location.

---

## Data provenance concepts

### RawLocation

A source-specific record exactly as fetched from an external data source (e.g. Google Places, OpenStreetMap). A `RawLocation` carries `data_source`, `data_source_id`, `fetched_at`, and the raw `payload`. It is **not** a domain entity. It is an observation from one external system at a point in time.

**Do not treat a RawLocation as a canonical record. Do not expose it to users as verified truth.**

### NormalizedLocation

A `RawLocation` mapped to the shared schema. It still belongs to one source (retains `data_source` and `data_source_id`). Normalization translates field names and formats — it does not add verification, deduplication, or cross-source merging.

**A NormalizedLocation is source-scoped. It is not a canonical domain Location.**

### MatchGroup

A set of NormalizedLocations from different sources that refer to the same real-world business. Produced by the merge processor before prioritization. The identity judgment that creates a MatchGroup is a design decision — it may be wrong or uncertain.

### Canonical output location

The result of the merge/prioritization step. This is the closest thing to a curated domain Location, but it still carries provenance (which sources contributed, when each source was last fetched). It must not be presented as independently verified unless an explicit verification process has been applied.

---

## Key distinctions that must not be blurred

| Do not confuse | With |
|---|---|
| `RawLocation` (source observation) | A canonical domain `Location` |
| `NormalizedLocation` (pipeline record) | A canonical domain `Location` |
| `Activity` (what you do) | `ItemCategory` (what kind of thing) |
| A `Location` (physical place) | A `Service` at that location |
| Source-observed data | Verified or curated data |
| Prototype UI (`/dev/` routes) | Stable product features |

---

## Concept relationships

```
Source ──produces──> RawLocation ──normalized to──> NormalizedLocation
                                                           │
                                          matched and merged by MergeProcessor
                                                           │
                                                   canonical Location
                                                           │
                                              offers one or more Services
                                                           │
                                          Service = Activity × ItemCategory
                                                           │
                                               qualified by Availability
```

---

## Ontology rules

These rules apply to all design, coding, and documentation work:

1. **Do not expose a source record as a canonical record.** Always distinguish between what came from a source and what has been curated or merged.
2. **Preserve provenance.** Every record derived from an external source must retain `data_source` and `data_source_id` through all pipeline stages.
3. **Do not confuse a location with a service offering at that location.** Model discovery, filtering, APIs, and UX around Services, not just Locations.
4. **Do not confuse Activity with ItemCategory.** They are independent classification axes. A Service requires both.
5. **Keep category systems explicit.** When adding Activities or ItemCategories, update the enum, the glossary, and any dependent UI or query logic together.
6. **Do not present uncertain data as verified.** Use availability and verification signals; surface their absence when relevant.
7. **Do not present prototype features as stable capabilities.** `/dev/` routes are experiments. Promote explicitly before treating as product.
8. **Use the same domain meanings consistently.** Code, schemas, UML, ADRs, and docs must agree. When a design changes the meaning of a term, document that change explicitly.

---

## Adding or changing domain concepts

If you add a new concept, relationship, or classification value:

1. Define it here first.
2. Update `docs/product/glossary.md`.
3. Update code (enums, DTOs, schemas) to match.
4. If the change affects user-facing modeling, update `docs/product/customer-journeys.md`.
5. If the change is architecturally significant, record it in an ADR under `docs/architecture/decisions/`.
