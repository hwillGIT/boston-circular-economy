# Test Assurance Policy

Version: 0.1

## Goal

The goal is stronger evidence, not a larger test count.

## Verification ladder

Use the lowest test level that can prove the claim.

Add higher levels when the risk requires them.

1. **Unit** — Check small logic units.
2. **Property or invariant** — Check rules across many inputs.
3. **Contract** — Check boundary behavior.
4. **Integration** — Check component interaction.
5. **Real-system end-to-end** — Check the complete workflow.

## Challenge angles

Each substantial change MUST consider:

### Expected

Check normal use.

### Boundary

Check empty, null, minimum, maximum, timeout, and limit cases.

### Adversarial

Check invalid input, misuse, race conditions, and dependency failure.

### Historical

Check known defects and regression cases.

## Risk classes

### Green

Examples:

- copy change;
- isolated style change;
- documentation update;
- safe internal refactor.

Normal evidence:

- build or type check;
- focused test;
- quick review.

### Yellow

Examples:

- form behavior;
- navigation;
- search;
- filters;
- API behavior;
- data transformation;
- business logic.

Normal evidence:

- behavior model;
- unit or property tests;
- integration test;
- applicable end-to-end test;
- explainable review.

### Red

Examples:

- authentication;
- authorization;
- privacy;
- money;
- destructive actions;
- migration;
- critical accessibility;
- safety logic.

Required evidence SHOULD include:

- formal behavior model;
- adversarial analysis;
- real-system test;
- recovery or rollback plan;
- deep human review.

## Truth tables and decision tables

Use a truth table when Boolean conditions control behavior.

Use a decision table when business rules use several conditions and outcomes.

A table MUST include rejected and failure cases.

## Property tests

Use property tests when an invariant applies to many inputs.

Example invariants:

- An added filter cannot increase a result set.
- An unauthorized user cannot gain access through request data.
- A normalized coordinate remains inside the supported range.
- Repeating an idempotent command does not create a second result.

## Real-system verification

Use real dependencies for the final critical path when practical.

If a real dependency cannot run, state the limitation.

Do not use a mock as proof that an external system behaves correctly.

## UI verification

For substantial UI work, consider:

- keyboard flow;
- screen reader semantics;
- zoom and text reflow;
- mobile, tablet, and desktop layouts;
- empty, loading, error, and permission states;
- visual regression;
- real journey completion.

## Architecture fitness functions

Convert stable architecture rules into automated checks when practical.

Examples:

- no circular dependencies;
- domain code does not import UI or infrastructure code;
- provider-specific types do not cross adapter boundaries;
- all provider implementations pass one contract suite;
- essential map actions have list equivalents;
- bundle size stays inside the budget;
- critical failures produce telemetry.
