# ADR-002: Use React with TypeScript and Vite for the frontend

**Date:** 2025-01-01  
**Status:** Accepted

## Decision

The frontend is a React application written in TypeScript, built with Vite, and using TanStack Router for client-side navigation.

## Why we chose this

- React is well-known and well-supported, so most contributors will already be familiar with it.
- TypeScript catches a class of bugs at compile time and makes the codebase easier to navigate — especially useful as the team changes.
- Vite gives fast local development startup and a simple build pipeline.
- TanStack Router provides type-safe routing, which reduces the chance of typos causing broken links between pages.

## Alternatives we considered

| Option | Why we didn't choose it |
|--------|------------------------|
| Plain JavaScript (no TypeScript) | TypeScript's type checking pays off quickly on any project that will have multiple contributors over time. |
| Next.js or Remix | These add server-side rendering, which isn't needed — the app is a read-heavy map/directory that works fine as a static site. |
| Vue or Svelte | Both are good options, but React's larger ecosystem and wider contributor familiarity made it the safer choice here. |
| React Router instead of TanStack Router | TanStack Router's file-based, type-safe routing reduces boilerplate and catches route errors at compile time. |

## Consequences

- The client builds to a static folder (`client/dist`) that can be served from any static host.
- Adding server-side rendering later would require migrating away from Vite to a framework like Next.js — doable but non-trivial.
