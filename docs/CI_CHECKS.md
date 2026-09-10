# Run and Explain the CI Checks

Continuous integration (CI) checks each proposed change before a human reviews it.
A passing check supports a specific claim. It does not prove that the whole product works.

## Install the same tools as CI

Use Node.js 22.23.2 and its bundled npm 10.9.8.
The `.node-version` file records the Node.js version.
Run this command from the repository root:

```sh
npm ci --no-audit --no-fund
```

Use Python 3.14.3 and uv 0.12.9 for data processing.
This pipeline reads source records and converts them into shared location data.
The `etl/.python-version` file records the Python version.
Run these commands from the repository root:

```sh
cd etl
uv sync --locked --dev
```

The npm and uv lockfiles record the dependency versions.
Do not regenerate the inactive pnpm lockfiles for this workflow.
The npm lockfile uses public registry URLs so installation also works outside Replit.

## Check a change

Run the JavaScript checks from the repository root:

```sh
npm run lint -w client
npm run lint:css
npm run lint -w server
npm run format:check
npm run build -w client
npm run build -w server
npm run test -w server
npm run docs:audit
npm run docs:generate
```

Run the Python checks from `etl/`:

```sh
uv run --locked ruff check .
uv run --locked ruff format --check .
uv run --locked mypy src/etl/merge/ --ignore-missing-imports
uv run --locked pytest
uv run --locked pydocstyle --convention=google src/ pipelines/
```

The last command reports Python docstring gaps. These gaps do not block CI.
Other failed checks block the final `Quality Gate` job.
A cancelled or skipped required job also blocks that gate.
Human approval remains separate from these checks.

| Check                    | What the result supports                                                 | What it does not establish                   |
| ------------------------ | ------------------------------------------------------------------------ | -------------------------------------------- |
| ESLint and Stylelint     | Code follows the configured rules.                                       | Every interaction works.                     |
| Prettier                 | Authored files use the selected format.                                  | Names and explanations are clear.            |
| Client and server builds | Type checks and compilation succeed.                                     | Production services are available.           |
| Server tests             | The tested authentication requests return the expected results.          | Every route or security property is covered. |
| Python tests             | The tested examples and merge rules produce the expected results.        | Live source queries work.                    |
| Mypy                     | The merge package passes its configured type checks.                     | All Python modules have been checked.        |
| Documentation audit      | Public callables reached from the configured entries have documentation. | Every comment is accurate or understandable. |

Server tests use an in-memory database. They do not open the repository's development database.
Python tests use local examples. The source queriers still contain unimplemented methods.
Formatting excludes generated output, imported data samples, and inactive pnpm lockfiles.
The Python formatter checks Python files separately.

## Explain a repair

Keep the changed files open while you use this prompt:

```text
Read this change and the CI result for the same revision.
State which failure prevented the check from running or passing.
Trace one concrete input through the changed code to the result.
Use short, active sentences and define unfamiliar terms.
Explain the choice, its evidence, its cost, and its limits.
Compare the closest viable alternative fairly.
Do not name a reasoning framework or describe your writing method.
Ask me to explain the controlling rule in my own words.
Wait for my answer.
Then change one condition and ask me to predict the result.
Check my answer against the code and a focused test or demonstration.
Do not write my explanation or certify my understanding.
```

For example, a search filter change also clears the previous map area.
The filter handler owns both updates in `useExploreLocations.ts`.
The alternative was a later effect that triggered another render.
The handler makes the relationship visible where the user action enters the code.
A browser check must still confirm the displayed results and the unchanged-filter case.

The Python location enums retain their existing string output.
Each local `UP042` exception explains why conversion to `StrEnum` would change that output.
These exceptions do not disable other lint rules or exclude a file.

For review, record the revision, observed result, closest alternative, and remaining uncertainty.
Ask a human reviewer to select one changed case that you have not rehearsed.

## Output and review

CI uploads generated TypeScript documentation as the `api-docs` artifact.
Its contents belong to the revision shown in that CI run.
Deployment has a separate workflow. Passing this workflow does not establish deployment readiness.

The [React guidance](https://react.dev/learn/you-might-not-need-an-effect)
supports handling related state updates in the action that causes them.
The [TypeDoc validation options](https://typedoc.org/documents/Options.Validation.html)
describe the documentation checks used here.
