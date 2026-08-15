# Simplified Technical English Style

Version: 0.1

## Purpose

Use this style for developer policy, tickets, AI prompts, pull requests, and technical documents.

This policy uses simplified technical English rules. It does not claim formal certification to an external language standard.

## Sentence rules

- Use active voice.
- Put one main instruction in each sentence.
- Use short sentences.
- Target 25 words or fewer when practical.
- Put the condition before the action.
- Use direct verbs.
- Avoid noun chains.

Good:

> If the provider fails, return cached results and show the data age.

Avoid:

> Provider failure cached result fallback freshness indication behavior should occur.

## Word rules

- Use one term for one concept.
- Do not change between synonyms for style.
- Define an abbreviation before first use.
- Avoid idioms.
- Avoid humor in policy text.
- Avoid vague words such as `easy`, `simple`, `obvious`, `normal`, `appropriate`, and `etc.` unless you define them.
- Use exact nouns instead of pronouns when a pronoun is unclear.

## Requirement words

Use:

- **MUST** for a required rule;
- **SHOULD** for the normal rule with allowed exceptions;
- **MAY** for an optional action.

Do not use `must` when you only mean a recommendation.

## Procedure rules

- Use numbered steps.
- Start each step with a verb.
- Keep one action in each step.
- State expected results.
- State failure handling.

## List rules

Use a bullet list for options or properties.

Use a numbered list for sequence.

Keep list items grammatically parallel.

## Explainability rules

For a complex concept, use:

1. Definition.
2. Mental model.
3. Mechanism.
4. Invariants.
5. Failure cases.
6. Example.
7. Limit of the mental model.

## Metaphor rules

Use a metaphor only when it improves understanding.

Always include:

- **Metaphor** — the intuitive picture;
- **Mechanism** — the real software behavior;
- **Boundary** — where the metaphor is not accurate.

## Evidence rules

Distinguish:

- fact;
- decision;
- inference;
- hypothesis;
- test result;
- user evidence.

Do not write `verified` when only a static review occurred.

Do not write `users prefer` without representative-user evidence.

## AI output rules

Start with the result.

Use headings that state the topic.

Put details after the summary.

Link to long artifacts.

State missing evidence and uncertainty.
