# Boston Circular Economy

A web app for discovering circular economy locations in Boston — things like repair shops, reuse stores, composting sites, etc.

## Stack

| Layer | Tech |
|---|---|
| Client | React 19 + Vite + TanStack Router (TypeScript) |
| Server | Express 5 + SQLite via `better-sqlite3` (TypeScript) |
| ETL | Python data pipeline (`uv`) — fetches & normalises location data |

## Running on Replit

Two workflows run automatically:

- **Start application** — Vite dev server for the client on port 5000 (webview)
- **Backend** — Express API server on port 3000 (console)

The client dev server is configured at `client/vite.config.ts`. In dev mode the base path is `/`; production builds use `/boston-circular-economy/` (for GitHub Pages).

## Key notes

- `seroval` is pinned to `^1.6.2` via `overrides` in the root `package.json` (1.5.0 has a CVE blocked by Replit's security policy).
- The server uses a local SQLite file (`dev.db`) — no external database needed for development.
- The ETL pipeline lives in `etl/` and uses `uv` for Python dependency management.

## User preferences

<!-- Add any user preferences here -->
