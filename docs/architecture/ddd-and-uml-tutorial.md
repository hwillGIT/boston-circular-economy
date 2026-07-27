# DDD and UML Tutorial: Boston Circular Economy

This document is a guided walkthrough of Domain-Driven Design (DDD) and Unified Modeling Language (UML) as they apply to this project. It is written for developers and project managers who are experienced in software but new to these methodologies. By working through the Boston Circular Economy domain as a concrete example, you will see how abstract concepts map to real design decisions.

---

## 1. Mission and Purpose

The Boston Circular Economy project is a public directory of places in Boston where residents can participate in the circular economy: repair cafes, tool libraries, thrift stores, donation drop-off points, refill stations, and more. The goal is to make these resources easy to discover through a searchable map.

The platform aggregates location data from multiple external sources (Google Places, OpenStreetMap, and others), normalizes it into a shared schema, deduplicates records across sources, and presents the results to residents through a web interface.

Understanding the domain clearly is essential before writing a single line of code. DDD gives us the vocabulary and structure to do that; UML gives us notation to make that structure visible.

---

## 2. Actors

An actor is any person or system that interacts with the platform. Each actor has distinct goals, and those goals drive the use cases the system must support.

**Resident** — A Boston resident who wants to find circular economy options near them. They arrive with a specific need: a broken appliance, a bag of donations, or a search for a power drill they need for one weekend project.

**Location Operator** — The organizer of a repair cafe, thrift shop, or tool library. They want their service to appear in the directory so residents can find them. Currently this actor relies on data sources such as Google Places; a self-service submission workflow is a planned future feature.

**Data Contributor** — A developer who adds or maintains a data source in the ETL pipeline. They work with the code, not the UI.

**Administrator** — A platform maintainer responsible for data quality. They review edge cases, resolve merge conflicts between sources, and manage the health of the directory.

---

## 3. Customer Journeys

A customer journey describes the end-to-end experience of an actor accomplishing a goal. Journeys are narrative, sequential, and human-centered. They reveal friction points and assumptions that formal use cases often miss.

Full journeys are documented in [customer-journeys.md](../product/customer-journeys.md). Below is a brief summary of the primary journeys:

| Journey | Actor | Goal |
|---------|-------|------|
| Find a repair service | Resident | Locate a repair cafe or paid repair shop for a specific item |
| Donate unwanted items | Resident | Find a nearby donation drop-off for clothing or household goods |
| Borrow a tool | Resident | Locate a tool library and understand how to access it |
| Add a data source | Data Contributor | Integrate a new external source into the ETL pipeline |
| Correct a listing | Location Operator | Report inaccurate or outdated information about their venue |

---

## 4. Use Cases

A use case captures a single interaction between an actor and the system, defined by a clear goal and a success outcome. Use cases are more formal than journeys and map directly to system features.

Full use cases are documented in [use-cases.md](../product/use-cases.md). Key use cases include:

- A resident filters the map by activity type and item category
- A resident views the details of a specific location
- A data contributor implements a new Querier and Normalizer for a data source
- An administrator triggers the merge process to deduplicate records
- An administrator marks a location as permanently closed

---

## 5. Domain Language

Every domain has its own vocabulary. In DDD, this shared vocabulary is called the **Ubiquitous Language**: the terms that developers, designers, and stakeholders all use consistently, in code, in conversation, and in documentation.

When the language is consistent, a sentence spoken in a product meeting can be read directly in the code. When it drifts, bugs hide in translation gaps.

The authoritative glossary for this project is in [glossary.md](../product/glossary.md). Key terms in this domain include:

- **Location** — a physical place that offers circular economy services
- **Activity** — what a visitor can do at a location (repair, donate, borrow, buy secondhand, etc.)
- **Item Category** — the type of goods involved (clothing, tools, electronics, etc.)
- **Service** — the pairing of one Activity with one Item Category
- **RawLocation** — location data as retrieved from an external source, before any normalization
- **NormalizedLocation** — location data mapped to the shared schema, ready for storage
- **Querier** — the component responsible for fetching data from a specific source
- **Normalizer** — the component responsible for translating source-specific data into the shared schema
- **DataStore** — the component responsible for reading and writing location records to the database
- **MergeProcessor** — the component responsible for identifying and merging duplicate records across sources

