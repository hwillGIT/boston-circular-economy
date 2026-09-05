# Boston Circular Economy: Concise Visual Architecture & Decision Records (ADRs)

## Executive Summary

This updated guide is **laser-focused on the concrete decisions taken by the `boston-circular-economy` team** (partnered with the City of Boston Environment Department).

Instead of explaining abstract mapping options, it visually demystifies the team's exact architectural pipeline:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           TEAM ARCHITECTURAL PIPELINE                           │
│                                                                                 │
│   [Google Places API] ──┐                                                       │
│                         ├──> [Merge Processor & Deduplicator] ──> [API Server] ──> [Client Map]
│   [OpenStreetMap API] ──┘         (etl/merge_processor.py)         (server/)      (client/)
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4 Core Decisions Taken by the Team

### Decision 1: Dual Data Pipeline (Google Places API + OpenStreetMap API)

- **Why both?**
  - **Google Places**: Gives rich business metadata (operating hours, user reviews, phone numbers).
  - **OpenStreetMap**: Gives free, open spatial shapes (polygons, municipal recycling bins, drop-off points).
- **Visual Explainer**: How the two ETL scripts in `etl/` pull from both sources into local snapshots.

### Decision 2: The Merge Processor & Spatial Deduplication (`etl/`)

- **The Problem**: A repair shop like "Mattapan Community Repair" might exist in both Google Places AND OpenStreetMap.
- **The Team's Solution**: A Python `MergeProcessor` in `etl/` that matches locations by distance threshold (< 50 meters) and merges attributes into a single master record.
- **Visual Explainer**: Step-by-step visual diagram of spatial matching & property merging.

### Decision 3: Backend API Server Storage (`server/`)

- **Why?**: The front-end React client (`client/`) never queries Google Places or OpenStreetMap directly during user browsing. Instead, it queries your backend API server (`/api/locations`), which serves the pre-merged GeoJSON snapshot.
- **Visual Explainer**: Zero API key leaks, zero rate-limiting crashes, fast 50ms responses.

### Decision 4: Client-Side Rendering (`client/`)

- **Why?**: The client receives a clean GeoJSON `FeatureCollection` from `server/` and renders custom pins on a Leaflet / Google Maps canvas.

---

## Proposed Expansion & Visual Deliverables

1. **`boston_team_adrs_and_architecture.md`**: Concise visual explainer artifact focusing on the 4 team decisions.
2. **Two Custom Generated Diagrams**:
   - `boston_dual_etl_pipeline`: Visual diagram of Google Places + OSM parallel ETL ingestion.
   - `boston_merge_processor_flow`: Visual step-by-step explainer of spatial deduplication and property merging.
3. **Updated Sandbox App**: Add **"Boston Merge Processor Simulator"** tab.
