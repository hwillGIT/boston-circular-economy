# Your First Frontend Assignment

Use this guide when you are new to the Circular Economy project.
You can begin with research or design. You do not need to write production code first.

Your goal is simple: finish one small artifact and explain one decision to the review team.

## Which path fits you?

| If you want to...                   | Read this                                              | Time to start |
| ----------------------------------- | ------------------------------------------------------ | ------------- |
| Choose a small UI task              | [Frontend AI assignments](work-units/README.md)        | 5 minutes     |
| Finish a guided first task          | Continue below                                         | 20 minutes    |
| Use AI to plan and explain work     | [Developer AI guide](work-units/DEVELOPER_AI_GUIDE.md) | 10 minutes    |
| Change code and open a pull request | [Contributing](../CONTRIBUTING.md)                     | 10 minutes    |
| Understand checks and their limits  | [CI checks](CI_CHECKS.md)                              | Reference     |

## How the work is divided

Each contributor owns one assignment at a time. The sequence divides work by the
artifact that the next person needs. A start condition is an accepted decision or
artifact that supplies the required input.

| Work lane          | Assignment | What the contributor completes              | Start condition           |
| ------------------ | ---------- | ------------------------------------------- | ------------------------- |
| Research           | UI-001     | Evidence note and source list               | Check the existing claims |
| UI specification   | UI-002     | Screen, state, and action table             | Accepted UI-001           |
| Interaction design | UI-003     | Two editable wireframes and a selected flow | Accepted UI-002           |
| Visual design      | UI-004     | One polished mobile screen                  | Selected UI-003           |
| Backend handoff    | UI-005     | API-call manifest and three JSON examples   | Accepted UI-002           |

UI-003 and UI-005 can proceed at the same time after UI-002. UI-004 follows the
selected wireframe. UI-001 is the first available assignment. The other assignments
wait for their named input. Do not start a waiting assignment to fill a gap with
assumptions.

The contributor owns the artifact and its explanation. The product or design owner
checks user intent and visual choices. The frontend work lead selects the next UI
unit. The backend lead confirms a shared API call. The review team checks evidence
and a changed case before it accepts an assignment.

An assignment manifest is a small file that names the outcome, inputs, timebox, and
deliverable. It tells you what to do without guessing.

## Your first 20 minutes

1. Open the [assignment catalog](work-units/README.md).
2. Start with UI-001 when it is available.
3. Check the issue assignee and its recent comments.
4. Claim an available assignment and state your next check-in.
5. Open its manifest and every source link it names.
6. Stop and record a question when a required decision is missing.

Do not fill gaps with guesses. A small, honest question is useful work.

## Claim the assignment

Read the issue before you make an artifact. A current claim names a contributor, an
accepted input revision, an intended artifact, and a next check-in. If another person
has a current claim, choose another ready assignment or ask for a decision.

Use this comment when you claim work:

```text
I am claiming [assignment].
I checked [accepted input or source].
I plan to deliver [artifact] within [timebox].
My next check-in is [date and time].
My current question or risk is [question or none].
```

When the timebox ends, link the artifact and state the next decision. Keep the record
in the issue so a mentor and the next contributor can resume the work.

## Start an AI session

Replace `[assignment]` and `[manifest]` before you send this prompt:

```text
I am starting [assignment]. Read [manifest].

Answer in short sentences.
1. What person gets what result?
2. What sources or files must I inspect?
3. What can I finish in this session?
4. What must I ask the project instead of guessing?

Do not create an artifact yet.
```

Check every source yourself. Use the AI response as a plan, not as evidence.

## Make the artifact

Follow the deliverable named in the manifest.
Keep the work inside the timebox.
For a research or design task, record source links and missing evidence.
For a code task, make the purpose clear through names, types, and visible failure behavior.

Use the [developer AI guide](work-units/DEVELOPER_AI_GUIDE.md) when you need a prompt to
compare choices, test a changed condition, or practice an explanation.

## Prepare the team review

Before you ask for review, prepare these five answers in your own words:

1. Who benefits, and what can they now do?
2. What happens in one concrete example?
3. Why did you choose this approach over the closest alternative?
4. What evidence supports the choice, and what does it not prove?
5. What changes when a value is missing, invalid, or unavailable?

For code, trace one input to its visible result.
Name the file or component that owns the decision.
Name one likely place to make a future change.

The review team chooses one changed case that you have not rehearsed.
Use that question to check your understanding and improve the work.

## Submit the work

Follow [Contributing](../CONTRIBUTING.md) for branch, setup, and pull request steps.
Complete `.github/submission.md` with evidence from the current revision.
Copy the same record into the pull request description.

The required checks must pass.
The review team then supplies two current approvals before `main` can change.

## When you are stuck

Write the smallest useful question in the assignment issue.
State the source you checked, the decision you need, and what work you completed.
Do not claim that an AI answer, a passing check, or a form proves that you understand the work.
