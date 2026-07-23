# Proposal: Home-Grown Reviewer — absorbing CodeRabbit's strengths

**Status:** Proposed — companion to [code-review-process.md](code-review-process.md).

## Why roll our own

CodeRabbit is free for public repos, so this is not about cost. It is about four things an
off-the-shelf bot cannot give us:

1. **Contract enforcement** — no vendor bot can be bound to our educational output contract
   (max 3–5 taught findings, principles named, links into *our* docs, zero nits). Its
   configuration nudges tone; it cannot restructure the product.
2. **Grounding in our ground truth** — our reviewer reads the ADRs, `docs/architecture.md`,
   `docs/design-patterns.md`, and the domain vocabulary. Reviews check against *our*
   architecture, not generic taste. CodeRabbit's documented blind spot is exactly this:
   it "can't know that your discount calculation formula is wrong if the formula is
   syntactically valid" — business/domain logic is where our docs give us an edge.
3. **Transparent, portable memory** — CodeRabbit's "learnings" live in its service and take
   2–4 weeks of feedback to calibrate. Ours live in the repo (`AGENTS.md`,
   `docs/review-learnings.md`), versioned, reviewable, and shared by the *coding* agents too —
   one memory improves both generation and review.
4. **Adversarial verification** — findings are attacked by skeptic passes before anyone sees
   them. No commercial bot does this; it is our main structural answer to review noise.

## Feature teardown: their strength → our equivalent

| # | CodeRabbit strength | Our implementation (all free) |
|---|--------------------|-------------------------------|
| 1 | PR summary + file-by-file walkthrough | First section of the review recipe output: plain-English summary + walkthrough, posted as one comment |
| 2 | Sequence diagrams of changes | Mermaid diagram in the summary — GitHub renders Mermaid natively in comments |
| 3 | 40+ integrated linters/SAST (Ruff, ESLint, Biome…) as deterministic pre-checks | Our CI runs `ruff`, `eslint`, `tsc`, `pytest`, `gitleaks` (+ `semgrep` free rules if wanted); CI output is **fed into the reviewer prompt** so the AI never re-litigates what machines settled |
| 4 | Path-based instructions (`.coderabbit.yaml` `path_instructions`) | Per-directory sections in `AGENTS.md` (`etl/`, `client/`, `server/`) — one versioned file guides both code generation *and* review |
| 5 | ast-grep rules for syntax-aware custom checks | ast-grep is open source: `rules/` dir + a CI step, added when a real recurring pattern justifies it |
| 6 | Learnings — adapts to team feedback over time | The learning loop: recurring findings become one-line entries in `AGENTS.md` / `docs/review-learnings.md` via normal PRs — instant, transparent, no calibration period |
| 7 | Incremental re-reviews (only deltas; resolves fixed threads) | The recipe takes the previous review comment as input: omit fixed findings, re-emit unfixed ones, respect resolved threads |
| 8 | One-click committable fixes | GitHub ```suggestion``` blocks in review comments — natively committable |
| 9 | Issue validation (does the PR satisfy the linked issue?) | Step 0 of the recipe: fetch the linked issue, check the diff against its acceptance criteria — our checklist item #1, automated |
| 10 | Chat commands (`@coderabbitai explain…`) | Contributors already have an agent; recipes are callable ad hoc, and `explain` uses our plain-English explanation style |
| 11 | Review profiles (chill/assertive) | Our output contract *is* the profile — stricter than "chill": capped, taught, kind |
| 12 | Multi-model routing (reasoning vs. cheap models) | Recipes specify tiers: light model for summary/walkthrough, strong model for judgment, and skeptics on a **different model family** than the author's agent (correlated-failure control) |
| 13 | Docstring & test generation | `falsify.md` already generates adversarial tests; docstrings on demand from the contributor's own agent |

## What ours has that CodeRabbit doesn't

- The **educational output contract** enforced end-to-end (their documented weakness is
  comment-volume fatigue on big PRs — the exact failure our cap prevents).
- **Deep-review panel** (7 lenses) with **adversarial verification** and a synthesis judge.
- Reviews **grounded in our ADRs, patterns doc, and domain vocabulary**.
- **In-repo memory** shared between review and generation.
- The pre-mortem and falsification artifacts (a failing test beats an opinion).

## Honest residual advantages CodeRabbit keeps

- **Zero-touch automation**: it runs on every PR with no human action, on hosted infra. Our
  default is run-on-demand recipes; full parity requires a GitHub Action with a repo API key —
  adopt only when a maintainer volunteers to own key + budget.
- **Polish and latency**: a hosted product is smoother than a recipe. Accepted trade for
  contract control.
- **Scale tuning**: it is calibrated across 2M+ repos. Our counter is narrower but deeper:
  calibration to *this* codebase via the docs and learning loop.

**Optional validation:** during rollout, run CodeRabbit (free) side-by-side for a few weeks and
compare against our reviewer on the same PRs. Retire whichever loses. Evidence over allegiance.

## Where it lives

- `docs/review-recipes/deep-review.md` — the panel + synthesis (the full reviewer).
- `docs/review-recipes/quick-review.md` — the lightweight per-PR pass (summary, walkthrough,
  diagram, issue validation, capped findings): the CodeRabbit-equivalent.
- `docs/review-recipes/falsify.md`, `red-team.md` — adversarial roles.
- `AGENTS.md` — path guidance + accumulated learnings.
- `.github/workflows/ci.yml` — the deterministic layer that feeds the reviewer.

## Rollout

1. CI layer (already first in the main proposal — it is also this design's foundation).
2. `quick-review.md` recipe + `AGENTS.md` path sections.
3. `deep-review.md`, `falsify.md`, `red-team.md`.
4. Optional side-by-side with CodeRabbit; keep the winner.
5. Optional GitHub Action automation when someone owns an API key.
