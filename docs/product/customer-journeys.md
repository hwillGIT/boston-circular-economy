# Customer Journeys

A customer journey traces the complete experience of an actor from the moment they have a need through to the moment that need is satisfied. Journeys are narrative and human-centered. They include context, motivation, friction points, and emotional state in a way that formal use cases do not.

These journeys represent the primary ways people interact with the Boston Circular Economy platform today and in the near future. Each journey is grounded in the real activities and data model described in [glossary.md](glossary.md).

---

## Journey 1: The Repair-Seeking Resident

**Actor:** Resident  
**Goal:** Get a broken item repaired without buying a replacement.

**Context:** Sarah has a stand mixer that stopped working. She suspects it needs a new motor brush, a common repair, but does not know how to do it herself. She has heard of repair cafes but has never been to one. She is not sure if any operate near her or when they run.

**Journey:**

Sarah opens the Boston Circular Economy map on her phone. She sees a cluster of pins near her neighborhood but is not sure what kind of places they are.

She opens the activity filter and selects "Repair — Free." The map updates immediately, dimming most pins and highlighting a smaller set. Three pins remain visible within a mile of her home.

She taps the nearest pin. The detail panel opens and shows the name, address, and opening hours. The services list confirms it handles electronics and small appliances. She notes that the next session is Saturday morning and adds a reminder.

On Saturday she brings the mixer. A volunteer opens it up, identifies the problem, orders a replacement part for two dollars, and shows her how to install it during the next session. The mixer works again.

**What the platform provided:** A filtered view, location details with service classification and opening hours, and enough information to plan a visit. The repair cafe itself provided the repair.

---

## Journey 2: The Decluttering Resident

**Actor:** Resident  
**Goal:** Find a nearby place to donate unwanted clothing and household items.

**Context:** Marcus is clearing out his apartment. He has three bags of clothes he no longer wears, a working toaster oven, and a box of books. He wants to donate rather than trash these items, but the major chains are inconvenient for him and he is not sure what else is available.

**Journey:**

Marcus opens the map on his laptop. He selects "Donate your items" from the activity filter and "Clothing" from the item category filter. Several locations appear within two miles.

He notices one location has a website link and clicks it to confirm they accept drop-ins rather than requiring appointments. The site confirms they do.

He loads his bags into his car and drives over on a weekday evening. The drop-off takes five minutes.

Later that week, thinking about the toaster oven and books, he returns to the map and separately filters for household goods and books. He finds two more locations and plans two additional trips.

**What the platform provided:** A way to filter by what the resident has, not just by what they want. The separation of service types into activity plus item category let Marcus address each item type independently.

---

## Journey 3: The Tool-Borrowing Resident

**Actor:** Resident  
**Goal:** Borrow a specific tool for a one-time home project.

**Context:** Priya is retiling her bathroom. She needs a wet tile saw for a single weekend. Buying one costs two hundred dollars; she will never need it again. She has heard tool libraries exist but has never found one she was sure was still operating.

**Journey:**

Priya opens the map and selects "Borrow tools" from the filters. One pin appears in her neighborhood.

She taps it and reads the details. The listing shows a website, an address, and a note that the library is open Tuesday evenings and Saturday mornings. She visits on a Tuesday, confirms they have the wet saw, and books it for the following weekend.

She borrows the saw, tiles the bathroom, and returns it on Saturday.

**What the platform provided:** Confirmation that the tool library was active, its address and hours, and enough confidence to make the trip before calling ahead. This is especially valuable for venues like tool libraries that have irregular hours or no prominent online presence.

---

## Journey 4: The Secondhand Shopper

**Actor:** Resident  
**Goal:** Buy a piece of used furniture instead of buying new.

**Context:** Yolanda is furnishing her first apartment on a budget. She wants a bookshelf and a desk and is open to secondhand if she can find them nearby.

**Journey:**

Yolanda opens the map and selects "Buy secondhand" and "Furniture." Several pins appear across different neighborhoods.

She sorts mentally by distance and visits two locations on the same afternoon. The first has a desk that fits her space. The second has a bookshelf in good condition. She buys both for less than the cost of one new piece of flat-pack furniture.

**What the platform provided:** A quick overview of resale venues that carry furniture, saving Yolanda the time of visiting irrelevant stores. The service classification let her filter by both activity type and item category at once.

---

## Journey 5: The Data Contributor

**Actor:** Data Contributor  
**Goal:** Integrate a new external data source into the ETL pipeline.

**Context:** A developer named Omar has discovered that a regional nonprofit publishes a public dataset of repair cafes and tool libraries in the Boston area. The dataset is available as a JSON API and includes information not covered by the existing Google Places and OpenStreetMap sources. He wants to add it to the pipeline.

**Journey:**

Omar reads the ETL README to understand the pipeline architecture and the interfaces he needs to implement.

He creates a new directory at `etl/src/etl/sources/repaircafe_network/` and adds `__init__.py`, `querier.py`, and `normalizer.py`.

He writes `GooglePlacesQuerier` as a reference and implements `RepairCafeNetworkQuerier`. The source's API returns paginated JSON, so he handles pagination inside `fetch()` so the rest of the pipeline sees a flat list.

He then writes `RepairCafeNetworkNormalizer`. The source uses non-standard field names and represents opening hours as a dictionary rather than a string. He maps these fields to the `NormalizedLocation` schema, converting the hours dictionary to a human-readable string.

He writes tests in `test_pipeline.py` covering several representative payloads, including edge cases where some optional fields are absent.

He runs `pytest` locally and all tests pass. He opens a pull request, noting the source, the number of locations it covers, and any normalization decisions that required judgment.

**What the platform provided:** A well-defined interface (`BaseQuerier`, `BaseNormalizer`, and the DTO schema) that made it clear exactly what Omar needed to implement. The shared DataStore meant he did not need to write any persistence code.

---

## Journey 6: The Returning Resident (Future)

**Actor:** Resident  
**Goal:** Revisit a location found in a previous session.

**Context:** A resident found a useful repair cafe on the map six months ago. They want to find it again without repeating the full search.

**Blocked by:** This journey is not yet possible. The platform does not currently support saved locations or user accounts.

When a favorites feature is implemented, this journey will proceed as: open the app, tap "Saved," see the previously bookmarked location, and tap for directions.

---

## Journey 7: The Location Operator (Future)

**Actor:** Location Operator  
**Goal:** Submit their venue to the directory and keep its listing accurate.

**Context:** The organizer of a new repair cafe that opened three months ago wants it to appear in the directory. They have noticed that some information about similar venues in the map is outdated and want to be able to correct their own listing without waiting for a data re-scrape.

**Blocked by:** This journey is not yet possible. The platform does not currently have a self-service submission or editing interface.

When an operator portal is implemented, the journey will proceed as: fill out a submission form, wait for admin approval, and then log in to edit hours, services, and contact details.
