# Explain and Check a Code Change

A reviewer must be able to follow the behavior, assess the choice, and identify what remains uncertain.
A passing test or a polished AI summary does not establish contributor understanding.

## Start with the outcome

Name the person or system that benefits.
State the observable result and the conditions under which it applies.
Keep proposed behavior separate from behavior implemented in the inspected revision.

Use the assignment manifest to limit the work.
A manifest names the inputs, scope, deliverables, dependencies, and acceptance criteria.
Research and design assignments can finish with evidence and specifications.
They do not require production code.

## Make the code explain its purpose

Use names that express the domain purpose.
Keep each rule and state change under one clear owner.
Use types and validation to show allowed inputs and missing values.
Keep calculations separate from network, storage, and screen updates.
Make failure signals and recovery visible.

Add a boundary when it simplifies ownership or a likely change.
A boundary is the set of inputs and outputs through which one part uses another.
Use comments for a hidden reason, constraint, or recovery rule.
Do not add comments that restate the code.

Trace one example from its input to the visible result.
Find the part that owns the decision.
Then identify where a likely behavior change belongs.

For example, the fork's location filter handlers also clear the previous map area.
The handlers call `resetSearchArea` in `useExploreLocations.ts`.
This keeps the related updates in the action that causes them.
A browser check must still confirm the displayed results.

## Explain the decision

Give the result first.
Then provide the evidence, the reason it supports the choice, and its limits.
Compare the closest viable alternative against the same criteria.
Name its strongest advantage.
State which new evidence would change the recommendation.

Keep a routine decision note within 150 words.
Use a longer record when the issue requires several linked decisions.
Do not hide uncertainty behind numerical scores or confident wording.

## Write for a project newcomer

Use short, active sentences.
Keep one instruction in each sentence.
Use one term for each concept.
Define unfamiliar terms when they first matter.
Keep instructions within 20 words and descriptions within 25 words per sentence.
Preserve exact code names, paths, units, and error meanings.

Do not name reasoning frameworks or describe the writing method in contributor output.
The explanation must make sense without that terminology.

## Check the behavior

Run checks that address the changed behavior.
Use [CI checks](CI_CHECKS.md) for the application's commands and their limits.
Record what ran, what happened, and the reason for any omitted check.

Use a normal example and a relevant changed condition.
Consider empty results, missing values, invalid inputs, or dependency failures.
Check the external behavior rather than repeating private implementation steps.
Keep fixtures small enough for a reviewer to understand.

## Keep the review record with the work

Complete `.github/submission.md` using the PR template's fields.
Commit the record with the change.
The submission workflow reads that record from the exact head commit as data.
Editing the PR description does not change its result.

The record must differ from the base revision.
This prevents an inherited record from satisfying a new change.
A complete record establishes only that the required information is present.
It does not establish accuracy, understanding, or human approval.

Use the fields to explain the outcome, evidence, decision, code, scope, checks, and remaining questions.
If AI prepared the record, identify its assistance.
Do not invent a completed teaching conversation or a human review.

## Choose the review attention

| Level  | Examples                                                           | Review focus                                                |
| ------ | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| Green  | Scoped research, wording, or an isolated visual detail             | Outcome, source accuracy, and the demonstrated result       |
| Yellow | Component behavior or an API proposal                              | Inputs, state ownership, alternatives, and failure behavior |
| Red    | Authentication, private data, deployment, or privileged automation | The affected trust rules, recovery, and specialist judgment |

These levels select review attention.
They do not require another permission request for local work that the user already authorized.
A missing product or API decision still needs its accountable owner.

## Confirm understanding with a person

Use the prompts in the [developer AI guide](work-units/DEVELOPER_AI_GUIDE.md).
Ask one question at a time and wait for the contributor's answer.
Keep the same artifact revision open during the discussion.

The contributor must explain one example, defend the choice, and identify where a likely change belongs.
The reviewer then selects one changed case that the contributor has not rehearsed.
The contributor predicts the result and checks the controlling rule.

Accept the assignment only when the reviewer can support that assessment.
Record the artifact, revision, reviewer, observation, and remaining question in the manifest.
An AI can identify gaps and provide hints. It cannot certify that the contributor understands the work.
