# UI Design Inspiration & CSS Pattern Library
> Compiled from civic tech benchmarks, sustainability platforms, and world-class map UIs

---

## Civic Design Benchmarks That Set the Bar

### Color Palettes Worth Stealing

````carousel
### 🏛️ Boston.gov (Fleet System)
| Token | Hex | Usage |
|---|---|---|
| Charles Blue | `#091F2F` | Header, dark surfaces |
| Optimistic Blue | `#1871BD` | Links, CTAs |
| Freedom Trail Red | `#FB4D42` | Accents, alerts |
| Neutral Ground | `#F2F2F2` | Backgrounds |

*Why it works:* Authoritative navy + warm red accent = civic trust with energy.
<!-- slide -->
### 🌿 Too Good To Go
| Token | Hex | Usage |
|---|---|---|
| Blue Stone | `#00615F` | Primary teal |
| Vista White | `#F9F3F0` | Warm background |
| Coral Peach | `#FF7E67` | Accent CTA |
| Eco Leaf | `#2D8A4E` | Success, impact |

*Why it works:* Warm cream replaces cold white — feels inviting, not sterile.
<!-- slide -->
### ⚡ Back Market
| Token | Hex | Usage |
|---|---|---|
| Pure Black | `#000000` | Base |
| Electric Mint | `#00F5D4` | Neon accent |
| Resale Green | `#00FF66` | Impact highlights |
| Muted Slate | `#8E8E93` | Secondary text |

*Why it works:* High-contrast dark mode + neon = premium tech feel.
<!-- slide -->
### 🇫🇮 Helsinki Design System
| Token | Hex | Usage |
|---|---|---|
| Bus Blue | `#0000BF` | Primary brand |
| Tram Green | `#008A5A` | Secondary |
| Brick Red | `#BD2719` | Alerts |
| Fog Light | `#F2F2F8` | Surfaces |

*Why it works:* Transit-color naming connects design to civic identity.
````

---

## 🚇 MBTA Official Line Colors

| Line | Hex | CSS Variable |
|---|---|---|
| Red Line | `#DA291C` | `--mbta-red` |
| Green Line | `#00843D` | `--mbta-green` |
| Orange Line | `#ED8B00` | `--mbta-orange` |
| Blue Line | `#003DA5` | `--mbta-blue` |
| Silver Line | `#7C878E` | `--mbta-silver` |
| Commuter Rail | `#80276C` | `--mbta-commuter` |
| Key Bus | `#FFC72C` | `--mbta-bus` |

---

## Premium CSS Patterns (Copy-Paste Ready)

### 🔮 Glassmorphism Card
```css
.glass-card {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 1.25rem;
  box-shadow: 
    0 20px 40px -15px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.7);
  padding: 1.75rem;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.7);
}

@supports not (backdrop-filter: blur(1px)) {
  .glass-card { background: #f8fafc; }
}
```

### 📊 Pure CSS Animated Counter (No JavaScript!)
```css
@property --num {
  syntax: "<integer>";
  initial-value: 0;
  inherits: false;
}

.animated-stat {
  transition: --num 2s cubic-bezier(0.16, 1, 0.3, 1);
  counter-reset: num var(--num);
  font-size: 3rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.animated-stat::after {
  content: counter(num);
}

/* Trigger on scroll into view */
.animated-stat.in-view { --num: 4850; }
```

### ✨ Staggered Entrance Animation
```css
.stagger-item {
  opacity: 0;
  animation: stagger-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--i) * 0.08s);
}

@keyframes stagger-in {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Usage: <div style="--i: 1">, <div style="--i: 2">, etc. */
```

### 💀 Skeleton Shimmer Loader
```css
.skeleton {
  background: linear-gradient(90deg,
    #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite ease-in-out;
  border-radius: 0.375rem;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; background: #f0f0f0; }
}
```

### 🎯 Active Step Pulse Ring
```css
.step-active .step-icon {
  box-shadow: 0 0 0 6px rgba(249, 115, 22, 0.2);
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
  0%  { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); }
  100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
}
```

