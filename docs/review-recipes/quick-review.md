# Recipe: Quick Review

The standard advisory review for any PR. Run it in the AI agent you already use: point the agent
at this file and the PR ("Follow docs/review-recipes/quick-review.md for PR #NN"). Output is one
PR comment. **Advisory only — never approve, request changes, or merge.**

## Inputs (gather before judging)

1. The full diff, and the surrounding source of changed files (not just hunks).
2. The **linked issue** — its acceptance criteria are the definition of intent.
3. CI results if available (lint, types, tests, secret scan). Machines have settled these:
   do not re-raise anything a linter/formatter owns.
4. Project ground truth: `AGENTS.md`, `docs/architecture.md`, `docs/design-patterns.md`,
   `docs/engineering-stances.md`, relevant ADRs.
5. The previous review comment on this PR, if any (see Re-review rules).

## Steps

1. **Summary & walkthrough** — 2–4 sentences of plain English on what the PR does and why,
   then a short per-file walkthrough. For multi-component changes, include a Mermaid sequence
   or flow diagram (GitHub renders it).
2. **Intent check** — does the diff satisfy the linked issue's actual requirement? If it
   satisfies the letter but misses the need, that is finding #1.
3. **Findings** — identify issues, then apply the output contract below. Check especially the
   agent-code failure modes: hallucinated APIs/packages, tests that would still pass if the
   logic were wrong, weakened quality gates, secrets, missing boundary validation.
4. **Verify before posting** — for each finding, re-read the actual source and confirm it is
   real in *this* code (not a theoretical risk). Drop anything speculative.

## Output contract (binding)

- **At most 5 findings**, ranked by what is most worth learning. Severity tags:
  `critical` (blocks: corruption, security, deploy breakage) / `warning` (concrete risk) /
  `suggestion` (improvement).
- **Each finding teaches**: what → why (name the principle or pattern) → a concrete better
  shape (use a ```suggestion block when the fix is mechanical) → *why-not* (if an obvious
  alternative exists, say why it isn't right here) → "Further reading" link into our docs
  first, then `docs/reading-list.md` (book + chapter).
- Where authorities disagree, say so and cite `docs/engineering-stances.md` for our side.
- **One praise note that teaches.** Questions over commands. No style/format comments ever.
- Everything below the findings goes in a `<details>` appendix.
- End with: `This is an advisory AI review — a human makes the merge decision.`

## Re-review rules (new commits pushed)

- Read your previous comment. Omit findings that are fixed; re-emit unfixed ones unchanged.
- Respect human-resolved threads unless the situation has objectively worsened.
- If the author disagreed with a finding, engage with the argument — concede or explain, don't
  repeat.

## Learning loop

If a finding repeats what you've seen flagged in earlier PRs, note at the bottom:
`Recurring theme — consider adding a line to AGENTS.md:` with the proposed one-liner.