---

## 6. Domain-Driven Design Concepts

DDD is a set of principles and patterns for building software whose structure reflects the business domain it models. These are the core concepts as they apply here.

### 6.1 Domain

The **domain** is the subject area the software addresses. For this project, the domain is the Boston circular economy: the network of businesses, nonprofits, and community initiatives that enable residents to extend the life of goods rather than disposing of them.

Understanding the domain means understanding that a repair cafe and a thrift store are both "locations" but serve different purposes, that the same physical business might appear in three different data sources under slightly different names, and that a resident's mental model is organized around what they want to do (repair this, donate that) rather than around data structures.

### 6.2 Ubiquitous Language

The **Ubiquitous Language** is the shared vocabulary the team uses everywhere—in code, tickets, conversations, and documentation. It eliminates the translation tax between technical and non-technical stakeholders.

In this codebase, the language is expressed through the Python DTOs in `etl/src/etl/dtos.py`. When the product owner says "we need to add a new activity for textile swaps," that maps directly to adding a new value to the `Activity` enum in code. No translation required.

### 6.3 Bounded Context

A **Bounded Context** is a logical boundary within which a particular model of the domain applies. The same term can mean different things in different bounded contexts, and that is acceptable as long as the boundary is clear.

This project has three bounded contexts:

**Data Ingestion** covers the ETL pipeline: everything from fetching raw data from external APIs to writing normalized records to the database. The key model here is `NormalizedLocation` and the components that produce it.

**Location Resolution** covers the process of merging records from multiple sources into a single authoritative record for each real-world place. The key model here is `MatchGroup` and `MergeProcessor`.

**Location Discovery** covers the resident-facing application: the map, search filters, and location detail view. The key model here is whatever the server API exposes to the frontend—presently the stored output of the merge process.

These contexts share vocabulary (a "location" in ingestion and a "location" in discovery both refer to the same physical place), but their internal data shapes differ. A `NormalizedLocation` in the ingestion context carries source metadata that the discovery context does not need.

### 6.4 Entity

An **Entity** is an object defined by its identity, not its attributes. Two entities with different identities are different objects even if every other field is identical.

In this project, a **Location** is an entity. Its identity is the combination of `data_source` and `data_source_id`—the source it came from and the ID the source assigned it. This identity allows the DataStore to update an existing record in place when new data arrives from the same source.

```python
class NormalizedLocation(BaseModel):
    data_source_id: str    # part of identity
    data_source: str       # part of identity
    name: str
    lat: float
    lon: float
    ...
```

### 6.5 Value Object

A **Value Object** is an object defined entirely by its attributes. It has no identity. Two value objects with identical attributes are interchangeable.

In this project, **Address** and **Contact** are value objects. It does not matter which specific Address object represents "123 Main St, Boston, MA"—all that matters is that the data is correct. If the phone number on a Contact changes, you replace the Contact entirely rather than updating an individual instance.

```python
class Address(BaseModel):
    street: str | None = None
    city: str | None = None
    state: str | None = None
    postcode: str | None = None
```

**Service** is also a value object. A `Service(activity=REPAIR_FREE, item_category=TOOLS)` is interchangeable with any other instance that holds the same values.

### 6.6 Aggregate and Aggregate Root

An **Aggregate** is a cluster of related objects treated as a single unit for data changes. Every aggregate has a root entity through which all external access must pass. The aggregate root enforces the invariants that keep the cluster consistent.

A **Location** is the aggregate root in this domain. Its constituent value objects—`Address`, `Contact`, `Availability`, and the list of `Services`—are part of the aggregate. External code should not update an address directly; it should update the location, which owns and validates the address.

In the current codebase this boundary is implicit rather than enforced by a dedicated domain layer. As the system grows, making it explicit will prevent inconsistency between a location's coordinates and its address, or between its services and its availability.

### 6.7 Repository (DDD Pattern)

A **Repository** is an abstraction that provides collection-like access to aggregates, hiding the details of the underlying storage mechanism. Code that retrieves a location should not need to know whether it is stored in SQLite, Postgres, or a flat file.

