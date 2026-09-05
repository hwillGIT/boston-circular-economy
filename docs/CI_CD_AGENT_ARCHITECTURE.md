# Contribution Checks and Review

This workflow supports small frontend assignments in
[hwillGIT/boston-circular-economy](https://github.com/hwillGIT/boston-circular-economy).
[The activation record](DELIVERY_ACTIVATION.md) distinguishes tested files from active repository settings.

## From assignment to accepted work

1. Select a ready [work unit](work-units/README.md).
2. Confirm its inputs, timebox, deliverable, and reviewer.
3. Use its AI prompts to explore, challenge, and produce the artifact.
4. Inspect the result and run the relevant checks.
5. Commit the evidence in `.github/submission.md`.
6. Open a pull request in the fork.
7. Ask the human reviewer to inspect the work and contributor explanation.
8. Record acceptance against the exact artifact revision.

The reviewer selects one changed case that the contributor has not rehearsed.
The contributor explains the controlling code, specification, or design.
The [developer guide](work-units/DEVELOPER_AI_GUIDE.md) provides practice prompts.

## What each check establishes

| Check               | What it checks                                                     |
| ------------------- | ------------------------------------------------------------------ |
| Lint • Client       | Client lint, CSS rules, and repository formatting                  |
| Lint • Server       | Server lint                                                        |
| Lint • ETL (Python) | Python lint, formatting, and merge-module types                    |
| Typecheck           | Client build, server build, and server authentication tests        |
| Test • ETL          | Python tests                                                       |
| Docs • Generate     | Public function documentation and generated API reference          |
| Docs • Python       | Advisory Python docstring audit                                    |
| Delivery policy     | Prose, work-unit manifests, submission structure, and policy tests |
| Quality Gate        | All listed jobs completed successfully                             |

The Python docstring audit remains advisory.
Read its step output for missing documentation, even when its job succeeds.
The other listed failures prevent a successful Quality Gate.

CI runs on pull requests to any branch, main pushes, feature pushes, and merge-group checks.
This allows a review branch to depend on another review branch.
CI uses read-only repository permissions and pinned action revisions.
It runs all application checks, including documentation-only changes.

## Local checks

Install the dependencies and hooks from the root `AGENTS.md`.
During a change, run focused checks for the affected behavior.
Before pushing, the local runner requires a clean worktree and the checked-out commit being pushed.

```bash
python3 -B .agents/skills/route-agent-work/scripts/run_local_checks.py --base origin/main
```

Use `--all` for every application check.
Local routing uses the changed files.
A shared Node lockfile selects client and server checks.
An unknown path or workflow change selects all application checks.

The commit hook checks prose, submission structure, manifests, and applicable policy tests.
The push hook also runs formatting and the selected application checks.
Checks must not change the submitted worktree.

## Prose scope

The prose check covers new and changed text.
A content fingerprint records legacy files that already fail the language rules.
Only an unchanged file with that fingerprint keeps its temporary exemption.
Changing its content makes the whole file subject to the check.

The baseline identifies the source revision and records each affected path.
It is not an automatic approval to add exemptions.
Review a baseline change as a policy change.
All assignment guides and delivery policies must pass without a baseline exemption.

## Submission status

The pull request description is the readable copy of `.github/submission.md`.
The record must differ from the base record.
The submission workflow reads the committed record through the GitHub API.
It executes the checker from the trusted base revision.

The workflow checks the live pull request head before starting and before publishing its result.
It writes the `Submission record` status to that head.
It does not execute the proposed code with a write token.
The first integration needs a follow-up pull request to demonstrate trusted-base enforcement.

The trusted script is `check_submission_workflow.py`.
It reads the proposed record from the contributor's source repository at the expected commit.
GitHub's [content API](https://docs.github.com/en/rest/repos/contents#get-repository-content)
supports reading a file at a specified revision.
The script uses GitHub's [status API](https://docs.github.com/en/rest/commits/statuses#create-a-commit-status)
to attach the result to that commit.

Tests simulate API responses without creating live statuses.
They cover a changed head, missing records, invalid content, failed writes, and records from another fork.
Commands inside Markdown remain data.
The tests do not establish that repository permissions or merge rules are active.

Submission validation checks structure and meaningful content.
It cannot establish that a stated check ran or that a contributor understands the work.
The human reviewer verifies both.

## AI review and human decisions

Use the review skill for a requested review.
The local runner can show its route without starting an AI session:

```bash
python3 -B .agents/skills/review-code-change/scripts/run_local_review.py --risk yellow --base origin/main --dry-run
```

The route applies a minimum review level from affected paths.
A contributor cannot lower that level through a declaration.
The runner refuses specialist decisions and requires the responsible human.
Available model names and user preferences must be checked before running a review.

Repository routing does not configure a hosted AI service.
Enable hosted review only after verifying its account permissions and operation.
AI findings remain advice. Human review and merge authority remain with maintainers.

## Deployment

The existing fork uses Replit settings and also contains an older Pages workflow.
Hosting and the backend destination need a maintainer decision.
The manual readiness workflow reports that unresolved requirement and performs no publication.
A selected host needs an exact-commit release check, environment configuration, and a recovery procedure.
