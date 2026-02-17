# WandStore Documentation

> The source of truth for "how we build" — the code is the source of truth for "what we built".

## Quick Links

- [Architecture](./architecture/) — System design, data flows, component diagrams
- [Infrastructure](./infrastructure/) — Cloudflare setup, deployment, monitoring
- [Decisions](./decisions/) — Architecture Decision Records (ADRs)
- [Guides](./guides/) — Developer onboarding, deployment runbook
- [Research](./research/) — Technical investigations (historical)

---

## What is WandStore?

WandStore is a persona-driven, AI-native e-commerce platform that generates personalized storefront UIs using LLMs at the edge.

### Core Concepts

- **LLM-Generated Storefronts:** Each shopper gets a unique, AI-generated HTML storefront based on their persona (minimalist, explorer, dealhunter, loyalist)
- **Non-Blocking Generation:** First visit returns an instant fallback template; AI generation runs in background via Cloudflare Containers
- **Shared Container Pool:** 10 shared container pool members process generation jobs via hash-based routing and DO alarm queues
- **Multi-Layer Cache:** R2 (long-term) + KV (edge cache) — return visits serve cached AI UIs instantly
- **Shopify Backend:** Product catalog and checkout handled by Shopify

### Architecture Overview

```
Shopper Request
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  CLOUDFLARE WORKER (Edge Router)                    │
│  • Route: /s/{store}?shopper={id}                   │
│  • Check R2 → KV for cached AI UI                   │
│  • Cache HIT → return instantly                      │
│  • Cache MISS → return fallback + trigger generation │
└──────────────────────┬──────────────────────────────┘
                       │ POST /trigger (non-blocking)
                       ▼
┌─────────────────────────────────────────────────────┐
│  DURABLE OBJECT (Pool Member: pool-0..pool-9)       │
│  • Hash-based routing: shopperId → pool member       │
│  • Job queue in DO storage (up to 100 per member)    │
│  • Alarm-based processing: dequeue → generate → next │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  CLOUDFLARE CONTAINER (AI Generator)                │
│  • Express server on port 8080                       │
│  • Calls Kimi LLM API to generate personalized HTML  │
│  • Persona detection + prompt building               │
│  • Falls back to template generation on LLM error    │
└──────────────────────┬──────────────────────────────┘
                       │
              ┌────────┴────────┐
              ▼                 ▼
        ┌──────────┐     ┌──────────┐
        │ KV Cache │     │    R2    │
        │ (1 hour) │     │ (永久)   │
        └──────────┘     └──────────┘
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Edge Router | Cloudflare Workers |
| Container Orchestration | Cloudflare Durable Objects (pool of 10) |
| AI Generation | Cloudflare Containers (Node.js + Express) |
| LLM Provider | Kimi (Moonshot AI) via `moonshot-v1-32k` |
| Short-Term Cache | Cloudflare KV |
| Long-Term Storage | Cloudflare R2 |
| E-commerce Backend | Shopify |
| CI/CD | GitHub Actions → `wrangler deploy` |
| Container Registry | Cloudflare Container Registry (`registry.cloudflare.com`) |

### Repository Structure

```
wandstore/
├── docs/                          # This repository — how we build
└── infrastructure/                # Code repository — what we built
    ├── .github/workflows/
    │   ├── deploy-container.yml   # Build + deploy on push to main
    │   └── set-secrets.yml        # Manual secret management
    └── wandstore-runtime/
        ├── worker/
        │   ├── src/index.ts       # Worker + DO logic (single file)
        │   └── wrangler.toml      # All Cloudflare bindings + config
        ├── container/
        │   ├── Dockerfile         # Node.js 20-slim container
        │   └── src/
        │       ├── generate.ts    # Express server + generation logic
        │       └── lib/
        │           ├── llm.ts     # Kimi/Claude API client
        │           └── prompts.ts # Persona-based prompt builder
        ├── shared/types.ts        # Shared TypeScript interfaces
        └── scripts/               # KV management utilities
```

---

## Getting Started

See [Developer Onboarding](./guides/developer-onboarding.md) to understand the codebase and deploy.
