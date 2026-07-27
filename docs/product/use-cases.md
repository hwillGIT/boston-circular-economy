# Use Cases — Boston Circular Economy

This document describes the likely use cases for the Boston Circular Economy application. Use cases describe what actors want to accomplish using the system. They are written from the user's perspective, not the system's.

For each use case, the document notes whether the capability currently exists, is partially built, or is a likely future need.

For actor definitions, see `docs/product/glossary.md`. For the domain model, see `docs/architecture/ddd-and-uml-tutorial.md`.

---

## How to Read a Use Case

Each use case includes:

- **Actor** — who initiates or participates in this workflow
- **Goal** — what the actor wants to accomplish
- **Preconditions** — what must be true before the use case begins
- **Steps** — what happens
- **Outcome** — what is true after it succeeds
- **Status** — whether this is currently implemented, partially built, or a future need

---

## Resident Use Cases

### UC-R1: Find a Repair Location

**Actor:** Resident  
**Goal:** Find a nearby place to get a specific item repaired  
**Status:** Partially built — the data model and pipeline exist; the client UI is not yet connected to real data

**Preconditions:**
- The resident has an item that needs repair
- Location data has been ingested by the ETL pipeline

**Steps:**
1. Resident opens the app
2. Resident enters the item type or browses by category
3. App returns a list of locations that offer repair services for that item category
4. Resident selects a location to see its address, contact info, and hours
5. Resident notes the location and plans their visit

**Outcome:** The resident knows where to go to get their item repaired.

**Notes:** The `Activity.REPAIR_FREE` and `Activity.REPAIR_PAID` values distinguish free repair (repair cafes, community events) from paid repair (professional shops). The `ItemCategory` enum further narrows the results. Neither filter is exposed in the client yet.

---

### UC-R2: Find a Donation Drop-Off Location

**Actor:** Resident  
**Goal:** Find somewhere to donate items they no longer need  
**Status:** Future — data model supports it; client UI does not yet exist

**Preconditions:**
- The resident has items they want to give away
- Location data with `Activity.DONATION_DROP` has been ingested

**Steps:**
1. Resident opens the app
2. Resident selects "Donate" or "Drop off"
3. App returns locations that accept donation drop-offs, optionally filtered by item category
4. Resident selects a location and reviews what items they accept
5. Resident visits and donates their items

**Outcome:** The resident donates their items rather than discarding them.

---

### UC-R3: Find Free Items to Pick Up

**Actor:** Resident  
**Goal:** Find somewhere to pick up free items  
**Status:** Future — `Activity.DONATION_PICK` exists in the schema; no client UI

**Preconditions:**
- Location data with `Activity.DONATION_PICK` has been ingested (free stores, give-away shops, community sharing points)

**Steps:**
1. Resident opens the app
2. Resident selects "Pick up free items" or "Free store"
3. App returns locations offering free items
4. Resident visits

**Outcome:** Resident finds a free item they needed, avoiding a purchase.

---

### UC-R4: Find Secondhand Goods to Buy

**Actor:** Resident  
**Goal:** Buy a used item instead of buying new  
**Status:** Future — `Activity.RESALE_BUY` exists in schema; no client UI

**Steps:**
1. Resident opens the app
2. Resident browses or searches for resale locations
3. App returns thrift stores, consignment shops, and secondhand shops with `Activity.RESALE_BUY`
4. Resident finds a location and visits

**Outcome:** Resident buys used goods rather than new.

---

### UC-R5: Borrow a Tool or Item

**Actor:** Resident  
**Goal:** Borrow a tool or item temporarily rather than buying it  
**Status:** Future — `Activity.BORROWING` exists in schema; no client UI

**Preconditions:**
- Location data with `Activity.BORROWING` has been ingested (tool libraries, item lending libraries)

**Steps:**
1. Resident opens the app
2. Resident searches for borrowing locations, optionally filtering by item category
3. App returns tool libraries and lending programs
4. Resident visits, presents membership or ID as required, and borrows the item

