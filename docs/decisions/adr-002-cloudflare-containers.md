# ADR-002: Cloudflare Containers Evaluation

## Status
- **Accepted** — Evaluated and rejected for MVP, kept for future consideration

## Context

Cloudflare Containers (now in public beta) offer serverless containers that run on Cloudflare's global network. We evaluated whether to use Containers for WandStore's runtime UI generation.

Key question: Should we use Containers instead of Durable Objects for storefront generation?

## Decision

We will **NOT use Containers for the MVP**. We will use Durable Objects instead.

Containers will be revisited for specific resource-intensive workloads (AI inference, image processing) in future phases.

## Evaluation

### Container Characteristics

| Feature | Description |
|---------|-------------|
| Runtime | Full Linux containers (Docker-compatible) |
| Cold Start | 1-5 seconds |
| Warm Response | 10-50ms |
| Languages | Any (Node.js, Python, Go, etc.) |
| Integration | Controlled via Workers + Durable Objects |

### Performance Comparison

| Platform | Cold Start | Warm Response |
|----------|------------|---------------|
| Workers | 0-5ms | 1-10ms |
| Durable Objects | 0-5ms | 1-10ms |
| Containers (lite) | 500ms-2s | 10-50ms |
| Containers (standard-2) | 1-5s | 10-50ms |

### Why Containers Are Slower

```
Container Cold Start Timeline:
├── Image Pull (if not cached): 500ms - 2s
├── Container Runtime Init:     200ms - 500ms
├── Application Boot:           300ms - 2s
└── First Request Handling:     10ms - 50ms
    TOTAL: 1-5 seconds
```

## Consequences

### Positive (of not using Containers for MVP)

- **Faster page loads:** 5ms cold start vs. 1-5s for Containers
- **Lower costs:** No container warmup costs
- **Simpler architecture:** Single technology (Durable Objects)
- **Faster development:** No Docker, image management, etc.

### Negative (trade-offs)

- **Limited template engines:** Cannot use EJS, Handlebars, etc.
- **No multi-language support:** Limited to JavaScript/TypeScript
- **Future migration:** May need to add Containers later for AI features

## Future Use Cases for Containers

We will revisit Containers when WandStore needs:

1. **AI-powered personalization** — LLM inference requires more resources
2. **Image generation/processing** — Product visuals, thumbnails
3. **PDF generation** — Invoices, reports
4. **Video processing** — Product demos

### Hybrid Architecture (Future)

```
Shopper Request → Worker → Route Decision
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
            Standard      Personalized     AI Features
            (DO)          (DO)             (Container)
            < 50ms        < 100ms          Async
```

## References

- [Cloudflare Containers Research](../../research/cloudflare-containers.md)
- [Cloudflare Containers Documentation](https://developers.cloudflare.com/containers/)
- Issue #14: Runtime UI Generation

---

*Decided: 2026-02-17*
