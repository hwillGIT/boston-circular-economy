# Contributing

Use [CI checks](docs/CI_CHECKS.md) to install dependencies and check your changes.
Use the root npm lockfile for JavaScript and `etl/uv.lock` for Python.

## Prototyping

### Client-side Prototyping

Use `/dev/` for prototyping and experimentation in the client app. Pages under `client/src/pages/dev/` are accessible at `/dev/` in development and listed on the dev index. Prototypes don't need to meet production standards — use them to explore ideas before building the real thing.

When a prototype is ready to graduate, move it out of `client/src/pages/dev/` into the appropriate location.
