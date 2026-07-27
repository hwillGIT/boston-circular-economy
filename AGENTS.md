# AGENTS.md

## Purpose

This file tells coding agents and AI assistants how to work in the `boston-circular-economy` repository.

Use it to keep changes grounded in the real codebase, written in plain English, and sized to the maturity of the project.

## What this repository is today

This repository is an early-stage monorepo for a Boston circular economy project.

Current top-level areas:

- `client/` — React + Vite front end, including the main app and `/dev/` prototype routes
- `server/` — small Express server with a `/ping` route and local SQLite setup
- `etl/` — Python ETL package for collecting, normalizing, and merging location data
- `data-explorations/` — exploratory source-specific research and samples, not stable runtime code

Current maturity:

- The client is the most developed user-facing area.
- The server is minimal and should not be described as a mature platform yet.
- The ETL area contains the clearest domain model today.
- The exploratory folders are useful, but they are not the same as production architecture.
- GitHub Pages currently deploys the client build from `client/dist` on pushes to `main`.

Do not invent missing services, environments, workflows, or operating practices.

## Default working method

For substantial work, use a multi-role, parallel-thinking workflow. One person or agent can cover multiple roles, but the thinking should still happen.

### 1. Repo Analyst

Look at the real repository first.

Check:

- code structure
- package and script setup
- workflows and deployment
- current constraints
- what is missing or still only a stub

### 2. Architecture Lead

Explain how the system is put together today.

Focus on:

- system boundaries
- container boundaries
- integration points
- places where the architecture is still emerging

### 3. Domain / DDD Analyst

Use lightweight domain thinking.

Focus on:

- shared terms
- main entities and concepts
- user or stakeholder goals
- where terminology differs between code, docs, and data

### 4. Decision Analyst

Find decisions worth recording.

Focus on:

- what decision is being made
- why it is being made now
- what options were considered
- what tradeoffs come with the choice

### 5. Delivery / Agile Analyst

Keep the work practical.

Focus on:

- small slices of work
- flow of work across app, server, ETL, and docs
- blockers and dependencies
- what needs to be documented to keep delivery moving

### 6. Onboarding / Docs Analyst

Write for real readers.

Focus on:

- what a new contributor needs first
- what can be skipped
- where repo structure is confusing
- how to explain the system in plain English

### 7. Adversarial Reviewer

Challenge the proposed answer before finalizing it.

Ask:

- Are we overstating system maturity?
- Are we adding process that this repo will not maintain?
- Are we using jargon where plain English would work better?
- Are we claiming architecture that does not exist in code or deployment?
- Will this document go stale quickly?

### 8. Integrator

Bring the outputs together into one clear result.

Check for:

- contradictions
- repeated terms with different meanings
- gaps between docs and code
- advice that is too heavy for the current repo

## Core rules

### Evidence first

Base recommendations on:

- actual files and folders
- real scripts and workflows
- real deployment setup
- real data shapes
- real code paths

If something is proposed rather than implemented, label it clearly as proposed.

### Plain English first

Write so that a new contributor can follow the reasoning without architecture jargon.

Prefer:

- short sentences
- common words
- direct explanations

Avoid:

- vague framework language
- inflated claims
- unexplained acronyms
- "architecture theater"

### Explain why and why not

For important decisions, always explain:

- why this option was chosen
- what other options were considered
- why those other options were not chosen

This matters for both documentation and education. A good record teaches future readers how the team thought, not just what it picked.

### Right-sized process

Use enough process to help the repo, not enough to slow it down.

This project does not need heavyweight governance. It does need:

- accurate docs
- clear decisions
- basic traceability
- honest boundaries between prototype, exploration, and stable code

## Preferred methods

### C4 is the main architecture method

Use C4 as the default way to describe structure.

Best fit here:

- System Context
- Container
- Component, only when detail is truly useful

Why:

- it matches the current repo shape well
- it stays readable
- it is easier to maintain than a large formal diagram set

Why not default to something heavier:

- the repo is still maturing
- too many diagrams will go stale
- heavy notation adds little value at this stage

### ADRs for important decisions

Use ADRs for decisions that will matter later.

Good ADR topics here include:

- monorepo structure
- GitHub Pages deployment for the client
- use of React + Vite in `client/`
- use of Express in `server/`
- use of the ETL shared schema in `etl/`
- rules for prototypes in `client/src/pages/dev/`

ADR writing rules:

- write in plain English
- start with the problem being solved
- state the decision clearly
- include `Why this`, `Other options considered`, and `Why not those`
- describe consequences in practical terms
- avoid buzzwords and abstract filler

