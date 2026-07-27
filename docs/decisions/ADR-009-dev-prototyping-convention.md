# ADR-009: Use a /dev/ path for prototyping in the frontend

**Date:** 2025-01-01  
**Status:** Accepted

## Decision

Exploratory or in-progress frontend work lives under `client/src/pages/dev/` and is accessible at the `/dev/` path during development. Prototype pages are listed on a dev index and do not need to meet production standards. When a prototype is ready, it is moved out of `/dev/` into the main page structure.

## Why we chose this

- Prototypes can be built and shared quickly without cluttering the main app or requiring a separate branch to stay current.
- The `/dev/` path makes it clear to anyone browsing the app that these pages are experimental.
- Contributors can explore ideas before committing to a full implementation, which reduces wasted effort.

## Alternatives we considered

| Option | Why we didn't choose it |
|--------|------------------------|
| Use feature branches for all prototyping | Branches can diverge from `main` and become stale. Keeping prototypes on `main` in a clearly marked path avoids that. |
| No formal prototyping convention | Without a convention, experimental code tends to either never get cleaned up or never get shared in the first place. |
| A separate repository for prototypes | Too much overhead. Keeping prototypes close to the production code means they benefit from the same tooling. |

## Consequences

- Pages under `/dev/` should not be linked from the main app or included in production navigation.
- When a prototype graduates to production, the `/dev/` version should be removed to avoid confusion.
- If the project adds end-to-end tests, tests should not target `/dev/` pages.
