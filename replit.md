# Boston Circular Economy

A City of Boston web tool for discovering circular economy locations — repair shops, donation centers, thrift stores, tool libraries, and community resources across Greater Boston.

## Stack

| Layer  | Tech                                                                                                  |
| ------ | ----------------------------------------------------------------------------------------------------- |
| Client | React 19 + Vite + TanStack Router (TypeScript), Leaflet maps                                          |
| Server | Express 5 + SQLite via `better-sqlite3` (TypeScript)                                                  |
| ETL    | Python data pipeline (`uv`) — fetches & normalises location data from Google Places and OpenStreetMap |

## Running on Replit

Two workflows run automatically:

- **Start application** — Vite dev server for the client on **port 5000** (webview)
- **Backend** — Express API server on **port 3000** (console)

The client proxies `/api/*` requests to the backend via Vite's `server.proxy` config.

## Key notes

- **DATABASE_URL** in the Replit environment is a PostgreSQL connection string and must not be used for the SQLite server. The server uses `SQLITE_PATH` (falls back to `dev.db` at the workspace root).
- The database is currently empty — the ETL pipeline needs to be run to populate location data.
- `seroval` is pinned to `^1.6.2` via `overrides` in the root `package.json` (1.5.0 has a CVE blocked by Replit's security policy).
- The app was merged from the `feature/visual-mapping-guides-and-adrs` branch of the upstream GitHub repo.
- Production build: `npm run replit:build` (Vite build) / `npm run replit:start` (Express serves static client).

## User preferences

<!-- Add any user preferences here -->
