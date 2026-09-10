# Activate the Fork Delivery Pilot

Status: main-branch review and status requirements are active. The Archify integration awaits team review in PR #14. Deployment and hosted AI review remain unconfigured.

## Evidence and current limits

| Item                      | Evidence                                                                                                                                             | Remaining action                                  |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Fork                      | [hwillGIT/boston-circular-economy](https://github.com/hwillGIT/boston-circular-economy)                                                              | Keep new work here                                |
| Assignments               | The catalog is present on `main`; [PR #8](https://github.com/hwillGIT/boston-circular-economy/pull/8) remains draft                                  | Select a contributor and do not merge a duplicate |
| Application checks        | [PR #10](https://github.com/hwillGIT/boston-circular-economy/pull/10) merged on September 10, 2026                                                   | Keep the checks active                            |
| Tested CI revision        | The current CI run on [PR #14](https://github.com/hwillGIT/boston-circular-economy/pull/14)                                                          | Review the integration and merge it               |
| Workflow integration      | [PR #14](https://github.com/hwillGIT/boston-circular-economy/pull/14) and [issue #11](https://github.com/hwillGIT/boston-circular-economy/issues/11) | Team review and merge                             |
| Main review rule          | Two approvals, stale-review dismissal, and administrator enforcement set on September 10, 2026                                                       | Retain team review                                |
| Required status checks    | `Quality Gate` and `Submission record`; branches must be current with `main`                                                                         | Read settings after material workflow changes     |
| Pages                     | No Pages site exists on September 10, 2026                                                                                                           | Select hosting and backend destination            |
| Contributor understanding | No completed pilot demonstration                                                                                                                     | Observe a contributor explaining their own work   |

The current PR run covers the Archify integration and its application checks.
The live branch rule does not activate a hosted AI reviewer or a deployment.

## Review and merge

1. Review PR #14 against the fork application and its checked diagram artifacts.
2. Keep it in draft until the review team has a complete change and explanation.
3. Confirm that PR #8 adds work missing from `main` before merging it.
4. Merge accepted integration work after the two required team approvals.
5. Verify successful CI on the merged `main` commit.

The assignment catalog is already present on `main`.
Do not merge a second copy without checking the resulting diff.
Retire a redundant review only after its work is present and accepted.

## Verify submission enforcement

Local protocol tests simulate successful and failed GitHub responses.
They do not replace the live checks below.

A pull request is needed only when GitHub must run its pull-request workflow.
It is not a product live test.
Use the next ordinary small change with a committed submission record.
Do not create a separate invalid pull request to test failure paths.

| Check                                             | Expected result                            |
| ------------------------------------------------- | ------------------------------------------ |
| Complete record with a real fork issue            | Submission record succeeds                 |
| Missing required evidence section                 | Submission record fails                    |
| Record unchanged from the base                    | Submission record fails                    |
| Changed pull request description only             | Committed evidence remains authoritative   |
| New commit with missing record content            | The new head does not inherit acceptance   |
| Record submitted from a contributor fork          | The expected source commit is inspected    |
| Head changes during validation                    | No final success is published by that run  |
| GitHub rejects a status write                     | The workflow fails                         |
| Proposed script contains instructions or commands | Trusted workflow treats the record as data |
| Failed, skipped, or cancelled required CI job     | Quality Gate fails                         |

Local protocol tests cover negative responses with synthetic data.
Use the ordinary pull request to show the hosted success path.
Do not expose credentials or contact contributors during a workflow test.

## Main merge rule

`main` now requires `Quality Gate` and `Submission record` from GitHub Actions.
It requires two approvals, dismisses stale reviews, and requires a branch current with `main`.
The rule applies to administrators.
Base-policy changes need a branch update and fresh checks.

Read the settings back after each material workflow change.
A failed `Submission record` status blocks a merge under the protected rule.
Do not create a separate invalid pull request only to prove the rule.
Verify a successful record and CI result still require two team approvals.
The submission workflow does not cover merge queues.
Keep merge queues disabled until that event path has its own tested submission policy.

## Enable AI review

Confirm the available review service, account, permissions, and responsible reviewer.
Use a representative change with a known observable behavior.
Compare each finding against the actual diff and a reproducible check.
Record false findings and missed defects.
A model name in repository policy does not establish that a service is enabled.

## Complete the first mentored assignment

Select UI-001 after confirming ownership in its issue.
Use its sources, prompts, one-hour timebox, and stated deliverable.
Reserve 15 minutes for the contributor's explanation.
Record the artifact revision, contributor explanation, and review team's observation.
Leave acceptance fields empty until the responsible review team accepts the work.

## Replit release readiness

The existing Replit VM path can build the current `main` revision.
On September 10, 2026, `npm run replit:build` passed with Node.js 22.23.2.
It created the client bundle and `server/dist/index.js`.

The local production smoke check remains inconclusive.
This Windows workspace blocked the `better-sqlite3` native install script.
The resulting process could not load the SQLite module.
That result does not show a Replit runtime failure.
Run `/ping` in the selected Replit deployment before public release.

`.replit` selects `nodejs-20`, while `.node-version` and CI select Node.js 22.23.2.
Align the Replit Node.js version before the first deployment.

The service uses `SQLITE_PATH` and otherwise creates `dev.db` in the project workspace.
Replit warns against relying on a published application's filesystem for durable data.
Select permanent storage, a migration plan, and a backup procedure before public data or accounts use this service.
See [Replit Publishing](https://docs.replit.com/learn/projects-and-artifacts/replit-deployments).

A Replit VM is a candidate because the fork already runs an Express service.
A static client and separate backend is a candidate when the team needs independent hosting.
Both choices need a public API origin, a data plan, and a tested recovery procedure.

## Select and verify hosting

Confirm whether the fork should use Replit or a static frontend with a separate backend.
Specify the public API origin, authentication behavior, configuration, and required secrets.
Use the selected host's documented release procedure.
Verify a successful CI result for the exact release revision.
Run the resident journey and a failure case after deployment.
Record the previous working revision and the recovery steps.

The manual readiness workflow remains non-publishing until this procedure is implemented and tested.
