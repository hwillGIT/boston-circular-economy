# Proposal: Code Review Process (for a team that codes with AI agents)

**Status:** Proposed — under refinement; for discussion at a Hack Night / in #Circular-Economy.

## Goals

Two goals shape every choice below:

1. **In aggregate, the review should be better than any single developer could be** — not by
   finding a smarter reviewer, but by combining many narrow perspectives (each with full
   attention), verifying their findings adversarially, and synthesizing the result.
2. **The review must educate, not annoy.** Output is capped, taught, and kind. A review that
   raises cognitive load or nags about trivia costs us volunteers; a review that teaches is how a
   rotating team levels up and why people stay. Success is measured by *declining* repeat
   findings per contributor — not by findings volume.

Everything proposed here uses free tooling (GitHub features, free-for-open-source apps, and
prompt recipes run in whatever AI agent contributors already use). Nothing paid.

## Where we are today

- `CONTRIBUTING.md` covers prototyping only (build freely in `client/src/pages/dev/`, graduate
  when ready). This proposal keeps that culture — prototypes ride the light lane.
- The only automation is the GitHub Pages deploy: **every merge to `main` ships to the public
  site**, and there is **no CI on pull requests**. Review is currently the only gate.
- Review practice is informal (issue-linked PRs, Hack Night discussion, squash merge), and
  reviewer capacity — not code-writing — is the bottleneck.

## Why agent-written code needs a deliberate process

Agents produce plausible code fast, shifting the bottleneck from writing to reviewing. The
failure modes to catch: hallucinated APIs and dependencies (including slopsquatting), tests that
pass but prove nothing, code that satisfies the literal prompt while missing the ticket's intent,
silent security gaps, over-engineering, quietly weakened quality gates — and **correlated
failures**: when the same kind of AI writes and reviews the code, they share blind spots and check
the code against itself rather than against intent. A human owns the intent check.

## The process at a glance

| Layer | What | Who/what runs it |
|-------|------|------------------|
| 0 | PR hygiene: small PRs, issue link, AI-use disclosure | Author |
| 1 | Pre-screen: format, lint, type-check, tests, secret scan | CI (auto-fixes style; humans never comment on it) |
| 2 | Advisory AI review comments | Free review bot (advisory only) |
| 3 | Human review by risk lane, using the checklist | One volunteer (two for Red) |
| 4 | Understanding + approval: author can explain the change; human merges | Author + reviewer |
| Deep | Multi-lens panel + adversarial verification (significant changes) | `/deep-review` recipe, on demand |

## Risk lanes

| Lane | Examples | Review depth |
|------|----------|--------------|
| Green | docs, copy, styling, `dev/` prototypes | CI + bot; one quick human OK |
| Yellow | ETL pipelines, API endpoints, business logic | Checklist review; one approval; adversarial tests encouraged |
| Red | secrets/keys, data-write paths, deploy/CI config, new dependencies | Checklist + second reviewer + red-team pass |

Red is deliberately narrow — no auth, payments, or PII exist yet, so the sensitive surface is
small (the Google API key, the deploy pipeline, data integrity, dependencies).

## The educational output contract

Applies to **every** reviewer — bot, panel, and human alike:

- **Never send a human to do a linter's job.** Formatting and style are auto-fixed in CI and
  never appear as review comments. Whole categories of nagging are deleted by automation.
- **At most 3–5 findings per review**, ranked by what is most worth learning. Depth of analysis
  is unlimited; demand on the reader is capped.
- **Every finding teaches**: what → *why*, naming the principle or pattern involved → a concrete
  better shape (a suggested diff when mechanical) → a link to the project's own reference
  (`docs/design-patterns.md`, an ADR, `etl/README.md`). The named principle is the educational
  payload — it transfers beyond this PR.
- **Teach the why-not, not just the why.** Where an obvious or popular alternative exists, the
  finding names it and explains why it isn't taken here ("you might expect a class hierarchy —
  popular because X — but we use injected strategies because our matchers must swap and be
  tested independently"). This is the ADR "considered options" habit at code scale, and it
  answers the "why didn't you just…?" question before anyone has to ask it.