In this project, `BaseDataStore` fulfills this role. It exposes methods like `write_source_snapshot()`, `read_source_snapshot()`, and `write_output_locations()` without exposing SQL. The concrete implementation, `LocalDataStore`, uses SQLite. Swapping to Postgres in the future requires changing only the implementation, not the callers.

### 6.8 Domain Service

A **Domain Service** is logic that belongs in the domain but does not fit naturally inside any single entity or value object. It typically involves coordination across multiple aggregates.

**MergeProcessor** is the domain service in this project. It takes records from multiple sources (entities owned by different bounded contexts), matches them to the same real-world locations, and produces a single authoritative output record. No individual location entity can own this logic because it inherently spans multiple locations.

### 6.9 Domain Event

A **Domain Event** is a record of something that happened in the domain, expressed in past tense. Events make implicit state changes explicit and enable downstream reactions without direct coupling.

The current codebase does not implement explicit domain events, but they are worth naming as the system matures:

- `LocationScraped` — a Querier retrieved a new snapshot from a source
- `LocationNormalized` — a Normalizer translated a RawLocation to a NormalizedLocation
- `MergeCompleted` — the MergeProcessor finished producing output locations
- `LocationClosedReported` — an operator or admin flagged a listing as no longer active

Modeling these events creates natural boundaries for asynchronous processing, auditing, and future webhook notifications to operators.

### 6.10 Command and Query

The CQRS principle (Command Query Responsibility Segregation) distinguishes **commands** (intent to change state) from **queries** (requests for information without side effects).

In this project:

