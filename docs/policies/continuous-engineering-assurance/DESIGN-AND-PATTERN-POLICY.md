# Design and Pattern Policy

Version: 0.1

## Goal

Structure software so that developers can change it safely.

## Forces before patterns

Use this order:

1. Problem.
2. Forces and constraints.
3. Expected change vectors.
4. Candidate structures.
5. Tradeoffs.
6. Pattern choice.
7. Fitness functions.
8. Revisit triggers.

A pattern is a tool. It is not a trophy.

## Design principles

### High cohesion

Keep related responsibilities together.

### Low coupling

Keep unrelated modules independent.

### Explicit contracts

Make boundary behavior visible and testable.

### Controlled state

Make state ownership and transitions clear.

### Failure isolation

Do not let one failure break unrelated behavior.

### Reversibility

Keep uncertain decisions replaceable when practical.

### Information hiding

Do not expose internal details without a consumer need.

### Locality

Keep the knowledge for one behavior close together.

## SOLID as questions

Use SOLID to diagnose a design.

Do not use it as a score.

- **SRP:** Do responsibilities change for different reasons?
- **OCP:** Is the variation real and worth designing for?
- **LSP:** Do implementations honor the same behavioral contract?
- **ISP:** Are consumers forced to depend on behavior they do not use?
- **DIP:** Are stable policies coupled to volatile details?

## GRASP helpers

Use these questions:

- **Information Expert:** Which module already has the required information?
- **Controller:** Which module should coordinate the use case?
- **Protected Variations:** Which volatile detail needs a stable boundary?
- **Indirection:** Does another layer reduce harmful coupling?
- **Pure Fabrication:** Does a non-domain service improve cohesion or testability?

## Pattern selection

Consider these pattern families only when the problem shape applies.

| Problem shape | Candidate patterns |
|---|---|
| Volatile external integration | Adapter, Ports and Adapters, Anti-Corruption Layer |
| Interchangeable behavior | Strategy, Policy, Specification |
| Explicit state transitions | State machine, reducer, statechart |
| Complex construction | Factory, Builder |
| Queue, retry, audit, or undo | Command |
| One-to-many notification | Observer, publish and subscribe |
| Staged transformation | Pipeline, pipes and filters |
| Complex domain rules | Value objects, aggregates, domain services, specifications |
| Distributed workflow | Saga, process manager, outbox, idempotency |
| External dependency failure | Timeout, retry, circuit breaker, bulkhead, fallback |
| Complex UI journey | Statechart, presenter, progressive disclosure, wizard |
| Spatial discovery | Synchronized map and list |

## Pattern falsification

For each selected pattern, ask:

> What evidence would make this the wrong pattern?

Examples:

- Strategy: Is the variation real?
- Adapter: Is there a semantic mismatch at the boundary?
- State machine: Are there legal states and transitions?
- Repository: Does it protect domain logic, or only rename the data tool?
- Microservices: Do we need independent deployment, ownership, scaling, or isolation?
- CQRS: Do read and write models differ enough to justify two models?
- Event sourcing: Are replay and temporal history foundational requirements?

## Simple baseline

Always compare a pattern against the simplest direct implementation.

Do not add a general framework when a local design is enough.

## Architecture fitness functions

A design decision SHOULD define automated checks when practical.

Examples:

- dependency direction;
- module boundary rules;
- provider contract conformance;
- state transition rules;
- data invariants;
- performance budgets;
- accessibility invariants;
- required telemetry.
