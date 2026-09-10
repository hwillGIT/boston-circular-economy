# Use AI to Understand and Explain Your Work

Use this guide with the assignment manifest. A manifest is the file that names the
scope, inputs, deliverables, and acceptance criteria.

Use the opening brief, then follow the assignment's prompts.
Use the other practice prompts when they address a gap.

Reserve the last 15 minutes of the assignment for explanation and questions.
Keep the code, design, or specification open during the discussion.
The contributor must supply the explanation. The AI can identify gaps and provide feedback.

## Terms used in the prompts

- **State:** Data that the screen or service remembers between actions.
- **Contract:** Agreed rules for inputs, results, and errors.
- **Decision owner:** The function or component responsible for one rule.
- **Boundary:** The inputs and outputs through which one part uses another.
- **Revision:** The exact version of the code, document, or design under review.

## Start each AI session with this brief

```text
Help me produce work that I can explain and maintain.
Read the assignment, its accepted inputs, and the relevant files.
Name the revision that you inspect.
Keep proposed behavior separate from behavior supported by the current files.
State the user outcome before the implementation details.

Use short, active sentences.
Use one term for each concept.
Define an unfamiliar term when it first matters.
Keep instructions within 20 words and descriptions within 25 words per sentence.
Keep one instruction in each sentence.
Preserve exact code names, paths, units, and error meanings.
Explain decisions in ordinary language.
Give the evidence, the reason it supports the choice, and the limits.
Compare the closest viable alternative fairly.
Change the recommendation when stronger evidence supports another choice.
Do not name reasoning frameworks or describe your writing method.
Do not invent test results, source facts, or my understanding.

Treat the following code guidance as part of any generated prototype or implementation.
Use names that state the domain purpose.
Keep each rule and state change under one clear owner.
Use types and validation to show allowed inputs and missing values.
Keep calculations separate from network, storage, and screen updates.
Make failure signals and recovery visible.
Add a boundary only when it simplifies ownership or a likely change.
Use comments for a hidden reason, constraint, or recovery rule.
Do not add comments that merely restate the code.
Use focused behavior checks for changed behavior.
Keep the work within the assignment scope.
```

A research note or design can explain a proposed behavior before code exists.
Mark that behavior as proposed. Do not invent files, function names, or passing tests.

## Trace one concrete example

```text
Choose one small example from this assignment.
Ask me to predict the result before you explain it.
Wait for my answer.

Then check my answer against the files or accepted design.
Trace the input through the place that owns the decision.
Show the resulting state, response, or screen change.
Cite the relevant file and line, or the exact design frame.
Show one failure or missing-data case.

Ask me to repeat the trace in my own words.
Correct one gap at a time.
If the trace requires guessing, identify the smallest clarification or code change.
Do not create production code for a research or design assignment.
```

For the clinic filter, the example starts with two synthetic clinics.
One clinic has a machine. The resident requests a machine and sees one clinic.
A proposed design must define how it treats unknown availability.

## Compare the two closest choices

```text
Help me compare two viable ways to meet this assignment.
Use the same criteria for both choices.
Include user clarity, maintenance effort, data needs, and failure behavior when relevant.
Use inspected evidence and state any assumption.
Do not invent numerical scores.

Recommend one choice under the stated conditions.
Explain why its benefits justify its costs.
Name the strongest reason to choose the alternative.
State the evidence that would change the recommendation.

Ask me to choose and explain the reason.
Wait for my answer before drafting the decision note.
Help me correct unsupported claims.
Do not make the explanation sound more certain than the evidence.
```

Keep the decision note within 150 words unless the issue requires more detail.
Include the result, reason, evidence, main cost, and condition for reconsidering the choice.
A sensible decision can change when its assumptions change.

## Predict a change and check it

```text
Change one condition in the example.
Choose a case that tests the rule, rather than a detail of the implementation.
Use a missing value, empty result, invalid input, or failed dependency when relevant.

Ask me to predict what the user will observe.
Wait for my answer.
Ask me to identify the code or specification that controls the result.
Compare my prediction with a focused test, inspection, or demonstration.
Record what actually happened and any limit of the check.
If the result differs, help me find the cause before proposing a fix.
```

For an API call, compare a successful empty response with a failed request.
For a wireframe, change a filter and follow the resulting screen state.
For visual design, increase the content length and inspect the layout.

## Explain the result to a project newcomer

```text
Ask me for a three-minute explanation of this work.
Ask one question at a time and wait for my answer.
Do not write a speech or answer the questions for me.

First, ask what the work lets a person do.
Next, ask me to trace one example from the input to the visible result.
Ask why I chose this design over its closest viable alternative.
Ask which evidence supports that choice.
Ask what can fail and how the user or caller finds out.
Ask where I would make one likely change.
Ask which claim remains unproven.

Check my answers against the same artifact revision.
Point out incorrect or unsupported statements.
Give me a small hint, then ask me to try again.
End with the gaps that still need a human decision or another check.
Do not certify that I understand the work.
```

Use the shared code, design, and tests as references. Memorizing syntax is not required.
The contributor must explain the relationship between the parts without reading an AI-written speech.

## Review code that should explain its purpose

Use this prompt when the assignment produces code. This includes code in a wireframe prototype.

```text
Inspect the changed code without relying on its generation transcript.
Trace one behavior from the entry point to the result.
Identify the owner of the decision, state, and external effects.
Check whether names, types, and boundaries expose the behavior.
Find the focused test or demonstration that checks it.

Report a clarity problem only when it makes the behavior or a likely change hard to follow.
Cite the smallest relevant location and explain its effect.
Prefer a better name, type, or boundary when that removes the confusion.
Use a comment only when a reason or constraint remains hidden.
Do not add unrelated cleanup, wrappers, or tests that copy the implementation.
Return no finding when the code supports a clear trace.
```

A summary from an AI does not prove that the code is clear.
The reviewer must be able to follow the code and challenge the contributor's explanation.

## Record the review

Add a short explanation to the issue or link a brief recording.
Use these fields:

```text
Artifact and revision:
User outcome:
Example from input to result:
Decision and closest alternative:
Evidence and its limits:
Failure and recovery:
Place to make a likely change:
One AI suggestion changed or rejected:
Remaining question:
```

The mentor selects one changed case that the contributor has not rehearsed.
Accept the assignment when the contributor can explain the result, support the choice,
and locate the controlling rule.
If a gap remains, name one specific revision or learning task.
Do not use an AI score or a polished summary as proof of understanding.

## Notes for mentors

Explaining the steps of a supplied example is an established teaching practice.
Carnegie Mellon describes examples with correct and incorrect steps in its
[active learning guidance](https://www.cmu.edu/teaching/online/designteach/strategies/activelearning.html).

Asking learners to recall an explanation and receive feedback supports learning.
Carnegie Mellon describes these practices in its
[teaching guidance](https://www.cmu.edu/teaching/resources/instructionalstrategies/activelearningstrategies/retrievalpractice/index.html).
The prompts above adapt these practices to a code review. Human review remains necessary.

Compare alternatives against stated criteria and record important uncertainty.
[NASA's engineering guidance](https://www.nasa.gov/reference/6-8-decision-analysis/)
describes this approach. Use a short comparison for these small assignments.

Use consistent words and define project terms.
The [official language guidance](https://www.asd-ste100.org/about.html)
explains why stable wording matters.
