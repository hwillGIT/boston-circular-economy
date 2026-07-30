# SPEC-013: Admin Portal

**Status**: DRAFT
**Priority**: SHOULD
**Epic**: Platform Administration
**Last Updated**: 2026-07-29
**Related ADRs**: ADR-001 (API Security)
**Related Specs**: SPEC-007 (ETL), SPEC-008 (Sponsorships), SPEC-011 (Auth)

---

## Context
Platform administrators need tools to manage locations, monitor data quality, view platform-wide analytics, and configure system behavior. This spec covers the admin role, its features, and the access control model.

## Roles & Permissions Model

| Role | Capabilities |
|------|-------------|
| **User** | Browse, search, log activities, view own profile |
| **Admin** | Everything above + location CRUD, user management, analytics, config |
| **Super Admin** | Everything above + role assignment, data export, destructive operations |

> [!IMPORTANT]
> For the prototype, admin is a simple boolean flag on the user record. Production should use RBAC (Role-Based Access Control) with granular permissions.

## User Stories

### US-013.1: Admin Dashboard
**As an** admin, **I want to** see a platform-wide analytics dashboard, **so that** I understand engagement and impact at a glance.

**Priority**: MUST
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** I am an admin, **When** I navigate to /admin, **Then** I see platform KPIs: total users, total activities, total CO₂ prevented, active locations.
- [ ] **Given** the dashboard, **When** I view it, **Then** I see a trend chart of activities over the last 30 days.
- [ ] **Given** the dashboard, **When** I view it, **Then** I see top 10 most active locations and top 10 most popular actions.
- [ ] **Given** I am NOT an admin, **When** I navigate to /admin, **Then** I see a 403 Forbidden page.

### US-013.2: Location Management
**As an** admin, **I want to** add, edit, deactivate, and merge locations, **so that** the directory stays accurate and deduplicated.

**Priority**: MUST
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** the location manager, **When** I search, **Then** I see a filterable, sortable table of all locations.
- [ ] **Given** a location, **When** I click "Edit", **Then** I can modify name, address, hours, phone, website, and data source.
- [ ] **Given** a location, **When** I toggle "Active", **Then** it is hidden from public search without being deleted.
- [ ] **Given** duplicate locations, **When** I select two and click "Merge", **Then** I choose a primary and the other's activities are reassigned.
- [ ] **Given** the form, **When** I add a new location manually, **Then** it appears in the directory immediately.

### US-013.3: Data Pipeline Monitoring
**As an** admin, **I want to** see the status of ETL pipeline runs, **so that** I know if data is fresh and if any errors occurred.

**Priority**: SHOULD
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** the admin panel, **When** I view "Data Pipelines", **Then** I see last run time, records processed, and error count per pipeline.
- [ ] **Given** a pipeline, **When** I click "Run Now", **Then** a manual ETL run is triggered.
- [ ] **Given** a pipeline error, **When** I click on it, **Then** I see the error message and affected records.

### US-013.4: User Management
**As an** admin, **I want to** view registered users and their activity levels, **so that** I can identify power users and address issues.

**Priority**: SHOULD
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** user management, **When** I view the list, **Then** I see users sorted by activity count with join date and last active.
- [ ] **Given** a user, **When** I click their name, **Then** I see their full activity history and impact stats.
- [ ] **Given** a user, **When** I click "Grant Admin", **Then** they gain admin access (Super Admin only).

### US-013.5: Configuration Panel
**As an** admin, **I want to** configure credit tiers, CO₂ estimates, and feature flags, **so that** the platform can be tuned without code changes.

**Priority**: COULD
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** the config panel, **When** I edit CO₂ estimates per action type, **Then** future activities use the new values.
- [ ] **Given** the config panel, **When** I edit credit tiers, **Then** future activities earn the updated credits.
- [ ] **Given** feature flags, **When** I toggle "Enable Sponsorships", **Then** sponsor badges appear/disappear on the public UI.

### US-013.6: Data Export
**As an** admin, **I want to** export platform data as CSV/JSON, **so that** I can share impact reports with partners and funders.

**Priority**: SHOULD
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** the admin panel, **When** I click "Export Activities", **Then** a CSV downloads with all activity records.
- [ ] **Given** the export, **When** I select a date range, **Then** only activities in that range are included.
- [ ] **Given** the export, **When** I click "Export Locations", **Then** a GeoJSON file downloads with all active locations.

### US-013.7: Audit Log
**As a** super admin, **I want to** see a log of all admin actions, **so that** there is accountability and traceability.

**Priority**: COULD
**Status**: Not Started

#### Acceptance Criteria
- [ ] **Given** the audit log, **When** I view it, **Then** I see timestamped entries: who did what (e.g., "Admin X deactivated Location Y").
- [ ] **Given** the audit log, **When** I filter by action type, **Then** I can narrow to just location edits or user changes.

## Non-Functional Requirements
- **Security**: Admin routes protected by role check middleware. API returns 403 for non-admin users.
- **Performance**: Admin dashboard queries should complete in under 2 seconds even with 10K+ activities.
- **Audit**: All admin write operations logged to an audit_log table.

## Dependencies
- SPEC-011: Authentication (role-based access)
- SPEC-007: Data Pipeline & ETL (pipeline monitoring)
- SPEC-008: Corporate/Municipal Sponsorships (sponsor management)

## Definition of Done
- [ ] All acceptance criteria pass
- [ ] Admin routes return 403 for non-admin users
- [ ] TypeScript compiles without errors
- [ ] Responsive admin layout
- [ ] Code reviewed
