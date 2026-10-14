---
name: controlled-language-system
description: Keep product language, business rules, procedures, formal logic, code, and tests semantically aligned. Use this skill when defining domain terms; writing user-facing explanations; writing operational procedures; specifying business or policy constraints; creating machine-checkable rules; or reviewing whether documentation and implementation mean the same thing.
---

# Controlled Language System

## Purpose

Use one authoritative domain vocabulary, then express the same meaning at the
least formal layer that preserves the required precision.

Do not force one writing style onto every artifact. A user explanation, an
operating procedure, a business rule, and a machine-checkable assertion serve
different readers.

The system is:

```text
authoritative terms and definitions
            |
   +--------+--------+----------------+----------------+
   |                 |                |                |
plain language   technical        business         formal
for people       procedure        rule             logic
   |                 |                |                |
   +--------+--------+----------------+----------------+
            |
      code and tests
            |
      semantic checks
            |
      back to terms
```

## Governing principle

**One meaning, multiple representations.**

The vocabulary is the semantic anchor. Other layers may simplify presentation,
but they must not silently change the meaning.

Use the least formal layer that is sufficient. Formal logic is a precision
tool, not a prestige layer.

## The layers

| Layer | Use it for | Typical reader | Main quality test |
|---|---|---|---|
| Authoritative vocabulary | Stable domain terms, definitions, allowed states, aliases, prohibited terms | Everyone | Does each important term have one meaning? |
| Plain Language | UI copy, help text, notices, explanations | End user | Can the reader understand the consequence and next action? |
| Technical procedure | Repeatable operational or engineering instructions | Operator, engineer | Is each action explicit, ordered, and unambiguous? |
| Business rule | Obligations, permissions, prohibitions, invariants | Product, policy, engineering | Can the rule be evaluated as true or false? |
| Formal logic | Selected relationships that benefit from automated reasoning | Rules engine, knowledge graph, validation tooling | Is the statement machine-checkable without hidden assumptions? |
| Code and tests | Executable enforcement and evidence | Engineering, QA | Does implementation enforce the authoritative rule at the real decision point? |

## Language disciplines

### Plain Language

Use ordinary words. Explain the outcome, why it matters, and what the person can
do next.

Do not expose internal scoring, implementation details, or formal vocabulary
unless the person needs them.

### Technical procedures

Use ASD-STE100-inspired discipline for procedures:

- Prefer active voice.
- Use one instruction per sentence.
- Use one approved term for one concept.
- State conditions before actions.
- Name the actor or component that performs the action.
- Prefer explicit verbs such as `check`, `record`, `reject`, `route`,
  `normalize`, and `display`.
- Do not claim formal ASD-STE100 compliance without a qualified review or
  approved checker.

If the repository has a stricter writing skill, apply it as the sentence-level
policy.

### Business rules

Write a business rule so a reviewer can determine whether the rule is satisfied.

Prefer these shapes:

- **Obligation:** Each X must Y when condition Z is true.
- **Prohibition:** No X may Y when condition Z is true.
- **Permission:** X may Y only when condition Z is true.
- **Invariant:** Every X has exactly one state from set S.
- **Ordering:** Event A must occur before event B.

A rule must not depend on UI wording.

Separate these sources:

- law or regulation;
- contractual requirement;
- adopted product or business policy;
- engineering constraint;
- current implementation.

Never label one source as another.

### Formal logic

Use ACE-style or another formal representation only when automated reasoning,
consistency checking, ontology work, or rule execution adds value.

A formal statement must define its predicates and quantifiers. Do not convert
ambiguous English into precise-looking ambiguous logic.

Do not claim ACE, SBVR, or other formal conformance unless the statement has
been validated with the required tooling or qualified review.

## Workflow

### 1. Find the authoritative concept

Before writing new copy or a new rule, search the repository for the existing
term, enum, state, policy, API field, ADR, schema, or decision record.

Reuse an existing concept when it already has the intended meaning.

### 2. Create or update the term card

For each important concept, capture:

```text
Canonical term:
Definition:
Allowed values or states:
Synonyms allowed in user copy:
Terms to avoid:
Source of authority:
Related rule IDs:
Examples:
Non-examples:
```

A term card can live in an existing glossary, schema, contract, ADR, or
requirements document. Do not create a second glossary when the repository
already has a canonical home.

### 3. Classify the statement before writing it

