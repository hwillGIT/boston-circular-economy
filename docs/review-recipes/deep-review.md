# Recipe: Deep Review (multi-lens panel)

For significant changes: anything touching architecture, new abstractions or dependencies, the
ETL/merge core, any Red-lane change — or on request. Run in an agent that supports subagents
(run lenses in parallel); otherwise run the lenses sequentially in one session. Output is one PR
comment (or a #Circular-Economy thread). **Advisory only.**

## Phase 1 — Context (once, shared by all lenses)

Load: the diff + full changed files; the linked issue; `AGENTS.md`; `docs/architecture.md`;
`docs/design-patterns.md`; `docs/engineering-stances.md`; relevant ADRs (`docs/adr/`);
`docs/merge-processor.md` if touching the data layer; CI output.

## Phase 2 — Lenses (each produces raw findings independently)

Run each lens as its own pass/subagent with only its mandate:

1. **Architecture & design** — coupling, dependency direction, boundary violations; conformance
   to the documented pipeline shape and ADRs; deep-vs-shallow modules (stance #1).
2. **Refactoring** — smells (duplication, long param lists, feature envy, primitive obsession,
   dead code) *and* simplification. For every significant finding, propose **2–3 alternative
   shapes with tradeoffs**, including the obvious/popular one and why it loses here.
3. **Domain fit** — does the model match the product (Activity/ItemCategory vocabulary,
   givers-first, documented anti-goals)? Naming that matches how the team talks?
4. **Evolution** — how does this age? Open where change is coming (new sources), closed where
   it isn't. What does the *next* contributor have to touch?
5. **Maintainability** — can a rotating volunteer of average skill understand and modify this?
   Cognitive load, explicitness, docstrings that explain why.
6. **Test honesty** — would the tests fail if the logic were wrong? What's untested (empty,
   null, malformed, boundary, failure paths)?
7. **Security & data integrity** — secrets, input validation, dependency provenance, anything
   that can corrupt the dataset or break deploy.

Each lens must also state what it deliberately did NOT flag (theoretical risks, unchanged code,
style) — the not-flagged discipline is what keeps the panel quiet.

## Phase 3 — Adversarial verification

For each raw finding, a skeptic pass — **on a different model/family than the code's author
agent when possible** — attempts to refute it against the actual source: is it real in this
code, on this path, at this project's scale? Findings that don't survive are dropped. When in
doubt, drop (a missed nitpick costs less than noise).

## Phase 4 — Synthesis (the only output anyone sees)

One judge merges survivors into a single review under the educational output contract:

- Verdict line first (approve-as-is / minor issues / needs discussion / blocking finding).
- **3–5 findings max**, ranked by learning value × impact, each in the teach format
  (what → why + principle → better shape → why-not → further reading), citing our docs and
  `engineering-stances.md` where the canon disagrees.
- One praise note that teaches. Appendix in `<details>` for everything else, including a
  one-line log of findings killed in Phase 3 (transparency about the filter).
- Recurring themes → proposed `AGENTS.md` one-liners (the learning loop).
- Close with the advisory disclaimer.
