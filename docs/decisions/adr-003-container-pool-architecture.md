# ADR-003: Container Pool Architecture

## Status
- **Accepted**

## Context

WandStore generates personalized storefront UIs using Kimi's LLM API. The generation takes ~100s and is stateless (no state needed in the container). We needed an architecture that:

1. Generates UIs without blocking the shopper's first page load
2. Efficiently uses Cloudflare Container instances (max 50)
3. Handles concurrent shoppers without creating one container per shopper

## Decision

Use a **shared pool of Durable Object + Container pairs** with alarm-based job queuing.

### Architecture

```
Worker → selectPoolMember(shopperId, 10) → pool-N DO → Container → Kimi LLM
```

### Key Design Choices

**Shared pool (10 members):** Each pool member is a DO managing one container. All shoppers are hash-routed to one of 10 pool members. Uses 10 of 50 max container instances.

**Hash-based routing:** `selectPoolMember()` hashes the shopperId to deterministically pick a pool member. Same shopper always hits the same member, preventing duplicate generations.

**Job queue in DO storage:** Each DO maintains a `jobQueue` array. The single-threaded DO guarantees no race conditions on enqueue/dequeue. Queue depth capped at 100 with 429 response when full.

**Alarm chaining:** Each alarm processes one job, then chains `setAlarm(Date.now())` if more jobs remain. This keeps processing sequential per pool member while allowing the DO to remain responsive to new `/trigger` requests between alarms.

**429 fallback:** If the primary pool member's queue is full, the worker tries the next member (`pool-(N+1) % poolSize`), cycling through all members before giving up.

**5-min inactivity timeout:** Shared containers stay warm for reuse. A 3s cold start only happens once per pool member.

**Non-blocking generation:** Worker returns a fallback template instantly on cache miss. Generation runs in the background via `ctx.waitUntil`.

## Consequences

### Positive
- 10 containers handle all traffic (vs. one per shopper)
- ~360 jobs/hr throughput (10 members x ~36 jobs/hr each)
- Containers stay warm across shoppers (5-min timeout)
- Graceful degradation on overload (429 fallback)
- No race conditions (DO single-threaded guarantee)

### Negative
- Sequential processing per pool member (one job at a time)
- Hash collisions mean some members may be busier than others
- Pool size is static (must redeploy to change)

## Configuration

| Var | Default | Purpose |
|-----|---------|---------|
| `POOL_SIZE` | `10` | Number of pool members |
| `MAX_QUEUE_DEPTH` | `100` | Max queued jobs per member |
| `CONTAINER_INACTIVITY_TIMEOUT_MS` | `300000` | Container idle timeout |
