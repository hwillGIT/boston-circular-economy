# Boston Circular Economy — Documentation

## Architecture

A civic sustainability platform connecting Boston residents with repair shops,
donation centers, and community resources to keep items out of the landfill.

### Tech Stack

| Layer      | Technology                                 |
| ---------- | ------------------------------------------ |
| **Client** | React 19, TanStack Router, Vite 7, Leaflet |
| **Server** | Express 5, better-sqlite3, Node.js 22      |
| **ETL**    | Python 3.14.3, Pydantic, Ruff              |
| **CI/CD**  | GitHub Actions, npm, uv                    |

### Module Map

| Module           | Path                                 | Purpose                                              |
| ---------------- | ------------------------------------ | ---------------------------------------------------- |
| `api`            | `client/src/lib/api.ts`              | REST client for server endpoints                     |
| `auth`           | `client/src/lib/auth.tsx`            | Auth context, RBAC, session management               |
| `authApi`        | `client/src/lib/authApi.ts`          | Auth-specific API client                             |
| `userTypes`      | `client/src/lib/userTypes.ts`        | Lightweight/heavyweight user entities                |
| `badges`         | `client/src/lib/badges.ts`           | Badge definitions and earned-badge logic             |
| `streaks`        | `client/src/lib/streaks.ts`          | Eco streak tracking                                  |
| `co2`            | `client/src/lib/co2.ts`              | CO₂ impact calculations                              |
| `authService`    | `server/src/services/authService.ts` | Password hashing, token management                   |
| `authMiddleware` | `server/src/middleware/auth.ts`      | Route guards: authenticate, requireAuth, requireRole |
| `migrations`     | `server/src/db/migrations.ts`        | Schema definitions and migration runner              |

### API Reference

Run `npm run docs:generate` to create the API reference in `docs/api/`.
The CI workflow also uploads the reference as the `api-docs` artifact.

### Design Documents

- [Layout decisions](https://github.com/hwillGIT/boston-circular-economy/blob/main/docs/ux-decisions/UXDR-001-layout-architecture.md)
- [Activity flow decisions](https://github.com/hwillGIT/boston-circular-economy/blob/main/docs/ux-decisions/UXDR-002-activity-logging-flow.md)
- [Customer journey and team design](https://github.com/hwillGIT/boston-circular-economy/blob/main/docs/customer_journey_and_agentic_team_design.md)
- [Architecture decisions](https://github.com/hwillGIT/boston-circular-economy/blob/main/docs/boston_team_adrs_and_architecture.md)
