# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for WandStore. Each ADR documents a significant architectural decision, including the context, decision, and consequences.

## ADR Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [ADR-001](./adr-001-runtime-ui-generation.md) | Runtime UI Generation with Durable Objects | Accepted | 2026-02-17 |
| [ADR-002](./adr-002-cloudflare-containers.md) | Cloudflare Containers Evaluation | Accepted | 2026-02-17 |

## ADR Template

```markdown
# ADR-XXX: Title

## Status
- Proposed / Accepted / Deprecated / Superseded by ADR-YYY

## Context
What is the issue that we're seeing that is motivating this decision?

## Decision
What is the change that we're proposing or have agreed to implement?

## Consequences
What becomes easier or more difficult to do because of this change?

### Positive
- ...

### Negative
- ...

### Neutral
- ...

## References
- Links to relevant issues, PRs, or external resources
```

---

## How to Propose a New ADR

1. Copy the template above
2. Create a new file: `adr-XXX-short-title.md`
3. Fill in all sections
4. Submit for review
5. Update the index above once accepted
