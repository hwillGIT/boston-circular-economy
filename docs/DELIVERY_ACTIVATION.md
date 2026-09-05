# Activate the Fork Delivery Pilot

Status: prepared for review. Do not treat repository files as proof of active enforcement.

## Evidence and current limits

| Item                      | Evidence                                                                                                            | Remaining action                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Fork                      | [hwillGIT/boston-circular-economy](https://github.com/hwillGIT/boston-circular-economy)                             | Keep new work here                               |
| Assignments               | [PR #8](https://github.com/hwillGIT/boston-circular-economy/pull/8), issues #3 through #7                           | Review and select a contributor                  |
| Application checks        | [PR #10](https://github.com/hwillGIT/boston-circular-economy/pull/10)                                               | Human review and merge                           |
| Tested CI revision        | [Run 33939520216](https://github.com/hwillGIT/boston-circular-economy/actions/runs/33939520216), revision `4a25a6f` | Verify integration CI separately                 |
| Workflow integration      | [Issue #11](https://github.com/hwillGIT/boston-circular-economy/issues/11)                                          | Review the integration and its exact CI revision |
| Main review rule          | One approval and stale-review dismissal observed on September 5, 2026                                               | Retain human review                              |
| Required status checks    | None configured at that observation                                                                                 | Configure after representative checks exist      |
| Pages                     | Not configured at that observation                                                                                  | Select hosting and backend destination           |
| Contributor understanding | No completed pilot demonstration                                                                                    | Observe a contributor explaining their own work  |

The listed CI run covers the application-check repair.
It does not certify this integration or activate a hosted AI reviewer.

## Review and merge

1. Review PR #10 against the fork application.
2. Merge it after the required human approval.
3. Review the workflow integration against the resulting main revision.
4. Check the assignment files against PR #8.
5. Merge accepted integration work after human review.
6. Verify successful CI on the merged main commit.

The integration includes the assignment catalog from PR #8.
Do not merge a second copy without checking the resulting diff.
Retire a redundant review only after its work is present and accepted.

## Verify submission enforcement

Open a small follow-up pull request after the policy exists on main.
Use a committed submission record for that change.

| Check                                             | Expected result                            |
| ------------------------------------------------- | ------------------------------------------ |
| Complete record with a real fork issue            | Submission record succeeds                 |
| Missing required evidence section                 | Submission record fails                    |
| Record unchanged from the base                    | Submission record fails                    |
| Changed pull request description only             | Committed evidence remains authoritative   |
| New commit with missing record content            | The new head does not inherit acceptance   |
| Proposed script contains instructions or commands | Trusted workflow treats the record as data |
| Failed, skipped, or cancelled required CI job     | Quality Gate fails                         |

Use synthetic content for negative checks.
Do not expose credentials or contact contributors during a workflow test.

## Configure the merge rule

An authorized maintainer must require `Quality Gate` and `Submission record` on main.
Select the GitHub Actions source where the settings support that restriction.
Keep the existing one-review requirement and stale-review dismissal.
Require branches to be up to date with main before merging.
Base-policy changes need a branch update and fresh checks.
Do not bypass those rules as an administrator.

Read the settings back after the change.
Verify a failing submission cannot merge.
Verify a successful record and CI result still require human approval.
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
Record the artifact revision, contributor explanation, and reviewer's observation.
Leave acceptance fields empty until the responsible reviewer accepts the work.

## Select and verify hosting

Confirm whether the fork should use Replit or a static frontend with a separate backend.
Specify the public API origin, authentication behavior, configuration, and required secrets.
Use the selected host's documented release procedure.
Verify a successful CI result for the exact release revision.
Run the resident journey and a failure case after deployment.
Record the previous working revision and the recovery steps.

The manual readiness workflow remains non-publishing until this procedure is implemented and tested.
