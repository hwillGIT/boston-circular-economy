# Boston Circular Economy — Documentation

## Architecture

A civic sustainability platform connecting Boston residents with repair shops,
donation centers, and community resources to keep items out of the landfill.

### Tech Stack

| Layer | Technology |
|---|---|
| **Client** | React 19, TanStack Router, Vite 7, Leaflet |
| **Server** | Express 5, better-sqlite3, Node.js 22 |
| **ETL** | Python 3.13, Pydantic, Ruff |
| **CI/CD** | GitHub Actions, pnpm |

### Module Map

| Module | Path | Purpose |
|---|---|---|
| `api` | `client/src/lib/api.ts` | REST client for server endpoints |
| `auth` | `client/src/lib/auth.tsx` | Auth context, RBAC, session management |
| `authApi` | `client/src/lib/authApi.ts` | Auth-specific API client |
| `userTypes` | `client/src/lib/userTypes.ts` | Lightweight/heavyweight user entities |
| `badges` | `client/src/lib/badges.ts` | Badge definitions and earned-badge logic |
| `streaks` | `client/src/lib/streaks.ts` | Eco streak tracking |
| `co2` | `client/src/lib/co2.ts` | CO₂ impact calculations |
| `authService` | `server/src/services/authService.ts` | Password hashing, token management |
| `authMiddleware` | `server/src/middleware/auth.ts` | Route guards: authenticate, requireAuth, requireRole |
| `migrations` | `server/src/db/migrations.ts` | Schema definitions and migration runner |

### API Reference

See the [generated API docs](./api/README.md) for full TypeScript interface
documentation with navigable class hierarchies.

### Design Documents

- [Social Encouragement Gap Analysis](../../.gemini/antigravity/brain/*/social_encouragement_gap_analysis.md)
- [UX Decision Records](../../.gemini/antigravity/brain/*/ux_decision_records.md)
- [Community Hub Proposal](../../.gemini/antigravity/brain/*/community_hub_proposal.md)
- [Technical Architecture — Social](../../.gemini/antigravity/brain/*/tech_architecture_social.md)
- [Technical Architecture — Community/Demand](../../.gemini/antigravity/brain/*/tech_arch_community_demand.md)
