# SPEC-009: Multi-Provider LLM Routing

**Status**: IMPLEMENTED
**Priority**: SHOULD
**Epic**: Platform & Data
**Last Updated**: 2026-07-29
**Related ADRs**:

---

## Context

The ETL pipeline uses Large Language Models (LLMs) to enrich unstructured data. To manage costs and ensure reliability, a router dynamically selects the appropriate model based on task complexity rather than relying on a single provider.

## User Stories

### US-009.1: API Key Configuration

**As a** developer, **I want to** configure API keys for various LLM providers (Anthropic, OpenAI, Gemini), **so that** the application can authenticate with whichever provider is selected.

**Priority**: MUST
**Status**: Implemented

#### Acceptance Criteria

- [ ] **Given** environment variables, **When** the application starts, **Then** it securely loads API keys for enabled providers.

### US-009.2: Complexity-Based Model Routing

**As a** system, **I want to** route prompts to different models based on a defined task complexity (Fast, Balanced, Strong), **so that** simple tasks use cheaper/faster models and complex tasks use highly capable models.

**Priority**: MUST
**Status**: Implemented (ModelRouter in `etl/src/etl/llm/`)

#### Acceptance Criteria

- [ ] **Given** a simple categorization task, **When** processed by the router, **Then** it selects a "Fast" model (e.g., GPT-3.5 or Claude Haiku).
- [ ] **Given** a complex reasoning task, **When** processed, **Then** it selects a "Strong" model (e.g., GPT-4 or Claude Opus).
- [ ] **Given** the router logic, **When** selecting models, **Then** it explicitly does NOT use simple round-robin scheduling, but rather intent-based routing.

### US-009.3: Graceful Fallback

**As a** system, **I want to** automatically fallback to an alternative provider if the primary choice is unavailable or rate-limited, **so that** the ETL pipeline does not fail unnecessarily.

**Priority**: SHOULD
**Status**: Implemented

#### Acceptance Criteria

- [ ] **Given** a request to a primary model fails (e.g., 429 Too Many Requests), **When** caught by the router, **Then** it automatically retries the request using a secondary provider in the same complexity tier.

## Non-Functional Requirements

- **Performance**: The routing logic itself must introduce negligible latency overhead.
- **Maintainability**: Adding new models or providers to the configuration should require minimal code changes.

## Dependencies

- SPEC-007: Data Pipeline & ETL (heavy consumer of this module)

## Definition of Done

- [ ] All acceptance criteria pass
- [ ] Code is unit tested covering fallback scenarios
- [ ] Code reviewed
