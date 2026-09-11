## Outcome

Collaborators can find public professional contact routes for the people who
created the source report and represented its MassDEP client.
The directory identifies the report as a Tufts field project and links each
route to its public source.

Issue exception: This requested collaborator directory has no dedicated issue.

## Evidence and limits

- Evidence: The directory uses the Tufts archive, employer pages, and agency pages that publish the listed roles or contact routes.
- Why this evidence supports the result: Each row links to the page that establishes the person, role, or professional route.
- Conditions and limits: A public address can become invalid after a job change. The directory does not establish willingness to collaborate.
- What could change the decision: A contact correction from the named person or organization requires an update.

## Decision explanation

- Why this design: A small sourced directory gives collaborators a clear starting point without copying personal information into the repository.
- Closest alternative: A list of names without contact routes is shorter. It would require each reader to repeat the same research.
- Trade-off accepted: Some rows use an organization route because no individual professional address was published.
- Revisit when: A source changes, a person requests removal, or the project adds an approved outreach owner.

## Code quality

- Trace one example: A maintainer selects a contact route, opens its source, and confirms the listed organization before outreach.
- Where to make a likely change: `docs/interested-collaborators.md` owns the directory rows and source links.
- Who owns the rule and state: The document owns its wording. The listed organizations own their public contact information.
- Failure and recovery: A stale route can misdirect outreach. Replace it only after a public professional source confirms the correction.
- What became simpler or harder: The directory makes the report's contributors easier to find. It requires periodic source checks.

## Risk and scope

- Review level: Yellow
- In scope: A source-linked collaborator directory and a documentation index link.
- Out of scope: Outreach, invitations, personal contact details, and changes to product behavior.
- Rules that must remain true: Each listed route is public and professional. No address is guessed from a naming pattern.

## What changed

- Added a source-linked directory for the five field-project authors and the two MassDEP project partners.
- Added a note that the archived report is a Tufts University field project, not a UMass project.
- Linked the directory from the documentation index.

## Challenge cases

The research found current roles that differ from the 2021 report. The directory
therefore labels public routes as routes rather than proof of current project
participation. It also uses organization contacts when no individual address was
published.

## Evidence

| Check                               | Result       | Evidence or reason not run                                                                |
| ----------------------------------- | ------------ | ----------------------------------------------------------------------------------------- |
| Client lint and build               | Not affected | The change does not alter client files.                                                   |
| Server lint and build               | Not affected | The change does not alter server files.                                                   |
| ETL tests                           | Not affected | The change does not alter ETL files.                                                      |
| Technical prose and editorial style | Pass         | The technical prose and formatting checks pass for both changed documents.                |
| Manual user journey                 | Not affected | The change does not alter an application flow.                                            |
| Accessibility / responsive          | Not affected | The change does not alter a screen.                                                       |
| Security / privacy / recovery       | Pass         | The directory excludes personal addresses, private phone numbers, and inferred addresses. |

## AI assistance

- [x] AI assisted with exploration or planning
- [x] AI assisted with implementation or tests
- [x] AI assisted with review or challenge

This record does not establish contributor understanding. Human review must check the explanation against the submitted work.

## Review focus and uncertainty

Confirm that each source supports the listed route and that the directory does
not expose personal contact information. Confirm that the Tufts affiliation
correction is clear.

## Documentation and learning

- [x] I updated the relevant README, `AGENTS.md`, decision record, or runbook
