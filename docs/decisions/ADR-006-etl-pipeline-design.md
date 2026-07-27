# ADR-006: Structure the ETL pipeline as Querier → Normalizer → DataStore

**Date:** 2025-01-01  
**Status:** Accepted

## Decision

Each data source in the ETL pipeline is implemented as a pair of classes — a **Querier** (fetches raw data) and a **Normalizer** (converts it to a shared schema). A shared **DataStore** handles persistence and is not reimplemented per source.

The pipeline runs in two separate jobs:
1. `scrape-to-local` — fetches and normalizes data from each source, saving snapshots.
2. `merge-process-to-local` — merges the snapshots across sources and writes the final output.

## Why we chose this

- Each data source (Google Places, OpenStreetMap, etc.) has a different API and data format. Separating the fetch step (Querier) from the normalization step (Normalizer) keeps each concern small and testable on its own.
- A shared schema (NormalizedLocation) means once data is normalized, the rest of the pipeline doesn't need to know which source it came from.
- Splitting scraping and merging into two separate jobs makes it easy to re-run just the merge without re-fetching all data — useful when tuning the merge logic.
- Adding a new data source only requires writing a new Querier and Normalizer — no changes needed to the DataStore or merge logic.

## Alternatives we considered

| Option | Why we didn't choose it |
|--------|------------------------|
| One script per data source, each writing directly to the database | Simple to start, but quickly leads to duplicated logic and no shared schema. Hard to merge across sources later. |
| A single monolithic pipeline script | Harder to test, extend, or run partial steps. |
| Use a dedicated ETL framework | Too heavy for the current stage. Plain Python classes are easier to contribute to and debug. See also ADR-004. |

## Consequences

- Adding a new data source means creating a new `querier.py` and `normalizer.py` under `etl/src/etl/sources/<source_name>/`. See the ETL README for step-by-step instructions.
- The pipeline currently stores data to local files. Switching to a database-backed DataStore in future is a matter of implementing a new `BaseDataStore` subclass.
