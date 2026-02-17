# System Architecture

## Overview

WandStore uses Cloudflare Workers as an edge router, Cloudflare Containers for LLM-powered UI generation, and a shared Durable Object pool to orchestrate background jobs.

## Request Flow

### First Visit (Cache MISS)

```
1. GET /s/magic-wands?shopper=abc123
   │
   ▼
2. Worker checks R2 → KV for cached UI
   └── MISS → continue
   │
   ▼
3. Worker returns fallback template immediately (non-blocking)
   │
   ▼
4. ctx.waitUntil → triggerBackgroundGeneration()
   │
   ▼
5. selectPoolMember("abc123", 10) → "pool-3" (hash-based)
   │
   ▼
6. POST /trigger to pool-3 DO → enqueue job, setAlarm(Date.now())
   │
   ▼
7. DO alarm fires → dequeue job → proxyToContainer(/generate)
   │
   ▼
8. Container calls Kimi LLM → generates personalized HTML (~100s)
   │
   ▼
9. DO stores result in KV (1hr TTL) + R2 (permanent)
   │
   ▼
10. If more jobs in queue → setAlarm(Date.now()) → process next
```

### Return Visit (Cache HIT)

```
1. GET /s/magic-wands?shopper=abc123
   │
   ▼
2. Worker checks R2 → HIT → return cached AI-generated HTML
   (Total latency: ~10-50ms)
```

## Component Details

### Worker (`worker/src/index.ts`)

Single file containing all edge logic:

- **Routes:** `/s/{store}`, `/health`, `/debug/*`, `/api/*`, `/webhook/*`
- **Cache strategy:** R2 first (long-term), then KV (edge cache), then fallback template
- **Pool routing:** `selectPoolMember()` hashes shopperId to `pool-0..pool-9`
- **Fallback:** If pool member returns 429 (queue full), tries next member

### Durable Object (`AIGeneratorContainer`)

Each pool member is a DO instance managing one container:

- **`POST /trigger`:** Enqueue job to `jobQueue` array in DO storage. Return 429 if queue >= `MAX_QUEUE_DEPTH` (100).
- **`alarm()`:** Dequeue first job, proxy to container `/generate`, store result in KV+R2, chain next alarm if queue non-empty.
- **`proxyToContainer()`:** Start container with `enableInternet: true` + env vars (secrets), set inactivity timeout (5 min), proxy request to port 8080.

### Container (`container/src/generate.ts`)

Stateless Express server:

- **`GET /health`:** Health check
- **`POST /generate`:** Takes `{jobId, storeSlug, shopperId, preferences}`, detects persona, builds prompt, calls Kimi LLM, returns `{success, html, persona, source}`
- **Personas:** minimalist, explorer, dealhunter, loyalist
- **Fallback:** Template-based generation if LLM fails

### Storage

| Store | Binding | Purpose | TTL |
|-------|---------|---------|-----|
| KV `UI_CACHE` | `UI_CACHE` | Edge-cached generated UIs (`ui:{store}:{shopper}`) | 1 hour |
| KV `GENERATION_QUEUE` | `GENERATION_QUEUE` | Job records, debug breadcrumbs, error logs | 1 hour |
| KV `SHOPPER_SESSIONS` | `SHOPPER_SESSIONS` | Shopper session data (`session:{shopper}`) | No expiry |
| R2 `wandstore-generated-ui` | `UI_STORAGE` | Long-term HTML storage (`generated/{store}:{shopper}.html`) | Permanent |

## Pool Configuration

| Var | Default | Purpose |
|-----|---------|---------|
| `POOL_SIZE` | `10` | Number of shared container pool members |
| `MAX_QUEUE_DEPTH` | `100` | Max queued jobs per pool member before 429 |
| `CONTAINER_INACTIVITY_TIMEOUT_MS` | `300000` | Container idle timeout (5 min) |
| `CACHE_TTL_SECONDS` | `3600` | KV cache TTL (1 hour) |

## Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/s/{store}?shopper={id}` | GET | Main storefront route |
| `/health` | GET | Health check |
| `/debug/container` | GET | Test container health via `pool-0` |
| `/debug/generate` | GET | Test full LLM generation via pool |
| `/debug/errors?shopper=X&store=Y` | GET | Check generation errors/breadcrumbs |
| `/api/generation/status?shopper=X&store=Y` | GET | Check if UI has been generated |
| `/api/shopper/track` | POST | Track shopper activity |
| `/webhook/generation-complete` | POST | Legacy webhook handler |
