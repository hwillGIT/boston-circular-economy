# Agent Guidelines

This file contains rules and conventions for agents working in this repository. Read it before writing code, designing systems, producing UML, or authoring documentation.

---

## Domain modeling guardrails

These rules apply to **all work in this repository**: code, schemas, UML, ADRs, API design, documentation, and customer-facing copy.

### Source records vs canonical records

A `RawLocation` is a source-specific observation. A `NormalizedLocation` is a pipeline-processed record. Neither is a canonical, curated domain entity. Do not expose raw or normalized pipeline records directly as if they were verified ground truth. The merge/prioritization step is where cross-source records become candidates for canonical output — and that output still carries provenance.

### Preserve provenance

Every imported record must retain its `data_source` and `data_source_id`. Do not discard or overwrite provenance fields during normalization or merging. When surfacing data to users, distinguish between what is source-observed and what is curated or verified.

### Location vs service

A **Location** is a place or organization. A **Service** is an offering at that location. Do not model the user-facing domain as if locations are the only first-class concept. Users look for a service (an activity, for a category of item, with acceptable availability) — they find it at a location. Design APIs, schemas, UML, and UX around services and activities, not just map pins.

### Activity vs item category

An **Activity** is what a person does (repair, donate, borrow, buy secondhand, refill, lend, rent). An **ItemCategory** is what kind of thing is involved (electronics, clothing, furniture, tools). These are independent dimensions. Do not collapse them into a flat tag or conflate one with the other. A `Service` is always the combination of both.

### Uncertain data

Do not display uncertain, unverified, or stale data as if it is confirmed and current. Use `last_verified`, availability flags, and source quality signals to communicate confidence. When those signals are absent or weak, surface that to users.

### Prototype vs stable feature

Code under `client/src/pages/dev/` is prototype-only. Do not reference, document, or describe prototype routes as if they are stable product features. A prototype must be explicitly promoted (moved out of `dev/`) before it is treated as production capability.

### Consistency across artifacts

Domain terms (`Location`, `Service`, `Activity`, `ItemCategory`, `RawLocation`, `NormalizedLocation`, `Availability`) must mean the same thing in code, schemas, UML diagrams, ADRs, and documentation. If a design decision changes the meaning of a term, document that change explicitly — do not silently redefine it in one artifact and leave others stale.

---

## Where to find more context

- **Domain model and ontology rules**: `docs/architecture/domain-model.md`
- **Term definitions**: `docs/product/glossary.md`
- **User-facing discovery patterns**: `docs/product/customer-journeys.md`
- **ETL pipeline structure**: `etl/README.md`
- **Prototype and contribution conventions**: `CONTRIBUTING.md`
