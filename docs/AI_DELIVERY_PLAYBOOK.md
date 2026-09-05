# Use AI to Complete Small Work Units

The developer owns the work and its explanation.
AI helps with research, alternatives, drafts, checks, and practice.
A human reviewer decides whether the result and explanation meet the assignment.

Use this workflow in `hwillGIT/boston-circular-economy`.
Upstream issues and Slack discussions provide context.
Create new work in the fork unless the user directs otherwise.

## Begin with the frontend assignments

The [work-unit index](work-units/README.md) contains five small assignments.
Each has a time limit, accepted inputs, deliverables, and copyable prompts.

| Unit   | Result                                           | Dependency                        |
| ------ | ------------------------------------------------ | --------------------------------- |
| UI-001 | Research evidence for the repair-clinic flow     | The agreed MVP and inspected fork |
| UI-002 | Screen behavior and state specification          | Accepted UI-001                   |
| UI-003 | Two wireframe options and a reasoned selection   | Accepted UI-002                   |
| UI-004 | Visual design based on Fleet                     | Selected UI-003                   |
| UI-005 | Current API mapping and a proposed call contract | Accepted UI-002                   |

Confirm contributor and mentor availability before assigning a person.
The published issues are currently unassigned.
A later unit starts when its required input has been accepted.

## Shape one unit

State one user outcome.
Name the files, decisions, or evidence that the contributor must inspect.
Limit the deliverable to work that fits the time box.
State what would make the result unacceptable.

For this pilot, the design uses two synthetic clinics and a mobile viewport.
A machine-availability filter provides a concrete example: two clinics become one matching result.
The specification must also explain unknown availability.

Do not assume that the current backend supplies every field required by the design.
The fork already has location list, nearby, and detail routes.
The API assignment must map supported fields and identify gaps.
Mark a new contract as proposed until its owner accepts it.

## Start an AI session

Use the opening brief in the [developer AI guide](work-units/DEVELOPER_AI_GUIDE.md).
Provide the assignment, accepted inputs, relevant files, and inspected revision.
Keep unrelated repository history out of the prompt.

Ask AI to help produce a reviewable result.
Then use the unit's prompts.
Reserve the last 15 minutes for explanation and questions.
Use additional practice prompts only when they address a gap.

The prompts use these practical checks:

- Predict a concrete result before reading the explanation.
- Trace the input through the part that owns the decision.
- Compare two viable choices using the same criteria.
- Change one condition and test the prediction.
- Explain the result to a newcomer in the contributor's own words.

AI must wait for the contributor's answer.
It can correct an unsupported statement and offer a small hint.
It must not write the contributor's defense or claim that the contributor understands the work.

## Use a role for a bounded purpose

| AI role                  | Useful output                                        | Human decision                                    |
| ------------------------ | ---------------------------------------------------- | ------------------------------------------------- |
| Research assistant       | Sources, observations, gaps, and assumptions         | Which evidence is sufficient for the unit         |
| Design assistant         | Screen states, options, and tradeoffs                | Which design meets the resident's need            |
| API assistant            | Current calls, field mapping, and proposed contracts | Which contract the backend owner accepts          |
| Implementation assistant | A scoped change and behavior checks                  | Whether the change belongs in the agreed scope    |
| Review assistant         | Evidence-backed findings and questions               | Whether the result and explanation are acceptable |

The [routing policy](../.agents/skills/route-agent-work/references/delivery-routing.json) records suggested work and model routes.
Treat a model recommendation as a starting point.
Check tool availability and the user's preferences before selecting a model.
Do not create parallel agent work unless the user or applicable instructions authorize it.

Mechanical checks belong to deterministic tools.
Use an existing repository skill for a repeated method.
Use a larger investigation only when the uncertainty or interaction between parts requires it.

## Keep the code understandable

Follow the [code change standard](CODE_CHANGE_STANDARD.md).
Names, types, ownership, and failure behavior must explain the purpose.
Comments should explain a reason that those structures cannot show.

A generated prototype still needs a clear trace.
For example, identify which component owns a filter and which function owns a network request.
Do not describe proposed behavior as implemented.
Do not use a fluent summary as evidence that the code is clear.

## Check and submit

Use [CI checks](CI_CHECKS.md) for setup and application checks.
The local routing tools select relevant application checks.
CI must retain the fork's CSS, formatting, build, Python, test, and documentation checks.

Complete the versioned `.github/submission.md` record.
Link the work unit and the artifacts.
Record actual check results and the exact evidence used.
Open a draft PR while review questions remain.

The submission checker validates record structure.
The prose checker catches selected wording and format problems.
Neither tool can determine whether a decision is correct or a person understands it.

## Review and accept

Review the user outcome and evidence before wording preferences.
Keep findings tied to a location and an observable consequence.
Compare the implementation with the accepted scope and contract.
Do not request unrelated cleanup or tests that repeat the implementation.

Ask the contributor to explain the result without reading an AI-written speech.
Let them use the code, design, specification, and tests as references.
Ask one unfamiliar changed case.
Record the answer and any remaining gap.

Use the manifest's completion fields only after the review occurs.
Leave acceptance fields empty while the work is pending.
If a gap remains, name one specific revision or learning task.

Human approval remains required for merging.
AI review supports that decision and does not replace it.

## Activate the workflow

Follow the [activation record](DELIVERY_ACTIVATION.md).
It distinguishes tested files from active repository settings and deployments.
Do not describe draft-PR CI as proof that deployment or team adoption is complete.

The fork's current setup points to Replit.
The earlier pilot targets GitHub Pages.
The deployment destination still needs the user's selection.

Do not send Slack announcements or messages to people without explicit authorization.
Coordination instructions can be prepared without sending them.

## Evaluate the pilot

Start with one accepted unit and an available mentor.
Observe whether the contributor can finish within the time box and explain the result.
Record the review time, unclear instructions, repeated mistakes, and useful AI suggestions.

Use those observations to adjust the next assignment.
Do not rank contributors by AI usage, generated code volume, or an automated understanding score.
