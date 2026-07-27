# Customer Journeys — Boston Circular Economy

This document maps out the step-by-step journeys that different actors take when using the application. A customer journey tells the story of one person trying to accomplish one goal — what they do, what the system does, and what can go wrong.

Journeys complement use cases. Where use cases describe **what the system supports**, journeys describe **what the experience feels like from the actor's point of view**.

Some journeys reflect current capabilities. Others describe the intended future experience. The status label on each journey makes this clear.

---

## Journey 1: Resident Finds a Repair Cafe

**Actor:** A Boston resident  
**Goal:** Get their broken toaster repaired for free  
**Status:** Future journey — the data and pipeline can support this; the resident-facing experience is not yet built

---

**The situation:**

Alex lives in Jamaica Plain and has a toaster that stopped working. Rather than throwing it away and buying a new one, Alex wants to see if it can be fixed. A friend mentioned there are repair cafes in Boston but Alex doesn't know where to find one.

---

**Step 1: Alex discovers the app**

Alex hears about the Boston Circular Economy app through a neighborhood newsletter. They open the website on their phone.

*Today:* The app shows a home page with a welcome message. There is no search functionality connected to real data yet.  
*Future intent:* The home page should offer a clear entry point: "What do you want to do?" or "What do you need help with?"

---

**Step 2: Alex searches for a repair location**

Alex wants to find somewhere to get a toaster fixed.

*Today:* The fuzzy search prototype (`client/src/pages/dev/fuzzy-search/`) lets Alex type "toaster" and see it highlighted in a list — but this is a UI experiment using mock data, not a live search.  
*Future intent:* Alex types "toaster" or selects "small appliances" under Electronics. The app queries locations with `Activity.REPAIR_FREE` or `Activity.REPAIR_PAID` and `ItemCategory.ELECTRONICS`.

---

**Step 3: Alex reviews the results**

A list of nearby repair locations appears, with names, neighborhoods, and hours.

*Future intent:* Results show the service type (free vs. paid), item categories accepted, and next available session. Alex sees "Beacon Hill Repair Cafe — Free electronics repair — Saturdays 10am–2pm."

---

**Step 4: Alex selects a location**

Alex taps the listing to see its full details: address, phone number, website, and any notes about what to bring.

*Future intent:* Detail view shows `NormalizedLocation.address`, `NormalizedLocation.contact`, and `NormalizedLocation.availability`.

---

**Step 5: Alex plans the visit**

Alex notes the Saturday hours and location. They attend the repair cafe, the toaster gets fixed, and it does not end up in the trash.

---

**What can go wrong:**
- The location's hours are outdated — the repair cafe now runs monthly, not weekly. This is the verification problem: `last_verified` is there in the schema, but the workflow to keep it current does not yet exist.
- The location has closed. There is no inactive/closed status in the current schema.
- The item type isn't covered — not all repair cafes do appliances. The `Service` model handles this, but only if the data is accurate.

---

## Journey 2: Resident Donates a Bag of Clothes

**Actor:** A Boston resident  
**Goal:** Find somewhere to drop off clothes they no longer wear  
**Status:** Future journey

---

**The situation:**

Sam is clearing out their closet and has a bag of old clothes in good condition. They don't want to throw them away. They want to find a local donation drop-off point.

---

**Step 1: Sam opens the app and selects Donate**

*Future intent:* A prominent action on the home screen: "Donate items" — mapped to `Activity.DONATION_DROP`.

---

**Step 2: Sam filters by item category**

Sam selects "Clothing" to narrow to locations that accept clothing donations.

*Future intent:* Filters map to `ItemCategory.CLOTHING` combined with `Activity.DONATION_DROP`.

---

**Step 3: Sam sees a map of nearby drop-off points**

*Future intent:* A map view shows pins for nearby locations. Sam can see which ones are close to home, work, or transit.

---

**Step 4: Sam checks availability**

Sam needs to know if they can drop off on a Tuesday afternoon.

*Future intent:* The `Availability.opening_hours` field provides this. The app parses the hours string and shows "Open Tue–Fri 10am–5pm."

