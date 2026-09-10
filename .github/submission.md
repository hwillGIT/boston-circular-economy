## Outcome

New developers can find, claim, and complete one small frontend assignment.
They can see which work is ready, waiting for an input, or needs a team decision.
They can start with a clear AI prompt and prepare for team review. A sponsor can
present the pilot in ten minutes and lead a twenty-minute review discussion.

Issue exception: This onboarding documentation change has no dedicated issue.

## Evidence and limits

- Evidence: The work queue links current issues and pull requests from the repository root, contribution guide, assignment catalog, and sponsor brief. The issue form has a valid YAML structure. Prettier, the prose check, and all local delivery-policy hooks pass.
- Why this evidence supports the result: Each entry point now directs a new developer to the same ready-work view and detailed references.
- Conditions and limits: The guide does not prove that a developer completed an assignment or understood the result. It does not prove that GitHub renders the form as intended. Team review still checks the submitted work.
- What could change the decision: Confusing feedback or an unclear claim requires a revision. A changed startup command or assignment flow also requires a revision.

## Decision explanation

- Why this design: A visible queue shows what can begin, what must wait, and which decisions belong to the team.
- Closest alternative: A contributor reads every issue before selecting work. It gives full context but makes the first available task hard to find.
- Trade-off accepted: The repository now maintains a queue snapshot and linked issue records. The team must update the snapshot after triage.
- Revisit when: Contributor feedback shows that a path, time estimate, or prompt no longer answers the first question.

## Code quality

- Trace one example: A new developer opens `README.md`, selects the work queue, checks UI-001, and opens its manifest.
- Where to make a likely change: `docs/GET_STARTED.md` owns the first-task sequence and its copyable AI prompt.
- Who owns the rule and state: The assignment manifest owns the task scope. GitHub branch protection owns the required checks and approvals.
- Failure and recovery: A missing decision stops the assignment. The contributor records the smallest useful question in the assignment issue.
- What became simpler or harder: One page now gives a clear start. Maintainers must keep its links and commands aligned with the detailed guides.

## Risk and scope

- Review level: Green
- In scope: Developer onboarding, task claiming, a work queue, a sponsor brief, documentation links, a first-task prompt, local setup instructions, and team-review instructions.
- Out of scope: Application behavior, API contracts, live deployment, secrets, and Slack messages.
- Rules that must remain true: The guide must not promise an unverified result. Required checks and team approvals remain separate from AI assistance.

## What changed

The root README now identifies the project, points new developers to a first task, and
links to the work queue before the detailed guides.

`docs/GET_STARTED.md` explains how to select a ready assignment, inspect its sources,
ask an AI for a plan, make the artifact, and prepare for the review team.
It also divides research, UI specification, interaction design, visual design, and
backend handoff by their deliverable and start condition.
It now gives a copyable issue-claim record and tells contributors how to avoid
duplicating a current claim.

The contribution guide now gives a short first-change sequence, direct frontend startup
commands, submission steps, and the two-approval rule.
It now asks the contributor to check and claim the issue before creating a branch.

The frontend assignment catalog now links back to the first-task guide.

`docs/WORK_QUEUE.md` groups active review, ready work, waiting inputs, team decisions,
future work, and completed work. It records the current one-pull-request pilot route
and the team decision needed before a recurring cohort uses a submission branch.

The sponsor brief now opens the work queue during the twenty-minute review.
It links to the checked Archify diagram package in PR #14 for the CI discussion.

The work-unit issue form now records a work lane, start condition, standard task size,
and expected handoff. The sponsor brief gives a ten-minute presentation and a
twenty-minute team review agenda.

## Challenge cases

The guide directs research and design contributors to a bounded artifact before code.
It directs code contributors to the relevant checks and the code standard.
It tells a contributor to stop and record a question when a decision is missing.
It separates an AI plan, a passing check, and a completed form from demonstrated understanding.
It tells a contributor to choose another ready task when a current claim exists.
It keeps waiting work separate from work that a contributor can claim now.

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

Review the work queue, first 20-minute sequence, work-lane map, issue-claim record,
sponsor brief, copyable AI prompt, and setup commands. Confirm that the guide directs
a developer to a small task without hiding the detailed rules. Confirm that work does
not start before its input is accepted. Confirm that the issue form requests a usable
handoff. Open the Archify diagrams and confirm that the CI discussion uses them.
The guide has not yet been used by a new contributor.

## Documentation and learning

- [x] I updated the relevant README, `AGENTS.md`, decision record, or runbook

The new guide asks a contributor to explain a concrete result, choice, evidence, and
failure case before team review.
