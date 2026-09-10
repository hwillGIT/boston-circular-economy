<!--
The required submission record is .github/submission.md. Replace that file with this
template's completed content and commit it with every change. You may mirror the same
record here for reviewer convenience. CI does not validate this pull request body.
-->

## Outcome

After this change, <!-- actor or system --> can <!-- observable result --> under <!-- important conditions -->.

Closes #<!-- issue number -->

<!-- Use "Issue exception:" with a specific reason only when no issue exists. -->

## Evidence and limits

- Evidence: <!-- Tests, code, observations, measurements, or accepted decisions. -->
- Why this evidence supports the result: <!-- Explain what the evidence establishes and why it supports the result. -->
- Conditions and limits: <!-- State when the result applies and what the checks do not establish. -->
- What could change the decision: <!-- Strongest counterexample, remaining uncertainty, or evidence that would change the decision. -->

## Decision explanation

- Why this design: <!-- Explain how this choice produces the result. -->
- Closest alternative: <!-- Compare a viable alternative fairly. State when it would be the better choice. -->
- Trade-off accepted: <!-- State the cost or limitation that remains. -->
- Revisit when: <!-- Name the evidence or condition that should reopen this decision. -->

## Code quality

- Trace one example: <!-- Name the entry point, decision owner, and observable result. -->
- Where to make a likely change: <!-- Name the function, component, or specification that controls the behavior. -->
- Who owns the rule and state: <!-- Identify the part responsible for the rule, stored data, and external actions. -->
- Failure and recovery: <!-- State the failure signal, containment, retry, rollback, or operator action. -->
- What became simpler or harder: <!-- Name new branches, dependencies, state, or duplication. State what became simpler. -->

## Risk and scope

- Review level: Green / Yellow / Red
- In scope:
- Out of scope:
- Rules that must remain true:

## What changed

-

## Challenge cases

Describe how you tried to prove the change wrong. Include normal, boundary, failure, and regression cases that apply.

-

## Evidence

| Check                               | Result                                        | Evidence or reason not run                   |
| ----------------------------------- | --------------------------------------------- | -------------------------------------------- |
| Client lint and build               | <!-- Pass, Fail, Not run, or Not affected --> | <!-- Command, result, or specific reason --> |
| Server lint and build               | <!-- Pass, Fail, Not run, or Not affected --> | <!-- Command, result, or specific reason --> |
| ETL tests                           | <!-- Pass, Fail, Not run, or Not affected --> | <!-- Command, result, or specific reason --> |
| Technical prose and editorial style | <!-- Pass, Fail, Not run, or Not affected --> | <!-- Command, result, or specific reason --> |
| Manual user journey                 | <!-- Pass, Fail, Not run, or Not affected --> | <!-- Command, result, or specific reason --> |
| Accessibility / responsive          | <!-- Pass, Fail, Not run, or Not affected --> | <!-- Command, result, or specific reason --> |
| Security / privacy / recovery       | <!-- Pass, Fail, Not run, or Not affected --> | <!-- Command, result, or specific reason --> |

For UI changes, add before-and-after screenshots or a recording.

## AI assistance

- [ ] No substantial AI assistance
- [ ] AI assisted with exploration or planning
- [ ] AI assisted with implementation or tests
- [ ] AI assisted with review or challenge

This record does not establish contributor understanding. Human review must check the explanation against the submitted work.

## Review focus and uncertainty

What should the human reviewer examine most closely? Which choice needs human judgment?
What is not yet proven?

-

## Documentation and learning

- [ ] No documentation change is needed
- [ ] I updated the relevant README, `AGENTS.md`, decision record, or runbook
- [ ] I recorded a follow-up issue for remaining work

Follow the
[`Code Change Standard`](https://github.com/hwillGIT/boston-circular-economy/blob/main/docs/CODE_CHANGE_STANDARD.md)
for the submission and explanation rules.
