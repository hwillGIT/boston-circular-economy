# Team Reading List

The further-reading layer of the code review process: when a review finding touches a topic one
of these books illuminates, the finding points here ("Further reading: Fowler, *Refactoring*,
ch. 3"). The goal is education — the review comment teaches the concept; the book teaches the
depth.

## How to get the books (mostly free)

- **Team shelf** — members lend personal copies at Tuesday Hack Nights. Add your name to the
  "team copy" column below if you're willing to lend one. (Lending physical books around is
  simple and legal; please don't share e-book files — licenses are personal.)
- **Boston Public Library** — a BPL card gives free access to the **O'Reilly Learning**
  platform (https://www.bpl.org/resource/oreilly/), which carries most titles below
  (O'Reilly, Addison-Wesley/Pearson, and Manning publishers). Massachusetts residents can get
  a BPL eCard online. Physical copies of most titles are also in the BPL catalog.
- **Free online, legally** — several core references are free on the web (marked below).

## The list

| Book | Backs (in our process) | Access | Notes |
|------|------------------------|--------|-------|
| Ousterhout, *A Philosophy of Software Design* (2nd ed.) | Architecture & maintainability lenses; "right-sized" check | Buy / team shelf; his Google talks are free on YouTube | The modern core design text; deep modules, complexity |
| Gamma et al., *Design Patterns* (GoF) | `design-patterns.md` vocabulary; architecture lens | BPL O'Reilly | Read as vocabulary; examples are dated — pair with refactoring.guru (free) |
| Fowler, *Refactoring* (2nd ed.) | Refactoring lens — the smell catalog our reviews cite | BPL O'Reilly; catalog summaries free at martinfowler.com | 2nd-ed. examples are **JavaScript** — matches our client/server |
| McConnell, *Code Complete 2* | Construction fundamentals; checklist items 5–9 | BPL O'Reilly | Encyclopedic; dip in by chapter |
| Feathers, *Working Effectively with Legacy Code* | Testability lens; seams & characterization tests | BPL O'Reilly | Best when we start refactoring inherited pipeline code |
| Kleppmann, *Designing Data-Intensive Applications* | ETL/merge/dedup work; data-integrity lens | BPL O'Reilly | The single most relevant book to our data layer |
| Khorikov, *Unit Testing: Principles, Practices, and Patterns* | Test-honesty lens; falsify recipe | BPL O'Reilly (Manning) | Literally the "tests that prove something" material |
| Hermans, *The Programmer's Brain* | The educational output contract itself | BPL O'Reilly (Manning) | The cognitive-load science behind "educate, don't overload" |
| Khononov, *Learning Domain-Driven Design* | Domain-fit lens; our Normalizer-as-translator boundary | BPL O'Reilly | Accessible DDD entry; Evans' original for the ambitious |
| Boswell & Foucher, *The Art of Readable Code* | Naming/clarity guidance | BPL O'Reilly | Recommended over *Clean Code* for the same goal |
| Martin, *Clean Code* | Historical context | BPL O'Reilly | **Contested** — its tiny-functions dogma conflicts with Ousterhout; see the stances file for our position |
| Winters et al., *Software Engineering at Google* | Review-as-education culture; learning loop | **Free online** (abseil.io/resources/swe-book) | The review-culture chapters are the best anywhere |

Also free and citable in reviews: refactoring.guru (patterns + smells), martinfowler.com
(catalogs & bliki), Google's eng-practices review guide (github.com/google/eng-practices).

## How reviews use this

- Findings cite **our docs first** (`design-patterns.md`, ADRs), then the canon — book +
  chapter/concept, with a "Further reading" line pointing here.
- Where authorities conflict (they do), the review says so; the team's side lives in
  `docs/engineering-stances.md` (proposed), not in any single book.
- If a book keeps illuminating the same recurring finding, that's the learning loop's cue: add a
  one-line rule to `AGENTS.md` citing it, so the lesson moves upstream.
