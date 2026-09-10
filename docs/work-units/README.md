# Frontend AI Assignments

These assignments prepare UI specifications, research, wireframes, visual design, and
backend-call proposals. Track the work in
[hwillGIT/boston-circular-economy](https://github.com/hwillGIT/boston-circular-economy/issues).
The assignment scope covers research and design artifacts.

Hubert owns frontend work selection, engineering acceptance, and the proposed backend
calls. Product and design retain their decisions. The backend lead confirms the shared
API contract before either side implements it.

## First slice

Use the [textile MVP](https://docs.google.com/document/d/1eI7OL8zppM01br13fuhXvWKAKnKWhRBOJ45NMYenpHU/edit),
specifically M2.1 and M2.2: clinic results and filters. It specifies two prototype
clinics, a 390-pixel mobile viewport, and Boston Fleet patterns.

This gives volunteers a common, bounded example. A prototype can test comprehension
and interaction without waiting for live clinic data. It cannot prove that a service
or backend capability exists.

| Assignment                                                                                                         | Timebox    | Deliverable                                    | Start condition                                       |
| ------------------------------------------------------------------------------------------------------------------ | ---------- | ---------------------------------------------- | ----------------------------------------------------- |
| [UI-001: Research](https://github.com/hwillGIT/boston-circular-economy/issues/3) / [manifest](ui-001.json)         | 60 minutes | Evidence note and pattern references           | Available for research after checking existing claims |
| [UI-002: UI specification](https://github.com/hwillGIT/boston-circular-economy/issues/4) / [manifest](ui-002.json) | 90 minutes | Screen manifest and state/action table         | Reviewed UI-001                                       |
| [UI-003: Wireframes](https://github.com/hwillGIT/boston-circular-economy/issues/5) / [manifest](ui-003.json)       | 90 minutes | Two editable alternatives and a selected flow  | Accepted UI-002                                       |
| [UI-004: Visual design](https://github.com/hwillGIT/boston-circular-economy/issues/6) / [manifest](ui-004.json)    | 90 minutes | One polished mobile screen and visual manifest | Selected UI-003                                       |
| [UI-005: Backend call](https://github.com/hwillGIT/boston-circular-economy/issues/7) / [manifest](ui-005.json)     | 90 minutes | Call manifest and three JSON examples          | Accepted UI-002                                       |

UI-003 and UI-005 can proceed independently after the screen specification is accepted.
UI-004 follows the selected wireframe. Each timebox covers one focused session,
excluding the wait for human review. Stop with a decision request when the work does
not fit.

## What the manifest means

Each JSON file is an assignment packet. It names the outcome, inputs, constraints,
AI prompts, deliverables, checks, reviewer, and handoff. The
[schema](manifest.schema.json) validates that structure. Schema validity does not
prove that a design is correct or complete.

The [screen template](screen-manifest.template.yaml) describes the resulting UI
contract: components, visible states, actions, data needs, and acceptance cases.
It is a draft template. Empty fields require decisions before implementation.

Keep product research and design originals in the project Drive or approved Figma
file. Keep assignment manifests and engineering decisions in GitHub. Record artifact
links and accepted revisions in the issue and completion record.

## Contributor instructions

1. Claim one issue and name your next check-in.
2. Read its manifest, source links, and prerequisite decisions.
   Use the opening brief in the [developer guide](DEVELOPER_AI_GUIDE.md).
3. Run the first AI prompt and check the sources yourself.
4. Compare the suggestions before asking the AI to generate an artifact.
5. Use the challenge prompt to find missing evidence or ambiguous behavior.
6. Inspect the deliverables and demonstrate them to the named reviewer.
7. Record one AI suggestion you changed or rejected and why.
8. Explain the result in your own words and answer one changed-case question.

Reserve the last 15 minutes for the explanation. Include a short note or recording
with the artifact. Trace the behavior, explain the decision, and cite its evidence.
If the artifact contains code, locate the controlling rule and the place to make a
likely change. The reviewer records what the contributor could explain.

An agent's output is a proposal until a person checks it. Do not fabricate user
research, service availability, approved design choices, or measurements.
If a source or tool is unavailable, report the exact gap and preserve completed work.

## Definition of done

Every assignment needs the named artifacts, checked acceptance criteria, contributor
explanation, and human decision. Record the artifact revision that received review.
A screenshot alone cannot establish keyboard behavior or accessibility.
An AI summary cannot establish contributor understanding. The accepted completion
record requires the contributor's explanation and the reviewer's observation.

Return one of these decisions:

- Accept the artifact and name the next unit.
- Request a specific revision supported by evidence.
- Stop and record the product, design, or backend decision that is missing.

Implementation work uses accepted designs and any relevant call contract. Hubert then
creates a small issue with the approved references, component boundaries, mock data,
and tests. Lint and build results cannot establish UI interaction,
contract, or accessibility behavior. Those checks need explicit implementation tasks
and evidence.

## Source boundaries

- The August 25 textile MVP defines this prototype slice.
- [Fleet](https://patterns.boston.gov/) supplies Boston's component guidance.
- [Team norms](https://docs.google.com/document/d/1v_cuc_hEcx9GzcsoE8GJv83o_qlVc3QX-LhdtlUGqHA/edit) govern scoped work and durable records.
- [#38](https://github.com/codeforboston/boston-circular-economy/issues/38) contains client MVP work.
- [#46](https://github.com/codeforboston/boston-circular-economy/issues/46) and [#53](https://github.com/codeforboston/boston-circular-economy/issues/53) anchor the API handoff.

The fork's [application](../../server/src/index.ts) mounts `/api/v1/locations`.
Its [location routes](../../server/src/routes/locations.ts) implement list, nearby, and
detail reads. UI-005 must compare these capabilities with the requested clinic fields.
Code presence alone does not prove deployed behavior or available clinic data.

Upstream issue links provide product and API context. Create assignment issues,
engineering decisions, and implementation follow-ups in this fork.
