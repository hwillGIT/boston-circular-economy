# Autonomous Assurance Routine Policy

Version: 0.1

## Purpose

This policy controls AI routines that inspect a project and propose maintenance work.

## Common routine protocol

Each routine MUST follow this sequence:

1. **Observe** — Inspect the real system and its signals.
2. **Detect** — Identify a candidate defect or risk.
3. **Gather evidence** — Collect logs, traces, tests, code, and artifacts.
4. **Model** — State expected behavior.
5. **Falsify** — Search for counterevidence.
6. **Verify** — Confirm the finding with independent evidence.
7. **Propose change** — Select the smallest safe correction.
8. **Pull request or no finding** — Submit evidence or record no actionable result.

## Human ownership

The routine MAY propose a change.

A human MUST approve and own the result.

The routine MUST NOT merge its own critical change unless a separate policy allows it.

## No-finding rule

A routine MUST be allowed to find nothing.

Do not measure routine value by pull request count.

Do not create cleanup work only to satisfy a daily schedule.

## Evidence rule

A routine MUST provide:

- observed behavior;
- reproduction steps;
- expected behavior;
- root cause or current hypothesis;
- falsification attempts;
- verification results;
- risk class;
- uncertainty.

## Change rule

The routine MUST propose the smallest safe change.

The routine MUST NOT combine unrelated cleanup with a defect fix.

The routine SHOULD add a regression test for a confirmed defect.

## Routine families

### Software

Examples:

- crash fuzzer;
- logic bug finder;
- flaky test investigator;
- duplication detector;
- architecture gardener.

### Experience

Examples:

- journey fuzzer;
- accessibility sentinel;
- responsive layout fuzzer;
- dead-end detector;
- content clarity reviewer.

### Data

Examples:

- data drift sentinel;
- freshness monitor;
- schema monitor;
- source disagreement detector.

### Knowledge

Examples:

- documentation fuzzer;
- architecture decision drift monitor;
- diagram drift monitor;
- terminology consistency monitor.

### Operations

Examples:

- dependency health monitor;
- observability auditor;
- performance regression monitor;
- recovery verifier.

## Documentation fuzzer

A documentation fuzzer SHOULD ask realistic developer questions.

Examples:

- Where is this behavior implemented?
- Which module owns this state?
- What happens when the dependency fails?
- Which invariant protects this workflow?
- Why was this design selected?
- How does a developer modify this behavior safely?

The routine SHOULD score each answer as:

- findable;
- correct;
- traceable;
- current;
- concise.