**Outcome:** Resident borrows a tool without buying it.

---

### UC-R6: Search by Item Name

**Actor:** Resident  
**Goal:** Type what they have or need and get relevant results  
**Status:** Partial prototype — fuzzy search UI exists in `client/src/pages/dev/fuzzy-search/` using mock item data; not connected to real locations

**Steps:**
1. Resident opens the app
2. Resident types an item name (e.g. "drill" or "winter coat")
3. App fuzzy-matches the input against known item categories
4. App returns locations relevant to that item

**Outcome:** Resident finds relevant locations without needing to know what "item category" means.

**Notes:** The mock data list in `client/src/pages/dev/fuzzy-search/-mock-data/items.ts` includes the full item vocabulary the fuzzy search is expected to work across. Promoting this prototype means connecting it to real location data and the `ItemCategory` + `Activity` model.

---

## Program Staff Use Cases

### UC-S1: Verify a Location Record

**Actor:** Program Staff  
**Goal:** Confirm that a location record is still accurate  
**Status:** Not yet built — `last_verified` field exists in schema but no workflow exists

**Preconditions:**
- A location record exists in the system
- Program staff has access to a curation tool (not yet built)

**Steps:**
1. Staff opens the curation interface
2. Staff reviews a location record (name, address, services, hours, contact)
3. Staff confirms accuracy or makes corrections
4. System updates `last_verified` timestamp
5. Verified record is marked as current

**Outcome:** Location record is marked verified with a current timestamp. Residents see accurate data.

---

### UC-S2: Correct a Location Record

**Actor:** Program Staff  
**Goal:** Fix inaccurate or outdated information in a location record  
**Status:** Not yet built

**Steps:**
1. Staff identifies a record with outdated information
2. Staff edits the relevant fields (hours, phone number, services offered)
3. System saves the corrected record and updates `last_verified`

**Outcome:** The corrected record replaces the outdated one.

---

### UC-S3: Flag a Location as Closed

**Actor:** Program Staff  
**Goal:** Mark a location that has closed or is no longer operating  
**Status:** Not yet built — no closed/inactive status in the current schema

**Steps:**
1. Staff discovers a location has permanently closed
2. Staff marks the record as inactive
3. App no longer shows the location in resident-facing results

**Outcome:** Residents do not get directed to a closed location.

**Notes:** The current schema does not have a status field for active/inactive locations. Adding one would be a schema-level change.

---

## Contributor Use Cases

### UC-C1: Add a New Data Source

**Actor:** Contributor  
**Goal:** Connect a new external data source (e.g. Yelp, a city dataset) to the ETL pipeline  
**Status:** Supported — the base classes are designed for this

**Preconditions:**
- The data source has an accessible API or downloadable dataset
- The Contributor has access to credentials or the data file

**Steps:**
1. Contributor creates a new folder under `etl/pipelines/` for the new source
2. Contributor subclasses `BaseQuerier` to fetch data from the source, returning a list of `RawLocation` objects
3. Contributor subclasses `BaseNormalizer` to map source-specific fields to `NormalizedLocation`
4. Contributor writes tests to verify the normalization is correct
5. Contributor opens a PR for review
6. Maintainer reviews and merges

**Outcome:** The new data source is integrated into the pipeline and its locations appear in the app.

**Code reference:** `etl/base/querier.py`, `etl/base/normalizer.py`, `etl/pipelines/example/` (reference implementation)

---

### UC-C2: Promote a Prototype to Production

**Actor:** Contributor, Maintainer  
**Goal:** Move a feature from the `/dev` prototype section into the main application  
**Status:** Process not yet formalized; prototype folder convention exists in the client

**Preconditions:**
- The prototype is working and demonstrates the intended behavior
- The Contributor has identified what mock data needs to be replaced with real data

