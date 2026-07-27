# Use Cases

This document describes the use cases for the Boston Circular Economy platform. Each use case captures a discrete interaction between an actor and the system, defined by a goal and the conditions for success.

Actors are defined in [ddd-and-uml-tutorial.md](../architecture/ddd-and-uml-tutorial.md#2-actors). Domain terms are defined in [glossary.md](glossary.md).

---

## Resident Use Cases

### UC-R1: Find Locations by Activity

**Actor:** Resident  
**Goal:** Discover circular economy locations that offer a specific type of service.

**Precondition:** The resident is using the map interface and knows what kind of activity they need (repair, donation drop-off, borrowing, etc.).

**Main flow:**
1. The resident selects one or more activity types from the filter panel.
2. The map updates to show only locations that offer the selected activities.
3. The resident sees pins representing matching locations, each labeled with the location's name.

**Success outcome:** The resident can see which locations near them offer the activity they want.

**Notes:** A resident might not know the exact activity name but can browse the list of options. Activity labels should be written in plain language ("Repair — Free", "Donate your items") rather than technical identifiers.

---

### UC-R2: Find Locations by Item Category

**Actor:** Resident  
**Goal:** Narrow search results to locations that handle a specific type of goods.

**Precondition:** The resident has a specific item in mind (broken laptop, bag of clothing, etc.).

**Main flow:**
1. The resident selects one or more item categories from the filter panel.
2. The map updates to show only locations with services that match the selected categories.
3. The resident can combine an item category filter with an activity filter to further narrow results.

**Success outcome:** The resident sees only locations relevant to the item they have.

**Notes:** Filters for activity and item category should work together. A resident looking to donate clothing should be able to filter by both `donation_drop` and `clothing` simultaneously.

---

### UC-R3: View Location Details

**Actor:** Resident  
**Goal:** Get the full details of a specific location before visiting.

**Precondition:** The resident can see a location on the map.

**Main flow:**
1. The resident clicks or taps a location pin.
2. A detail panel opens showing: name, address, contact information (phone, website), opening hours, and the list of services offered.
3. The resident reads the details and decides whether to visit.

**Success outcome:** The resident has enough information to visit the location without needing to search elsewhere.

**Notes:** Some fields may be null if the data source did not provide them (for example, a location may have no phone number). The UI should handle missing fields gracefully without showing blank labels.

---

### UC-R4: Get Directions to a Location

**Actor:** Resident  
**Goal:** Navigate from their current location to a circular economy venue.

**Precondition:** The resident has viewed a location's details and wants to go there.

**Main flow:**
1. The resident taps a "Get directions" link in the location detail panel.
2. The platform opens a navigation app (Google Maps, Apple Maps, or the device's default) pre-populated with the destination address.
3. The resident follows the navigation.

**Success outcome:** The resident arrives at the location.

**Notes:** This use case depends on UC-R3 (the resident must first view the location details). The platform itself does not provide turn-by-turn navigation; it hands off to an external app.

---

## Data Contributor Use Cases

### UC-C1: Add a New Data Source

**Actor:** Data Contributor  
**Goal:** Integrate a new external data source so its locations appear in the directory.

**Precondition:** The contributor has access to a data source (API, dataset, or web service) that contains circular economy location data and has read the ETL contributing guide.

**Main flow:**
1. The contributor creates a new directory under `etl/src/etl/sources/<source_name>/`.
2. The contributor implements `BaseQuerier` in `querier.py`. The `fetch()` method retrieves all relevant locations from the source and returns them as a list of `RawLocation` objects.
3. The contributor implements `BaseNormalizer` in `normalizer.py`. The `normalize()` method maps each `RawLocation` payload to a `NormalizedLocation`, translating the source's field names and values into the shared schema.
4. The contributor writes a `test_pipeline.py` with tests that cover the normalization logic.
5. The contributor runs the tests locally to confirm they pass.
6. The contributor opens a pull request.

**Success outcome:** The new source's locations are ingested in subsequent pipeline runs and appear in the map after the next merge.

**Notes:** The contributor is responsible only for the Querier and Normalizer. The DataStore and MergeProcessor are shared infrastructure and do not need to be changed per source.

---

### UC-C2: Update Normalization Logic for an Existing Source

**Actor:** Data Contributor  
**Goal:** Correct or extend how a source's raw data is mapped to the shared schema.

**Precondition:** The contributor has identified an issue with an existing normalizer (incorrect field mapping, missing activity classification, etc.).

**Main flow:**
1. The contributor locates the normalizer file for the affected source.
2. The contributor updates the `normalize()` method to fix the mapping.
3. The contributor updates or adds tests in `test_pipeline.py` to cover the changed behavior.
4. The contributor runs the tests and confirms they pass.
5. The contributor opens a pull request.

**Success outcome:** The normalization issue is resolved and the fix is covered by tests.

---

### UC-C3: Add a New Activity or Item Category

**Actor:** Data Contributor  
**Goal:** Extend the taxonomy to include a new type of activity or item category.

**Precondition:** The contributor has identified a real-world circular economy activity or item type that is not covered by the current enums.

**Main flow:**
1. The contributor adds the new value to the `Activity` or `ItemCategory` enum in `etl/src/etl/dtos.py`.
2. The contributor reviews each existing normalizer to determine whether any source offers this activity or category, and updates those normalizers accordingly.
3. The contributor opens a pull request for review.

**Success outcome:** The new activity or category is recognized by the data model and any relevant sources map to it correctly.

**Notes:** Adding a new activity or item category affects the data model, the normalization logic for potentially every source, and the frontend filter UI. This is a cross-cutting product decision that should be discussed with the team before implementation.

---

## Administrator Use Cases

### UC-A1: Trigger the Merge Process

**Actor:** Administrator  
**Goal:** Produce the latest merged output from all source snapshots.

**Precondition:** At least one source snapshot has been written to the data store by a completed ETL run.

**Main flow:**
1. The administrator triggers the merge job.
2. `MergeProcessor.process()` reads the current source snapshots.
3. `MergeProcessor.match()` groups records that refer to the same real-world location.
4. `MergeProcessor.prioritize()` resolves conflicts where sources disagree on field values.
5. The merged output locations are written to the output store.

**Success outcome:** The output store contains a deduplicated, up-to-date set of locations ready to be served by the API.

**Notes:** The `match()` and `prioritize()` methods are not yet implemented. Until they are, the merge process produces no output and this use case cannot be completed.

---

### UC-A2: Mark a Location as Closed

**Actor:** Administrator  
**Goal:** Remove a location that has permanently closed from the live directory.

**Precondition:** The administrator has confirmed that a location is no longer operating.

**Main flow:**
1. The administrator identifies the location in the data store by its `data_source` and `data_source_id`.
2. The administrator updates the record to indicate the location is closed or removes it from the output.
3. The change is reflected in the next API response.

**Success outcome:** The closed location no longer appears in the resident-facing map.

**Notes:** A self-service workflow for operators to report closures is a planned future feature. In the current system this action requires manual intervention by an administrator.

---

### UC-A3: Investigate a Merge Conflict

**Actor:** Administrator  
**Goal:** Resolve a case where two or more source records for the same physical location have conflicting data (different names, addresses, or service classifications).

**Precondition:** The merge process has identified a match group where sources disagree on one or more fields.

**Main flow:**
1. The administrator reviews the conflicting records from each source.
2. The administrator determines which source is more reliable for the conflicting fields.
3. If necessary, the administrator updates the prioritization logic in `MergeProcessor.prioritize()` to handle this class of conflict consistently.
4. The administrator re-runs the merge to confirm the conflict is resolved.

**Success outcome:** The merged output record reflects the correct data and the conflict is handled consistently for similar cases in the future.

---

## Future Use Cases

The following use cases are anticipated but not yet implemented.

**UC-F1: Operator Submits a New Listing** — A location operator fills out a form to submit their venue to the directory, triggering a review and approval workflow before the listing goes live.

**UC-F2: Operator Updates a Listing** — A location operator logs in to edit their venue's information (hours, services, contact details).

**UC-F3: Resident Saves a Favorite Location** — A resident bookmarks a location for quick access on future visits.

**UC-F4: Resident Reports Inaccurate Information** — A resident flags a listing as outdated or incorrect, triggering a review.

**UC-F5: Scheduled ETL Run** — The ETL pipeline runs automatically on a defined schedule, keeping source snapshots current without manual triggering.
