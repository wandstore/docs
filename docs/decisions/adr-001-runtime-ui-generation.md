# ADR-001: Runtime UI Generation with Durable Objects

## Status
- **Superseded by [ADR-003](./adr-003-container-pool-architecture.md)**

## Context

We evaluated approaches for generating personalized storefront UIs at runtime. Options included static site generation, SSR, edge-side template compilation, and Durable Objects with HTML template strings.

## Original Decision

Use Durable Objects with HTML template string generation — one DO per shopper with SQLite state.

## What Actually Happened

We implemented LLM-powered generation via Cloudflare Containers instead. The DO is used as a container orchestrator (not for template rendering), and the container calls Kimi's LLM API to generate full personalized HTML. Template rendering is only used as a fallback when the LLM is unavailable.

See [ADR-003](./adr-003-container-pool-architecture.md) for the current architecture.
