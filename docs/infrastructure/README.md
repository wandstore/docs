# Infrastructure

## Cloudflare Services

| Service | Purpose | Status |
|---------|---------|--------|
| Workers | Edge routing, cache checks, fallback templates | Active |
| Durable Objects | Container pool orchestration (alarm-based job queue) | Active |
| Containers | AI UI generation (Node.js + Express + Kimi LLM) | Active |
| KV | Short-term edge caching (3 namespaces) | Active |
| R2 | Long-term generated UI storage | Active |
| Container Registry | `registry.cloudflare.com` — auto-pushed by `wrangler deploy` | Active |

## Account

- **Account ID:** `61709e52b392b237c89ee049f6a0e4a5`
- **Worker URL:** `https://wandstore-runtime.yo-617.workers.dev`

## Worker

| Name | Entry | Bindings |
|------|-------|----------|
| `wandstore-runtime` | `worker/src/index.ts` | AI_GENERATOR, UI_CACHE, GENERATION_QUEUE, SHOPPER_SESSIONS, UI_STORAGE |

## Durable Object

| Class | Purpose |
|-------|---------|
| `AIGeneratorContainer` | Manages one container per pool member. Handles job queue, alarm processing, container lifecycle. |

Instances are named `pool-0` through `pool-9` (configurable via `POOL_SIZE`).

## Container

| Name | Image Source | Instance Type | Max Instances |
|------|-------------|---------------|---------------|
| `ai-generator` | `../container/Dockerfile` | `basic` (0.25 vCPU, 1 GiB) | 50 |

Built and pushed to `registry.cloudflare.com` automatically by `wrangler deploy`.

## KV Namespaces

| Binding | ID | Key Pattern | Purpose |
|---------|----|-------------|---------|
| `UI_CACHE` | `943f5ce4...` | `ui:{store}:{shopper}` | Cached generated UIs (1hr TTL) |
| `GENERATION_QUEUE` | `5a422f31...` | `job:*`, `error:*`, `debug:*` | Job records + debug logs |
| `SHOPPER_SESSIONS` | `5634e37d...` | `session:{shopper}` | Shopper state |

## R2 Bucket

| Binding | Bucket Name | Key Pattern |
|---------|-------------|-------------|
| `UI_STORAGE` | `wandstore-generated-ui` | `generated/{store}:{shopper}.html` |

## Secrets

Set via `wrangler secret put` or the `set-secrets.yml` workflow:

| Secret | Required | Purpose |
|--------|----------|---------|
| `KIMI_API_KEY` | Yes | Moonshot AI API key for LLM generation |
| `SHOPIFY_STORE` | No | Shopify store domain |
| `SHOPIFY_ACCESS_TOKEN` | No | Shopify Storefront API token |
| `WEBHOOK_SECRET` | No | Webhook authentication |
| `AI_GATEWAY_URL` | No | Cloudflare AI Gateway endpoint |

## Environment Variables

Defined in `wrangler.toml` `[vars]`:

| Var | Value | Purpose |
|-----|-------|---------|
| `ENVIRONMENT` | `production` | Environment identifier |
| `CACHE_TTL_SECONDS` | `3600` | KV cache TTL |
| `POOL_SIZE` | `10` | Container pool members |
| `CONTAINER_INACTIVITY_TIMEOUT_MS` | `300000` | Container idle timeout (5 min) |
| `MAX_QUEUE_DEPTH` | `100` | Max jobs per pool member queue |

## CI/CD

### `deploy-container.yml` (automatic on push to main)

Triggers on changes to `wandstore-runtime/container/**`, `wandstore-runtime/worker/**`, or the workflow itself.

Steps:
1. Checkout + setup Node.js 20
2. Install + build container TypeScript
3. Install worker dependencies
4. Setup Docker
5. Install Wrangler
6. `wrangler deploy` — builds container image, pushes to `registry.cloudflare.com`, deploys worker + container

### `set-secrets.yml` (manual dispatch)

Sets `KIMI_API_KEY` via `wrangler secret put`.

## Cost Estimates

| Component | Monthly Cost |
|-----------|-------------|
| Workers Paid Plan | $5 |
| Containers (10 pool members, ~360 jobs/hr capacity) | $50-200 |
| KV | $5-10 |
| R2 | $1-5 |
| Kimi API (~$3.40/1M tokens) | $100-500 |
| **Total** | **$160-720** |
