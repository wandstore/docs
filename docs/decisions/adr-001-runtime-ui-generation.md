# ADR-001: Runtime UI Generation with Durable Objects

## Status
- **Accepted**

## Context

WandStore needs to generate personalized storefront UIs at runtime. Each shopper should see a unique storefront based on their preferences, browsing history, and intent. This requires:

1. Sub-100ms response times globally
2. Stateful shopper sessions
3. Dynamic HTML generation
4. Integration with Shopify for product data

We evaluated several approaches:
- Static site generation (SSG) with edge personalization
- Server-side rendering (SSR) with traditional servers
- Edge-side template compilation
- Durable Objects with runtime HTML generation

## Decision

We will use **Cloudflare Durable Objects with HTML template string generation** for runtime UI generation.

### Architecture

```
Shopper Request → Worker (Edge Cache) → Durable Object → HTML Response
                      ↓                      ↓
                 Cache API            SQLite State
```

### Key Components

1. **One Durable Object per shopper** — Maintains state in SQLite, generates personalized HTML
2. **HTML template strings** — Fastest rendering approach, no runtime overhead
3. **Multi-layer caching** — Edge Cache API + DO in-memory cache
4. **Shopify Storefront API** — Product catalog and checkout

## Consequences

### Positive

- **Fast response times:** 10-50ms for warm requests, 50-100ms for cold
- **Stateful personalization:** Shopper history, preferences, cart state
- **Global edge deployment:** 300+ locations worldwide
- **Cost-effective:** Pay only for actual compute time
- **No cold starts:** DO hibernation provides near-zero overhead

### Negative

- **Limited to JavaScript/TypeScript:** Cannot use traditional template engines (EJS, etc.)
- **Learning curve:** DO programming model is different from traditional servers
- **SQLite limitations:** Single-writer, not suitable for high-write scenarios

### Neutral

- **Vendor lock-in:** Tied to Cloudflare platform
- **Debugging complexity:** Distributed state requires new debugging approaches

## Alternatives Considered

| Approach | Cold Start | Warm Latency | Personalization | Verdict |
|----------|------------|--------------|-----------------|---------|
| DO + HTML Templates | 5ms | 10ms | ⭐⭐⭐⭐⭐ | ✅ **Selected** |
| DO + Hono JSX | 5ms | 15ms | ⭐⭐⭐⭐⭐ | Good alternative |
| Container + Express | 2s | 50ms | ⭐⭐⭐⭐⭐ | ❌ Too slow |
| Static + Edge Functions | 0ms | 5ms | ⭐⭐ | ❌ Not stateful enough |

## References

- [Runtime UI Generation Research](../../research/runtime-ui-generation.md)
- [Cloudflare Durable Objects Documentation](https://developers.cloudflare.com/durable-objects/)
- Issue #14: Runtime UI Generation

---

*Decided: 2026-02-17*
