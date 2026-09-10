# Documentation Standards

## Docstring Rules

These standards are enforced by CI and must be followed for all code changes.

### TypeScript (JSDoc)

Use JSDoc with `@param`, `@returns`, `@throws`, `@example` tags.
Preserve existing TSDoc comments. Add `@see` cross-references where relevant.

````typescript
/**
 * Hashes a plaintext password using scrypt with a random 16-byte salt.
 * The output format is `salt:hash` where both are hex-encoded.
 *
 * @param password - The plaintext password to hash
 * @returns A string in `salt:hash` format suitable for database storage
 * @throws {Error} If the password is empty or exceeds 128 characters
 *
 * @example
 * ```ts
 * const hashed = hashPassword('s3cure!');
 * // => "a1b2c3...:d4e5f6..."
 * const isValid = verifyPassword('s3cure!', hashed);
 * // => true
 * ```
 *
 * @see {@link verifyPassword} for validation
 * @see {@link generateToken} for session token creation
 */
export function hashPassword(password: string): string { ... }
````

### Python (Google-style, PEP 257)

Use type annotations in signatures, not in docstrings.

```python
def merge_locations(
    primary: list[Location],
    secondary: list[Location],
    *,
    threshold_meters: float = 50.0,
) -> list[MergedLocation]:
    """Merge two location datasets using geospatial proximity matching.

    Matches locations from the secondary source to primary locations
    within the given distance threshold. Unmatched secondary locations
    are appended as new entries.

    Args:
        primary: Canonical location records (e.g., from city database).
        secondary: Supplementary records to merge in.
        threshold_meters: Maximum distance for a match. Defaults to 50m.

    Returns:
        Deduplicated list of merged locations with provenance metadata.

    Raises:
        ValueError: If either input list is empty.

    Example:
        >>> merged = merge_locations(city_locs, osm_locs, threshold_meters=30)
        >>> len(merged) <= len(city_locs) + len(osm_locs)
        True
    """
```

### Rules

1. **Never overwrite existing documentation.** Only add missing docstrings.
2. **Every docstring must reference actual behaviour**, not just the function name.
   Read the implementation before writing.
3. **Include one `@example` or doctest per public function** where feasible.
4. **Add `@see` cross-references** to related functions and types.
5. **Document edge cases** in the description (empty inputs, null returns, etc.).
6. **Use `@category`** tags to organize TypeDoc output:
   - `@category Auth` — authentication and session management
   - `@category Database` — schema, migrations, queries
   - `@category Routes` — Express route handlers
   - `@category Client` — React components and hooks
   - `@category Types` — interfaces, enums, type aliases

### CI Enforcement

The `docs` job runs these checks:

1. `npm run docs:audit` validates the public functions and methods reached from `typedoc.json` entry points.
2. Missing documentation and invalid local links fail the audit.
3. `npm run docs:generate` writes the API reference to `docs/api/`.
4. CI uploads the reference as an artifact for the reviewed revision.

The audit uses TypeDoc. The repository does not configure an ESLint JSDoc plugin.
The Python docstring audit remains advisory. Its result appears in the CI summary.
Read [CI checks](./CI_CHECKS.md) for the setup commands and check limits.
