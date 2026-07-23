# Proposal: Code Review Process (with a focus on AI-agent-written code)

**Status:** Proposed — for discussion at a Hack Night / in #Circular-Economy. Not yet team policy.

A right-sized review process for this project: a public-GitHub, volunteer team where much of the
code is written with AI agents (the onboarding doc explicitly encourages AI-assisted work). It
adapts the ideas behind Cloudflare's AI code-review system and current industry practice, scaled
down to what this team can actually run.

## Where we are today (what this builds on)

The repo currently documents very little process, and this proposal is mostly **additive**:

- `CONTRIBUTING.md` covers **prototyping only** — build freely under `client/src/pages/dev/`,
  graduate when ready. This proposal keeps that culture intact (prototypes ride the light lane).
- The only automation is the **GitHub Pages deploy**, which ships `main` to the public site on
  every merge. There is **no CI gate** (no lint/tests run on PRs) — so today, review is the only
  thing standing between a PR and production.
- Review practice is informal: PRs linked to issues, discussed at Hack Nights, squash-merged.
  Several PRs have sat unreviewed for weeks — review capacity, not code-writing, is the bottleneck.

## Why agent code needs a deliberate process

AI agents produce plausible-looking code fast, which shifts the bottleneck from writing to
reviewing. The specific failure modes to catch:

- **Hallucinated APIs / dependencies** — calls to methods or packages that don't exist in the
  pinned versions (including "slopsquatting": a made-up package name an attacker registered).
- **Tests that pass but prove nothing** — agent-written tests often validate the code's own
  (possibly flawed) logic instead of the requirement and its edge cases.
- **Missing the intent** — the agent satisfies the literal prompt while missing what the ticket
  actually needed.
- **Silent security gaps** — missing input validation, missing checks on new endpoints, secrets
  in code or fixtures.
- **Over-engineering** — needless abstraction for a few-thousand-row directory app.
- **Weakened quality gates** — a diff that quietly skips tests, loosens lint, or lowers coverage.
- **Correlated failures** — when the same kind of AI writes and reviews the code, they share
  blind spots and check the code against itself rather than against intent. A human must own the
  intent check.

## The proposed process (five layers)

Each layer filters issues so scarce human attention goes where only humans add value.

**Layer 0 — PR hygiene (author).** Small PRs (aim < ~250 lines); link the issue; fill the PR
template, including an **AI-use disclosure** (which files were agent-written, what you verified).

**Layer 1 — Automated pre-screen (CI, must pass first).** Lint, type-check, tests, and secret
scanning on every PR: `ruff` + `pytest` for `etl/`, `eslint` + `tsc` for `client/`/`server/`.
Cheapest, most reliable filter — and the single biggest gap today, since `main` auto-deploys.

**Layer 2 — AI reviewer (advisory).** A review bot posts inline comments (hallucinated APIs,
obvious bugs, style). **Advisory only — it cannot approve or merge.** Suggested: CodeRabbit
(free for public repos, installs from the GitHub Marketplace).

**Layer 3 — Human review (risk-triaged).** A human reads the PR against the checklist below,
focusing on what tools miss: does it do what the ticket needed, does it fit the architecture,
is it safe. Depth depends on the risk lane.

**Layer 4 — Understanding + approval.** Beyond trivial changes, the author should be able to
explain the approach the agent took — we don't merge code nobody understands. A **human approves
and merges**; the heavier lanes get a second set of eyes.

## Risk lanes

| Lane | Examples | Review depth |
|------|----------|--------------|
| Green | docs, copy, styling, `dev/` prototypes | CI + AI reviewer; one quick human OK |
| Yellow | ETL pipelines, API endpoints, business logic | Full checklist; one human approval |
| Red | secrets/keys, data-write paths, deploy/CI config, new dependencies | Full checklist; second experienced reviewer |

Green protects the prototype-first culture in `CONTRIBUTING.md` — experiments stay fast. Red is
deliberately narrow: this project has no auth, payments, or PII yet, so the genuinely sensitive
surface is small (the Google API key, the deploy pipeline, the data-integrity path, dependencies).

## Review checklist for agent-written code

1. **Intent** — the diff implements the ticket's real requirement, not just the literal prompt.
2. **Real APIs** — every imported module/function exists in the pinned version.
3. **Dependencies** — new packages use the correct registry name, are maintained, licensed OK.
4. **No secrets** — no keys/tokens in code, tests, logs, or fixtures.
5. **Validation & boundaries** — external input validated; SQL/output parameterized/escaped.
6. **Tests exercise behavior** — failure paths and edge cases, not just the happy path; the tests
   would fail if the logic were wrong.
7. **No weakened gates** — the PR doesn't skip tests, loosen lint, or bypass hooks.
8. **Architecture fit** — respects the module boundaries and patterns already in the codebase
   (e.g. the ETL Querier → Normalizer → Ingester shape).
9. **Right-sized** — no needless abstraction for this project's scale.
10. **Understood** — the author can explain what it does and why.

## Supporting artifacts (created if adopted)

- **CI workflow** (`.github/workflows/ci.yml`) — lint/type/test/secret-scan on every PR, required
  to pass before merge (branch protection on `main`).
- **PR template** (`.github/pull_request_template.md`) — issue link, AI-use disclosure, checklist
  checkbox.
- **`AGENTS.md`** at the repo root — project conventions for coding agents (stack, patterns,
  "don't" rules, where things live). Better agent input means less to catch in review.
- A short **review section in `CONTRIBUTING.md`** pointing at the lanes and checklist.

## Guardrails

- The AI reviewer is a supplement, **never the approver** — a human owns every merge decision.
- Humans check **intent**, because AI review shares blind spots with AI generation.
- Keep it light: one off-the-shelf bot + a CI gate + a checklist. No custom review orchestration.
- Break-glass merges (skipping review for a genuine hotfix) should be rare and visible.

## Proposed rollout order

1. CI pre-screen (biggest single win — `main` currently deploys with zero automated checks).
2. CodeRabbit on the repo (free, minutes to install).
3. PR template + `AGENTS.md`.
4. Risk lanes + checklist recorded in `CONTRIBUTING.md`.
5. Revisit after a month at a Hack Night: are Green PRs flowing fast, is human time going to
   Yellow/Red, is anything just ceremony?

## Open questions for the team

- Do we have enough active reviewers to require one human approval on Yellow/Red without
  stalling PRs — or should we set a "best effort within 48h" norm instead of a hard gate?
- Is the AI-use disclosure acceptable friction for volunteers?
- Who administers branch protection and the CodeRabbit install (needs repo admin)?
