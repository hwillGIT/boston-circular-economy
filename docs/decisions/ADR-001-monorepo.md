# ADR-001: Keep all code in one repository

**Date:** 2025-01-01  
**Status:** Accepted

## Decision

We keep the frontend (client), API server, and ETL pipeline in a single Git repository, managed as an npm workspace.

## Why we chose this

- The project is early-stage and small; three separate repos would create overhead for little benefit.
- Changes often span more than one part of the system (e.g. a new data field needs ETL, server, and client changes). A single repo means those changes can land in one pull request.
- It's easy for contributors to find everything in one place and run the whole system locally.

## Alternatives we considered

| Option | Why we didn't choose it |
|--------|------------------------|
| Separate repo per component (client, server, ETL) | Too much coordination overhead at this stage — versioning, cross-repo PRs, shared CI. |
| Single repo but no workspace tooling | Still one repo, but npm workspaces give us per-package scripts and dependency isolation at almost no cost. |

## Consequences

- All components share the same issue tracker and pull request history, which keeps things simple.
- If the project grows significantly (e.g. multiple independent teams), splitting into separate repos is worth revisiting.
