# UI Design Principles — Boston Circular Economy

## 1. Core Principles

### 1.1 Spatial Context First

- The map is the primary interface, not a secondary view.
- Location cards and map markers are always in sync.
- Users should never lose spatial context when viewing details.
- _Inspired by: Google Maps, Airbnb_

### 1.2 Friction-Free Logging (<30 seconds)

- Any user action requiring logging should complete in <30 seconds.
- Maximum 2 required fields for any form.
- Auto-calculate everything possible (CO₂, credits, location).
- Show impact preview BEFORE submit to motivate completion.
- _Inspired by: Strava (1-tap), Olio (<30s), Too Good To Go (3-tap)_

### 1.3 Trust Through Transparency

- Every location shows its data source and verification tier.
- Social proof (neighbor counts, activity history) visible on cards.
- Official municipal sources distinguished from community contributions.
- _Inspired by: HomeAdvisor badges, Nextdoor verified addresses, TaskRabbit guarantees_

### 1.4 Tangible Impact

- Never show abstract numbers alone (e.g., '5.8 lbs CO₂').
- Always pair with tangible equivalency ('= charging your phone 43 times').
- Show cumulative progress, not just per-action stats.
- Celebrate milestones with visual badges and animations.
- _Inspired by: Too Good To Go equivalencies, Strava streaks, Olio Karma tiers_

### 1.5 Progressive Disclosure

- Show essential info upfront, details on demand.
- Card → Detail panel → Full page (3 levels of detail).
- Filters start collapsed, expand with 'More filters' affordance.
- _Inspired by: Google Maps bottom sheet (peek → half → full)_

### 1.6 Civic Warmth, Not Corporate Cold

- Friendly, conversational tone in all copy.
- Warm sustainability palette (greens, creams, terracotta accents).
- Gratitude mechanics (thank a volunteer, appreciate a location).
- Community-first language ('neighbors helped' not 'users served').
- _Inspired by: Buy Nothing values commitment, Nextdoor neighbor tone, Olio karma_

## 2. Visual Design Tokens

### 2.1 Color System

- **Brand Colors:**
  - Civic Navy: `#1a365d`
  - Eco Green: `#2f855a`
  - Boston Blue: `#2b6cb0`
- **Semantic Colors:**
  - Success: `#38a169`
  - Warning: `#d69e2e`
  - Error: `#e53e3e`
  - Info: `#3182ce`
- **Surface Colors:**
  - Background: `#f7fafc`
  - Card: `#ffffff`
  - Hover: `#edf2f7`
  - Active: `#e2e8f0`
- **Trust Badge Colors:**
  - Gold (Municipal): `#ecc94b`
  - Blue (Partner): `#4299e1`
  - Green (Community): `#48bb78`
- **MBTA Line Colors (Optional Accents):**
  - Red: `#da291c`
  - Orange: `#ed8b00`
  - Green: `#00843d`
  - Blue: `#003da5`

### 2.2 Typography

- **Font:** Inter (Google Fonts)
- **Scale:**
  - 12px (Small/Caption)
  - 14px (Secondary/Body Small)
  - 16px (Body Regular)
  - 20px (Heading 3/Subtitle)
  - 24px (Heading 2)
  - 32px (Heading 1/Display)
- **Weights:**
  - 400 (body)
  - 500 (labels)
  - 600 (emphasis)
  - 700 (headings)
  - 800 (display)
- **Line Height:**
  - 1.5 for body
  - 1.2 for headings

### 2.3 Spacing (8pt Grid)

- **Scale:** 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
- **Card Padding:** 16px
- **Section Gap:** 24px
- **Container Max-Width:** 1440px

### 2.4 Border Radius

- **Chips/Pills:** 9999px
- **Cards:** 12px
- **Buttons:** 10px
- **Inputs:** 8px
- **Modals:** 16px

### 2.5 Shadows

- **sm:** `0 1px 3px rgba(0,0,0,0.08)`
- **md:** `0 4px 12px rgba(0,0,0,0.1)`
- **lg:** `0 8px 24px rgba(0,0,0,0.12)`
- **xl:** `0 25px 60px rgba(0,0,0,0.15)`
- _Interaction:_ Hover cards get `md → lg` transition.

## 3. Component Specifications

### 3.1 LocationCard

- **Info Hierarchy:** Image/Map Thumbnail > Title > Distance/Time > Trust Badge > Action Button
- **States:**
  - Default: Standard shadow (md).
  - Hover: Elevated shadow (lg), scale(1.02), background tint.
  - Selected: Border highlight (Civic Navy), active background.
  - Synced: Visually highlighted when corresponding map marker is hovered.
- **Dimensions:** Min-width 280px, Max-width 400px. Image aspect ratio 16:9.

### 3.2 Activity Log Form

- **Reduced Field Set:** Maximum 2 inputs (e.g., item type, quantity).
- **Selection:** Use touch-friendly chips instead of dropdowns for frequent categories.
- **Preview:** Real-time impact preview displayed before submission.
- **Success State:** Inline checkmark animation, summarizing impact gained.

### 3.3 Trust Badges

- **Tier 1 (Municipal):** Gold background, shield/building icon. Placed prominently near the title.
- **Tier 2 (Partner):** Blue background, handshake/check icon.
- **Tier 3 (Community):** Green background, user/community icon.

### 3.4 Impact Counter

- **Animation:** Digits count up dynamically from 0 to final value.
- **Equivalency:** Display tangible text below (e.g., "= charging your phone 43 times").
- **Visuals:** Use a circular progress ring filling up to indicate progress toward a milestone.

### 3.5 Empty States

- **Copy:** Conversational and friendly (e.g., "Looks like no activity here yet! Be the first neighbor to contribute.").
- **Actions:** Clear primary button to guide recovery or next steps.
- **Illustrations:** Use light, thematic SVG illustrations (e.g., a quiet street, a sprouting plant).

### 3.6 Skeleton Loading

- **Shimmer Specifications:** Linear gradient moving left to right, background `#e2e8f0`.
- **Card Skeleton:** Placeholder blocks for image (16:9), title (1 line), and body (2 lines). Matches LocationCard dimensions.

## 4. Interaction Patterns

### 4.1 Card Hover

- `transform: scale(1.02)`, shadow elevation, 200ms `cubic-bezier`.

### 4.2 Map-Card Sync

- Bidirectional hover highlight, click `scroll-into-view`.

### 4.3 Bottom Sheet (Mobile)

- Drag handle, 3 snap points (peek/half/full), spring physics.

### 4.4 Success Celebrations

- Checkmark bounce animation, confetti particles (optional), impact summary.

### 4.5 Skeleton → Content Transition

- Shimmer → fade-in content, 200ms `ease-out`.

## 5. Responsive Breakpoints

- **Mobile:** `<768px` (bottom sheet, single column, larger touch targets 48px+)
- **Tablet:** `768px-1024px` (collapsible sidebar)
- **Desktop:** `>1024px` (50/50 split view)

## 6. Accessibility Requirements

- WCAG 2.1 AA compliance
- All interactive elements keyboard navigable
- Focus visible indicators
- Reduced motion support via `prefers-reduced-motion`
- Minimum contrast ratio 4.5:1 for text
- Screen reader announcements for dynamic content changes
- Touch targets minimum 48x48px on mobile