### Lightweight DDD

Use DDD mainly to improve language and understanding.

Good uses in this repo:

- glossary work
- clarifying `Location`, `Service`, `Activity`, `ItemCategory`, and source records
- aligning terminology between ETL, server, client, and docs

Do not force full bounded-context modeling unless the codebase actually grows into that need.

### Selective UML

Use UML only when it helps explain behavior that C4 does not cover well.

Likely good uses:

- ETL flow sequences
- merge behavior
- client-to-server-to-data request flow

Do not make UML the default for every document.

### Zachman is optional only

You may use Zachman as a thinking aid if it genuinely helps.

Do not make it a required framework for this repository.

### Kanban is the preferred workflow

Prefer Kanban over sprint-heavy process unless the team chooses otherwise.

Why:

- this repo mixes product work, prototypes, ETL work, and exploratory work
- those streams will likely move at different speeds
- flow is more useful than fixed ceremony at this stage

Suggested states:

- Backlog
- Ready
- In Progress
- Review
- Blocked
- Done

## Repo-specific guidance

### `client/`

Treat the client as the main user-facing surface.

Current facts:

- Vite builds the app
- TanStack Router uses file-based routes in `client/src/pages/`
- `/dev/` is used for prototypes and experiments
- GitHub Pages deploys the client only

Guidance:

- keep production-facing routes distinct from prototype routes
- do not document `/dev/` experiments as finished product features
- when a prototype is ready, move it out of `client/src/pages/dev/`
- keep docs honest about what is exploratory versus shipped

### `server/`

Treat the server as minimal unless the code proves otherwise.

Current facts:

- Express server
- simple `/ping` route
- local SQLite setup in `server/src/db/index.ts`

Guidance:

- do not describe the server as a full API platform yet
- if server responsibilities grow, update docs to describe routes, contracts, persistence, and runtime boundaries
- keep claims about storage and API scope modest and evidence-based

### `etl/`

Treat ETL as a major source of domain truth.

Current facts:

- Python package managed through `pyproject.toml`
- shared DTOs define `RawLocation` and `NormalizedLocation`
- source-specific queriers and normalizers exist for Google Places and OpenStreetMap
- merge processing is present but still incomplete

Guidance:

- use ETL types and pipeline stages when describing the domain
- document source-to-normalized boundaries clearly
- do not hide incomplete merge logic or stubbed behavior
- keep data contracts aligned with the actual DTOs

### `data-explorations/`

Treat this area as exploratory by default.

Guidance:

- separate exploratory findings from stable implementation guidance
- do not present sample data or experiments as production pipelines
- move stable patterns into `etl/` or other maintained areas before documenting them as standard practice

## Documentation expectations

Documentation in this repo should:

- match the codebase as it exists now
- say when something is proposed, partial, or exploratory
- help both do the work and understand the work
- stay brief unless extra detail clearly helps

Recommended doc categories:

- architecture overview
- C4 diagrams
- ADRs
- glossary and use cases
- onboarding notes
- delivery and workflow notes when needed

## Traceability rules

For substantial changes, try to maintain a clear path from:

**goal → use case or problem → decision → code change → documentation**

Not every small change needs every artifact. But bigger changes should leave enough trace that a future contributor can answer:

- what changed
- why it changed
- what alternatives were considered
- what else should be updated

## Change discipline

Before making claims in docs:

1. inspect the relevant files
2. inspect the relevant workflow or deployment setup
3. separate current state from proposed state
4. check whether terminology matches code

When changing code or docs:

- make the smallest change that fully solves the problem
- update nearby docs when behavior or meaning changes
- avoid creating new process unless there is clear reuse value
- prefer consistency with existing repo structure over generic best-practice templates

## Definition of Done guidance

For substantial work, check whether done should include updates to:

- architecture overview
- diagrams
- ADRs
- onboarding notes
- glossary or use cases
- workflow guidance

Work is not fully done if it changes how the system works but leaves the main explanation misleading.

## Style rules for generated content

Always:

- use plain English
- be concrete
- name real files, folders, routes, scripts, and workflows
- say when something is incomplete
- explain tradeoffs in practical terms

Never:

- fabricate architecture
- describe prototypes as production features
- describe exploration as stable runtime behavior
- use jargon when a simple explanation will do
- hide uncertainty

## Quick checklist for agents

Before finalizing substantial work, ask:

- Did I inspect the real code and workflow first?
- Did I separate current state from future ideas?
- Did I explain why and why not for important decisions?
- Did I keep the language plain?
- Did I avoid overstating system maturity?
- Did I update documentation when meaning changed?

