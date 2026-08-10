---
name: Auth wiring intentionally deferred
description: The login UI is mock-only by user decision; real client-server auth integration is deferred.
---

The client's sign-in UI (useAuthForm/auth.tsx) creates a browser-only mock user and does NOT call the real server auth API, while `/api/v1/activities` requires a real bearer session. The user explicitly cancelled the task to wire real auth (Aug 2026) and said it is **intentionally deferred to later**.

**Why:** user decision — auth is "on hold until later"; the app is a prototype and activity logging via UI is accepted as non-functional for now.

**How to apply:** do not re-propose wiring real auth or "fix" the mock login as a bug. If a change depends on users having real sessions, flag the dependency and ask instead of silently rebuilding auth.