---

**Step 5: Sam drops off the clothes**

The clothes go to someone who needs them rather than a landfill.

---

**What can go wrong:**
- The location doesn't accept the specific type of clothing (only formalwear, not casual). The current `Service` model doesn't have sub-categories within clothing yet.
- The drop-off bin is full. This is operational state that the app cannot track without real-time integration.

---

## Journey 3: Program Staff Verifies a New Batch of Locations

**Actor:** City program staff  
**Goal:** Review locations ingested from a new data source and confirm they are accurate  
**Status:** Future journey — no curation tool exists yet

---

**The situation:**

A city program coordinator named Jordan is responsible for the quality of location data in the app. The ETL pipeline has just ingested 30 new locations from an OpenStreetMap data pull. Jordan needs to review them before they appear to residents.

---

**Step 1: Jordan logs into the curation interface**

*Future intent:* A staff-facing interface (not the public app) shows a queue of records pending review.

---

**Step 2: Jordan reviews each record**

For each location, Jordan sees:
- Name, address, and coordinates
- Services listed (activity + item category)
- Availability / hours
- Last verified date (empty for new records)
- Data source and source ID

---

**Step 3: Jordan confirms or corrects the record**

Jordan checks:
- Is this place real and still operating?
- Are the listed services accurate?
- Are the hours correct?

Jordan can approve the record as-is, edit individual fields, or mark it for follow-up.

---

**Step 4: Jordan marks the record as verified**

*Future intent:* The system sets `NormalizedLocation.last_verified` to today's date and marks the record as verified. It is now eligible to appear in resident-facing results.

---

**Step 5: Jordan flags a location as closed**

While reviewing, Jordan finds that one location has permanently closed.

*Future intent:* Jordan marks it as inactive. It is removed from resident-facing results but remains in the database for audit purposes.

---

**What can go wrong:**
- Jordan can't reach the location to confirm hours. The record remains unverified.
- The source data has a data format error — the address is malformed. Jordan needs to manually correct it or flag it for the contributor who built the pipeline.

---

## Journey 4: Contributor Adds an OpenStreetMap Pipeline

**Actor:** A developer contributing to the project  
**Goal:** Build a production-ready Querier and Normalizer for OpenStreetMap data  
**Status:** Plausible near-term — sample data exists in `data-explorations/openstreetmap/`

---

**The situation:**

A contributor named River wants to connect the app to OpenStreetMap's Overpass API, which can be queried for repair cafes, thrift stores, and tool libraries across the Boston area.

---

**Step 1: River studies the sample data**

River opens `data-explorations/openstreetmap/samples/` and looks at what the Overpass API returns. They note the field names, the format of opening hours, and how location coordinates are structured.

---

**Step 2: River builds the Querier**

River creates `etl/pipelines/openstreetmap/querier.py` and subclasses `BaseQuerier`. The `fetch()` method calls the Overpass API, handles pagination, and returns a list of `RawLocation` objects where `data_source = "openstreetmap"`.

---

**Step 3: River builds the Normalizer**

River creates `etl/pipelines/openstreetmap/normalizer.py` and subclasses `BaseNormalizer`. The `normalize()` method maps OSM field names (e.g. `addr:street`, `opening_hours`, `amenity`) to the shared `NormalizedLocation` schema.

---

**Step 4: River maps OSM tags to domain vocabulary**

This is the interesting DDD challenge. OSM uses tags like `amenity=reuse`, `shop=second_hand`, and `craft=*` to describe location types. River has to decide how to map these to `Activity` values.

For example:
- `amenity=reuse` → `Activity.DONATION_DROP` or `Activity.DONATION_PICK` (or both)?
- `shop=second_hand` → `Activity.RESALE_BUY`

These decisions are documented in a comment in the normalizer, or potentially in a decision record.

---

**Step 5: River writes tests**

River writes unit tests in `etl/pipelines/openstreetmap/test_pipeline.py` using sample data from `data-explorations/openstreetmap/samples/`. The tests verify that known OSM records normalize to the expected `NormalizedLocation` output.

