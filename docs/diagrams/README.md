# Checked diagrams

These diagrams explain the delivery path and its review evidence.
Each source file is JSON.
Each HTML file is a checked-in, interactive rendering of that source.
Read the [activation record](../DELIVERY_ACTIVATION.md) for live repository settings.

| Source                             | Checked HTML                       | Purpose                                                               |
| ---------------------------------- | ---------------------------------- | --------------------------------------------------------------------- |
| `agent-delivery.architecture.json` | `agent-delivery.architecture.html` | Shows the people, checks, and artifacts that move a change to review. |
| `ci-review.workflow.json`          | `ci-review.workflow.html`          | Shows the path from a selected unit to team review.                   |

## CI rule

CI runs the vendored Archify copy.
The manifest records its source and revision.
It validates each source and recreates each HTML file.
The job fails when a checked-in HTML file is stale.
It does not call an AI model.

On a pull request, CI also builds an architecture-delta artifact when both the base and head contain the architecture source.
The artifact shows authored additions, removals, and changed relationships.
It supports review. It does not approve a merge.

## Update a diagram

Install the nested Archify dependencies from the repository root.

```sh
npm ci --prefix .agents/skills/archify --no-audit --no-fund
```

Use the [project Archify skill](../../.agents/skills/archify/SKILL.md) to update a JSON source.
Then run this command.

```sh
node .agents/scripts/check_archify_diagrams.mjs
```

The command validates the sources and rewrites the checked HTML files.
Review and commit both the JSON source and its HTML output.

When a diagram changes, run its browser check before handoff.

```sh
node .agents/skills/archify/bin/archify.mjs visual-check docs/diagrams/<name>.html --json
```

The browser receipt proves basic containment and capture coverage.
Inspect the captured images before you describe the visual review as passed.
The local screenshots and receipts stay out of Git.

## AI prompt

```text
Use the project Archify skill to update the diagram that matches this change.
Read the named source files and the changed code first.
List the facts that support each changed node or connection.
Do not claim a relationship that the sources do not show.
Keep one clear main path and short labels.
Validate and deliver the diagram.
Show me the changed JSON and HTML files.
Ask me to trace one edge from its source to its result.
Change one condition and ask me to predict the new path.
Wait for my answer before correcting it.
Do not write my explanation or claim that I understand the change.
```

## Pinned source

The project copies Archify from `tt-a1i/archify` at commit `18911058008f17dc065af23a2cdc9bfeff6d3f7a`.
Its license is MIT.
The vendored skill and its lockfile make the renderer reproducible in CI.
Update the source, revision, and generated files together.
