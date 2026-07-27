# Architecture Decision Records

This folder contains records of significant decisions made about how this project is built.

Each ADR explains what was decided, why, and what alternatives were considered.  
Use the [template](template.md) when adding a new one.

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [ADR-001](ADR-001-monorepo.md) | Keep all code in one repository | Accepted |
| [ADR-002](ADR-002-frontend-stack.md) | Use React with TypeScript and Vite for the frontend | Accepted |
| [ADR-003](ADR-003-api-server.md) | Use Node.js with Express for the API server | Accepted |
| [ADR-004](ADR-004-python-etl.md) | Use Python for the ETL pipeline | Accepted |
| [ADR-005](ADR-005-sqlite.md) | Use SQLite as the database | Accepted |
| [ADR-006](ADR-006-etl-pipeline-design.md) | Structure the ETL pipeline as Querier → Normalizer → DataStore | Accepted |
| [ADR-007](ADR-007-shared-location-schema.md) | Use a shared location schema across all data sources | Accepted |
| [ADR-008](ADR-008-github-pages-deployment.md) | Deploy the frontend to GitHub Pages | Accepted |
| [ADR-009](ADR-009-dev-prototyping-convention.md) | Use a /dev/ path for prototyping in the frontend | Accepted |

## When to add an ADR

Add an ADR when you make a decision that:
- is hard to reverse,
- affects multiple parts of the project, or
- future contributors would reasonably wonder "why did they do it this way?"

Small implementation details don't need ADRs — save them for choices that shape the overall structure or direction of the project.
