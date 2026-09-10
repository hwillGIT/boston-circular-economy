## Outcome

Archify now creates checked diagrams for delivery and review work.
The CI workflow validates their JSON sources and committed HTML results.
The main branch requires a current `Quality Gate`, `Submission record`, and two team approvals.

Issue exception: This Archify documentation integration has no dedicated issue.

## Evidence and limits

- Evidence: Two Archify diagrams validate with nine checks each. The staged repository snapshot passes the full Prettier check. Main protection requires the checked aggregate and submission status.
- Why this evidence supports the result: The same renderer reads each committed source and confirms that each generated file is current.
- Conditions and limits: Local ETL tests use repository fixtures. GitHub CI remains the final runner and action environment.
- What could change the decision: A failed hosted check, a stale render, or an unreviewed renderer update requires a revision.

## Decision explanation

- Why this design: JSON sources make system diagrams reviewable and reproducible. Checked HTML gives reviewers an interactive artifact.
- Closest alternative: A hand-drawn image could explain the same flow. It would not prove that the checked source still creates the image.
- Trade-off accepted: The fork stores a pinned renderer and its lockfile. A renderer upgrade needs an explicit review.
- Revisit when: A maintained organization-wide diagram tool replaces the pinned renderer.

## Code quality

- Trace one example: `check_archify_diagrams.mjs` reads the manifest, delivers each diagram, then checks that Git tracks the source and HTML.
- Where to make a likely change: `docs/diagrams/manifest.json` owns diagram locations. The source JSON owns the diagram's nodes and connections.
- Who owns the rule and state: The CI workflow owns execution. The manifest owns included diagrams. The review team owns the decision.
- Failure and recovery: A stale HTML file fails the check. Run the diagram check, inspect the result, and commit the generated file.
- What became simpler or harder: Reviewers can inspect a current map from a pull request. Renderer updates need a deliberate dependency change.

## Risk and scope

- Review level: Yellow
- In scope: Pinned Archify source, checked diagrams, local validation, CI artifacts, developer guidance, and main review enforcement.
- Out of scope: Hosted AI reviews, deployment, backend changes, and Slack messages.
- Rules that must remain true: CI uses read-only repository permissions. It does not invoke an AI model or approve a merge.

## What changed

The fork contains two delivery diagrams with JSON sources and HTML results.
The `architecture-diagrams` job installs the pinned renderer, validates both pairs, and uploads the review artifacts.
It builds a comparison artifact when the pull request base and head both include the architecture source.
Main now requires the `Quality Gate` and `Submission record` from GitHub Actions.
It also requires two team approvals and dismisses stale approvals.
Workflow guidance uses the same two-approval team review rule.
The artifact uploader uses the pinned Node 24 release.
The activation record states the tested Replit build, local SQLite limit, and required data decision.

The local runner calls the same diagram check before a push.
The server test command uses Node test discovery. It runs on Windows shells that do not expand file patterns.
The developer playbook includes a prompt that asks contributors to trace a changed connection and predict a changed result.
The formatting rules exclude only generated, imported, and vendored files.

## Challenge cases

The diagram checker rejects unsupported types, missing files, paths outside the fork, repeated identifiers, and source metadata that disagrees with the manifest.
It also rejects diagram pairs that Git does not track and HTML that does not match a current render.
The delta step skips the first integration because its base revision has no architecture source.

## Evidence

| Check                               | Result       | Evidence or reason not run                                                     |
| ----------------------------------- | ------------ | ------------------------------------------------------------------------------ |
| Client lint and build               | Pass         | Client lint, CSS lint, and a Node 22.23.2 production build pass.               |
| Server lint and build               | Pass         | Server lint, TypeScript build, and four authentication tests pass.             |
| ETL tests                           | Pass         | Python 3.14.3 runs Ruff, Mypy, and all 22 ETL tests.                           |
| Technical prose and editorial style | Pass         | Prose check reports zero violations. Delivery-policy and routing tests pass.   |
| Replit production build             | Pass         | `npm run replit:build` passes on main with Node.js 22.23.2.                    |
| Replit production smoke check       | Not run      | The Windows workspace blocks the native SQLite install script.                 |
| Manual user journey                 | Not affected | This change adds CI and documentation. It does not change a product journey.   |
| Accessibility / responsive          | Not affected | This change adds CI and documentation. It does not change rendered product UI. |
| Security / privacy / recovery       | Not run      | Hosted workflow permissions and artifact retention need GitHub CI evidence.    |

The application documentation audit and generation pass.
Archify validates both diagrams with nine checks and no warnings.
The browser review passes for the current architecture diagram.
It shows the main branch label and active status rules.

## AI assistance

- [x] AI assisted with exploration or planning
- [x] AI assisted with implementation or tests
- [x] AI assisted with review or challenge

This record does not establish contributor understanding. The review team must check the explanation against the submitted work.
The trusted-base checker still needs this legacy statement while it is updated by this pull request.
This record does not establish contributor understanding. Human review must check the explanation against the submitted work.

## Review focus and uncertainty

Review the pinned Archify source, the renderer lockfile, the main protection settings, and the narrow formatting exclusions.
Confirm that the new CI job has no write permission and that its uploaded artifacts match this revision.
The first pull request can only demonstrate that the delta step skips a base without diagram source.

## Documentation and learning

- [x] I updated the relevant README, `AGENTS.md`, decision record, or runbook

The diagram guide records update, review, and mentoring steps.
The developer prompt asks for a personal trace and prediction before feedback.