### 🌊 CSS Scroll-Driven Card Reveal (Zero JS)
```css
.scroll-reveal {
  animation: fade-up linear both;
  animation-timeline: view();
  animation-range: entry 10% cover 30%;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 🗺️ Map UI Patterns

### Split-Screen Layout (Airbnb Pattern)

```css
.map-layout {
  display: flex;
  height: calc(100vh - var(--header-height));
  overflow: hidden;
}

.map-sidebar {
  width: 420px;
  flex-shrink: 0;
  overflow-y: auto;
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.05);
}

.map-viewport {
  flex: 1;
  position: relative;
}

@media (max-width: 767px) {
  .map-layout { flex-direction: column-reverse; }
  .map-sidebar {
    width: 100%;
    height: 45vh;
    border-right: none;
    border-top: 1px solid #e5e7eb;
    border-radius: 1.5rem 1.5rem 0 0;
  }
  .map-viewport { height: 55vh; }
}
```

### Floating Glassmorphic Filter Bar
```css
.filter-bar {
  position: absolute;
  top: 16px; left: 16px; right: 16px;
  z-index: 500;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  padding: 8px 16px;
  border-radius: 9999px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.filter-chip {
  height: 36px;
  padding: 0 16px;
  border-radius: 9999px;
  border: 1px solid #d1d5db;
  background: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip.active {
  background: #111827;
  color: #fff;
  border-color: #111827;
}
```

### Airbnb-Style Price Pill Markers
```css
.map-marker-pill {
  background: #ffffff;
  color: #222;
  font-weight: 700;
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 28px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
              background 0.15s ease;
}

.map-marker-pill:hover,
.map-marker-pill.is-hovered {
  transform: scale(1.18);
  background: #222;
  color: #fff;
  z-index: 400;
}

.map-marker-pill.is-selected {
  background: #2563eb;
  color: #fff;
  outline: 3px solid rgba(37, 99, 236, 0.35);
}
```

### Detail Drawer (Slide-Over)
```css
.detail-drawer {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: #fff;
  z-index: 600;
  transform: translateX(-100%);
  transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
  overflow-y: auto;
}

.detail-drawer.open {
  transform: translateX(0);
}

/* Mobile: bottom sheet instead */
@media (max-width: 767px) {
  .detail-drawer {
    top: auto; bottom: 0;
    width: 100%; height: auto;
    max-height: 90vh;
    border-radius: 1.5rem 1.5rem 0 0;
    transform: translateY(100%);
  }
  .detail-drawer.open {
    transform: translateY(0);
  }
}
```

### Hover Sync Architecture (Sidebar ↔ Map)
```
[Hover Card #102]
      │
      ▼
[State: activeId = 102]
      │
      ├──────────────────────┐
      ▼                      ▼
[Sidebar Card #102]    [Map Marker #102]
 • adds .is-hovered     • scale(1.2)
 • elevated shadow      • z-index: 400
                         • pan if offscreen
```

---

## Z-Index Elevation Ladder
```
Modals / Global Popovers        z: 1000
Drawers / Detail Panels          z: 600
Floating Filters / Controls      z: 500
Hovered Map Markers              z: 400
Map Legend                       z: 300
Map Zoom/Compass Controls        z: 200
Default Map Markers              z: 100
Base Map Tiles                   z: 0
```

---

## What Makes It Feel "Premium" — 6 Rules

1. **Warm backgrounds** — Replace `#FFFFFF` with `#F9F3F0` or `#F8FAFB`. Cold white = clinical. Warm tints = inviting.
2. **Typography contrast** — Pair a bold heading font (Space Grotesk, Lora) with a clean body font (Inter). Monotone type = boring.
3. **Micro-animations** — Staggered entrances, pulse rings, shimmer loaders. Static pages = dead pages.
4. **Glass layering** — `backdrop-filter: blur()` on overlays and floating panels. Flat opaque boxes = dated.
5. **Bidirectional hover** — Sidebar card ↔ map marker sync. Disconnected elements = amateur.
6. **Tangible impact metrics** — "Equivalent to planting 3 trees" alongside raw stats. Raw numbers alone = cold.
