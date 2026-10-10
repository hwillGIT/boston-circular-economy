# Boston Circular Economy: use cases

A set of 15 use cases for the people most likely to use the pilot, ranked by how likely each is to use it. Each use case has a four-scene illustrated story, a journey, edge cases, a success measure, a pilot scope tag and a source label.

This is proposed direction for the team to review. It is not a team decision.

## How to read this

- **Source labels:** "From team doc", "Seen in Figma", "Team Vercel prototype (not Figma)" and "Proposed". Proposed means inferred from the evidence, not named by the team.
- **Scope tags:** "In pilot", "Roadmap, not in pilot" and "Maintainer task".
- **Illustrations:** The scenes are illustrations of fictional people. They are not photos and not real users. They do not show app screens or real brands. A few show the Boston skyline.
- **Ranking:** Likelihood scores are reasoned estimates from 1 to 5. No usage data exists. Change the ranking after the first tests.

## The 6 planned personas

| Group | Use cases | Status |
|---|---|---|
| 3 residents | Denise (Senior), Marisol (Parent), Jason (Student renter) | From team doc. Named in the Drive docs. Denise is also Persona 3 in Figma. |
| 2 service providers | Small repair shop owner, Repair nonprofit organiser | PROPOSED. The team plans 2 but names none. |
| 1 city staff | City reviewer | PROPOSED. The team plans 1 but names none. |

## Ranking

| Rank | Use case | Who | Likelihood (1-5) | Scope | Source |
|---|---|---|---|---|---|
| 1 | [Denise](01-denise.md) | Senior resident. Repair seeker. | 5 | In pilot | From team doc |
| 2 | [Jordan](02-jordan.md) | Commuter with no car. Small-appliance repair. | 5 | In pilot | Team Vercel prototype (not Figma) |
| 3 | [Marisol](03-marisol.md) | Parent. Gets and gives in one trip. | 4 | In pilot | From team doc |
| 4 | [Jason](04-jason.md) | Student renter. Finds used goods. | 4 | In pilot | From team doc |
| 5 | [Resident who does not know what to search](05-browser.md) | Browser. Has an item but no word for it. | 3 | In pilot | Proposed |
| 6 | [Mender or clothes donor](06-mender-or-clothes-donor.md) | Has an old shirt. Mend, swap or donate. | 3 | In pilot | Team Vercel prototype (not Figma) |
| 7 | [Give-away donor](07-give-away-donor.md) | Has usable goods to pass on. | 3 | In pilot | Proposed |
| 8 | [Community helper](08-community-helper.md) | Helps a resident use the app (for example library staff, a neighbour, a relative). | 3 | In pilot | Proposed |
| 9 | [Recycler](09-recycler.md) | Wants to recycle an item correctly. | 2 | Roadmap, not in pilot | Seen in Figma |
| 10 | [Event attendee](10-event-attendee.md) | Wants a repair clinic or event. | 2 | Roadmap, not in pilot | Seen in Figma |
| 11 | [Community joiner](11-community-joiner.md) | Wants to join or help the movement. | 2 | Roadmap, not in pilot | Seen in Figma |
| 12 | [Small repair shop owner](12-small-repair-shop-owner.md) | Wants to be listed. Provider persona 1. | 2 | Maintainer task | Proposed |
| 13 | [Repair nonprofit organiser](13-repair-nonprofit-organiser.md) | Runs clinics or a donation site. Provider persona 2. | 2 | Maintainer task | Proposed |
| 14 | [City reviewer](14-city-reviewer.md) | Circular Economy administrator. Checks what the public sees. City persona. | 2 | Maintainer task | Proposed |
| 15 | [Data steward](15-data-steward.md) | Volunteer maintainer of the catalog. | 2 | Maintainer task | Proposed |

## Test scenarios for the next stage (proposed)

Denise, Jordan, Marisol, Jason, the Browser and the Give-away donor. They are the six most likely users and all are in the pilot.

