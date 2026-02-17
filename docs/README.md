# WandStore Documentation

> The source of truth for "how we build" — the code is the source of truth for "what we built".

## Quick Links

- [Architecture](./architecture/) — System design, data flows, component diagrams
- [Infrastructure](./infrastructure/) — Cloudflare setup, deployment, monitoring
- [Decisions](./decisions/) — Architecture Decision Records (ADRs)
- [Guides](./guides/) — Developer onboarding, runbooks
- [Research](./research/) — Market research, competitive analysis

---

## What is WandStore?

WandStore is a persona-driven, AI-native e-commerce platform that generates personalized storefront experiences at the edge.

### Core Concepts

- **Persona-Driven Storefronts:** Each shopper sees a unique, personalized store based on their preferences, browsing history, and intent
- **Runtime UI Generation:** Storefronts are generated dynamically using Cloudflare Durable Objects, not static builds
- **Shopify Backend:** Product catalog, inventory, and checkout handled by Shopify
- **Edge-First:** Everything runs on Cloudflare's global edge network for sub-100ms response times

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SHOPPER BROWSER                                 │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLOUDFLARE EDGE (Worker)                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • Routing & edge caching                                           │   │
│  │  • Authentication & rate limiting                                   │   │
│  │  • Static asset serving (R2)                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DURABLE OBJECT (Per-Shopper Instance)                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • Shopper state (SQLite)                                           │   │
│  │  • Template rendering                                               │   │
│  │  • Personalization logic                                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
┌─────────────────────────────┐    ┌─────────────────────────────┐
│        SHOPIFY API          │    │      CLOUDFLARE R2          │
│  • Product catalog          │    │  • Static assets            │
│  • Inventory                │    │  • Store themes             │
│  • Checkout                 │    │  • Generated snapshots      │
└─────────────────────────────┘    └─────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Edge Runtime** | Cloudflare Workers |
| **Stateful Compute** | Cloudflare Durable Objects |
| **Storage** | Durable Objects SQLite, R2 |
| **AI Gateway** | Cloudflare AI Gateway |
| **E-commerce Backend** | Shopify |
| **CDN** | Cloudflare CDN |

---

## Repository Structure

```
wandstore/
├── docs/                    # This repository
├── storefront/              # Main storefront Worker
├── infrastructure/          # Terraform/Pulumi configs
└── landing/                 # Marketing site
```

---

## Getting Started

See [Developer Onboarding](./guides/developer-onboarding.md) to set up your local environment.

---

## Contributing to Docs

1. Create a new file in the appropriate directory
2. Follow the existing Markdown style
3. Update this README if adding new sections
4. Submit a PR with a clear description

---

## Questions?

- Check the [Guides](./guides/) section for how-tos
- Review [Decisions](./decisions/) for context on architectural choices
- Ask in the team channel

---

*Last updated: 2026-02-17*
