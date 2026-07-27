# Domain Glossary — Boston Circular Economy

This glossary defines the core terms used in this project. The goal is to make sure everyone — developers, project managers, data people, and city partners — uses these words consistently.

Where a term maps directly to code, the code location is noted. Where a term describes a concept that is not yet built, that is also noted.

---

## Core Domain Terms

### Activity

Something a person can do at a location. Activities describe the action from the visitor's point of view.

Currently defined activities (see `etl/dtos.py`):

| Activity | Plain English |
|---|---|
| `repair_free` | Get your item repaired here for free (e.g. a repair cafe) |
| `repair_paid` | Get your item repaired here for a fee (e.g. a cobbler, an electronics shop) |
| `donation_drop` | Drop off items you no longer need |
| `donation_pick` | Pick up free items (e.g. a free store or give-away shop) |
| `resale_buy` | Buy secondhand items here |
| `resale_sell` | Sell or consign items here |
| `refill` | Refill your own container here (e.g. a bulk food store or refill station) |
| `borrowing` | Borrow items here for free (e.g. a tool library) |
| `renting` | Rent items here for a fee |
| `lending` | Lend your own items through this location |

The set of activities is a controlled vocabulary — meaning new activities can only be added by changing the code. This is intentional: it keeps the domain language consistent and prevents data drift from free-text entries.

**Code reference:** `etl/dtos.py`, `Activity` enum

---

### Availability

Information about when a location is open and whether it operates on a regular basis.

Has two fields:
- `opening_hours` — a string describing when the location is open (e.g. "Sa 10:00–14:00"), using the OSM opening_hours format where possible
- `is_persistent` — whether the location is a permanent fixture (true) or a periodic event like a pop-up repair cafe (false)

**Code reference:** `etl/dtos.py`, `Availability` class

---

### Bounded Context

A section of the system where a particular set of terms has a consistent, agreed meaning. Different parts of the system can use the same word differently — a bounded context defines the scope where one meaning applies.

This is a DDD concept, not a code construct. See `docs/architecture/ddd-and-uml-tutorial.md` for how it applies to this project.

---

### Contact

Contact information for a location: phone number, email address, website, and social media link. All fields are optional because not every location has all of them.

**Code reference:** `etl/dtos.py`, `Contact` class

---

### Contributor

A person who adds to the codebase — writing a new data pipeline, building a new frontend feature, fixing a bug, or improving documentation — but who may not have authority to merge changes. Distinguished from Maintainer.

**Role in the system:** Builds new functionality, adds new data sources, promotes prototypes.

---

### Data Curator

A person who reviews location records for accuracy and completeness. This might be a program staff member, a volunteer, or a researcher. They answer questions like: Is this place still open? Are the listed services accurate? Has this been recently verified?

The `last_verified` field in `NormalizedLocation` is a placeholder for curation-related metadata. The workflow for curating records does not yet exist in the application.

**Code reference:** `etl/dtos.py`, `NormalizedLocation.last_verified`

---

### Data Source

An external API or dataset from which location records are pulled. Examples include Google Places, OpenStreetMap, and Yelp. Each data source has its own field names, data formats, and API conventions.

The ETL pipeline is designed around data sources: each source gets its own `Querier` and `Normalizer` implementation.

**Code reference:** `etl/base/querier.py`, `etl/base/normalizer.py`, `etl/pipelines/example/`

---

### Entity

In Domain-Driven Design, an entity is something with a unique identity that persists over time. Even if its attributes change, it is still the same thing.

In this codebase, `NormalizedLocation` behaves like an entity. It is identified by the combination of `data_source` and `data_source_id`. Two records with the same combination refer to the same real-world place, even if the details differ between fetches.

---

### Ingester

The third stage of the ETL pipeline. It takes a list of normalized locations and persists them to a storage target — currently a JSON file, eventually a database.

The ingester merges new records with existing ones by matching on `(data_source, data_source_id)`.

**Code reference:** `etl/base/ingester.py`, `etl/json_ingester.py`

---

### Item Category

The type of item that an activity applies to at a location. For example, a repair cafe might repair electronics and clothing but not furniture.

