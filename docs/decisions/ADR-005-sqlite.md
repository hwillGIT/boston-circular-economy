# ADR-005: Use SQLite as the database

**Date:** 2025-01-01  
**Status:** Accepted

## Decision

Both the ETL pipeline and the API server use SQLite — a file-based database — rather than a hosted database server.

## Why we chose this

- SQLite requires no infrastructure setup: the database is a single file on disk. Any contributor can run the full stack locally without installing a database server.
- For the current scale (a directory of local businesses in one city), SQLite is more than capable.
- The server uses WAL (write-ahead logging) mode, which improves read performance under concurrent requests.
- It's easy to inspect the database directly using free tools like DB Browser for SQLite or the SQLite CLI.

## Alternatives we considered

| Option | Why we didn't choose it |
|--------|------------------------|
| PostgreSQL | More powerful, but requires a running server. Adds friction for local development and deployment. Worth revisiting if we need full-text search, geographic queries (PostGIS), or concurrent writes at scale. |
| MySQL / MariaDB | Same issues as PostgreSQL — unnecessary server overhead at this scale. |
| A hosted database (Supabase, PlanetScale, etc.) | Adds cost and an external dependency. Not needed until the project grows beyond what a file-based DB can handle. |

## Consequences

- The database is a file (`dev.db` locally, configurable via `DATABASE_URL`). It should not be committed to the repository.
- SQLite works well for read-heavy workloads, but is not designed for high write concurrency. If write volume increases significantly, migrating to PostgreSQL is the likely next step.
- Switching databases later is achievable but will require migrating the schema and data.