- **Grounded in named sources, honestly.** Findings cite the principle *and* where it comes
  from — our own docs first (`design-patterns.md`, an ADR), the canon second (e.g. "Fowler,
  *Refactoring* — Feature Envy") with a "Further reading" pointer into
  [`docs/reading-list.md`](../reading-list.md), where every title is available via the team
  shelf or free through the Boston Public Library's O'Reilly access. Where authorities disagree
  (they often do), the review says so rather than presenting contested advice as settled law;
  [`docs/engineering-stances.md`](../engineering-stances.md) records which side this team takes
  and why.
- **Questions over commands** ("what happens if the source returns zero records?"), and **one
  praise note that teaches** ("clean Repository usage — storage can now change freely").
- **Progressive disclosure**: one-line verdict, then the taught findings, everything else in a
  collapsed appendix.
- **The learning loop**: a finding that recurs across PRs becomes a one-line addition to
  `AGENTS.md` or the docs, so future agents and humans get it upstream and the lesson never
  needs re-teaching. This is how the process reduces its own future workload.

## Deep review: the multi-lens panel

For significant changes, a panel of narrow reviewers — each reading the full change **plus the
project's own ground truth** (ADRs, `docs/architecture.md`, `docs/design-patterns.md`, the DTO
vocabulary) — so the review is against *our* architecture, not generic taste:

1. **Architecture & design** — coupling, dependency direction, boundaries, SOLID; does it fit
   the documented Querier → Normalizer → Ingester shape or silently fork it; ADR compliance.
2. **Refactoring** — code smells (duplication, long methods, feature envy, primitive obsession,
   dead code) and simplification. For each significant finding it must propose **2–3 alternative
   shapes with tradeoffs** — multi-option thinking is required output, not just criticism.
3. **Domain fit** — does the code's model match the product's (the Activity/ItemCategory
   taxonomy, givers-first priority, the documented anti-goals)?
4. **Evolution** — how does the change age? Open where change is coming (new data sources),
   closed where it isn't.
5. **Maintainability for this team** — can a rotating volunteer of average skill understand and
   modify it? Cognitive load, explicitness, docs.
6. **Testability & test honesty** — would the tests fail if the logic were wrong; what's untested.
7. **Security & data integrity** — on the Red surface.

Then two stages that make the aggregate exceed any individual reviewer:

- **Adversarial verification** — skeptic passes (on a different model than the author's agent
  where possible) try to *refute* each finding before it is shown to anyone. Plausible-but-wrong
  critiques die here; this is the noise filter that keeps the panel from becoming spam.
- **Synthesis judge** — dedupes, ranks by learning value and impact, and writes **one** coherent
  review under the educational output contract. Seven lenses in; 3–5 taught findings out.

**Triggers:** changes touching architecture, new abstractions or dependencies, the ETL/merge
core, anything Red — or on demand by author or reviewer.

**Implementation (free):** a prompt recipe in the repo (`docs/review-recipes/deep-review.md`)
that any contributor runs in the AI agent they already use. No infrastructure, no shared API key,
no spend beyond what contributors already have. If the team later wants it automatic, a GitHub
Action can run the same recipe on a `deep-review` label — adopt only if someone volunteers to
own the API key and budget.

## Adversarial roles

Three adversarial mechanisms, all free, adopted together for aggregate benefit:

- **Adversarial test generation (Yellow/Red):** an agent whose only job is to *falsify* the PR —
  write edge-case and failure-path tests that try to break it. It attacks the worst agent-code
  failure mode (tests that prove nothing) and produces a concrete artifact — a failing test — that
  a volunteer can evaluate in seconds. Recipe: `docs/review-recipes/falsify.md`.
