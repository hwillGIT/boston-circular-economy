# Architecture Governance

## Purpose

This policy defines the default working method for `hwillGIT/boston-circular-economy`. It keeps architecture, delivery, and onboarding work evidence-based, lightweight, and durable as the repository evolves.

## Scope

This policy applies to:

- `client/` React + Vite application
- `server/` Express + SQLite service
- `etl/` Python data pipeline and shared DTO contracts
- `data-explorations/` exploratory source analysis and transformation work
- related issues, decisions, pull requests, diagrams, and onboarding material

## Default Working Method

Significant work should use a multi-role, parallel-thinking workflow. One person may play multiple roles, but the responsibilities should still be covered explicitly.

### Core roles

- **Repo Analyst** — maps the actual repository structure, workflows, runtime boundaries, and current constraints
- **Architecture Lead** — maintains structural views, boundaries, and cross-cutting concerns
- **Domain / DDD Analyst** — maintains domain language, core concepts, stakeholder behaviors, and use cases
- **Decision Analyst** — captures important decisions, alternatives, tradeoffs, and consequences in ADRs
- **Delivery / Agile Analyst** — aligns architecture work with backlog flow, Kanban policies, and definitions of ready/done
- **Onboarding / Docs Analyst** — keeps contributor, architect, and stakeholder guidance clear and maintainable
- **Adversarial Reviewer** — challenges assumptions, overengineering, weak evidence, and documentation rot risk
- **Integrator** — reconciles outputs, removes contradictions, and preserves traceability across artifacts

### Required workflow behaviors

1. **Work from evidence first.** Start from the repository's actual code, docs, workflows, and operating constraints before proposing architecture.
2. **Think in options for significant decisions.** Consider at least two viable approaches and record why one was chosen when the choice has lasting impact.
3. **Use adversarial review.** Challenge complexity, hidden assumptions, missing operational realities, and stale or ceremonial documentation.
4. **Prefer right-sized methods.** Use the lightest method that creates durable clarity.
5. **Integrate before publishing.** Final artifacts should present one coherent working model, not disconnected viewpoints.

## Method Selection Rules

The preferred architecture/documentation toolkit for this repository is:

- **C4** — primary structural modeling method
- **ADRs** — primary decision-recording method
- **Use cases** — primary behavior and stakeholder method
- **Kanban** — preferred delivery workflow
- **Lightweight DDD** — preferred domain-language approach
- **Selective UML** — optional support for sequences, DTOs, or interactions when it adds clarity
- **Zachman** — optional reference/checklist only, not the operating model

### Selection guidance

- Use **C4** for system context, containers, and important components
- Use **ADRs** when a decision affects architecture, interfaces, data contracts, deployment shape, or long-term team behavior
- Use **use cases** to connect stakeholder goals to backlog and implementation
- Use **DDD-lite** to stabilize terms such as location, source, service, activity, normalization, and merge
- Use **UML sparingly** when sequence or structure is easier to understand that way than in prose
- Do not create heavyweight documentation frameworks that exceed the current maturity of the codebase

## Repository-Specific Architecture Guidance

### `client/`

- Treat `client/` as the public-facing product surface
- Keep production routes and prototype routes distinct
- Use `client/src/pages/dev/` for experiments and graduate proven work out of `/dev`
- Keep architecture notes grounded in the actual TanStack Router file-based route structure and shared root layout
- Update docs when route structure, navigation expectations, or deployment assumptions change

### `server/`

- Treat `server/` as the API and integration boundary
- Keep documentation grounded in actual endpoints, data access boundaries, and environment assumptions
- Record decisions when the server gains durable API shape, validation patterns, auth strategy, or schema management rules
- Reflect that current implementation is intentionally minimal and should not be documented as more mature than it is

### `etl/`

