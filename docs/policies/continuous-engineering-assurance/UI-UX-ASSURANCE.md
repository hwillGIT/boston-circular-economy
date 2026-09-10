# UI and UX Assurance Policy

Version: 0.1

## Goal

The interface MUST help the intended user understand, complete, and recover from a journey.

A correct screen can still fail the user.

## Required journey model

For a substantial experience change, define:

- user;
- goal;
- entry state;
- journey steps;
- success state;
- empty state;
- loading state;
- error state;
- permission-denied state;
- recovery paths;
- exit or handoff state.

## Experience contract

The interface MUST explain:

1. What is happening.
2. Why information is requested.
3. What happens next.
4. How to recover from a problem.

## Conceptual model

State the model that the interface teaches.

Examples:

- guided service finder;
- map-based discovery tool;
- dashboard;
- step-by-step form;
- workspace.

When a metaphor helps, document:

- the metaphor;
- the actual mechanism;
- the limit of the metaphor.

## Must-not-break invariants

Define experience invariants.

Examples:

- discovery does not require an account;
- a denied permission has a fallback;
- essential map content has a list alternative;
- entered data survives recoverable failure;
- low-confidence information does not appear as verified fact;
- every destructive action has clear consequences.

## Accessibility

Accessibility is a behavior requirement.

Check:

- semantic structure;
- keyboard access;
- focus order;
- control names;
- error announcements;
- contrast;
- touch targets;
- zoom and reflow;
- reduced motion;
- nonvisual alternatives.

Automated checks do not replace manual checks for critical journeys.

## Evidence levels

Use one evidence label for each UX claim.

- **E0 — Hypothesis:** expert or AI review only.
- **E1 — Static evidence:** screenshot, design, or accessibility-tree review.
- **E2 — Interactive evidence:** the real interface was used.
- **E3 — Representative-user evidence:** intended users were observed.
- **E4 — Production behavior:** real usage data supports the claim.
- **E5 — Outcome evidence:** the journey produces the intended result.

Do not describe E0 or E1 evidence as user validation.

## Developer explainability

The implementation record MUST connect:

> User need → Journey → Interaction contract → Component or service → Test → Production signal

A developer SHOULD be able to find the implementation owner for each important journey step.

## Experience review lenses

Review:

- findability;
- comprehension;
- visual hierarchy;
- interaction feedback;
- recovery;
- accessibility;
- trust and consent;
- responsive behavior;
- data uncertainty;
- operational limits.

## Analytics

Analytics MAY identify where a journey fails.

Analytics does not prove why the failure occurs.

Use user research to explain causes when the reason is not clear.
