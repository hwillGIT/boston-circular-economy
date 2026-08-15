# AI Engineering Policy

Version: 0.1

## Purpose

Use this policy for code, tests, UI, UX, architecture, documentation, and operations.

The AI tool supports engineering work. The human developer owns the result.

## Required language

Use simplified technical English.

Follow these rules:

- Use active voice.
- Use one term for one concept.
- Use short sentences.
- Put one instruction in each sentence.
- Define abbreviations before use.
- Avoid idioms and vague words.
- Use `MUST`, `SHOULD`, and `MAY` as defined terms.
- State uncertainty directly.
- Do not claim that a test ran unless it ran.
- Do not invent evidence.

See `TECHNICAL-ENGLISH-STYLE.md` for the full style policy.

## Meaning of policy words

- **MUST** means the rule is required.
- **SHOULD** means the rule is the normal choice. Give a reason when you do not follow it.
- **MAY** means the choice is optional.

## Core workflow

For each substantial change, follow this sequence:

1. **Intent** — State the user or system need.
2. **Model** — Select the smallest useful behavior model.
3. **Design** — Assign responsibilities and select boundaries.
4. **Implement** — Make the smallest complete change.
5. **Challenge** — Try to prove the change wrong.
6. **Verify** — Collect evidence at the correct test levels.
7. **Explain** — Explain purpose, mechanism, limits, and evidence.
8. **Review** — Support human review with clear evidence.
9. **Observe** — Define signals for real operation.
10. **Learn** — Update tests, documents, and decisions.

## Before implementation

The AI MUST state the behavioral claim.

Use this form:

> After this change, [actor or system] can [observable behavior] under [important conditions].

The AI MUST identify important constraints.

The AI MUST identify the risk class:

- **Green** — low-risk change;
- **Yellow** — behavioral change;
- **Red** — critical change.

The AI MUST select a model when the behavior has important states, rules, or boundaries.

Use:

- a truth table for Boolean rules;
- a decision table for business rules;
- a state machine for state transitions;
- a journey model for UI and UX flows;
- an invariant for properties that must always hold;
- a contract for module or service boundaries;
- a sequence diagram for multi-component interaction.

Do not create a model when it does not improve understanding.

## Design policy

The AI MUST evaluate responsibility, cohesion, coupling, state, contracts, and failure behavior.

The AI MUST use forces before patterns.

Follow this order:

1. State the problem.
2. State the forces and constraints.
3. State the expected change vectors.
4. Compare the simplest direct design with pattern-based options.
5. Select the smallest design that meets the need.
6. State tradeoffs and revisit triggers.

The AI MUST NOT add a pattern only because it is popular.

Use SOLID as questions, not as a score:

- **SRP:** Do responsibilities change for different reasons?
- **OCP:** Is the variation real and worth designing for?
- **LSP:** Do implementations honor the same contract?
- **ISP:** Are consumers forced to depend on unused behavior?
- **DIP:** Are stable policies coupled to volatile details?

Prefer:

- high cohesion;
- low coupling;
- explicit contracts;
- controlled state;
- failure isolation;
- reversible decisions;
- composition over deep inheritance;
- a functional core with effects at the boundary when practical.

## Implementation policy

The AI MUST keep the change inside the requested scope.

The AI MUST preserve existing invariants unless the task changes them.

The AI SHOULD make small and reviewable changes.

The AI MUST NOT hide major behavior changes inside refactoring.

The AI MUST NOT remove tests only to make a build pass.

The AI MUST NOT add speculative frameworks or extension points without evidence of variation.

## Challenge policy

The AI MUST challenge substantial changes from four angles:

- **Expected:** normal use;
- **Boundary:** empty, null, minimum, maximum, timeout, and limit cases;
- **Adversarial:** invalid input, misuse, concurrency, and dependency failure;
- **Historical:** known defects and regression cases.

The AI MUST state counterexamples for critical logic.

The AI SHOULD use property tests when an invariant applies to many inputs.

## Verification policy

Select the required evidence by risk.

Possible levels are:

1. Unit tests.
2. Property or invariant tests.
3. Contract tests.
4. Integration tests.
5. Real-system end-to-end tests.
6. Accessibility tests.
7. Responsive UI tests.
8. Performance tests.
9. Security and privacy tests.
10. Recovery and observability tests.

A mock proves behavior against a model of a dependency.

A real-system test checks whether that model matches reality.

Critical journeys SHOULD run against the real application when practical.

The AI MUST state which tests ran and which tests did not run.

## UI and UX policy

For a substantial UI or UX change, the AI MUST identify:

- the intended user;
- the user goal;
- the entry state;
- the success state;
- empty, loading, error, and permission-denied states;
- recovery paths;
- accessibility needs;
- evidence level.

Essential map behavior MUST have a non-map alternative.

A user MUST receive clear status, next steps, and recovery instructions.

The AI MUST separate a design hypothesis from user research evidence.

Use these evidence levels:

- **E0:** hypothesis;
- **E1:** static review;
- **E2:** interactive evidence;
- **E3:** representative-user evidence;
- **E4:** production behavior;
- **E5:** outcome evidence.

## Explainability policy

The AI MUST make a substantial change understandable to another developer.

The explanation MUST answer:

1. What problem does this solve?
2. What should now be true?
3. What model explains the behavior?
4. How does the implementation achieve it?
5. What must remain true?
6. What can fail?
7. Why was this design selected?
8. What evidence supports it?
9. What is still uncertain?

Use this structure for metaphors:

1. **Metaphor** — Give the intuitive model.
2. **Mechanism** — Explain what the software actually does.
3. **Boundary** — Explain where the metaphor stops working.

The AI MUST NOT present an inferred rationale as a recorded historical decision.

## Pull request policy

A substantial pull request MUST include:

- claim;
- context;
- model;
- implementation summary;
- invariants;
- challenge cases;
- evidence;
- risk;
- uncertainty;
- documentation impact.

Use `PR-EVIDENCE-TEMPLATE.md`.

Apply the five-minute reconstruction test:

> Can another developer understand the purpose, model, boundaries, and evidence in about five minutes?

If the answer is no, improve the explanation or simplify the design.

## Autonomous routine policy

An AI routine MUST follow this loop:

> Observe → Detect → Gather Evidence → Model → Falsify → Verify → Propose Change → Pull Request or No Finding

A routine MUST be allowed to report no finding.

A routine MUST NOT create work only to satisfy a schedule.

A routine MUST propose the smallest safe change.

A human MUST approve and own the result.

See `AUTONOMOUS-ROUTINE-POLICY.md`.

## Required final response for substantial work

Use these headings:

1. **Claim**
2. **What changed**
3. **Why this design**
4. **Evidence**
5. **Risk**
6. **Uncertainty**
7. **Next review action**

Keep the response concise.

Link to detailed artifacts instead of repeating them.
