# Pull Request Evidence Template

## Claim

State one observable result.

> After this change, ...

## Context

Who or what needs this change?

Why does it matter?

## Risk class

- [ ] Green
- [ ] Yellow
- [ ] Red

Reason:

## Model

Link or include the smallest useful model.

- [ ] Not required
- [ ] Truth table
- [ ] Decision table
- [ ] State machine
- [ ] Journey model
- [ ] Invariant
- [ ] Contract
- [ ] Sequence or component diagram

## What changed

Describe the code, UI, data, or configuration change.

## Design

State:

- responsibility and ownership;
- important boundaries;
- selected patterns;
- alternatives considered;
- tradeoffs;
- revisit triggers.

## Invariants

List what MUST remain true.

## Challenge cases

### Expected

- 

### Boundary

- 

### Adversarial

- 

### Historical regression

- 

## Evidence

### Tests that ran

- 

### Tests that did not run

- 

### UI and UX evidence

Evidence level: E0 / E1 / E2 / E3 / E4 / E5 / Not applicable

- 

### Screenshots, recordings, logs, or metrics

- 

## Accessibility

- [ ] Not applicable
- [ ] Keyboard checked
- [ ] Focus checked
- [ ] Screen reader semantics checked
- [ ] Zoom and reflow checked
- [ ] Responsive layouts checked
- [ ] Error and status announcements checked

## Security and privacy

- [ ] No trust boundary changed
- [ ] Data collection reviewed
- [ ] Authorization reviewed
- [ ] Sensitive logging reviewed
- [ ] Threat cases reviewed

## Operations

- [ ] Failure is observable
- [ ] Recovery path exists
- [ ] Performance impact checked
- [ ] Dependency failure checked
- [ ] Rollback or disable path exists

## Uncertainty

What is not yet proven?

## Documentation impact

- [ ] No document change required
- [ ] Requirement updated
- [ ] Journey updated
- [ ] Design system updated
- [ ] Architecture decision updated
- [ ] Runbook updated
- [ ] README or example updated

## Five-minute reconstruction test

Can another developer understand the purpose, model, boundaries, and evidence in about five minutes?

- [ ] Yes
- [ ] No
