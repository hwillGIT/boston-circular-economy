# Glossary

This glossary defines the terms used across the Boston Circular Economy platform. It covers both domain vocabulary (the language of the circular economy and its actors) and technical vocabulary (the patterns and components used in the codebase).

The terms are grouped into two sections: [Domain Terms](#domain-terms) and [Technical Terms](#technical-terms).

---

## Domain Terms

### Activity

The type of transaction a resident can perform at a location.

Activities are modeled as an enum in the codebase. Current values are: `repair_free`, `repair_paid`, `donation_drop`, `donation_pick`, `resale_buy`, `resale_sell`, `refill`, `borrowing`, `renting`, and `lending`. Activities are always described from the resident's point of view—`donation_drop` means the resident drops off an item, not that the location receives one.

---

### Availability

The access profile of a location, describing when it is open and whether it operates on a persistent schedule.

Availability has two fields: `opening_hours` (a human-readable string, or null if unknown) and `is_persistent` (a boolean indicating whether the location operates on a regular schedule, as opposed to pop-up or one-off events).

---

### Circular Economy

An economic model in which goods are kept in use for as long as possible through repair, reuse, sharing, and recycling, rather than being discarded after first use.

In the context of this platform, the circular economy is represented by the network of locations where Boston residents can participate in these practices.

---

### Item Category

The type of goods involved in a service offered at a location.

Item categories are modeled as an enum. Current values are: `shoes`, `electronics`, `clothing`, `books`, `furniture`, and `tools`. Item categories and activities are combined to form a Service.

---

### Location

A physical place that offers one or more circular economy services to residents.

A location has a name, coordinates, address, contact details, availability, and a list of services. In the data model, a location's identity is scoped to a data source: two records from different sources that represent the same physical place are separate Location entities until the merge process reconciles them.

---

### Location Operator

The person or organization responsible for running a circular economy location.

A location operator might be a repair cafe organizer, the manager of a thrift store, or the coordinator of a tool library. Currently the platform does not have a self-service workflow for operators to submit or update listings; this is a planned future feature.

---

### Resident

A Boston resident who uses the platform to find circular economy options near them.

Residents are the primary users of the map interface. They arrive with a specific need and use activity and item category filters to find relevant locations.

---

### Service

The pairing of one Activity with one Item Category, representing a specific offering at a location.

A location can have multiple services. For example, a thrift store that buys and sells clothing would have two services: `(resale_buy, clothing)` and `(resale_sell, clothing)`. Services are value objects—two Service instances with the same activity and item category are identical.

---

## Technical Terms

### Aggregate

A cluster of domain objects treated as a single unit for the purpose of data changes. All access and modification passes through the aggregate root.

In this project, a Location is the aggregate root. Its Address, Contact, Availability, and Services are part of the Location aggregate and should not be modified except through the Location.

---

### Aggregate Root

The entry point entity in an aggregate. External code interacts with the aggregate through the root, which is responsible for maintaining the consistency of the entire cluster.

The Location entity is the aggregate root in this domain.

---

### BaseDataStore

The abstract base class that defines the data persistence interface for the ETL pipeline.

Concrete implementations of `BaseDataStore` handle the details of the underlying storage technology. The current implementation, `LocalDataStore`, uses SQLite. The abstract interface allows the storage layer to be swapped without changing the pipeline code that calls it.

---

### BaseNormalizer

The abstract base class that defines the interface for a source-specific data normalizer.

Each data source has its own `BaseNormalizer` subclass. It implements `normalize()`, which takes a list of `RawLocation` objects and returns a list of `NormalizedLocation` objects. The normalizer is responsible for translating field names, formats, and values from the source schema into the shared schema.

---

### BaseQuerier

The abstract base class that defines the interface for a source-specific data fetcher.

Each data source has its own `BaseQuerier` subclass. It implements `fetch()`, which returns a list of `RawLocation` objects. Pagination, authentication, and retry logic for that source are handled inside `fetch()` and are not visible to the rest of the pipeline.

---

### Bounded Context

A logical boundary within which a specific model of the domain applies consistently.

This project has three bounded contexts: Data Ingestion (fetching and normalizing raw data), Location Resolution (merging duplicate records across sources), and Location Discovery (serving the resident-facing map). Each context has its own internal model, and the interfaces between them are the places where those models translate.

---

### Command

An operation that changes the state of the system. A command expresses intent and has side effects.

In this codebase, `write_source_snapshot()` and `write_output_locations()` on the DataStore are commands. They change the contents of the database and do not return data.

---

### DataStore

The component responsible for reading and writing location records to persistent storage.

The DataStore is shared across all ETL pipelines. It exposes methods for writing source snapshots (`write_source_snapshot()`), reading them back (`read_source_snapshot()`), and writing the final merged output (`write_output_locations()`).

---

### Domain

The subject area a piece of software is built to model and serve.

The domain for this project is the Boston circular economy: the locations, actors, activities, and items that make up the local network of repair, reuse, and sharing.

---

### Domain Event

A record of something meaningful that occurred in the domain, expressed in past tense. Domain events make implicit state changes explicit and enable decoupled downstream reactions.

The current codebase does not implement explicit domain events, but relevant examples include `LocationScraped`, `LocationNormalized`, and `MergeCompleted`.

---

### Domain Service

A piece of domain logic that coordinates across multiple entities or aggregates and does not fit inside any single one of them.

`MergeProcessor` is the domain service in this project. It takes location records from multiple sources and produces a single deduplicated output set. No individual location entity can own this logic because it operates across location identities.

---

### Entity

A domain object defined by its identity rather than its attributes. Two entities with different identities are distinct even if all their data fields are identical.

A `NormalizedLocation` is an entity. Its identity is the combination of `data_source` and `data_source_id`. This identity persists across updates: when a source is re-scraped, existing records are updated in place rather than duplicated.

---

### ETL

Extract, Transform, Load. A data pipeline pattern in which data is fetched from a source (Extract), converted to a target schema (Transform), and written to a destination (Load).

In this project, Queriers handle extraction, Normalizers handle transformation, and the DataStore handles loading.

---

### MatchGroup

A dictionary keyed by data source name, where each value is the `NormalizedLocation` that source has for a particular real-world business.

`MatchGroup` is the intermediate data structure produced by `MergeProcessor.match()` and consumed by `MergeProcessor.prioritize()`. A match group is only created when two or more sources have a record for the same physical place.

---

### MergeProcessor

The domain service responsible for identifying location records from different sources that represent the same physical place, and producing a single authoritative output record for each.

`MergeProcessor` has two steps: `match()`, which groups records across sources by physical identity, and `prioritize()`, which resolves conflicts when sources disagree on field values. Both methods are currently stubs awaiting implementation.

---

### Normalizer

A source-specific component that translates `RawLocation` records into `NormalizedLocation` records.

Each data source has its own Normalizer. The Normalizer knows the conventions of its source's schema and maps them onto the shared domain schema. Normalization is a pure transformation: it takes input and returns output without reading from or writing to the database.

---

### NormalizedLocation

A location record that has been translated from a source-specific schema into the shared domain schema.

`NormalizedLocation` is the output of the Normalizer and the input to the DataStore. It carries all the information needed to persist and serve a location, plus `data_source` and `data_source_id` so the record can be traced back to its origin and updated when the source is re-scraped.

---

### Query

An operation that retrieves information from the system without changing its state. A query has no side effects.

In this codebase, `read_source_snapshot()` on the DataStore and `fetch()` on a Querier are queries. The frontend map search is also a query.

---

### Querier

A source-specific component that fetches raw data from an external API or dataset and returns it as a list of `RawLocation` objects.

Each data source has its own Querier. The Querier handles all source-specific concerns: authentication, pagination, rate limiting, and error handling. The rest of the pipeline sees only the returned list of `RawLocation` objects.

---

### RawLocation

A location record as retrieved from an external source, before any normalization.

`RawLocation` carries the raw API payload in a `payload: dict` field alongside the metadata needed to identify and trace the record: `data_source`, `data_source_id`, and `fetched_at`. It is the boundary between the Querier and the Normalizer.

---

### Repository (DDD Pattern)

An abstraction that provides collection-like access to aggregates, decoupling the domain logic from the storage mechanism.

`BaseDataStore` fulfills the repository role in this project. Domain code calls `write_source_snapshot()` and `read_source_snapshot()` without knowing whether the data is stored in SQLite, Postgres, or any other backend. Changing the storage technology requires implementing a new subclass, not changing the callers.

---

### Ubiquitous Language

The shared vocabulary used consistently by all members of the team—developers, designers, and stakeholders—in code, conversation, and documentation.

In this project, the ubiquitous language is anchored in the Python DTOs (`dtos.py`) and in this glossary. When a product discussion refers to a "location," an "activity," or a "service," those words mean exactly what the code says they mean.

---

### Value Object

A domain object defined entirely by its attribute values, with no distinct identity. Two value objects with the same attributes are interchangeable.

In this project, `Address`, `Contact`, `Availability`, and `Service` are value objects. If a location's phone number changes, the old `Contact` is discarded and replaced with a new one; there is no concept of "updating" a particular Contact instance.
