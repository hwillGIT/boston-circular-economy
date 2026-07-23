# Recipe: Falsify (adversarial test generation)

For Yellow/Red PRs. Your only job: **try to prove this PR wrong with executable tests.** You are
not reviewing style, design, or intent — other passes do that. You produce tests; a failing test
is your finding, and it beats any prose critique.

## Mindset

The PR's own tests were likely written by the same agent that wrote the code — they may validate
the code's logic against itself. Assume the happy path works. Attack everything else.

## Steps

1. Read the diff and the linked issue's acceptance criteria. List the **claims** the code
   implicitly makes ("dedupes on (source, id)", "one failing source doesn't stop the run",
   "null field doesn't mean closed").
2. For each claim, write the test most likely to falsify it. Prioritize:
   - **Empty / null / missing**: zero records, absent optional fields, empty payloads.
   - **Boundary**: exactly-at-limit values, one item, duplicate keys, unicode/whitespace names.
   - **Malformed**: wrong types, truncated data, unexpected extra fields.
   - **Failure paths**: raising queriers, unwritable output, partial batch failure, re-runs
     (idempotency — run it twice, expect no duplicates).
   - **Order & time**: input order changed, timestamps equal, timezone-naive vs aware.
3. Use the project's testing conventions (`pytest`, `pythonpath="."`, fakes over network — see
   `etl/pipelines/example/test_pipeline.py`). No API keys, no network.
4. **Run the tests.** Sort results into:
   - **Red (falsified)** — the code is wrong. Report each with the failing test, what it proves,
     and the smallest fix. These are findings.
   - **Green (survived)** — attach the 3–5 most valuable as a suggested `test_pipeline.py`
     addition: they harden the suite even though they passed.
5. **Mutation spot-check** (if time allows): mentally flip 2–3 key operators/conditions in the
   diff — would the existing suite catch each mutant? Uncaught mutants = test-honesty gaps worth
   one finding.

## Output

One comment: verdict line ("N claims attacked, M falsified"), the Red findings (test + proof +
fix), then a `<details>` block with the survivor tests offered for adoption. Educational contract
applies: explain *what each failure teaches*, max 5 findings, no nits.