Ask what the statement is trying to do:

- explain something to a person;
- tell an operator what to do;
- define what the system permits or requires;
- state a relationship for machine reasoning.

Choose the layer from that purpose.

### 4. Write from the authoritative meaning

Write the business rule before deriving user copy when the behavior is governed
by an obligation, prohibition, permission, or invariant.

Write the procedure from the rule.

Write user copy from the consequence the user needs to understand.

Create formal logic only when it will actually be consumed or checked.

### 5. Keep traceability

For consequential rules, assign or reuse a stable rule identifier.

Trace in both directions:

```text
term -> rule -> procedure/API -> implementation -> test
  ^                                         |
  +------------- user explanation <--------+
```

A user-facing sentence is not evidence that the implementation enforces the
rule.

A passing test is evidence about code behavior. It is not evidence that the
rule itself is correct.

### 6. Test at the enforcement point

A rule is not implemented because a helper function exists.

The test must reach the path where the real decision, state transition, data
read, or side effect occurs.

For negative rules, test the prohibited path.

For missing required data, prefer a safe failure over an unchecked action when
the project policy requires denial by default.

### 7. Run the semantic-drift review

Before publishing or merging, ask:

- Does one term have two meanings?
- Do two terms mean the same thing unnecessarily?
- Does UI copy imply a stronger decision than the underlying state?
- Does a procedure add a condition that is absent from the business rule?
- Does code accept a state that the vocabulary does not allow?
- Does a test prove a helper instead of the production path?
- Is a business policy described as law?
- Is a legal or contractual requirement described as optional?
- Does formal logic hide an undefined predicate or assumption?
- Did a source-system field leak into the user vocabulary without review?

Resolve the meaning first. Then repair the representations.

## Output pattern

When this skill is used for a new consequential rule, produce the smallest set
of artifacts needed:

1. authoritative term or state definition;
2. business rule;
3. technical procedure or API behavior;
4. user explanation, when a user is affected;
5. executable validation or test;
6. formal logic only when a real machine consumer exists.

Do not manufacture all six layers for trivial text.

## Anti-patterns

### UI copy as the source of truth

Bad:

> The button says "Approved", therefore the state is approved.

The state model is authoritative. The button text is a presentation.

### Procedure as policy

Bad:

> The runbook checks a threshold, therefore the threshold is a requirement.

A procedure implements a rule. It does not create the rule.

### Precise-looking ambiguity

Bad:

> Every eligible user has an approved account.

"Eligible", "approved", and "account" are undefined.

### Formal logic everywhere

Bad:

> Convert every requirement into logic before the team can discuss it.

Use formal logic where a machine will reason over it or where ambiguity is
costly enough to justify the overhead.

### Different vocabulary in every layer

Bad:

> UI: provider; API: vendor; database: location; rules: facility

This may represent four concepts or one concept with four names. Resolve that
before adding more code.

## Validation checklist

- [ ] The important domain terms have one authoritative meaning.
- [ ] Allowed states and enum values match the authoritative vocabulary.
- [ ] User copy does not overstate the underlying decision.
- [ ] Procedures use consistent technical terms and explicit actions.
- [ ] Business rules can be evaluated as true or false.
- [ ] Rule sources are classified correctly.
- [ ] Consequential rules trace to implementation and production-path tests.
- [ ] Formal logic is used only where there is a machine or validation benefit.
- [ ] Missing data cannot silently bypass a required control.
- [ ] The same concept still means the same thing in copy, rules, code, and tests.


## RTRevenue repository profile

Apply the repository's existing sentence-level writing rules in addition to this
skill. For internal technical writing, use the existing `st100-writing` or
`write-timeless-technical-prose` guidance where applicable.

### Protected semantic boundaries

Preserve these existing distinctions unless an approved decision changes them.

**Light QE outcomes**

```text
INVITED_TO_APPLY
NOT_INVITED_AT_THIS_TIME
INSUFFICIENT_DATA
```

These states describe an invitation decision. Do not translate them into
approval language.

**Full QE outcomes**

```text
APPROVED
DECLINED
UNDER_REVIEW
```

Do not collapse Light QE and full QE into one state vocabulary.

**Consent before data access**

The Merchant Agreement and granular data-use consent are a hard boundary.
Protected external business data must not be read before the required consent
exists.

### RTRevenue worked example: consent-gated data access

**Authoritative terms**