- `fetch()` on a Querier is a query (it retrieves data but does not change the system's state)
- `normalize()` is a transformation (pure function, no side effects)
- `write_source_snapshot()` is a command (it changes the state of the data store)
- The map search in the frontend is a query

Keeping these roles distinct makes testing straightforward: a command needs an assertion on the resulting state; a query needs an assertion on the returned value.

---

## 7. UML Concepts

UML is a visual notation for describing software systems. It is most useful as a communication tool, not as a specification language. The diagrams below illustrate the current architecture.

### 7.1 Class Diagram

A **class diagram** shows the types in the system and the relationships between them. It is the structural view: what exists, not what happens.

```
┌───────────────────┐       ┌─────────────┐
│  NormalizedLocation│◄─────│   Service   │
│──────────────────│1     *│─────────────│
│ data_source_id    │       │ activity    │
│ data_source       │       │ item_category│
│ name              │       └─────────────┘
│ lat               │
│ lon               │       ┌─────────────┐
│ address           │◄──────│   Address   │
│ contact           │       │─────────────│
│ services          │       │ street      │
│ availability      │       │ city        │
│ last_verified     │       │ state       │
└───────────────────┘       │ postcode    │
                            └─────────────┘

         ┌───────────────┐
         │  RawLocation  │
         │───────────────│
         │ data_source   │
         │ data_source_id│
         │ fetched_at    │
         │ payload: dict │
         └───────────────┘
```

`NormalizedLocation` has a composition relationship with `Address`, `Contact`, `Availability`, and a list of `Service` objects. `RawLocation` exists independently; it is the input to the normalization step, not part of the persistent model.

### 7.2 Sequence Diagram

A **sequence diagram** shows how objects interact over time to accomplish a specific task. It is the behavioral view: what happens, in what order.

The following sequence describes a single pipeline run:

```
Querier          Normalizer        DataStore
   │                  │                │
   │── fetch() ──────►│                │
   │◄─ RawLocation[] ─┤                │
   │                  │                │
   │── normalize() ───►               │
   │◄─ NormalizedLocation[] ──────────┤
   │                                   │
   │── write_source_snapshot() ───────►│
   │◄─ OK ────────────────────────────┤
```

Each arrow is a method call or return value. The diagram makes it immediately obvious that the Querier never talks directly to the DataStore, and that the Normalizer never talks to either the Querier or the DataStore—it is a pure transformation step.

### 7.3 Component Diagram

A **component diagram** shows the high-level building blocks of a system and the interfaces between them.

```
┌──────────────────────────────────────────────────────────┐
│                        ETL Pipeline                       │
│                                                          │
│   ┌──────────┐    RawLocation[]   ┌────────────┐         │
│   │  Querier │──────────────────► │ Normalizer │         │
│   └──────────┘                    └────────────┘         │
│   (per source)                    (per source) │         │
│                                                │         │
│                         NormalizedLocation[]   │         │
│                                        ┌──────▼──────┐  │
│                                        │  DataStore  │  │
│                                        └─────────────┘  │
└──────────────────────────────────────────────────────────┘
         │                                      │
         │            ┌──────────────────┐      │
         └───────────►│  MergeProcessor  │◄─────┘
                      └──────────────────┘
                               │
                               ▼
                    ┌──────────────────┐       ┌──────────────┐
                    │   Output Store   │◄──────│  Server API  │
                    └──────────────────┘       └──────────────┘
                                                       │
                                               ┌───────▼──────┐
                                               │  React Client │
                                               └──────────────┘
```

This diagram makes the data flow visible at a glance: data enters through source-specific Queriers, is normalized to a common shape, persisted by the shared DataStore, merged by the MergeProcessor, and ultimately served to the frontend via the server API.

### 7.4 Activity Diagram

An **activity diagram** models a workflow or process, including decision points and parallel flows. It is similar to a flowchart but grounded in UML semantics.

The following activity diagram describes the ETL job:

```
[Start]
   │
   ▼
Fetch from Google Places ──────────────────────────────────┐
   │                                                        │
Fetch from OpenStreetMap ──────────────────────────────────┤
   │                                                        │
   │◄──────────────────────────────────────────────────────┘
   │ (all sources complete)
   ▼
Normalize each source's records
   │
   ▼
Write normalized records to source snapshots
   │
   ▼
Run MergeProcessor: match records across sources
   │
   ▼
Prioritize conflicting fields
   │
   ▼
Write merged output locations
   │
   ▼
[End]
```

Fetch steps from independent sources can run in parallel (shown as concurrent branches). The merge step depends on all source snapshots being complete.

### 7.5 Use Case Diagram

A **use case diagram** shows actors and the system functions they interact with. It is a high-level overview of scope, not a detailed specification.

```
        ┌─────────────────────────────────────────┐
        │             Boston CE Platform           │
        │                                         │
Resident├─── Filter locations by activity         │
        │                                         │
        ├─── View location details                │
        │                                         │
        └─── (future) Submit new listing          │
                                                  │
Data    ┌─── Add new ETL source                   │
Contributor│                                      │
        └─── Improve normalization logic          │
                                                  │
Admin   ┌─── Trigger merge process                │
        │                                         │
        └─── Mark location as closed              │
        └─────────────────────────────────────────┘
```

---

## 8. Architecture Implications

The DDD analysis above suggests several architectural observations about the current state of the codebase and directions for growth.

**The bounded contexts are currently coupled at the data layer.** The ingestion pipeline writes directly to the same SQLite database that the server reads. As the system grows, it is worth considering whether these contexts should communicate through a well-defined interface (for example, the merge output table becomes the contract) rather than sharing a database file.

**The MergeProcessor is a stub.** Its `match()` and `prioritize()` methods are not yet implemented. This is the most significant domain logic gap in the system. The matching strategy—how to decide that two records from different sources refer to the same physical place—is a non-trivial problem that deserves careful domain modeling before implementation.

**Location identity is source-scoped, not world-scoped.** A Location entity is identified by `(data_source, data_source_id)`. Once the merge process is complete, output locations will need a stable identifier of their own, independent of any source. This output identity needs to be designed before any persistent links (bookmarks, operator claims) are built on top of it.

**Activities and item categories are the core of the value proposition.** The `Activity` and `ItemCategory` enums define the filtering vocabulary that residents use. Adding new values to these enums is a product decision, not just a technical one. Changes here affect the data model, the normalization logic for every source, and the UI simultaneously.

**The server API is a thin shell.** Currently the server starts a SQLite connection and exposes no routes. Building the discovery bounded context on top of the merge output will be the next major development phase.
