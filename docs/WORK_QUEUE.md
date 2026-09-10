# Developer Work Queue

Use this page to select work and to lead the twenty-minute sponsor review.
The linked GitHub issue or pull request is the source of truth for ownership,
comments, revisions, and review. Update this page during triage or after a team
decision. This snapshot was checked on September 10, 2026.

## How the queue works

| State     | Meaning                                                     | Contributor action                        | Team action                                   |
| --------- | ----------------------------------------------------------- | ----------------------------------------- | --------------------------------------------- |
| Now       | The work has a known input and can begin.                   | Check the issue, then claim it.           | Confirm a mentor and review roles.            |
| Next      | The work needs an accepted artifact or decision.            | Read the named input. Do not begin yet.   | Accept the input or state what is missing.    |
| Future    | The pilot must provide evidence before this work is shaped. | Do not claim it.                          | Create a bounded unit after the pilot review. |
| Completed | A team accepted the exact artifact revision.                | Use the record as an input when relevant. | Keep the decision and evidence available.     |

The state groups mirror the public [Cursor Boston active-work map](https://github.com/hwillGIT/cursor-boston/blob/develop/.github/ACTIVE_ISSUES.md).
Circular Economy keeps its current protected `main` route during this pilot.

## Now — active review and ready work

| Work                                                                                                  | State                   | Next action                                                                                 |
| ----------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------- |
| [UI-001 research](https://github.com/hwillGIT/boston-circular-economy/issues/3)                       | Ready for a contributor | Check the current claim. Post the claim record. Produce an evidence note within 60 minutes. |
| [PR #14: CI, diagrams, and API template](https://github.com/hwillGIT/boston-circular-economy/pull/14) | Team review             | Two people check the submitted revision and record separate observations.                   |
| [PR #15: developer start path](https://github.com/hwillGIT/boston-circular-economy/pull/15)           | Team review             | Two people check the submitted revision and record separate observations.                   |

UI-001 has no assigned contributor or mentor. The team names both before work starts.
Use the [claim record](GET_STARTED.md#claim-the-assignment) after checking the issue.
Open the [Archify diagrams proposed in PR #14](https://github.com/hwillGIT/boston-circular-economy/pull/14)
when the team reviews the CI and delivery route.

## Next — waiting for an accepted input

| Work                                                                                         | Required input                       | Decision owner          |
| -------------------------------------------------------------------------------------------- | ------------------------------------ | ----------------------- |
| [UI-002 screen specification](https://github.com/hwillGIT/boston-circular-economy/issues/4)  | Accepted UI-001 evidence note        | Product or design owner |
| [UI-003 wireframes](https://github.com/hwillGIT/boston-circular-economy/issues/5)            | Accepted UI-002 screen specification | Product or design owner |
| [UI-004 visual design](https://github.com/hwillGIT/boston-circular-economy/issues/6)         | Selected UI-003 wireframe            | Product or design owner |
| [UI-005 backend-call proposal](https://github.com/hwillGIT/boston-circular-economy/issues/7) | Accepted UI-002 screen specification | Backend lead            |

UI-003 and UI-005 can begin after UI-002 is accepted. UI-004 begins after the team
selects a wireframe.

## Decisions for the team

| Decision                                                                                          | Why it matters                                                 | Current action                           |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------- |
| [Release path, data, and recovery](https://github.com/hwillGIT/boston-circular-economy/issues/16) | It defines how a hosted release is verified and recovered.     | Decide before publishing a service.      |
| [Hosted AI review service](https://github.com/hwillGIT/boston-circular-economy/issues/17)         | It defines service access, responsible review, and evaluation. | Decide before enabling hosted AI review. |

These decisions do not block the UI-001 research pilot.

## Future — shape work after the pilot

Create the next unit only after the UI-001 review identifies an observed need.
Give it one user result, a known input, a timebox, an owner for the next decision,
and an expected review record. Use the [ready work-unit form](../.github/ISSUE_TEMPLATE/work-unit.yml)
when a new unit needs triage.

## Completed

No pilot unit has an accepted artifact revision yet. Move work here only after the
team records a decision for the exact revision.

## Delivery route

Use one pull request for each pilot unit. It keeps the assignment, evidence, and two
team approvals tied to one revision. The protected `main` rule remains the current
integration route.

A dedicated submission branch can serve a recurring cohort, event, or time-bounded
batch of related work. Before the team creates one, record its owner, purpose, end
date, base branch, review rule, and integration plan. The route reduces repeated
routing decisions. It also needs branch updates and a final integration review.

The current pilot has one ready unit. The team reviews this route after the pilot.