**Steps:**
1. Contributor identifies a prototype in `client/src/pages/dev/` ready for promotion
2. Contributor connects the prototype to real data via the server API
3. Contributor removes mock data dependencies
4. Contributor moves the component to the appropriate place in `client/src/pages/`
5. Contributor updates routing in `tsr.config.json` and removes the dev-only route
6. Contributor adds appropriate tests
7. Contributor opens a PR for review
8. Maintainer reviews and merges

**Outcome:** Feature is available to all residents, not just developers.

**Code reference:** `client/src/pages/dev/`, `client/tsr.config.json`

---

### UC-C3: Run an ETL Pipeline Locally

**Actor:** Contributor  
**Goal:** Run the pipeline to ingest location data during development  
**Status:** Supported — the example pipeline can be run locally

**Steps:**
1. Contributor navigates to the `etl/` directory
2. Contributor runs the pipeline for a specific source
3. `JSONIngester` writes normalized location records to a JSON file
4. Contributor inspects the output to verify correctness

**Outcome:** Location data is normalized and available for local testing.

---

## Maintainer Use Cases

### UC-M1: Review and Merge a New Data Source

**Actor:** Maintainer  
**Goal:** Review a contributor's new pipeline implementation and merge it  
**Status:** Supported — standard PR workflow

**Steps:**
1. Maintainer reviews the new Querier and Normalizer subclasses
2. Maintainer checks that the normalization maps source fields correctly to the shared schema
3. Maintainer verifies that tests exist and pass
4. Maintainer confirms the new source does not break existing pipelines
5. Maintainer merges the PR

**Outcome:** New data source is part of the main codebase.

---

### UC-M2: Decide Whether to Expand the Activity Vocabulary

**Actor:** Maintainer  
**Goal:** Decide whether a new type of activity (e.g. "composting drop-off") should be added to the `Activity` enum  
**Status:** Governance process not formally defined

**Steps:**
1. Maintainer or Contributor identifies that a new kind of activity is appearing in source data that does not map to any existing `Activity` value
2. Team discusses whether this is truly a new activity type or can be approximated by an existing one
3. If a new type is warranted, the `Activity` enum and any related UI filters are updated
4. The decision is documented in an ADR

**Outcome:** The domain vocabulary is extended intentionally.

**Notes:** The controlled vocabulary approach in `etl/dtos.py` means this is a deliberate decision, not an automatic free-text expansion.

---

## External Data Source Use Cases

### UC-E1: Provide Location Data via API

**Actor:** External Data Source (e.g. Google Places, OpenStreetMap)  
**Goal:** Supply raw location records to the pipeline  
**Status:** Exploration underway — sample data in `data-explorations/`

**Steps:**
1. Querier authenticates with the external API
2. Querier fetches location records (with pagination if needed)
3. Querier wraps each record in a `RawLocation` DTO
4. `RawLocation` list is passed to the Normalizer

**Outcome:** Raw records are available for normalization.

**Notes:** `data-explorations/google-places/` and `data-explorations/openstreetmap/` contain sample data used to understand each source's format. Neither has a production Querier yet.

---

## Future Use Cases Worth Considering

These are not implemented and have no code yet, but are natural next steps given the domain:

| ID | Use Case | Actors | Why it matters |
|---|---|---|---|
| UC-F1 | Flag a location as inaccurate (resident-reported) | Resident | Crowdsourced quality signals |
| UC-F2 | Browse locations on a map | Resident | Spatial discovery is more intuitive than list browsing |
| UC-F3 | Subscribe to alerts for new locations near me | Resident | Keeps engaged users informed |
| UC-F4 | Add a new location (community submission) | Resident, Program Staff | Grassroots expansion of the directory |
| UC-F5 | Export location data as open data | Program Staff, Researcher | Supports open-data goals of the circular economy mission |
| UC-F6 | Schedule automated ETL runs | Maintainer | Keeps data current without manual intervention |
| UC-F7 | Monitor data freshness across sources | Maintainer, Program Staff | Surfaces stale records that need re-fetching or verification |