---

**Step 6: River opens a PR**

River opens a PR against `main`. The Maintainer reviews the normalization logic and tag mappings, asks clarifying questions, and merges.

---

**What can go wrong:**
- An OSM location has a tag combination the normalizer doesn't recognize. The normalizer needs to handle unknowns gracefully (skip the record or log a warning) rather than crash.
- The Overpass API rate-limits requests. The Querier needs to handle retries and respect limits.
- OSM data quality varies — some records have incomplete addresses or missing hours.

---

## Journey 5: Contributor Promotes the Fuzzy Search Prototype

**Actor:** A developer who wants to turn the prototype into a real feature  
**Goal:** Connect the fuzzy search to real location data and promote it to the main app  
**Status:** Likely near-term — the prototype is in `client/src/pages/dev/fuzzy-search/`

---

**The situation:**

The fuzzy search prototype works well for searching a static list of item names. The next step is connecting it to real location data so residents can type "toaster" and get actual repair locations.

---

**Step 1: Understand what the prototype does today**

The prototype (`client/src/pages/dev/fuzzy-search/index.tsx`) takes a text query, runs it through a character-matching algorithm against a list of mock item names (`-mock-data/items.ts`), and highlights matching characters.

---

**Step 2: Decide what the promoted feature should do**

The contributor decides on the promoted behavior:
- User types an item name
- App maps item name to one or more `ItemCategory` values
- App queries the server for locations with matching services
- App returns a list of locations with activity labels

---

**Step 3: Extend the server API**

The contributor adds an endpoint to the Express server (currently minimal — just `/ping` in `server/src/index.ts`):

```
GET /api/locations?activity=repair_free&item_category=electronics
```

The server queries the SQLite database (`server/src/db/index.ts`) for matching locations.

---

**Step 4: Connect the client to the API**

The contributor updates the search component to call the new API endpoint instead of matching against the mock data array. The fuzzy matching logic may still be useful for the item → category mapping step.

---

**Step 5: Move the component out of dev**

The contributor moves the working component from `client/src/pages/dev/fuzzy-search/` to the appropriate production location (e.g. `client/src/pages/search/`) and updates the route configuration.

---

**Step 6: PR, review, and merge**

The contributor opens a PR. The Maintainer reviews the API design, the client integration, and the route structure. After merge, the search feature is live for residents.

---

## Journey 6: Someone New Wants to Understand the Codebase

**Actor:** A new developer or project manager joining the project  
**Goal:** Get oriented quickly — understand the purpose, structure, and key concepts  
**Status:** Supported — the docs you are reading are part of this journey

---

**Step 1: Read the README**

The repository root `README.md` is minimal today — it just says "Client-side application for the Boston Circular Economy project." That is a gap: a good README should orient a newcomer in under 60 seconds.

---

**Step 2: Explore the folder structure**

The new contributor opens the repo and sees:
- `client/` — the React/Vite frontend
- `server/` — the Express backend
- `etl/` — the Python data pipeline
- `data-explorations/` — raw data samples from potential sources
- `docs/` — documentation (this file and others)

---

**Step 3: Read the domain model**

The new contributor opens `etl/dtos.py`. This is the most information-dense single file in the codebase. It defines the shared vocabulary: what a Location is, what a Service is, what Activities are supported.

---

**Step 4: Read the tutorial**

The new contributor reads `docs/architecture/ddd-and-uml-tutorial.md` to understand:
- Why the code is structured this way
- What DDD and UML mean in this context
- What the bounded contexts are
- What is built vs. what is planned

---

**Step 5: Read the glossary and use cases**

- `docs/product/glossary.md` — definitions of core terms
- `docs/product/use-cases.md` — what the system supports and for whom
- This document — what the experience looks like for each actor

---

**Step 6: Make a small contribution**

The new contributor finds something small to contribute — a documentation fix, a test for the example pipeline, or a new prototype in the dev section — and follows the workflow in `CONTRIBUTING.md`.
