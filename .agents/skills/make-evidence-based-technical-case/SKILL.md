---
name: make-evidence-based-technical-case
description: Explain technical decisions, code changes, and review findings with evidence, clear limits, and fair alternatives in plain English.
---

# Explain a Technical Decision

Make the reasoning visible to a reader who does not know the implementation.
Keep formal argumentation names and labels out of the resulting artifact.

Read [the language profile](references/asd-ste100-software.yaml) before drafting.
Read [the voice guide](references/editorial-voice.md) for reader-facing text.
Use [the decision questions](references/decision-questions.md) for a disputed or complex choice.
Use [the GitHub policy](references/github-technical-communication.yaml) for an issue, review, or pull request.

## Explain the result

Inspect the code, issue, tests, logs, and cited decisions first.
Separate observations from inferences. Do not treat an AI answer as evidence.

Answer the questions that matter for the choice:

- What should happen, and who benefits?
- What inspected evidence supports this result?
- Why does that evidence support this choice?
- Under which conditions does the conclusion hold?
- When would the closest alternative be better?
- What observation would change the decision?
- Who owns the next action or unresolved decision?

Use connected prose for a small change. Use a comparison table when readers must compare options.
Do not force every explanation into the same headings.
Use the existing fields when completing a submission form or decision record.

## Explain code through an example

Follow the [code standard](../../../docs/CODE_CHANGE_STANDARD.md).
Trace one input through the code that owns the rule to the visible result.
Name the changed contract, state owner, failure signal, and supported recovery when relevant.
Point to the place where a likely change belongs.

Use names, types, interfaces, and focused tests to express ordinary behavior.
Use comments for reasons or constraints that the code cannot show clearly.
Compare the chosen approach with a credible alternative under the same conditions.

For mentoring, use the [developer guide](../../../docs/work-units/DEVELOPER_AI_GUIDE.md).
Ask one question, then wait. Let the contributor predict before showing the result.
Give a hint when an answer fails. Ask the contributor to revise their explanation.
Do not write an explanation that a contributor will submit as proof of understanding.

## Keep the wording direct

- Use active voice and familiar words.
- Keep descriptive sentences at 25 words or fewer.
- Keep procedural sentences at 20 words or fewer.
- Give one instruction per procedural sentence.
- Define a necessary technical term at its first use.
- Use one stable term for one concept.
- Preserve identifiers, commands, quoted interface text, and citations.
- Avoid contractions, semicolons, promotional wording, and editing narration.

Lead with the result or decision. Put its evidence and limits nearby.
Preserve useful uncertainty and disagreement. Explain a constraint without blaming a person.
Use time words for runtime order, dated evidence, or actual project state.
Do not claim formal language-standard compliance from a sentence checker.

## Check the explanation

Run the repository prose check:

```bash
python3 -B .agents/scripts/check_delivery.py prose
```

The checker tests wording patterns and length. It cannot establish accuracy or understanding.
A human reviewer checks the reasoning, evidence, fair comparison, and contributor explanation.
