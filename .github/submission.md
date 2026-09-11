## Outcome

The submission checker accepts the approved technical-summary marker comments in a committed record.
It continues to reject every other HTML comment as a template placeholder.

Issue exception: This compatibility correction has no dedicated issue.

## Evidence and limits

- Evidence: The new test accepts the approved marker comments. The existing record test still passes.
- Why this evidence supports the result: The checker removes only eight exact marker strings before it searches for placeholder comments.
- Conditions and limits: The change does not check the quality of the summary text. The later writing policy owns that rule.
- What could change the decision: A new marker name needs a reviewed checker and test update.

## Decision explanation

- Why this design: A narrow allowlist preserves the existing protection against unfinished template comments.
- Closest alternative: Remove all comments before validation. That would hide unfinished template content.
- Trade-off accepted: The checker must list each approved marker explicitly.
- Revisit when: The writing policy changes its required marker set.

## Code quality

- Trace one example: check_submission.py removes approved markers before it searches for a template placeholder.
- Where to make a likely change: TECHNICAL_SUMMARY_MARKERS owns the accepted comment strings.
- Who owns the rule and state: The submission checker owns comment validation. GitHub owns the published status.
- Failure and recovery: An unknown comment fails validation. Correct the record or add a reviewed marker rule.
- What became simpler or harder: A marker summary can coexist with the old record checks. The allowlist needs maintenance.

## Risk and scope

- Review level: Yellow
- In scope: Submission placeholder validation and its unit tests.
- Out of scope: Writing policy content, application behavior, deployment, and approval rules.
- Rules that must remain true: Unknown HTML comments fail. The trusted workflow reads the record as data.

## What changed

The checker now recognizes the eight marker comments used by the technical-summary format.
The test proves that those comments pass while the existing committed record remains valid.

## Challenge cases

The unit test adds a valid marker summary before a valid record.
The existing placeholder test continues to reject unfinished HTML comments.
The repository record test verifies compatibility with the current main record.

## Evidence

| Check                               | Result       | Evidence or reason not run                                |
| ----------------------------------- | ------------ | --------------------------------------------------------- |
| Client lint and build               | Not affected | The change does not alter client files.                   |
| Server lint and build               | Not affected | The change does not alter server files.                   |
| ETL tests                           | Not affected | The change does not alter ETL files.                      |
| Technical prose and editorial style | Pass         | The checker unit tests pass.                              |
| Manual user journey                 | Not affected | The change does not alter a user journey.                 |
| Accessibility / responsive          | Not affected | The change does not alter application screens.            |
| Security / privacy / recovery       | Pass         | The allowlist retains rejection of unknown HTML comments. |

## AI assistance

- [x] AI assisted with implementation or tests

This record does not establish contributor understanding. Human review must check the explanation against the submitted work.

## Review focus and uncertainty

Review the exact marker list and confirm that it does not permit an unfinished template comment.
The later writing policy will verify summary wording after its own merge.

## Documentation and learning

- [x] No documentation change is needed
