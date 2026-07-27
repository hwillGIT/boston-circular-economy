# Contributing

## Domain modeling assumptions

All contributions — code, schemas, UML, documentation, and product copy — must respect the domain model defined in [`docs/architecture/domain-model.md`](docs/architecture/domain-model.md). The short version:

- A **Service** is an Activity + ItemCategory offered at a Location. Users look for services, not just places.
- **Activity** (what you do) and **ItemCategory** (what kind of thing) are separate dimensions. Do not collapse them.
- A **RawLocation** is a source observation. A **NormalizedLocation** is a pipeline record. Neither is a canonical domain Location.
- Preserve `data_source` and `data_source_id` through all pipeline stages. Do not discard provenance.
- Do not present uncertain or unverified data as confirmed. Surface confidence signals.
- Domain terms must mean the same thing in code, schemas, UML, and docs. If a design changes a term's meaning, document it explicitly.

## Prototyping

### Client-side Prototyping

Use `/dev/` for prototyping and experimentation in the client app. Pages under `client/src/pages/dev/` are accessible at `/dev/` in development and listed on the dev index. Prototypes don't need to meet production standards — use them to explore ideas before building the real thing.

When a prototype is ready to graduate, move it out of `client/src/pages/dev/` into the appropriate location.

Do not reference, document, or describe `/dev/` routes as stable product features until they have been promoted.

