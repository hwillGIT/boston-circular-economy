# Sponsor Brief: Developer Delegation With AI Support

Use this brief to present the proposed developer workflow in ten minutes.
Use the review agenda to reach a team decision in twenty minutes.

## Chapter 1: Result and decision — 1 minute

The pilot gives each contributor one small assignment with a known result, timebox,
source material, AI prompts, and review path. Contributors use AI to explore and
check their work. They remain responsible for the artifact and its explanation.

Approve a pilot of [UI-001](work-units/ui-001.json) with one contributor, one mentor,
and two review-team members. The pilot ends with an accepted research artifact, a
specific revision request, or a recorded missing decision.

Do not begin UI-002 until the review team accepts the UI-001 input. This limit keeps
the next developer from building on an unreviewed assumption.

## Chapter 2: Work is divided by handoff — 2 minutes

Each assignment produces an input for the next assignment. A contributor owns one
assignment at a time. A start condition is an accepted decision or artifact that
supplies the required input.

| Lane               | Unit   | Timebox    | Deliverable                                 | Starts after                |
| ------------------ | ------ | ---------- | ------------------------------------------- | --------------------------- |
| Research           | UI-001 | 60 minutes | Evidence note and source list               | Existing claims are checked |
| UI specification   | UI-002 | 90 minutes | Screen, state, and action table             | UI-001 is accepted          |
| Interaction design | UI-003 | 90 minutes | Two editable wireframes and a selected flow | UI-002 is accepted          |
| Visual design      | UI-004 | 90 minutes | One polished mobile screen                  | UI-003 is selected          |
| Backend handoff    | UI-005 | 90 minutes | API-call manifest and three JSON examples   | UI-002 is accepted          |

UI-003 and UI-005 can proceed at the same time after UI-002. UI-004 follows the
selected wireframe. The sequence prevents product research, UI design, and API
assumptions from becoming one unclear assignment.

## Chapter 3: A developer claims and completes work — 2 minutes

The developer checks the issue, its source links, the current assignee, and recent
comments. If the task is available, the developer claims it in the issue and gives a
next check-in. The claim states the intended artifact and the accepted input revision.

The developer then follows this session sequence:

1. Read the manifest and identify the user result.
2. Ask the AI for a short plan and check every cited source.
3. Compare alternatives before producing the artifact.
4. Test one changed or missing-data case.
5. Explain the artifact, decision, evidence, and limit in the developer's own words.
6. Record the artifact revision and next decision in the issue.

If another contributor already has a current claim, choose another ready task. If an
input is missing, record the smallest decision needed. Do not fill the gap with a
guess or duplicate the other contributor's work.

## Chapter 4: AI and CI protect the work — 2 minutes

An AI agent can suggest options, challenge unsupported claims, and help a contributor
practice an explanation. It cannot accept a design, approve a shared API call, or
certify a contributor's understanding.

Continuous integration, or CI, runs automated checks for a pull request. The proposed
CI workflow checks formatting, builds, tests, work-unit structure, prose, and the
submission record. Checked Archify diagrams show the delivery and review flow.

The CI checks establish that the submitted revision meets defined technical rules.
They do not establish that a UI choice is useful or that an explanation is accurate.
Two review-team members check those questions against the exact submitted revision.

## Chapter 5: People make the decisions — 2 minutes

The contributor owns the artifact and explanation. The mentor runs a short opening
checkpoint and helps expose an unanswered decision. The product or design owner checks
user intent and visual choices. The frontend work lead selects the next UI unit. The
backend lead confirms any shared API call.

One review-team member checks the user result, evidence, and artifact. Another checks
a changed case, failure behavior, and the code or contract boundary. Each records an
observation from the same revision. A second pass by the same person does not satisfy
the team review requirement.

## Chapter 6: Pilot boundaries and open decisions — 1 minute

The first pilot uses synthetic clinic data. It does not publish a service, collect
personal data, change a live API, or choose a hosted AI service.

[PR #14](https://github.com/hwillGIT/boston-circular-economy/pull/14) proposes the
Archify diagrams, CI checks, team record, and API-call manifest. [PR #15](https://github.com/hwillGIT/boston-circular-economy/pull/15)
proposes the developer start path and task map. Both need the configured two-person
team review before `main` changes.

[Issue #16](https://github.com/hwillGIT/boston-circular-economy/issues/16) holds the
release-host, data, and recovery decision. [Issue #17](https://github.com/hwillGIT/boston-circular-economy/issues/17)
holds the hosted AI review-service decision. Those decisions do not block the UI-001
research pilot.

## Twenty-minute team review

| Time          | Topic             | Decision or evidence                                                      |
| ------------- | ----------------- | ------------------------------------------------------------------------- |
| 0–2 minutes   | Outcome           | Confirm that the pilot should produce a research artifact before code.    |
| 2–6 minutes   | Work map          | Confirm the UI-001 to UI-005 handoffs and the one-assignment rule.        |
| 6–10 minutes  | Developer session | Check the claim, source, AI, changed-case, and explanation steps.         |
| 10–14 minutes | CI and diagrams   | Check what automation proves and what still needs human review.           |
| 14–17 minutes | Roles             | Name the mentor and two distinct review-team roles.                       |
| 17–20 minutes | Pilot decision    | Accept the pilot, request a bounded change, or record a missing decision. |

## Record the team decision

Copy this record into the pilot issue or pull request:

```text
Pilot unit and exact revision:
Contributor:
Mentor:
Outcome and evidence reviewer:
Changed-case and boundary reviewer:
Accepted input and source evidence:
Changed case selected by the team:
Pilot decision: accept, revise, or stop:
Next unit or unresolved decision:
```

The pilot is complete only when the review team records a decision for the exact
artifact revision. A passing check, a completed form, or an AI summary does not make
the decision.

## Material to open during the discussion

- [UI-001 issue](https://github.com/hwillGIT/boston-circular-economy/issues/3)
- [Assignment catalog](work-units/README.md)
- [Developer AI guide](work-units/DEVELOPER_AI_GUIDE.md)
- [Mentor pilot guide](MENTOR_PILOT.md)
- [CI and review workflow](CI_CD_AGENT_ARCHITECTURE.md)
- [Activation tracker](https://github.com/hwillGIT/boston-circular-economy/issues/11)
