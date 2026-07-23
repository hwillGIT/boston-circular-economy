# Recipe: Red Team

For Red-lane PRs only: secrets/keys, data-write paths, deploy/CI configuration, new
dependencies. Your only job: **break this change.** Think like an attacker and like entropy.
Scope is the narrow Red surface — this project has no auth, payments, or PII yet.

## Attack surfaces (this project, specifically)

1. **Secrets** — could the Google API key (or any token) end up in code, logs, error messages,
   test fixtures, committed datasets, or CI output? Does any change widen where secrets flow?
2. **Dependencies** — for each new/updated package: does it exist under exactly this name on the
   canonical registry (typo/slopsquatting)? Maintained? License compatible? Install scripts?
   Pin/lockfile updated consistently?
3. **Deploy/CI** — could this change ship something broken or unintended to the public site
   (main auto-deploys)? Does any workflow change weaken a gate, expose a secret in logs, or
   run untrusted code (e.g. on pull_request_target)?
4. **Data integrity** — can this path corrupt or silently lose the dataset? Re-run safety
   (idempotency), partial-write on crash, the null-does-not-mean-closed patching rule, dedup
   key collisions, concurrent runs clobbering the local store.
5. **Input trust** — external API responses are untrusted input: oversized payloads, unexpected
   types, injection into anything later interpreted (SQL, HTML, shell, logs).

## Method

For each surface: state the attack, attempt it concretely against the actual diff (trace the
code path; write a small proof-of-concept test or command where possible), and record the
outcome: **Breaks** (with reproduction), **Survives** (say what defended it), or **Can't assess**
(say what's missing). No theoretical risks without a plausible path in *this* codebase.

## Output

One comment: verdict line, then only **Breaks** findings (max 5, educational contract: what →
why it's exploitable/corrupting → the fix → further reading), one line acknowledging the
strongest defense you failed to break, and a `<details>` appendix listing attacks attempted with
outcomes — the attempt log is the audit trail. Advisory only; a human (plus the second Red-lane
reviewer) decides.
