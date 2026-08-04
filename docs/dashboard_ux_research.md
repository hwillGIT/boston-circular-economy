# Dashboard UX/UI Guiding Principles
## Desktop · Web App · Mobile

> [!IMPORTANT]
> This document provides platform-specific design guidance. Desktop, web app, and
> mobile are three distinct contexts with different user intent, input methods, and
> layout conventions. Do NOT apply mobile principles to desktop or vice versa.

---

## Part 1: Desktop Dashboard Design

Desktop is for **deep exploration and complex tasks**. Users have a large screen,
a precision mouse, and a keyboard. They expect information density.

### Layout

| Principle | Guideline | Reference |
|---|---|---|
| **Two-column layout** | Standard and recommended. Main content (flexible width) + sidebar (240–280px fixed). | GitHub, Vercel, Figma, Stripe |
| **Sidebar purpose** | Persistent navigation, project-switching, user context, or summary widgets. Keeps navigation visible for quick context-switching. | NN/g: constant spatial orientation reduces cognitive load |
| **Grid system** | Use a 12-column grid for alignment. Data-dense components (tables, charts) need breathing room. | Material Design, Bootstrap |
| **Collapsible sidebar** | Allow users to collapse the sidebar to maximize content width for data-heavy views (maps, wide tables). | VS Code, Linear, Notion |

### Information Hierarchy (F-Pattern)

Users scan desktop dashboards in an **F-Pattern** — left to right, then down:

| Zone | Content | Why |
|---|---|---|
| **Top-left** | North Star metric (most critical KPI) | Eyes land here first. ~80% of viewing time is on left half. |
| **Top row** | 3–5 primary KPIs with trend deltas | Instant health check in under 5 seconds |
| **Middle band** | Trend charts, time-series data | Shows direction — are things improving? |
| **Bottom section** | Detailed tables, activity logs | Drill-down for users who need granularity |
| **Right sidebar** | Leaderboard, community feed, contextual widgets | Complementary, glanceable, non-critical |

### Sidebar DO's and DON'Ts

| ✅ DO | ❌ DON'T |
|---|---|
| Navigation links | Dump unrelated widgets ("Digital Attic") |
| User profile/context summary | Duplicate navigation from the header |
| Compact leaderboard or activity feed | Put primary CTAs in the sidebar |
| Quick-action shortcuts | Create orphaned scrolling (sidebar shorter than main) |
| Make it sticky so it scrolls with content | Force interactive elements the user must click here |

### KPI Cards

- **Cap at 4–5** primary KPIs per view (working memory: 3–5 items)
- Each card must include: **label**, **value** (largest type), **trend delta** (+12%), **visual indicator** (arrow/sparkline)
- **Tooltips**: Use ONLY for secondary info (how the metric is calculated, data source). Never hide critical context like "is this good or bad?"
- Cards follow the Z-pattern: most important metric top-left

### Gamification Placement (Desktop)

| Element | Placement | Pattern Source |
|---|---|---|
| **Streak counter** | Top-right of header/nav bar. Visible on every page. | Duolingo |
| **Kudos/social buttons** | Inline with activity feed items, not as standalone widgets | Strava |
| **Leaderboard** | Right sidebar (compact) or dedicated tab | Peloton |
| **Badges** | Collapsed summary row ("3 of 12 earned") with expand-on-click | Progressive disclosure |

### Action Density

- **1 primary CTA** per page (e.g., "Log Activity" button in header)
- Secondary actions use ghost buttons or text links
- Attach actions contextually to the data they affect (e.g., export button near the table, not floating globally)

---

## Part 2: Mobile App Dashboard Design

Mobile is for **quick status checks and high-level metrics**. Users have a small
screen, use their thumbs, and expect fast, glanceable information.

### Layout

| Principle | Guideline | Reference |
|---|---|---|
| **Single column** | Mandatory. No sidebars. Vertical stacking only. | iOS HIG, Material Design |
| **Bottom navigation** | 3–5 tabs maximum. Icons with labels. Active state visually distinct. | iOS Tab Bar, Android Bottom Nav |
| **Thumb zone** | Primary interactive elements in the bottom third of screen. Avoid critical nav at the top on large phones. | Thumb zone research |
| **Card stacking order** | 1) Total impact summary → 2) Pending actions → 3) Recent activity → 4) Deep-dive charts (simplified) | Priority-based stacking |

### Information Hierarchy

