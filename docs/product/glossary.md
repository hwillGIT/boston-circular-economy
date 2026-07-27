# Glossary

Plain-English definitions for terms used across this project. These meanings apply in code, schemas, UML, documentation, and product copy. When in doubt, defer to `docs/architecture/domain-model.md` for the full conceptual model.

---

## Activity

What a person does at a location, from the visitor's perspective. Examples: repair (free or paid), donate (drop-off or pick-up), buy secondhand, sell secondhand, borrow, rent, lend, refill.

An Activity is not an ItemCategory. "Repair electronics" describes a Service (Activity + ItemCategory), not an Activity alone.

See: `Activity` enum in `etl/src/etl/dtos.py`.

---

## Availability

Information about when and whether a Service or Location is accessible. Includes opening hours and a flag indicating whether the location is a permanent fixture or an occasional/pop-up event.

Absence of availability data does not mean the location is unavailable — it means the data is unknown. Treat missing availability as uncertain, not as confirmed open or closed.

---

## Canonical location

A curated domain record representing a real-world place, produced by merging and prioritizing records from one or more sources. A canonical location still carries provenance (which sources contributed). It is not the same as a `NormalizedLocation` or a `RawLocation`.

---

## Contact

How to reach a Location: phone number, email, website, or social media. Belongs to a Location, not to a Service.

---

## Data source

An external system from which location data is fetched (e.g. Google Places, OpenStreetMap). Each source provides its own identifiers and schema. Source identity is preserved through all pipeline stages.

---

## ItemCategory

The kind of item involved in a Service. Examples: shoes, electronics, clothing, books, furniture, tools.

An ItemCategory classifies things, not actions. It is not the same as an Activity. Both are needed to describe a Service.

See: `ItemCategory` enum in `etl/src/etl/dtos.py`.

---

## Location

A place or organization that users can physically visit or interact with. A Location has an address, contact information, and offers one or more Services. It is a domain entity with stable identity across data sources.

A Location is not a `RawLocation` and is not a `NormalizedLocation`. Those are pipeline concepts; a Location is the domain concept they feed toward.

---

## MatchGroup

A set of NormalizedLocations from different sources that the merge processor believes refer to the same real-world business. The matching judgment may be imprecise — a MatchGroup is a candidate grouping, not a confirmed identity assertion.

---

## NormalizedLocation

A source record that has been mapped to the shared schema. It still belongs to one source and retains `data_source` and `data_source_id`. Normalization translates format and field names; it does not add verification or cross-source merging.

A NormalizedLocation is not a canonical domain Location. Do not surface it to users as if it were independently verified.

---

## Prototype / dev route

A page or feature under `client/src/pages/dev/` that is experimental and does not meet production standards. Prototypes are not stable product capabilities. A prototype must be explicitly moved out of `/dev/` before it is treated as a production feature.

---

## Provenance

The record of where a piece of data came from, including which external source and what source-specific identifier. Provenance is preserved through all ETL pipeline stages via `data_source` and `data_source_id` fields. Do not discard provenance during normalization or merging.

---

## RawLocation

A record as fetched from an external source, before any normalization. Carries `data_source`, `data_source_id`, `fetched_at`, and the raw `payload`. A RawLocation is a source observation, not a domain entity. It must not be exposed to users as verified information.

---

## Service

An offering at a Location. Defined by an Activity and an ItemCategory. A Service is the primary unit of user-facing discovery — users are looking for what they can do and with what kind of item, not just where a building is.

A Service always belongs to one Location. A Location can offer multiple Services.

---

## Verification / last_verified

A signal indicating how recently a record was confirmed to be accurate. When `last_verified` is null or stale, the data should be treated as uncertain. Do not display unverified data as confirmed.