## Open decisions (proposed direction)

1. Keep the 3 proposed keepers (shop owner, nonprofit organiser, City reviewer) as the provider and City personas? Proposed: yes. Rename them when the team names its own.
2. Is Spanish text in the pilot (Marisol)? Proposed: no for the pilot. Write plain English now so it can be translated later. Keep Spanish as a named roadmap item.
3. Recycle: link-only roadmap card, or hide it? Proposed: link-only to a City source. It is a Figma card, so people will tap it.
4. Join: keep as a contact link, or drop the card? Proposed: a contact link with no sign-up. Drop it if no one owns the inbox.
5. Events: link to the host page only, or show none? Proposed: link only. No dates, no register, no calendar in the pilot.
6. Provider corrections (shop owner, nonprofit organiser): outside form plus maintainer review? Proposed: yes. It keeps accounts out of the pilot.
7. Who is the City reviewer and who owns the contact inbox? Open. A real owner is not named yet.
8. Add a print-friendly result page for helpers (community helper)? Proposed: yes. It is small and helps seniors most.
9. Which 6 use cases become the test scenarios for the next stage? Proposed: Denise, Jordan, Marisol, Jason, Browser and Give-away donor. They are the six most likely users and all are in the pilot.

Item 7 is open. The City reviewer and contact inbox owner is a role placeholder: Circular Economy administrator. No real person is named and nothing is confirmed with the team.

## Review of gaps and risks

### Users added during review

- Community helper: a library worker or relative who runs the app for a senior. No team doc names this user, but the senior and Spanish-language personas imply one.
- Data steward: the person who keeps the catalog true. Without this user the app decays.
- Browser: a visitor with no word for the item. A way in, shown as a user so it gets tested.

### Users still missing, not built here

- Volunteer coach at a Fixit Clinic. Figma matches residents to coaches. Roadmap, needs sign-up.
- Other City teams (311, Zero Waste office) who may link to the app. No source says how.
- Local groups such as Buy Nothing admins who might share the link. Reach, not a flow.
- Residents who use a screen reader. Not a persona, but a test group for every journey.
- Researchers or press who ask for data. Not in the pilot. Defer.

### Conflicts with pilot scope

- Provider self-listing first read as "log in and edit". That breaks the no-accounts rule. Fixed: corrections go by an outside form to a maintainer, who edits the reviewed catalog.
- Event register and Add to calendar  store personal data and imply booking. Fixed: tagged Roadmap. The pilot links to the host page only.
- Saved lists, reminders, impact totals and the share card (Denise, Jason, event attendee) need stored data. Fixed: tagged Roadmap. The page address is the saved search.
- First draft success measures counted clicks and visits. That needs analytics, which the pilot excludes. Fixed: every measure is a small task test or a manual check.
- Walk time and T access (Jordan) need route data. Fixed: pilot shows distance and a directions link in the person's own map app.
- Device location is not used. Every journey starts from a zip code or place name.
- Recycle is not a pilot Activity. Pilot Activities are Repair, Give away and Find used. Fixed: Recycle is link-only roadmap.

### Accounts and booking creep, checked step by step

- No journey step needs an account. Where a source needs one, the step is tagged Roadmap and has a no-account fallback.
- No journey books anything. "Confirm this option" in Flow B of the Vercel prototype and "Register now" in Figma are marked Roadmap.
- Provider and City journeys never use a login in the pilot. They use a form, a review and a build.

### Known weak spots

- The Figma persona and journey pages were not reachable when this was written. The three residents come from the older Drive docs. The persona facts may have changed.
- Likelihood scores are reasoned estimates, not data. No usage numbers exist. The ranking should change after the first tests.
- Provider and City personas are guesses from team docs and Figma notes. A real shop owner and a real City reviewer have not been asked.
- Details were not read for Sam Patel and Alex Morgan, the deferred personas in the MVP doc.
