# ADR-004: Use Python for the ETL pipeline

**Date:** 2025-01-01  
**Status:** Accepted

## Decision

The data pipeline (fetching, normalizing, and storing location data) is written in Python, managed with the `uv` package manager and Pydantic for data validation.

## Why we chose this

- Python has the richest ecosystem for data work — libraries for HTTP, parsing, geospatial analysis, and data science are mature and plentiful.
- Pydantic makes it easy to define and validate the shape of data as it moves between pipeline stages, catching problems early.
- Python is the language most data-focused contributors are likely to know.
- `uv` is fast and handles virtual environments and dependencies in a single tool.

## Alternatives we considered

| Option | Why we didn't choose it |
|--------|------------------------|
| Write ETL in TypeScript/Node.js | Would keep the whole repo in one language, but Python's data ecosystem is stronger and most data contributors expect Python. |
| Use a dedicated ETL framework (Airflow, Prefect, dbt) | Too heavy for the current scale. A simple Python script pipeline is easier to run, debug, and contribute to. We can adopt an orchestration tool later if needed. |
| R | Less general-purpose, smaller contributor pool, and less suitable for a production pipeline. |

## Consequences

- Contributors working on the pipeline need Python 3.14+ and `uv`.
- The ETL pipeline is separate from the web stack and runs as a standalone command, not as part of the web server.
- Moving to a hosted orchestration tool (like Airflow) is a valid next step if the pipeline grows in complexity or needs scheduling.