| Zone | Content |
|---|---|
| **Top strip** | 3–4 KPIs in a horizontally scrollable strip or tight 2×2 grid |
| **Below KPIs** | Primary action card ("Log your next activity") |
| **Middle** | Activity feed with inline kudos |
| **Bottom** | Simplified charts, badges (collapsed) |
| **Bottom nav bar** | Explore · Dashboard · Community · Profile |

### Touch Targets

| Platform | Minimum Size |
|---|---|
| iOS | 44×44 pt |
| Android | 48×48 dp |

- Provide immediate visual feedback on all taps (color change, micro-animation)
- **No hover states** — everything must work on tap
- Use tap-to-reveal instead of hover-to-reveal for tooltips and info buttons
- Swipe gestures for secondary actions (dismiss, archive)

### Gamification Placement (Mobile)

| Element | Placement | Pattern Source |
|---|---|---|
| **Streak counter** | Top of screen, always visible, or in nav bar | Duolingo |
| **Kudos** | Inline with each activity in the feed. One-tap. | Strava |
| **Leaderboard** | Dedicated tab in bottom nav, NOT in main dashboard | Peloton |
| **Badges** | Horizontal scroll strip, tap to expand details | Nike Run Club |

### Progressive Disclosure

- Show the summary; hide the depth
- Activity log: show last 5 items, "View All" link for full list
- Charts: use sparklines, not full interactive charts
- Badges: show count and next badge, not full grid
- **Never hide core actions** (like "Log Activity"). Hide data depth.

---

## Part 3: Web App (Responsive PWA)

The web app must serve BOTH desktop and mobile contexts from a single codebase.
Use responsive design with adaptive breakpoints.

### Breakpoint Strategy

| Breakpoint | Layout | Navigation | Content |
|---|---|---|---|
| **≥1200px** (Desktop) | Two-column: main + sidebar | Persistent sidebar or top nav | Full data density, charts, tables |
| **768–1199px** (Tablet) | Single column, wider cards | Collapsible sidebar or top nav | Moderate density, stack charts |
| **<768px** (Mobile) | Single column, stacked cards | Bottom tab bar or hamburger | KPI strip, simplified feed, sparklines |

### Responsive Component Behavior

| Component | Desktop | Tablet | Mobile |
|---|---|---|---|
| **KPI Cards** | 4-across row | 2×2 grid | Horizontal scroll strip |
| **Activity Log** | Full table with columns | Simplified table | Card list, no table |
| **Leaderboard** | Sidebar widget | Below main content | Dedicated tab |
| **Sidebar** | Visible, fixed 280px | Collapsed, toggle | Hidden (bottom nav instead) |
| **Tooltips** | Hover + click | Click only | Tap-to-reveal popover |
| **Charts** | Full interactive | Simplified | Sparklines only |
| **Badges** | Expandable grid | Horizontal scroll | Collapsed count |

### Container Queries (2026 Standard)

Use CSS Container Queries instead of just viewport media queries. This lets
individual components (like a leaderboard or KPI card) adapt to their own
container width, regardless of screen size. This is critical for components
that may appear in a sidebar (narrow) or main content (wide).

```css
.kpi-card-container { container-type: inline-size; }

@container (min-width: 200px) {
  .kpi-card { /* compact layout */ }
}

@container (min-width: 350px) {
  .kpi-card { /* full layout with trend chart */ }
}
```

### PWA-Specific Patterns

- **App Shell**: Cache the static UI shell (nav, header, layout) separately from data
- **Offline-first**: Queue user actions (log activity) while offline, sync on reconnect
- **Install prompt**: Progressive — don't force, offer after engagement threshold

---

## Part 4: Universal Principles (All Platforms)

### Accessibility (WCAG 2.1 AA)

| Requirement | Standard |
|---|---|
| Text contrast | 4.5:1 minimum |
| Data visualization contrast | 3:1 minimum |
| Color alone | Never use color alone to convey meaning. Always pair with icon/text. |
| Screen reader order | DOM order must match visual hierarchy |
| Focus indicators | Visible focus rings on all interactive elements |
| Alt text for charts | Provide text summary (e.g., "Bar chart showing 10% decrease in water usage") |

### The 5-Second Test

Users should be able to identify the top metric and primary action within 5 seconds
of viewing the dashboard. If they can't, the hierarchy is wrong.

### Cognitive Load

