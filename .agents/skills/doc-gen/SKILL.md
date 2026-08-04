---
name: doc-gen
description: >
  Generate missing code documentation (docstrings, JSDoc, godoc comments)
  for a specified directory or file. Validates output against the project's
  linting rules. Use when asked to "document", "add docstrings",
  "generate JSDoc", or "improve documentation coverage".
---

## Workflow

1. **Detect** the primary language of the target path.
2. **Audit** — identify all public symbols without documentation.
3. **Read** each symbol's implementation to understand behaviour.
   Never document based on the function name alone.
4. **Write** documentation following the project's standards:
   - Python: Google-style docstrings (PEP 257). Args, Returns, Raises.
     Type annotations in signatures, not docstrings.
   - TypeScript: JSDoc with `@param`, `@returns`, `@throws`, `@example`.
     Preserve existing TSDoc. Add `@see` cross-references.
   - Go: Package-level doc comments on every exported symbol.
     First sentence is the symbol summary. No @param tags — use prose.
5. **Validate** with the appropriate linter:
   - Python: `pydocstyle --convention=google`
   - TypeScript: `npx eslint --rule 'jsdoc/require-jsdoc: error'`
   - Go: `go vet ./...`
6. **Fix** any linter violations and re-run until clean.
7. **Report**: files modified, symbols documented, linter status.

## Rules

- **Never overwrite** existing documentation. Only add missing docstrings.
- Every generated docstring must reference the function's **actual behaviour**,
  not its name. Read the implementation before writing.
- Include one `@example` or doctest per public function where feasible.
- Document **what and why**, not how. Internal implementation details
  in docstrings couple documentation to code structure.
- Use `@category` tags for TypeDoc grouping:
  - `@category Auth` — authentication and session management
  - `@category Database` — schema, migrations, queries
  - `@category Routes` — Express route handlers
  - `@category Client` — React components and hooks
  - `@category Types` — interfaces, enums, type aliases

## Parameters

- `target`: File or directory path (default: `src/`)
- `style`: Documentation style override (default: from DOCUMENTATION_STANDARDS.md)
- `dry-run`: If true, report gaps without modifying files

## Anti-Patterns

- **"Document everything" trap**: Scope to changed files, new modules,
  or public API surfaces. Don't blanket-pass a whole codebase with noise.
- **Trust without validation**: Always run the documentation linter after
  generation. Edge cases (complex generics, overloads) can produce
  malformed JSDoc or incorrect type references.
- **Documenting implementation details**: Docstrings describe behaviour
  and contracts, not internal algorithms.
- **Skipping the audit**: Without a baseline, you can't measure improvement.
