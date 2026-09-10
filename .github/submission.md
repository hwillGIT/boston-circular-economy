## Outcome

New developers can find one small frontend assignment.
They can see its place in the work sequence, start it with a clear AI prompt, and
prepare for team review.
The repository now gives them a short starting path before the detailed guides.

Issue exception: This onboarding documentation change has no dedicated issue.

## Evidence and limits

- Evidence: The new guide links from the repository root, the contribution guide, and the assignment catalog. Prettier, the prose check, and all local delivery-policy hooks pass.
- Why this evidence supports the result: Each entry point now directs a new developer to the same bounded first action and the same detailed references.
- Conditions and limits: The guide does not prove that a developer completed an assignment or understood the result. Team review still checks the submitted work.
- What could change the decision: Confusing feedback from a first contributor, a changed startup command, or a new assignment flow requires a revision.

## Decision explanation

- Why this design: A short path based on a developer's goal makes the first action visible without hiding the detailed rules.
- Closest alternative: One long contribution guide holds all information in one place. It gives complete context but delays the first useful action.
- Trade-off accepted: The repository now maintains a short entry page and detailed reference guides. Links between them must stay current.
- Revisit when: Contributor feedback shows that a path, time estimate, or prompt no longer answers the first question.

## Code quality

- Trace one example: A new developer opens `README.md`, selects the guided task path, reads `docs/GET_STARTED.md`, and opens a ready manifest.
- Where to make a likely change: `docs/GET_STARTED.md` owns the first-task sequence and its copyable AI prompt.
- Who owns the rule and state: The assignment manifest owns the task scope. GitHub branch protection owns the required checks and approvals.
- Failure and recovery: A missing decision stops the assignment. The contributor records the smallest useful question in the assignment issue.
- What became simpler or harder: One page now gives a clear start. Maintainers must keep its links and commands aligned with the detailed guides.

## Risk and scope

- Review level: Green
- In scope: Developer onboarding, documentation links, a first-task prompt, local setup instructions, and team-review instructions.
- Out of scope: Application behavior, API contracts, live deployment, secrets, and Slack messages.
- Rules that must remain true: The guide must not promise an unverified result. Required checks and team approvals remain separate from AI assistance.

## What changed

The root README now identifies the project, points new developers to a first task, and
lists guides by goal and time to start.

`docs/GET_STARTED.md` explains how to select a ready assignment, inspect its sources,
ask an AI for a plan, make the artifact, and prepare for the review team.
It also divides research, UI specification, interaction design, visual design, and
backend handoff by their deliverable and start condition.

The contribution guide now gives a short first-change sequence, direct frontend startup
commands, submission steps, and the two-approval rule.

The frontend assignment catalog now links back to the first-task guide.

## Challenge cases

The guide directs research and design contributors to a bounded artifact before code.
It directs code contributors to the relevant checks and the code standard.
It tells a contributor to stop and record a question when a decision is missing.
It separates an AI plan, a passing check, and a completed form from demonstrated understanding.

## Evidence

| Check                               | Result       | Evidence or reason not run                                                        |
| ----------------------------------- | ------------ | --------------------------------------------------------------------------------- |
| Client lint and build               | Not affected | This change updates Markdown only.                                                |
| Server lint and build               | Not affected | This change updates Markdown only.                                                |
| ETL tests                           | Not affected | This change updates Markdown only.                                                |
| Technical prose and editorial style | Pass         | Prettier, the delivery prose check, and all six local delivery-policy hooks pass. |
| Manual user journey                 | Not affected | This change does not alter a product journey.                                     |
| Accessibility / responsive          | Not affected | This change does not alter rendered product UI.                                   |
| Security / privacy / recovery       | Not affected | This change adds no runtime code, secret, or permission.                          |

Hosted CI must still run against the submitted revision.

## AI assistance

- [x] AI assisted with exploration or planning
- [x] AI assisted with implementation or tests
- [x] AI assisted with review or challenge

The review team must check the explanation against the submitted work.
This record does not establish contributor understanding. Human review must check the explanation against the submitted work.

## Review focus and uncertainty

Review the first 20-minute sequence, work-lane map, copyable AI prompt, and setup
commands. Confirm that the guide directs a developer to a small task without hiding
the detailed rules. Confirm that work does not start before its input is accepted.
The guide has not yet been used by a new contributor.

## Documentation and learning

- [x] I updated the relevant README, `AGENTS.md`, decision record, or runbook

The new guide asks a contributor to explain a concrete result, choice, evidence, and
failure case before team review.
