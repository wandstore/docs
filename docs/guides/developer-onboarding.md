# Developer Onboarding

## Prerequisites

- Node.js 20+
- Git
- Cloudflare account with access to the WandStore account
- `wrangler` CLI (`npm install -g wrangler`)

## Clone and Explore

```bash
git clone https://github.com/wandstore/infrastructure.git
cd infrastructure/wandstore-runtime
```

### Project Structure

```
wandstore-runtime/
├── worker/
│   ├── src/index.ts       # Worker + Durable Object (all edge logic)
│   ├── wrangler.toml      # Cloudflare config (bindings, vars, container)
│   ├── package.json       # Worker dependencies
│   └── tsconfig.json      # TypeScript config (ES2022)
├── container/
│   ├── Dockerfile         # Node.js 20-slim, non-root user, healthcheck
│   ├── src/
│   │   ├── generate.ts    # Express server: /health, /generate
│   │   └── lib/
│   │       ├── llm.ts     # Kimi/Claude API client with retry logic
│   │       └── prompts.ts # Persona-based prompt builder
│   ├── package.json       # Container dependencies (express, pino)
│   └── tsconfig.json      # TypeScript config (CommonJS)
├── shared/types.ts        # Shared interfaces
└── scripts/
    ├── kv-upload.js       # Upload templates to KV
    └── kv-utils.js        # KV management (list, delete, export)
```

### Key Files

| File | What It Does |
|------|-------------|
| `worker/src/index.ts` | Edge router, cache checks, pool routing, DO with job queue + alarm processing, fallback templates |
| `container/src/generate.ts` | Persona detection, Kimi LLM calls, HTML generation, template fallback |
| `container/src/lib/llm.ts` | LLM API integration with retry, timeout, token tracking |
| `container/src/lib/prompts.ts` | System + user prompts per persona |
| `worker/wrangler.toml` | All Cloudflare bindings (KV, R2, Container, DO) and env vars |

## Local Development

```bash
# Worker
cd worker
npm install
npx wrangler dev          # Starts on http://localhost:8787

# Container (separate terminal)
cd container
npm install
npm run build
npm start                 # Starts on http://localhost:8080
```

## Deploy

Deployment is automatic via GitHub Actions on push to `main`. To deploy manually:

```bash
cd worker
npx wrangler deploy
```

This builds the container image, pushes it to `registry.cloudflare.com`, and deploys the worker.

## Verify Deployment

```bash
# Health check
curl https://wandstore-runtime.yo-617.workers.dev/health

# Container health via pool-0
curl https://wandstore-runtime.yo-617.workers.dev/debug/container

# Full LLM generation test (takes ~100s)
curl https://wandstore-runtime.yo-617.workers.dev/debug/generate

# Check errors for a shopper
curl "https://wandstore-runtime.yo-617.workers.dev/debug/errors?shopper=test-1&store=magic-wands"
```

## How Generation Works

1. Shopper hits `/s/magic-wands?shopper=abc123`
2. Worker checks R2, then KV for cached AI UI — returns it if found
3. On cache miss: returns fallback template instantly, triggers background generation
4. `selectPoolMember("abc123", 10)` hashes shopperId to a pool member (e.g., `pool-3`)
5. Worker POSTs `/trigger` to pool-3's DO — job is enqueued, alarm is set
6. DO alarm fires, dequeues job, starts container (if not running), proxies to `/generate`
7. Container detects persona, calls Kimi LLM, returns generated HTML
8. DO stores HTML in KV (1hr) + R2 (permanent), updates shopper session
9. If more jobs queued, chains another alarm

## Secrets

Secrets are set via `wrangler secret put` or the `set-secrets.yml` GitHub Actions workflow:

```bash
wrangler secret put KIMI_API_KEY
```

Required: `KIMI_API_KEY`. Optional: `SHOPIFY_STORE`, `SHOPIFY_ACCESS_TOKEN`, `AI_GATEWAY_URL`.
