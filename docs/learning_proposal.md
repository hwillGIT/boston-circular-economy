# Learning Proposal: Geographic Mapping & Boston Circular Economy Stack

> **Slash Command**: `/learn`  
> **Repository Target**: `hwillGIT/boston-circular-economy` (City of Boston Environment Department)

---

## 1. Classification & Rationale

### Proposed Rules
- **`RULE[geographic_api_security]`**:
  - Restrict client-side Google Maps API keys by HTTP Referrer in Cloud Console.
  - Proxy all sensitive endpoints (Places API New, Routes API, Overpass API queries) through the backend Express server (`server/routes/api.js`).
- **`RULE[open_data_first_class]`**:
  - For municipal and non-profit circular economy platforms, use **OpenStreetMap (OSM) & Overpass QL** as the primary open data source to eliminate recurring API tile billing.

### Proposed Skills
- **`boston-circular-mapping`**:
  - Complete integration pipeline connecting React (`client/`), Express (`server/`), Python GeoJSON ETL (`etl/`), and spatial explorations (`data-explorations/`) with Google Maps JS SDK & Leaflet.js.

---

## 2. Precise Text Additions

### Proposed Skill Specification (`SKILL.md`)
```markdown
# Boston Circular Economy Mapping Skill

## Stack Overview
- **Client**: React + Google Maps JS SDK (`AdvancedMarkerElement`) OR Leaflet.js + OSM tiles.
- **Server**: Express Node.js proxying Google Places API & Overpass QL for Boston bounding box (`[42.2270, -71.1912, 42.3968, -70.9860]`).
- **ETL**: Python `requests` + `geojson` formatting for Open Data ingestion.
```