- Treat `etl/` as the primary data-contract and ingestion area
- Keep architecture and onboarding grounded in the real pipeline model: querier -> normalizer -> data store
- Protect shared DTO and source-normalization contracts with explicit documentation and ADRs when they materially change
- Require evidence for new source pipelines, normalization rules, and merge behavior

### `data-explorations/`

- Treat `data-explorations/` as exploratory, not production by default
- Keep experiments traceable to questions, source behavior, or candidate ETL work
- Promote findings into `etl/`, ADRs, or formal docs only after they are validated and intentionally adopted
- Avoid letting exploratory artifacts silently become the source of truth

## Traceability Rules

Important work should be traceable across the following chain whenever applicable:

1. goals or problem statements
2. use cases or stakeholder needs
3. backlog items or issues
4. ADRs or architecture notes
5. pull requests and code changes
6. onboarding or operational guidance
7. runtime or delivery workflow implications

Minimum traceability expectations:

- consequential decisions should reference the issue, discussion, or problem that drove them
- architecture-impacting code changes should update the affected docs in the same change when practical
- onboarding guidance should point to the authoritative code or architecture source, not duplicate it unnecessarily
- exploratory findings adopted into production should be linked back to their source evidence

## Artifact Categories

The repository should prefer a small set of durable artifacts:

- **Architecture overview** — what the system is, who it serves, and where major responsibilities live
- **C4 views** — system context, containers, and selected component views
- **ADRs** — important decisions, tradeoffs, and consequences
- **Use cases** — stakeholder goals and major behavioral flows
- **Glossary / domain language** — stable terms used across client, server, and ETL
- **Delivery workflow guidance** — Kanban policy, work item states, definitions of ready/done
- **Onboarding guides** — developer, architect, and team guidance
- **Operational notes** — deployment, data flow, or environment assumptions that affect change work

## Documentation Quality Standards

Documentation in this repository should be:

- **accurate** — derived from the code and actual workflow
- **current** — updated with meaningful architecture or process change
- **concise** — lightweight, readable, and free of ceremony
- **traceable** — linked to code, issues, decisions, or operational reality
- **actionable** — useful for making, reviewing, or implementing change
- **right-sized** — detailed enough to guide work without becoming shelfware

Documentation should explicitly separate:

- current state vs target state
- production behavior vs prototypes/experiments
- adopted decisions vs options still under evaluation

## Maintenance Rules

- Update this governance when the repository's default working method changes
- Update architecture docs when structure, deployment, data contracts, or key boundaries materially change
- Add or update an ADR when a decision has long-lived technical, delivery, or documentation consequences
- Update onboarding material when contributor workflows, local setup, or artifact expectations change
- Prefer revising existing authoritative docs over adding overlapping documents
- Remove or mark stale material when it no longer reflects the repository

## Decision and Review Policy

For significant work:

1. gather evidence from code, docs, workflows, and runtime boundaries
2. identify options and tradeoffs
3. challenge assumptions through adversarial review
4. choose the simplest durable approach
5. record the result in the right artifact type
6. link the result to implementation and onboarding impact

Warning signs to challenge before adoption:

- architecture described without repository evidence
- framework-heavy process that exceeds the repo's size or maturity
- diagrams with no maintenance path
- ADRs written for trivial choices
- undocumented promotions from prototype or exploration into production use
- duplicated docs that disagree about system behavior

## Delivery Workflow Expectations

Kanban is the default delivery model for this repository.

Expected properties:

- visible work states
- limited work in progress
- clear entry and exit criteria
- architecture and documentation work tracked alongside feature and data work
- explicit handling of blocked work and experiments

Architecture, delivery, and documentation work should be treated as first-class backlog items when they materially reduce risk or improve flow.

## Practical Operating Rule

When working on this repository, default to:

1. inspect the real repo
2. analyze in multiple roles
3. compare options for significant choices
4. challenge assumptions adversarially
5. document only what the repo can realistically maintain
6. preserve traceability from intent to implementation

This is the standard for architecture and documentation quality in `hwillGIT/boston-circular-economy`.
