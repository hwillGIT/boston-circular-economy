# ADR-003: Use Node.js with Express for the API server

**Date:** 2025-01-01  
**Status:** Accepted

## Decision

The API server is a Node.js application written in TypeScript using the Express framework.

## Why we chose this

- Using TypeScript on both the frontend and backend means contributors only need one language for the whole web stack.
- Express is minimal and widely understood — it adds little magic, so the server is easy to reason about.
- Sharing types (e.g. API response shapes) between client and server becomes possible with a single language.
- The server's initial role is straightforward: read from the database and serve JSON to the client. Express is more than sufficient for this.

## Alternatives we considered

| Option | Why we didn't choose it |
|--------|------------------------|
| Python backend (Flask or FastAPI) | Would require contributors to context-switch between Python (ETL) and the server. Keeping the server in TypeScript reduces that burden. |
| Deno or Bun | Both are newer runtimes with less community tooling and fewer contributors familiar with them at this stage. |
| No API server (client fetches static JSON) | Workable for a read-only MVP but limits future features like filtering, user data, or writes. |
| A more opinionated framework (Fastify, Nest.js) | Express is simpler and has lower learning curve. We can migrate if we need more structure later. |

## Consequences

- The server runs separately from the client (on a different port in development).
- If the server stays simple, we could also replace it with a serverless function layer later without major changes.
