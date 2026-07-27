# ADR-008: Deploy the frontend to GitHub Pages

**Date:** 2025-01-01  
**Status:** Accepted

## Decision

The frontend is deployed automatically to GitHub Pages on every push to `main`, using GitHub Actions. Only the built static files are deployed — no server or backend is part of this deployment.

## Why we chose this

- GitHub Pages is free for public repositories and requires zero infrastructure setup.
- Because the frontend builds to a static folder (`client/dist`), it doesn't need a server to run.
- Deploying on every push to `main` means the live site always reflects the latest code without any manual steps.

## Alternatives we considered

| Option | Why we didn't choose it |
|--------|------------------------|
| Vercel or Netlify | Both are good options and offer similar simplicity. GitHub Pages keeps everything within GitHub and requires no additional account or service. |
| Self-hosted server | Adds cost and maintenance overhead. No benefit at this stage. |
| Deploy the backend alongside the frontend | The backend isn't needed for the initial static map/directory view. Keeping the deployment simple reduces risk. |

## Consequences

- The deployed site is a static frontend only — it does not call a live backend API. Any dynamic features (search, filters backed by the server) will require a separate hosting solution for the API.
- The deploy workflow (`deploy.yml`) only builds the client. If a server deployment is added later, a new workflow or hosting provider will be needed.
- The live site URL is determined by the GitHub Pages configuration in the repository settings.