- `granular data-use consent`: explicit permission for the applicable protected
  business-data sources.
- `protected business-data read`: a read from a covered external financial or
  business-data source.

**Plain Language**

> Connect your business data after you review and give the required permission.

**Technical procedure**

1. Check for the required Merchant Agreement.
2. Check for valid granular data-use consent.
3. Do not call protected external data sources when either check fails.
4. Record the consent evidence before the first protected data read.
5. Start data ingestion only after the gate passes.

**Business rule**

> Every protected business-data read must have the required agreement and valid
> granular data-use consent recorded before the read occurs.

**Formal form, only if a rule engine or knowledge model needs it**

```text
Every protected-data-read has a valid-consent-event.
Every protected-data-read has an agreement-event.
Every valid-consent-event that authorizes a protected-data-read precedes that read.
```

Define `protected-data-read`, `valid-consent-event`, `agreement-event`, and
`precedes` before machine use.

**Implementation evidence**

Test the real adapter or orchestration path. A unit test of a consent helper is
not sufficient if another production path can call the external source directly.

### RTRevenue worked example: investment-limit enforcement

**Business rule**

> An investment commitment must not be accepted when accepting it would violate
> the applicable investor investment limit.

**Procedure**

1. Load the data required for the applicable limit.
2. Calculate the remaining permitted amount.
3. Compare the proposed commitment with that amount.
4. Reject the commitment when it is above the permitted amount.
5. Do not accept the commitment when required limit data is unavailable.
6. Record the decision evidence.

**Implementation test**

Exercise the production commitment path with a proposed commitment above the
remaining limit. Verify that no accepted commitment is recorded.

The existence of `check_investment_limit()` is not enforcement by itself. The
production commitment path must call or otherwise enforce the rule.

### State-separation invariant

```text
LightQEOutcome = {
  INVITED_TO_APPLY,
  NOT_INVITED_AT_THIS_TIME,
  INSUFFICIENT_DATA
}

FullQEOutcome = {
  APPROVED,
  DECLINED,
  UNDER_REVIEW
}
```

A serializer, API contract, UI, or analytics pipeline must not substitute a
value from one set for a value in the other set.## Circular Economy profile

Use this skill for product terminology, ETL semantics, API contracts, decision
rules, user guidance, and tests.

The project helps Boston residents repair and reuse more items rather than throw
them out. Keep user language simple while preserving source and data semantics
in technical layers.

### Existing data vocabulary

The repository currently supports these local-service-provider data sources:

```text
google_places
openstreetmap
```

The ETL pipeline normalizes source records and merges matching locations.
Field-merging code gives Google Places priority for fields governed by the
configured source priority, then falls back to OpenStreetMap.

Do not turn this implementation choice into a universal product truth. It is an
ETL rule that can change independently of the user-facing concept of a repair or
reuse option.

### Worked example: source normalization

**Authoritative terms**

- `source record`: a record received from a supported external data source.
- `normalized location`: the common representation after source-specific
  normalization.
- `source priority`: the configured ordering used when equivalent candidate
  field values must be selected.

**Plain Language**

> We combine local service information from supported sources so people can
> find repair and reuse options more easily.

**Technical procedure**

1. Read the supported source snapshots.
2. Normalize each source record.
3. Match records that refer to the same location.
4. Merge matched records.
5. Use the configured source priority for fields governed by that rule.
6. Preserve enough provenance to identify the contributing source records.

**Business rule**

> Each merged location must be derived from one or more supported source
> records.

For a field governed by source priority:

> When equivalent candidate values are available from both supported sources,
> select the value from the higher-priority source.

**Formal form, only when a machine consumer needs it**

```text
Every merged-location has at least one source-record.
Every source-record has exactly one supported-data-source.
```

If source precedence is modeled formally, define the precedence relation rather
than embedding vendor names throughout the logic.

**Implementation tests**

- A merge of equivalent Google Places and OpenStreetMap records produces one
  merged location.
- A field governed by source priority uses the Google Places value when both
  sources provide an equivalent candidate value.
- The same field falls back to the OpenStreetMap value when the preferred value
  is absent.

### Product-language boundary

User-facing language should describe what a resident can do: repair, reuse,
repurpose, learn, or find a service.

Internal terms such as fuzzy-match threshold, DTO, normalizer, data-source enum,
and source priority belong in technical documentation unless explaining them
helps the user make a decision.
