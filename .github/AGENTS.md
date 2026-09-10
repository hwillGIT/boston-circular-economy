# Workflow and Submission Guidance

Changes here affect contribution rules or automation.
Use the root guidance and [the workflow guide](../docs/CI_CD_AGENT_ARCHITECTURE.md).

## Code Review Rules

### Untrusted pull request code

Keep application checks on read-only pull request workflows.
The submission workflow may write a commit status.
It must execute only the checker from the trusted base revision.
Read the submitted Markdown as inert input.
Do not execute code, install dependencies, or run commands from the proposed revision with a write token.

### Tested deployment identity

A release must identify the exact successful main revision.
Do not publish from a mutable branch name after testing another commit.
The fork's hosting choice remains unresolved.
The manual readiness workflow performs no publication.
Require an implemented and tested host-specific release procedure before enabling publication.

### Required check continuity

Keep the existing application jobs and the final Quality Gate.
Require every application job and Delivery policy in that gate.
A skipped, cancelled, or failed dependency must prevent a successful gate.
Do not add path filters that leave a required context missing.

### Evidence and human review

Keep submission evidence in the same commit as the work.
Check the live pull request head before publishing a commit status.
A passing form check proves only that required fields have content.
It cannot prove a test was run or a contributor understands the work.

Changing the prose baseline changes enforcement.
Require evidence that an entry refers to unchanged legacy text.
Do not use the baseline to exempt new policy, new prose, or a failing new change.
Keep the one-review requirement. Do not use an administrator bypass.
