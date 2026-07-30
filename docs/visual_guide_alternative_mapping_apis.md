# Alternative Geographic Mapping APIs: Mapbox GL JS & MapLibre GL JS Master Visual Guide

> **Special Focus**: Comparing Google Maps Platform with Mapbox GL JS & Open-Source MapLibre GL JS for Circular Economy Apps

---

## 1. Architectural Landscape & Infographic Overview

While Google Maps Platform offers comprehensive global POI data, modern spatial applications—especially in the **Circular Economy, Smart Cities, and Open Data sectors**—frequently use alternative mapping engines: **Mapbox GL JS** and **MapLibre GL JS (OpenStreetMap)**.

![Alternative Geographic Mapping APIs Architecture](file:///C:/Users/huber/.gemini/antigravity/brain/0d18a02f-8b58-4fea-84c2-22970cc05218/alternative_apis_architecture.jpg)

### Why Consider Alternative Mapping APIs?

1. **Custom Visual Styling**: Mapbox Studio allows pixel-level control over map cartography (e.g. custom dark/neon themes matching circular economy brand aesthetics).
2. **Isochrone Analysis (Catchment Zones)**: Calculate 5, 10, and 15-minute walking/cycling zones around recycling facilities and repair cafes.
3. **Data Sovereignty & Self-Hosting**: MapLibre GL JS combined with OpenStreetMap allows 100% self-hosted, privacy-compliant, zero lock-in deployment.

---

## 2. Triple Dialectic Decision Framework

```
                             MAP ENGINE SELECTION
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
Google Maps Platform                 Mapbox GL JS                MapLibre GL JS
Proprietary Global Data              Design-Driven Vector Maps    Open-Source & Self-Hostable
Best for: Commercial POI Lookup      Best for: Custom UX & Isochrone Best for: Data Ownership & Offline
```

### Comprehensive Technical Comparison Matrix

| Feature / Capability | Google Maps JS API | Mapbox GL JS | MapLibre GL JS (OSM) |
| :--- | :--- | :--- | :--- |
| **Data Engine** | Google Vector Renderer | WebGL Mapbox Vector | WebGL Open-Source Renderer |
| **Base Map Data** | Google Maps Database | OpenStreetMap + Custom | OpenStreetMap / Custom Tiles |
| **Custom Styling** | Cloud Style Editor (Basic) | Mapbox Studio (Advanced) | Maputnik / Open Style Spec |
| **Isochrone API** | Workarounds / Distance Matrix | Native Isochrone API | Valhalla / OSRM Self-Hosted |
| **Data Sovereignty** | Google Cloud Only | Mapbox Cloud | 100% Self-Hostable (PMTiles) |
| **Custom HTML Markers** | `AdvancedMarkerElement` | `mapboxgl.Marker` | `maplibregl.Marker` |
| **GeoJSON Performance** | `map.data` layer | `addSource('geojson')` | `addSource('geojson')` |
| **License** | Commercial Proprietary | Proprietary (v2+) | Open Source (BSD-3-Clause) |

---

## 3. Mapbox GL JS Deep-Dive & Annotated Code

Mapbox GL JS uses client-side WebGL rendering to draw vector tiles at 60 FPS.

### Step 1: Map Initialization & Custom Style
```javascript
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const map = new mapboxgl.Map({
  container: 'map', // DOM element ID
  style: 'mapbox://styles/mapbox/dark-v11', // Custom Studio Style URL
  center: [-122.4194, 37.7749], // [Lng, Lat] format! (Note order difference from Google Maps)
  zoom: 13,
  pitch: 45 // 3D perspective tilt
});
```

### Step 2: Adding HTML Custom Markers (Recycling Hubs)
```javascript
function addMapboxRecyclingMarker(map, lng, lat, title, capacity) {
  // Create DOM element for marker content
  const el = document.createElement('div');
  el.className = 'mapbox-custom-marker';
  el.innerHTML = `
    <div class="pin-head">♻️</div>
    <div class="pin-badge">${capacity}</div>
  `;

  // Instantiate Mapbox Marker
  new mapboxgl.Marker(el)
    .setLngLat([lng, lat]) // [Lng, Lat]
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h4>${title}</h4><p>Capacity: ${capacity}</p>`)
    )
    .addTo(map);
}
```

### Step 3: Fetching Catchment Isochrones (15-Minute Repair Cafe Zone)
```javascript
async function getIsochrone(lng, lat, minutes = 15) {
  const url = `https://api.mapbox.com/isochrone/v1/mapbox/cycling/${lng},${lat}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`;
  
  const response = await fetch(url);
  const data = await response.json();

  // Add Isochrone Polygon Source to Map
  if (map.getSource('isochrone-src')) {
    map.getSource('isochrone-src').setData(data);
  } else {
    map.addSource('isochrone-src', {
      type: 'geojson',
      data: data
    });

    map.addLayer({
      id: 'isochrone-layer',
      type: 'fill',
      source: 'isochrone-src',
      layout: {},
      paint: {
        'fill-color': '#10b981',
        'fill-opacity': 0.3
      }
    });
  }
}
```

---

## 4. MapLibre GL JS (Open-Source / OpenStreetMap) Deep-Dive

MapLibre GL JS is the community-driven open-source fork of Mapbox GL JS. It uses standard OpenStreetMap tiles or self-hosted vector tile servers like **TileServer GL** or **PMTiles**.

### Step 1: Open-Source Map Initialization (Zero API Key Required)
```javascript
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Initialize MapLibre with free vector style tiles (e.g. Demotiles / OpenStreetMap)
const map = new maplibregl.Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json', // Open-source tile spec
  center: [-122.4194, 37.7749], // [Lng, Lat]
  zoom: 12
});
```

### Step 2: Streaming GeoJSON Vector Layers in MapLibre
```javascript
map.on('load', () => {
  // Add GeoJSON Feature Collection Source
  map.addSource('material-flow-data', {
    type: 'geojson',
    data: 'https://your-domain.org/api/v1/circular-flow.geojson'
  });

  // Render Line Layer for Material Transport
  map.addLayer({
    id: 'material-flow-lines',
    type: 'line',
    source: 'material-flow-data',
    paint: {
      'line-color': '#06b6d4',
      'line-width': 4,
      'line-dasharray': [2, 2]
    }
  });
});
```

---

## 5. Self-Hosting Vector Tiles for Circular Economy Data Sovereignty

For municipal waste management, non-profit circular initiatives, or strict data privacy applications:

```
[OpenStreetMap Data (.pbf)] ──> [PMTiles / TileServer GL] ──> [MapLibre GL JS Client]
```

1. **Download OSM Extract**: Obtain free `.osm.pbf` regional data from Geofabrik.
2. **Convert to PMTiles**: Single-file cloud-optimized vector tile format that requires zero server backend (served directly over HTTP Range Requests).
3. **Render in MapLibre**: Point `style.json` to your self-hosted PMTiles URL.

---

## 6. Accessing the Interactive Engine Switcher Sandbox

The developer web application has been updated with a live **Engine Switcher & Isochrone Simulator**:

- **Web App**: [index.html](file:///C:/Users/huber/.gemini/antigravity/scratch/google_maps_circular_economy_guide/index.html)
- **Features**: Live side-by-side comparison of Google Maps vs Mapbox GL JS vs MapLibre GL JS, Isochrone radius calculator, and dynamic code playground.