- Working memory: 3–5 items at a time
- Cap primary KPIs at 4–5 per view
- Use whitespace to group related data (Gestalt: proximity)
- Remove any element that doesn't support comprehension or action

### Data Without Action is Noise

If a user cannot take an action based on a widget, consider removing it.
Every widget should answer a specific question or prompt a decision.

---

## Part 5: Applied to Our Dashboard — Anti-Patterns Diagnosed

### What We Were Doing Wrong

| Anti-Pattern | What We Did | Research Says |
|---|---|---|
| **Digital Attic sidebar** | Dumped Leaderboard + GratitudeFeed + Kudos + SDG in right col | Sidebar is for navigation/context, not widget dumping |
| **Orphaned scrolling** | SDG badges at bottom of long right col, isolated with whitespace | Fix with sticky sidebar OR move content to appropriate zone |
| **Mobile patterns on desktop** | Proposed killing the sidebar entirely | Sidebars are STANDARD on desktop — the fix is what goes IN the sidebar |
| **Wrong Kudos placement** | Kudos as standalone sidebar widget | Strava: Kudos go INLINE with activity feed items |
| **Wrong Streak placement** | EcoStreak buried in main content area | Duolingo: Streak in top-right nav, visible on every page |
| **Too many CTAs** | Multiple competing interactive elements visible at once | 1 primary CTA per viewport |
| **No progressive disclosure** | Everything shown at once (badges, log, kudos, leaderboard, gratitude) | Show summary, let users expand depth |

### Recommended Layout (Desktop Web App)

```
┌──────────────────────────────────────────────────────────────────────┐
│ 🏠 Explore  Dashboard  Community  Events    🔥 7-day │ [Log Activity]│
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │♻️ Items  │ │🌍 CO₂    │ │💰 Saved  │ │⭐ Credits│               │
│  │   42     │ │  180 kg  │ │  $320    │ │   156    │               │
│  │  ↑ +12%  │ │  ↑ +8%   │ │  ↑ +15%  │ │  ↑ +22%  │               │
│  │  ⓘ SDG12 │ │  ⓘ SDG13 │ │          │ │          │               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
│                                                                      │
│  MAIN CONTENT (flexible)                 │  SIDEBAR (280px, sticky)  │
│  ────────────────────────────────────────│──────────────────────────  │
│                                          │                            │
│  🏆 Badges: 3 of 12 earned       [→]    │  📊 Neighborhood           │
│  ─────────────────────────────────────── │  Leaderboard               │
│                                          │  ┌────────────────────┐    │
│  Activity Log              [All Time ▾]  │  │ 1. JP        1,204 │    │
│  ┌───────────────────────────────────┐   │  │ 2. Allston     987 │    │
│  │ Donated 3 jackets   🌿 Kudos [5] │   │  │ 3. Dorchester  823 │    │
│  │ Repaired bicycle    🌿 Kudos [12]│   │  │    ⋮               │    │
│  │ Attended swap event 🌿 Kudos [3] │   │  └────────────────────┘    │
│  │ Recycled electronics🌿 Kudos [8] │   │                            │
│  └───────────────────────────────────┘   │  💚 Gratitude Feed         │
│  [📥 Export CSV]  [📄 Export PDF]         │  "Thanks to Oak Hill..."  │
│                                          │  "Amazing repair cafe!"   │
│                                          │                            │
└──────────────────────────────────────────┴────────────────────────────┘
```

### Recommended Layout (Mobile Web App)

```
┌──────────────────────┐
│ 🔥 7   Boston CE   👤│
├──────────────────────┤
│  ♻️ 42  🌍 180  💰 320│  ← KPI strip (scrollable)
├──────────────────────┤
│  ┌──────────────────┐│
│  │ [Log Activity]   ││  ← Primary CTA, prominent
│  └──────────────────┘│
│                      │
│  🏆 3 of 12 badges ▸ │  ← Collapsed
│                      │
│  Recent Activity     │
│  ┌──────────────────┐│
│  │ Donated jackets  ││
│  │ 🌿 5 kudos       ││  ← Inline kudos
│  ├──────────────────┤│
│  │ Repaired bicycle ││
│  │ 🌿 12 kudos      ││
│  └──────────────────┘│
│  [View all →]        │
│                      │
├──────────────────────┤
│ 🗺️   📊   🌿   📅   👤│  ← Bottom nav
│Explore Dash Comm Evts│
└──────────────────────┘
```
