## Outcome

Contributors receive five bounded frontend assignments with prompts, deliverables, and a human explanation checkpoint.
The workflow checks the fork's application and committed work evidence.

Closes #11

## Evidence and limits

- Evidence: Local checks pass for client and server builds, four server tests, 22 Python tests, and 138 delivery-policy tests.
- Why this evidence supports the result: Application checks preserve the fork's behavior. Policy tests reject incomplete records, invalid dependencies, and failed required jobs.
- Conditions and limits: A completed record cannot establish that its statements are correct or that a contributor understands the work.
- What could change the decision: Missing required checks, incorrect routing, or execution of untrusted code with a write token require revision.

## Decision explanation

- Why this design: Build on PR #10's tested fork revision and retain its application checks.
- Closest alternative: The original pilot branch preserves earlier review history. It has conflicting application changes and continues to change elsewhere.
- Trade-off accepted: This integration needs a separate review and an explicit merge order.
- Revisit when: The maintainer selects another shared workflow or the host-specific release procedure.

## Code quality

- Trace one example: A changed legacy document loses its content exemption. The prose checker reports violations for correction before submission.
- Where to make a likely change: The delivery checker owns baseline matching and manifest checks. The submission checker owns required record fields.
- Who owns the rule and state: Versioned policy owns mechanical rules. GitHub owns check results. A human reviewer owns acceptance.
- Failure and recovery: A missing field, unaccepted dependency, or failed required check prevents success. Correct the affected artifact and submit a new revision.
- What became simpler or harder: Ordinary questions connect the assignment, record, and review. Content fingerprints preserve existing prose debt without exempting edited files.

## Risk and scope

- Review level: Red
- In scope: Assignment guidance, local checks, CI integration, committed submission validation, review instructions, and activation steps.
- Out of scope: New product behavior, live API credentials, automatic human approval, and Slack messages.
- Rules that must remain true: Required checks remain effective. Privileged workflows execute trusted base code and treat the submitted record as data.

## What changed

Five manifests connect research, specifications, wireframes, visual design, and a backend-call proposal.
Prompts ask contributors to predict, trace, compare, change a condition, and explain independently.

The integration starts from PR #10 at revision `4a25a6f`.
The workflow tools derive from `6ac23f9`, with fork-specific checks and ordinary language.
A fingerprint baseline records 52 unchanged legacy files.
The manual deployment readiness workflow performs no publication while hosting remains unresolved.

## Challenge cases

Tests cover missing fields, misleading Markdown, incomplete acceptance, unknown dependencies, cycles, and missing sources.
An edited legacy file loses its exemption.
Each failed, skipped, or cancelled required job prevents a successful Quality Gate.
The review router raises the minimum review level for sensitive paths.

## Evidence

| Check                               | Result       | Evidence or reason not run                                                                                      |
| ----------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------- |
| Client lint and build               | Pass         | Client lint, CSS checks, Prettier, and production build. Existing bundle warnings remain.                       |
| Server lint and build               | Pass         | Server lint, TypeScript build, and four isolated authentication tests.                                          |
| ETL tests                           | Pass         | Ruff checks, format, Mypy, and all 22 tests.                                                                    |
| Technical prose and editorial style | Pass         | No new prose violations, five valid manifests, 138 policy tests, and four validated skills.                     |
| Manual user journey                 | Not affected | Application source matches PR #10, which records the browser journey checks.                                    |
| Accessibility / responsive          | Not affected | This integration changes delivery files and assignment guidance.                                                |
| Security / privacy / recovery       | Not run      | Hosted trusted-base submission tests, human workflow review, and host-specific recovery remain activation work. |

The public function documentation audit and generation pass.
The existing Python docstring audit remains advisory.
Hosted integration CI must be checked against the submitted commit.

## AI assistance

- [x] AI assisted with exploration or planning
- [x] AI assisted with implementation or tests
- [x] AI assisted with review or challenge

This record does not establish contributor understanding. Human review must check the explanation against the submitted work.

## Review focus and uncertainty

Review the trusted-base submission workflow, baseline exemptions, preserved CI checks, and the decision to defer publication.
The first integration cannot demonstrate trusted-base enforcement until its policy exists on main.
A follow-up pull request must test that path before required status checks are enabled.

Human review, a contributor demonstration, hosted AI review configuration, and deployment remain pending.
The activation guide gives concrete checks and the required merge order.

## Documentation and learning

- [x] I recorded a follow-up issue for remaining work

[Issue #11](https://github.com/hwillGIT/boston-circular-economy/issues/11) tracks integration and activation evidence.
The developer guide contains practice prompts. Acceptance records remain empty until human review.
