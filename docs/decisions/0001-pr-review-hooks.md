# Decision: Keep Automated Checks and Team Review Separate

- Status: Proposed for the fork pilot
- Owner: Fork maintainer
- Related issue: [#11](https://github.com/hwillGIT/boston-circular-economy/issues/11)

## Result

Automated checks verify code rules, tests, wording, and submission structure.
An AI review can identify supported defects.
The review team decides whether to accept the work and the contributor's explanation.

## Evidence and reason

The fork has a React client, an Express server, and a Python ETL.
[The CI repair](https://github.com/hwillGIT/boston-circular-economy/pull/10)
passed all eight hosted jobs at revision `4a25a6f`.
Those checks do not assess a contributor's understanding.

The submission record travels with the code in a commit.
This lets the review team inspect the evidence and implementation together.
The trusted-base checker reads the record as data before publishing its status.

## Alternatives

A mutable pull request description is easier to edit.
It can diverge from the commit whose status a merge rule evaluates.
Keep it as the readable copy of the committed record.

A fully automated acceptance decision would reduce review effort.
It would not observe whether a contributor can explain an unfamiliar changed case.
Use a short demonstration with the review team for that question.

## Conditions and limits

A filled field can contain incorrect evidence.
A prose checker cannot establish correctness or formal language-standard compliance.
Team review must check the evidence and explanation.
Hosted AI review availability and hosting remain activation decisions.

## Next action

Review the fork integration, merge accepted work, and run the activation checks.
Record one contributor's independent explanation and the review team's observation.
Do not mark an assignment accepted before that evidence exists.