Currently defined categories (see `etl/dtos.py`):

| Category | Example items |
|---|---|
| `shoes` | Boots, sandals, sneakers |
| `electronics` | Laptops, phones, small appliances |
| `clothing` | Jackets, dresses, sewing repairs |
| `books` | Paperbacks, textbooks, comics |
| `furniture` | Chairs, shelves, tables |
| `tools` | Drills, saws, garden tools |

Like `Activity`, this is a controlled vocabulary. The set of item categories can be expanded, but that is a deliberate decision, not a free-text entry.

**Code reference:** `etl/dtos.py`, `ItemCategory` enum

---

### Location

A specific place that offers one or more circular economy services. In the normalized form, a location has a name, coordinates (latitude and longitude), an address, contact information, a list of services, and availability information.

"Location" is the central concept of this application. Everything else is either context about a location or a way to find one.

**Code reference:** `etl/dtos.py`, `NormalizedLocation`

---

### Maintainer

A person who has merge authority for the repository and is responsible for the architectural direction of the project.

---

### Normalizer

The second stage of the ETL pipeline. It takes raw location data from a specific source and maps it to the shared `NormalizedLocation` schema. Each data source has its own normalizer because each source uses different field names and formats.

**Code reference:** `etl/base/normalizer.py`, `etl/pipelines/example/normalizer.py`

---

### Normalized Location

A location record that has been processed by the normalization pipeline and conforms to the shared schema defined in `etl/dtos.py`. This is the form that the application uses — not the raw form from any individual data source.

See also: Raw Location.

**Code reference:** `etl/dtos.py`, `NormalizedLocation`

---

### Prototype

A feature or interface that is under active development and is not yet stable enough to be part of the main product. Prototypes live in `client/src/pages/dev/` and use mock data.

The fuzzy-search feature is a current example of a prototype. It demonstrates how search might work, but it operates on mock item names rather than real location data.

Promoting a prototype means connecting it to real data, adding appropriate error handling, and moving it out of the dev section. That process is not yet formally defined.

**Code reference:** `client/src/pages/dev/`

---

### Program Staff

City employees, nonprofit coordinators, or other domain experts who work on the circular economy program in an operational role. They may verify location records, manage the directory, and communicate with venues.

In the future, program staff are the most likely users of any data curation or verification tools.

---

### Querier

The first stage of the ETL pipeline. It fetches raw location data from an external data source, handles pagination if the API requires it, and returns a list of `RawLocation` records.

**Code reference:** `etl/base/querier.py`, `etl/pipelines/example/querier.py`

---

### Raw Location

A location record as fetched directly from an external data source, before any normalization. It stores the source name, the source's own identifier, the time it was fetched, and the raw response payload.

Raw locations preserve the original data so that the normalization step can be improved without re-fetching from the source. They are a pipeline boundary: they carry data from the querier to the normalizer.

**Code reference:** `etl/dtos.py`, `RawLocation`

---

### Resident

The primary end user of the public-facing application. A resident is someone in the Boston area who wants to find a place to repair, donate, borrow, or exchange goods.

---

### Service

A specific thing you can do at a location with a specific type of item. A service is the combination of an `Activity` and an `ItemCategory`. For example: "free electronics repair" is `Activity.REPAIR_FREE` + `ItemCategory.ELECTRONICS`.

A location can have many services.

**Code reference:** `etl/dtos.py`, `Service`

---

### Value Object

In Domain-Driven Design, a value object is something fully described by its values, with no separate identity. Two value objects with the same values are considered equal and interchangeable.

In this codebase: `Address`, `Contact`, `Service`, and `Availability` are value objects. They describe aspects of a location but have no identity on their own. If an address changes, the old address is simply replaced.

---

### Verification

The process of confirming that a location record is still accurate — that the place is open, that the services listed are still offered, and that the contact details are current.

The `last_verified` field in `NormalizedLocation` tracks when a record was last verified. The tools and workflow for verification are not yet built.

**Code reference:** `etl/dtos.py`, `NormalizedLocation.last_verified`
