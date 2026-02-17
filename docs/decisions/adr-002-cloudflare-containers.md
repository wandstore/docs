# ADR-002: Cloudflare Containers Evaluation

## Status
- **Superseded by [ADR-003](./adr-003-container-pool-architecture.md)**

## Original Decision

Do NOT use Containers for the MVP due to cold start latency (1-5s). Use Durable Objects with HTML templates instead.

## What Actually Happened

We adopted Containers as the core generation mechanism. The cold start concern turned out to be acceptable because:

1. **Generation is non-blocking.** The first visit returns a fallback template instantly; the container runs in the background.
2. **5-min inactivity timeout** keeps containers warm for subsequent requests.
3. **Shared pool of 10** means containers are reused across shoppers, not cold-started per shopper.
4. **LLM calls take ~100s** — a 3s cold start is negligible relative to the total generation time.

See [ADR-003](./adr-003-container-pool-architecture.md) for the current architecture.

## Original Research (Historical)

The container performance research in [research/cloudflare-containers.md](../research/cloudflare-containers.md) is still accurate for the raw numbers. The conclusion was wrong because it didn't account for non-blocking background generation.
