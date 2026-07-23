# Proposals

This directory holds **proposed** processes and practices for the Boston Circular Economy
project — ideas a contributor has written up for team discussion, **not** adopted policy.
Nothing in here is binding until the team agrees to it (typically at a Tuesday Hack Night or
in #Circular-Economy on Slack).

## Why a proposals directory

We're a volunteer team with rotating contributors. Process changes work here only when the
team has actually talked them through — so proposals live in this folder, get discussed, get
edited, and only then "graduate." This mirrors how we treat code: prototype in `dev/`, discuss,
then promote (see `CONTRIBUTING.md`).

## Lifecycle

1. **Propose** — add a Markdown doc here via a normal pull request, with a `Status: Proposed`
   line at the top. Announce it in Slack / bring it to a Hack Night.
2. **Discuss** — comments on the PR, in Slack, or at a Hack Night. Edit the doc as the
   discussion evolves.
3. **Decide** — if adopted, move the relevant content to its real home (`CONTRIBUTING.md`,
   `.github/`, CI workflows, an ADR) and either delete the proposal or mark it
   `Status: Adopted (superseded by …)`. If declined, mark it `Status: Declined` with a short
   note on why — the reasoning is worth keeping.

## Current proposals

| Proposal | Status | Summary |
|----------|--------|---------|
| [code-review-process.md](code-review-process.md) | Proposed | A review process for pull requests, focused on AI-agent-written code: CI pre-screen, an advisory AI reviewer, risk-lane human review, and an agent-code checklist. |
