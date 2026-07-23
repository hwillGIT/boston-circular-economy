# Engineering Stances

Where the software canon disagrees with itself, this file records which side **this team** takes
and why. Reviews (human and AI) cite these stances instead of presenting contested advice as
settled law. Each stance names the debate, our position, and where it already shows in our code.
Disagree? Open a PR against this file — that *is* the process.

## 1. Function and module size: depth over tininess

**The debate:** *Clean Code* (Martin) argues functions should be very small and extracted
aggressively. *A Philosophy of Software Design* (Ousterhout) argues the opposite risk is worse —
lots of shallow functions increase the surface a reader must hold in their head; modules should be
**deep** (simple interface, substantial implementation).

**Our side: Ousterhout.** Optimize for the *reader's* cognitive load, not for line counts. Extract
a function when it removes a real burden (a name that teaches, reuse, testability) — not to hit a
size dogma. A 30-line function a volunteer reads top-to-bottom beats six 5-line hops.

**In our code:** `query_job.py` keeps `run_job()` as one readable loop instead of scattering it;
the ETL base classes expose one-method interfaces (`fetch`, `normalize`, `ingest`) hiding real
work — deep modules.

## 2. Composition and injected strategies over inheritance

**The debate:** classic OO leans on inheritance hierarchies; the GoF's own first principle
("favor object composition over class inheritance") and most modern practice lean away.

**Our side: composition.** Swappable behavior is injected (Strategy), not subclassed, whenever the
behavior must vary independently or be tested in isolation. Inheritance is fine for the shallow
Template-Method base classes we already have (`BaseQuerier` etc.) — one level, no deep trees.

**In our code:** the merge processor design takes `Matcher` and `Prioritizer` as injected
Protocols precisely because matching rules (#30/#31) will be swapped and unit-tested; `run_job`
receives its pipelines and ingester as arguments.

## 3. Patterns are vocabulary, not targets

**The debate:** GoF patterns as essential design vocabulary vs. Java-era ceremony to be avoided.

**Our side: vocabulary.** We *name* a pattern when the code already wants that shape (it teaches
and compresses communication — see `design-patterns.md`); we never add a pattern to seem
well-designed. "You aren't gonna need it" outranks pattern completeness at our scale.

## 4. A little duplication beats the wrong abstraction

**The debate:** DRY absolutism vs. Sandi Metz's "duplication is far cheaper than the wrong
abstraction."

**Our side: Metz.** Tolerate small, obvious duplication until the *third* occurrence reveals the
true shape. Premature shared abstractions couple pipelines that should evolve independently —
each source's Normalizer may repeat a little rather than share a clever helper that fits nobody.

## 5. Comments explain what code cannot

**The debate:** "good code is self-documenting" purism vs. Ousterhout's view that comments carry
the information code can't express (why, invariants, units, non-obvious context).

**Our side: comments for the why.** Names carry the *what*; comments and docstrings carry intent,
constraints, and why-not ("null does not mean the business closed"). A module docstring that
explains design choices (as in `query_job.py`) is required reading-material, not noise.

## 6. Tests verify behavior, not implementation

**The debate:** mockist (interaction-testing) vs. classical (state/behavior) schools; coverage
percentage as a goal vs. as a byproduct.

**Our side: classical, behavior-first (Khorikov).** A test should fail only when *behavior* is
wrong, not when internals are refactored. Prefer real objects and fakes at boundaries over mock
verification of call sequences. Edge and failure paths (empty, null, malformed, boundary) count
more than the happy path; coverage numbers are never the target.

**In our code:** the falsify recipe exists because agent-written tests tend to validate their own
logic; `run_job`'s design (dependencies injected) exists so tests need no network and no key.

## 7. Boring, explicit, and few dependencies

**The debate:** rich frameworks and clever metaprogramming vs. minimal, explicit code.

**Our side: boring wins.** Rotating volunteers must be able to read everything. Prefer the
standard library, explicit wiring (a `build_default_pipelines()` list) over DI frameworks or
magic registration, and adding a dependency is a Red-lane change that must justify itself
(maintenance, licensing, supply-chain risk — see the review checklist).

## 8. Fail loudly at boundaries; isolate failures in batch work

**The debate:** defensive programming everywhere vs. crash-early.

**Our side: both, placed correctly.** Validate and fail loudly at system boundaries (pydantic at
the DTO boundary; a missing API key raises immediately). Inside batch orchestration, isolate one
unit's failure so the rest proceeds — one flaky source is logged and skipped, and the exit code
reports partial failure (`run_job`). Never swallow errors silently; never let one source kill the
nightly run.

---

*Sources these stances draw on: Ousterhout, "A Philosophy of Software Design"; Gamma et al.,
"Design Patterns"; Metz, "The Wrong Abstraction"; Fowler, "Refactoring"; Khorikov, "Unit
Testing: Principles, Practices, and Patterns"; see [reading-list.md](reading-list.md).*
