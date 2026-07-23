# Team Reading List

The further-reading layer of the code review process: when a review finding touches a topic one
of these books illuminates, the finding points here ("Further reading: Fowler, *Refactoring*,
ch. 3"). The goal is education — the review comment teaches the concept; the book teaches the
depth.

## How to get the books (mostly free)

**Onboarding step: get a BPL card.** Every team member is asked to sign up for a Boston Public
Library card as part of joining — it's free, takes minutes, and unlocks this entire list
digitally. Register at https://www.bpl.org/ecard/ (eCard: anyone who lives, attends school,
owns property, or works in Massachusetts; covers **all online resources including O'Reilly
Learning**). Upgrade to a physical card at any BPL branch (photo ID + MA address) if you also
want to borrow print copies. Members outside Massachusetts use the free-online tier below.

- **Boston Public Library** — the card gives free access to the **O'Reilly Learning** platform
  (https://www.bpl.org/resource/oreilly/), which carries most titles below (O'Reilly,
  Addison-Wesley/Pearson, and Manning publishers). Physical copies are in the BPL catalog —
  per-title links in the table.
- **Team shelf** — members lend personal copies at Tuesday Hack Nights. Add your name to the
  "team copy" column below if you're willing to lend one. (Lending physical books around is
  simple and legal; please don't share e-book files — licenses are personal.)
- **Free online, legally** — several core references are free on the web (marked below).

## The list

Links go to the BPL catalog search (stable) and the O'Reilly platform search (sign in with your
BPL card via the resource page, or your own subscription).

| Book | Backs (in our process) | Access | Notes |
|------|------------------------|--------|-------|
| Ousterhout, *A Philosophy of Software Design* (2nd ed.) | Architecture & maintainability lenses; "right-sized" check | [BPL](https://bpl.bibliocommons.com/v2/search?query=philosophy%20of%20software%20design%20ousterhout&searchType=smart) / team shelf; his Google talk is free on YouTube | The modern core design text; self-published, so not on O'Reilly |
| Gamma et al., *Design Patterns* (GoF) | `design-patterns.md` vocabulary; architecture lens | [BPL](https://bpl.bibliocommons.com/v2/search?query=design%20patterns%20gamma%20reusable%20object-oriented&searchType=smart) · [O'Reilly](https://learning.oreilly.com/search/?q=design%20patterns%20gamma) | Read as vocabulary; examples are dated — pair with refactoring.guru (free) |
| Fowler, *Refactoring* (2nd ed.) | Refactoring lens — the smell catalog our reviews cite | [BPL](https://bpl.bibliocommons.com/v2/search?query=refactoring%20fowler&searchType=smart) · [O'Reilly](https://learning.oreilly.com/search/?q=refactoring%20fowler) · free catalog at martinfowler.com | 2nd-ed. examples are **JavaScript** — matches our client/server |
| McConnell, *Code Complete 2* | Construction fundamentals; checklist items 5–9 | [BPL](https://bpl.bibliocommons.com/v2/search?query=code%20complete%20mcconnell&searchType=smart) · [O'Reilly](https://learning.oreilly.com/search/?q=code%20complete%20mcconnell) | Encyclopedic; dip in by chapter |
| Feathers, *Working Effectively with Legacy Code* | Testability lens; seams & characterization tests | [BPL](https://bpl.bibliocommons.com/v2/search?query=working%20effectively%20with%20legacy%20code%20feathers&searchType=smart) · [O'Reilly](https://learning.oreilly.com/search/?q=working%20effectively%20with%20legacy%20code) | Best when we start refactoring inherited pipeline code |
| Kleppmann, *Designing Data-Intensive Applications* | ETL/merge/dedup work; data-integrity lens | [BPL](https://bpl.bibliocommons.com/v2/search?query=designing%20data-intensive%20applications%20kleppmann&searchType=smart) · [O'Reilly](https://learning.oreilly.com/search/?q=designing%20data-intensive%20applications) | The single most relevant book to our data layer |
| Khorikov, *Unit Testing: Principles, Practices, and Patterns* | Test-honesty lens; falsify recipe | [BPL](https://bpl.bibliocommons.com/v2/search?query=unit%20testing%20principles%20practices%20patterns%20khorikov&searchType=smart) · [O'Reilly](https://learning.oreilly.com/search/?q=unit%20testing%20khorikov) | Literally the "tests that prove something" material |
| Hermans, *The Programmer's Brain* | The educational output contract itself | [BPL](https://bpl.bibliocommons.com/v2/search?query=programmer%27s%20brain%20hermans&searchType=smart) · [O'Reilly](https://learning.oreilly.com/search/?q=programmer%27s%20brain%20hermans) | The cognitive-load science behind "educate, don't overload" |
| Khononov, *Learning Domain-Driven Design* | Domain-fit lens; our Normalizer-as-translator boundary | [BPL](https://bpl.bibliocommons.com/v2/search?query=learning%20domain-driven%20design%20khononov&searchType=smart) · [O'Reilly](https://learning.oreilly.com/search/?q=learning%20domain-driven%20design%20khononov) | Accessible DDD entry; Evans' original for the ambitious |
| Boswell & Foucher, *The Art of Readable Code* | Naming/clarity guidance | [BPL](https://bpl.bibliocommons.com/v2/search?query=art%20of%20readable%20code%20boswell&searchType=smart) · [O'Reilly](https://learning.oreilly.com/search/?q=art%20of%20readable%20code) | Recommended over *Clean Code* for the same goal |
| Martin, *Clean Code* | Historical context | [BPL](https://bpl.bibliocommons.com/v2/search?query=clean%20code%20martin%20handbook&searchType=smart) · [O'Reilly](https://learning.oreilly.com/search/?q=clean%20code%20martin) | **Contested** — its tiny-functions dogma conflicts with Ousterhout; see the stances file for our position |
| Winters et al., *Software Engineering at Google* | Review-as-education culture; learning loop | **[Free online](https://abseil.io/resources/swe-book)** · [O'Reilly](https://learning.oreilly.com/search/?q=software%20engineering%20at%20google) | The review-culture chapters are the best anywhere |

Also free and citable in reviews: refactoring.guru (patterns + smells), martinfowler.com
(catalogs & bliki), Google's eng-practices review guide (github.com/google/eng-practices).

## How reviews use this

- Findings cite **our docs first** (`design-patterns.md`, ADRs), then the canon — book +
  chapter/concept, with a "Further reading" line pointing here.
- Where authorities conflict (they do), the review says so; the team's side lives in
  [`docs/engineering-stances.md`](engineering-stances.md), not in any single book.
- If a book keeps illuminating the same recurring finding, that's the learning loop's cue: add a
  one-line rule to `AGENTS.md` citing it, so the lesson moves upstream.