- **Red-team hunter (Red only):** an agent prompted purely to break the change — exploit it,
  corrupt the data path, find the missed edge — scoped to the narrow Red surface.
  Recipe: `docs/review-recipes/red-team.md`.
- **The pre-mortem line (all human reviews):** before approving, the reviewer writes one
  sentence: *"the most likely way this fails in production is ___."* Zero cost; forces
  adversarial thinking as a habit.

(A full advocate/refuter/judge debate is reserved for ADR-level decisions, where it is already
our practice — it is too heavy for routine diffs.)

## Review checklist (Layer 3)

1. **Intent** — the diff implements the ticket's real requirement, not the literal prompt.
2. **Real APIs** — every imported module/function exists in the pinned version.
3. **Dependencies** — correct registry names, maintained, licensed OK.
4. **No secrets** — no keys/tokens in code, tests, logs, or fixtures.
5. **Validation & boundaries** — external input validated; SQL/output parameterized/escaped.
6. **Tests exercise behavior** — failure paths and edge cases; the tests would fail if the logic
   were wrong.
7. **No weakened gates** — the PR doesn't skip tests, loosen lint, or bypass hooks.
8. **Architecture fit** — respects documented boundaries and patterns.
9. **Simpler alternative?** — is there a materially simpler shape? For Yellow/Red PRs the author's
   description states what alternatives were considered and why this shape won.
10. **Understood** — the author can explain what it does and why.
11. **Pre-mortem** — reviewer states the most likely production failure in one sentence.

## Supporting artifacts (created if adopted — all free)

- **CI workflow** (`.github/workflows/ci.yml`) — auto-format, `ruff` + `pytest` (etl), `eslint` +
  `tsc` (client/server), secret scan; required before merge (branch protection on `main`).
- **PR template** (`.github/pull_request_template.md`) — issue link, AI-use disclosure,
  alternatives-considered (Yellow/Red), checklist checkbox.
- **`AGENTS.md`** at the repo root — project conventions for coding agents, seeded from the
  docs; the learning loop's destination.
- **Review recipes** (`docs/review-recipes/`) — **drafted and ready to trial**:
  [`quick-review.md`](../review-recipes/quick-review.md) (the standard advisory pass),
  [`deep-review.md`](../review-recipes/deep-review.md) (the multi-lens panel),
  [`falsify.md`](../review-recipes/falsify.md), [`red-team.md`](../review-recipes/red-team.md).
- **Advisory reviewer** — our own `quick-review.md` recipe (see
  [home-grown-reviewer.md](home-grown-reviewer.md)), which absorbs the strong features of
  commercial bots while obeying the output contract. CodeRabbit (free for public repos) may run
  side-by-side during rollout as a comparator. Advisory only; never the approver.
- A short review section in `CONTRIBUTING.md` pointing at lanes, contract, and checklist.

## Guardrails

- No reviewer — bot or panel — approves or merges. **A human owns every merge decision**, and
  humans own intent, because AI review shares blind spots with AI generation.
- The output contract binds everyone; a deep panel that dumps twenty findings has failed
  regardless of how smart the findings are.
- Break-glass merges (skipping review for a genuine hotfix) are rare and visible.
- Revisit at a Hack Night after a month: are Green PRs flowing fast, are repeat findings
  declining, is anything pure ceremony?

## Rollout order

1. CI pre-screen with auto-formatting (biggest win; `main` currently deploys with zero checks).
2. Advisory bot install (minutes; free).
3. PR template + `AGENTS.md`.
4. Review recipes (deep-review, falsify, red-team) + lanes and checklist into `CONTRIBUTING.md`.
5. One-month retrospective against the education metric (repeat findings declining?).

## Open questions for the team

- Enough active reviewers to hard-require one approval on Yellow/Red — or a
  "best effort within 48h" norm instead?
- Is the AI-use disclosure + alternatives-considered acceptable friction for volunteers?
- Who administers branch protection and the bot install (needs repo admin)?
- Where should deep-review runs be shared — as a PR comment, or a thread in #Circular-Economy?
