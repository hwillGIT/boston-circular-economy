# ADR-007: Use a shared location schema across all data sources

**Date:** 2025-01-01  
**Status:** Accepted

## Decision

All data sources are normalized into a single shared schema (`NormalizedLocation`) that describes a physical location, its services (what activities are available and for which item categories), and its availability. Each record retains its original `data_source` and `data_source_id` so it can be traced back to its origin.

## Why we chose this

- A consistent schema means the API server and frontend only need to understand one shape of data, regardless of how many sources exist.
- Retaining the `data_source` and `data_source_id` makes it possible to detect and merge duplicate businesses that appear in multiple sources (e.g. a repair cafe listed in both Google Places and OpenStreetMap).
- Describing what you can *do* at a location (the `Activity` enum) from the visitor's perspective — rather than echoing source-specific tags — keeps the model useful and consistent across different API structures.

## Alternatives we considered

| Option | Why we didn't choose it |
|--------|------------------------|
| Store raw source data and transform it at query time | More flexible, but the frontend and server would need source-specific logic everywhere. Hard to maintain. |
| One database table per data source | Easy initially, but makes cross-source features (deduplication, merged views) much harder. |
| Use a generic key-value schema (e.g. `{"key": "value"}` for all fields) | Fully flexible, but loses all type safety and makes the data hard to work with. |

## Consequences

- When a new source doesn't provide a field (e.g. no phone number), we store `null` — no fake data, no omission.
- The `Activity` and `ItemCategory` enums are intentionally limited to what's relevant for the project. They will need to be extended as the project grows.
- Merging duplicate businesses across sources (the MergeProcessor) depends on this shared schema being consistent. A future change to the schema must be applied to all normalizers.
