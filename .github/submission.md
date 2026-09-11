<!-- technical-summary:start -->

## Plain-English Technical Summary

<!-- technical-risk:start -->

The copied renderer and interactive pages can add 179,000 lines to a review pull request.
<!-- technical-risk:end -->
<!-- technical-fix:start -->

CI checks out the pinned renderer and generates interactive pages as artifacts
<!-- technical-fix:end -->
<!-- technical-state:start -->

while the repository keeps two review images and the JSON sources.
<!-- technical-state:end -->

**Key Concepts Explained**

* **"Pinned renderer":** CI checks out one fixed source revision before it creates diagram review pages.
* **"Review image":** A checked PNG lets reviewers inspect each diagram from the pull request file list.
* **"Build artifact":** CI uploads the interactive page for detailed review without storing the page in Git.

<!-- technical-summary:end -->

## Outcome

The review team can inspect Archify diagrams without reviewing 179,000 vendored and generated lines.
CI renders interactive pages from a pinned source revision and uploads them with the job.

Issue exception: This CI and documentation change has no dedicated issue.

## Evidence and limits

- Evidence: The pinned renderer validates both JSON sources with nine checks. Both browser captures pass.
- Why this evidence supports the result: The renderer confirms valid sources and produces the pages used for the review images.
- Conditions and limits: The source hash records the image source revision. It does not prove that the PNG pixels match the page.
- What could change the decision: A renderer change, failed diagram check, or misleading review image requires a revised artifact.

## Decision explanation

- Why this design: CI uses a fixed renderer revision. The repository keeps concise sources and images for review.
- Closest alternative: Commit the renderer and interactive HTML pages. That supports local viewing but makes ordinary review impractical.
- Trade-off accepted: Reviewers use the CI artifact for interactive controls. The checked PNG shows a static capture.
- Revisit when: A maintained diagram tool produces compact, deterministic review artifacts with the same source checks.

## Code quality

- Trace one example: `check_archify_diagrams.mjs` reads a manifest, validates the JSON, creates HTML, and checks the corresponding review image.
- Where to make a likely change: `docs/diagrams/manifest.json` owns diagram paths, source hashes, and renderer revision.
- Who owns the rule and state: The workflow runs the renderer. The manifest owns each diagram record.
- Failure and recovery: A changed source hash fails the check. Refresh the PNG and update the manifest hash.
- What became simpler or harder: Git review is smaller. A diagram refresh requires a browser capture.

## Risk and scope

- Review level: Yellow
- In scope: Archify sources, review images, diagram checks, CI artifacts, documentation, and writing policy.
- Out of scope: Application behavior, deployment, hosted AI review, backend calls, and Slack messages.
- Rules that must remain true: CI uses read-only repository access. Team approval remains separate from automated checks.

## What changed

- CI checks out `tt-a1i/archify` at a fixed commit.
- The diagram checker renders ignored HTML files and checks JSON source hashes for static PNG images.
- The summary workflow checks new and edited pull request descriptions from the trusted base.
- The repository contains two JSON sources and two compact PNG review images.
- The workflow uploads interactive pages and an architecture comparison artifact.
- The project contains the timeless technical prose skill and uses it for documentation and submission summaries.

## Challenge cases

The check validates the external renderer path and the manifest revision before it creates a page.
The browser captures show the full diagram at four viewport sizes.

- Normal case: Both diagrams pass nine Archify checks with no warnings.
- Boundary case: The checker rejects a PNG smaller than 640 by 400 pixels.
- Failure case: The checker rejects a source hash that does not match its review image record.
- Regression case: The architecture comparison artifact still renders when the base source exists.

## Evidence

| Check                               | Result       | Evidence or reason not run                                                                   |
| ----------------------------------- | ------------ | -------------------------------------------------------------------------------------------- |
| Client lint and build               | Not affected | The change does not alter client source files.                                               |
| Server lint and build               | Not affected | The change does not alter server source files.                                               |
| ETL tests                           | Not affected | The change does not alter ETL source files.                                                  |
| Technical prose and editorial style | Pass         | The delivery prose check and the technical summary check pass.                               |
| Manual user journey                 | Not affected | The change does not alter a product journey.                                                 |
| Accessibility / responsive          | Not affected | The change does not alter application screens.                                               |
| Security / privacy / recovery       | Pass         | CI uses `contents: read` and an exact Archify commit. The job uploads review artifacts only. |

## AI assistance

- [x] AI assisted with exploration or planning
- [x] AI assisted with implementation or tests
- [x] AI assisted with review or challenge

This record does not establish contributor understanding. The review team must check the explanation against the submitted work.

## Review focus and uncertainty

Review the external checkout path, fixed renderer revision, JSON source hashes, and static image quality.
The browser check supports layout claims but does not replace team inspection of the diagram meaning.

## Documentation and learning

- [x] I updated the relevant README, `AGENTS.md`, decision record, or runbook
