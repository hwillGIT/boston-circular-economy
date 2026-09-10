# Teamwork Project Prompt — Draft

> Status: Ready for launch — awaiting user approval
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

Develop a world-class visual guide and interactive web-based developer sandbox for Google's Geographic Mapping APIs (Maps JS API, Places API, Routes API, Geocoding API) tailored for developers building Circular Economy applications.

Working directory: `C:\Users\huber\.gemini\antigravity\scratch\google_maps_circular_economy_guide`
Integrity mode: development

## Requirements

### R1. Interactive Developer Visual Sandbox & Demo App

Build a responsive, dark-mode glassmorphism web app that serves as an interactive sandbox. It must feature:

- An interactive map preview demonstrating circular economy location nodes (E-Waste hubs, Recycling centers, Repair cafes, Material flow GeoJSON vectors).
- An interactive Visual Architecture Flow visualizer showing how API keys, Maps JS SDK, Places API, and Data Layers interact.
- An interactive Code Generator & Playground for dynamic imports (`importLibrary("marker")`), `AdvancedMarkerElement`, `PinElement`, GeoJSON layers, and Eco-Friendly Routes API calls.

### R2. Visual Master Guide Artifact

Create a comprehensive GFM markdown guide (`visual_guide_google_maps_api.md`) including:

- Architecture sequence diagrams & data flowcharts.
- Dialectic multi-option comparisons (GeoJSON Data Layer vs Advanced Markers vs WebGL; Places API vs Custom Backend).
- Code snippets with step-by-step annotations for developers of all experience levels.
- Best practices for API key security, HTTP referrer restrictions, billing alerts, dynamic imports, and exponential backoff retry patterns.

### R3. Visual Assets & Diagrams

Generate high-resolution visual diagrams and infographics illustrating key concepts, API lifecycle, authorization flows, and circular economy location data models.

## Acceptance Criteria

### Visual Quality & UX

- [ ] Modern UI with custom styling, glassmorphism card layouts, CSS animations, and polished color palette (emerald/teal for circular economy, cyan/blue for API elements).
- [ ] No generic browser defaults; uses modern sans-serif typography.

### Technical Accuracy & Completeness

- [ ] Demonstrates dynamic library import (`google.maps.importLibrary("marker")`).
- [ ] Uses modern `AdvancedMarkerElement` and `PinElement` with Map ID configuration.
- [ ] Includes Eco-friendly routing concepts from Google Routes API.
- [ ] Provides explicit API security guidance (HTTP referrers, API key restrictions, proxy patterns).

---

_Next: when approved → delegate via invoke_subagent (see Delegation Protocol)_
