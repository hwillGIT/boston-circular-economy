# BCYF Data Integration & Ongoing Event Maintenance Strategy

> **Target Platform**: Boston Circular Economy  
> **Entity**: Boston Centers for Youth & Families (BCYF - 36 Community Facilities)

---

## 1. Initial Ingestion: How BCYF Locations Enter the Platform

To bring BCYF's 36 community locations into the platform, we employ a **2-Tiered Hybrid Ingestion Approach**:

```
 Tier 1: Facility Locations (Static)          Tier 2: Community Events (Dynamic)
┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
│ City of Boston Open Data Portal      │     │ BCYF Partner Admin Portal            │
│ (data.boston.gov / ArcGIS REST API) │     │ (/partner/bcyf-submit)               │
└──────────────────┬───────────────────┘     └──────────────────┬───────────────────┘
                   │                                            │
                   ▼                                            ▼
┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
│  etl/bcyf_ingest.py                  │     │  Express Backend API                 │
│  (Geocodes & Calculates MBTA Bounds) │     │  (POST /api/v1/events/bcyf)          │
└──────────────────┬───────────────────┘     └──────────────────┬───────────────────┘
                   │                                            │
                   └───────────────────┬────────────────────────┘
                                       ▼
                     ┌────────────────────────────────────┐
                     │ Master Pre-Merged GeoJSON Snapshot │
                     │ (server/data/boston_merged_nodes)  │
                     └────────────────────────────────────┘
```

---

### Phase A: Initial Dataset Import (Day 1 Setup)

1. **Source 1: City of Boston Open Data Portal (`data.boston.gov`)**
   - The City of Boston publishes official BCYF Community Center facility coordinates via ArcGIS REST / CKAN API endpoints.
   - We run a Python script (`etl/bcyf_ingest.py`) to query the API or parse the official CSV dataset.
2. **Spatial Enrichment**:
   - The ETL script calculates physical distance to the nearest MBTA station (Red Line, Orange Line, Blue Line, Green Line, Key Bus Routes).
   - Generates 36 GeoJSON `Point` features tagged with `facility_type: "bcyf_community_center"`.

---

## 2. Ongoing Maintenance & Updates: How Content Stays Fresh

Facility addresses change rarely, but **community events (Fix-It Clinics, Mending Circles, Tool Library hours)** change frequently.

Here is how we maintain data freshness over time:

---

### Strategy 1: Partner Self-Service Portal (`/partner/bcyf`)

BCYF site directors or volunteer Fix-It Cafe hosts submit upcoming events via a lightweight 1-minute form:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      BCYF EVENT SUBMISSION PORTAL                      │
├────────────────────────────────────────────────────────────────────────┤
│ Facility: [ BCYF Mattapan Community Center (525 River St)       ▼ ]   │
│ Event Type: (o) Fix-It Clinic  ( ) Clothing Swap  ( ) Mending Circle   │
│ Event Date: [ 2026-08-15 ]  Time: [ 10:00 AM ] to [ 2:00 PM ]          │
│ Cost: [ Free ]   Capacity: [ 25 Walk-ins / RSVP ]                       │
│ What to Bring: [ Small appliances, toaster, clothing seam repairs ]   │
│                                                                        │
│                       [ SUBMIT EVENT FOR REVIEW ]                      │
└────────────────────────────────────────────────────────────────────────┘
```

- **Verification Workflow**: Submissions go to a `pending_verification` queue. A designated project admin or BCYF liaison approves events with one click.
- **Auto-Expiration**: Events automatically archive 24 hours after their scheduled end time, preventing stale listings on the map.

---

### Strategy 2: Automated Calendar Feed Sync (iCal / RSS / Google Calendar)

If BCYF hosts post events on Boston.gov or Google Calendar:

- An automated cron task runs every 24 hours (`etl/calendar_sync.py`).
- Parses `.ics` / iCal feeds and updates event dates automatically without human intervention.

---

### Strategy 3: Semi-Annual Data Audit Script (`etl/audit_bcyf.py`)

Every 6 months, a python audit script runs to:

1. Re-query `data.boston.gov` to check for new BCYF center openings or address changes.
2. Flag inactive locations that haven't hosted a circular economy event in > 90 days.

---

## 3. Data Schema Extension for BCYF Nodes

To support BCYF facilities in our master GeoJSON format:

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-71.0921, 42.2764]
  },
  "properties": {
    "id": "bcyf-mattapan-001",
    "name": "BCYF Mattapan Community Center",
    "address": "525 River St, Mattapan, MA 02126",
    "facility_type": "bcyf_community_center",
    "mbta_access": {
      "nearest_station": "Mattapan Station (Mattapan High-Speed Line)",
      "walk_minutes": 4
    },
    "services_offered": ["fix_it_clinic", "clothing_swap", "tool_library"],
    "upcoming_events": [
      {
        "event_id": "evt-2026-0815",
        "title": "BCYF Mattapan Fix-It Clinic",
        "date": "2026-08-15",
        "hours": "10:00 AM - 2:00 PM",
        "cost": "Free",
        "walk_in": true
      }
    ],
    "city_district": "District 4 (Mattapan/Dorchester)"
  }
}
```

---

## 4. Operational Comparison Matrix

| Integration Method                  |  Setup Effort   | Maintenance Effort | Data Freshness | Best Used For                          |
| :---------------------------------- | :-------------: | :----------------: | :------------: | :------------------------------------- |
| **Initial Open Data API Import**    |   Low (1 Day)   |  Low (Automated)   |      High      | 36 BCYF Building Locations & Addresses |
| **Partner Web Portal (`/partner`)** | Medium (3 Days) | Low (1 min/event)  |   Real-Time    | Fix-It Clinic Dates & Clothing Swaps   |
| **iCal / Google Calendar Sync**     | Medium (2 Days) | Zero (Fully Auto)  |   Real-Time    | Boston.gov Official Events Calendar    |
