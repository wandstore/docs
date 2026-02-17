# System Architecture

## Overview

WandStore uses a **distributed edge architecture** built on Cloudflare's global network. The system generates personalized storefront UIs at runtime using Durable Objects for stateful compute.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                    CLIENT LAYER                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Browser    │  │ Mobile App   │  │   API Client │  │  Webhook     │             │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘             │
└─────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────────┘
          │                 │                 │                 │
          └─────────────────┴─────────┬───────┴─────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                   EDGE LAYER                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                      CLOUDFLARE WORKER (API Gateway)                         │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │    │
│  │  │   Router    │  │   Cache     │  │     Auth    │  │ Rate Limit  │        │    │
│  │  │             │  │     API     │  │             │  │             │        │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                               │
│                                      ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                         STATIC ASSETS (R2 / Cache)                           │    │
│  │  • CSS/JS bundles  • Images  • Fonts  • Store themes                         │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────┬──────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              STATEFUL COMPUTE LAYER                                  │
│                                                                                      │
│  ┌─────────────────────────────┐    ┌─────────────────────────────────────────┐     │
│  │    STORE CONFIG DO          │    │         SHOPPER DO (Per-Shopper)        │     │
│  │  ┌───────────────────────┐  │    │  ┌─────────────────────────────────┐   │     │
│  │  │ • Base templates      │  │    │  │ • Shopper preferences           │   │     │
│  │  │ • Theme configuration │  │    │  │ • Browsing history              │   │     │
│  │  │ • Product cache       │  │    │  │ • Cart state                    │   │     │
│  │  │ • Store settings      │  │    │  │ • Generated HTML cache          │   │     │
│  │  └───────────────────────┘  │    │  │ • SQLite persistence            │   │     │
│  │                             │    │  └─────────────────────────────────┘   │     │
│  │  One per store              │    │                                       │     │
│  └─────────────────────────────┘    │  One per active shopper               │     │
│                                     └───────────────────────────────────────┘     │
│                                                                                      │
└──────────────────────────────────────┬──────────────────────────────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
┌────────────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│      SHOPIFY           │ │   CLOUDFLARE     │ │   AI GATEWAY     │
│  ┌──────────────────┐  │ │  ┌────────────┐  │ │  ┌────────────┐  │
│  │ Storefront API   │  │ │  │     R2     │  │ │  │  LLM API   │  │
│  │ • Products       │  │ │  │ • Assets   │  │ │  │ • Prompts  │  │
│  │ • Collections    │  │ │  │ • Themes   │  │ │  │ • Caching  │  │
│  │ • Checkout       │  │ │  │ • Backups  │  │ │  │ • Logging  │  │
│  └──────────────────┘  │ │  └────────────┘  │ │  └────────────┘  │
└────────────────────────┘ └──────────────────┘ └──────────────────┘
```

## Component Details

### 1. API Gateway (Cloudflare Worker)

The entry point for all requests. Handles:
- **Routing:** Route requests to appropriate handlers
- **Caching:** Check Cache API before hitting DOs
- **Authentication:** Validate shopper sessions
- **Rate Limiting:** Prevent abuse

### 2. Durable Objects

#### Store Config DO
- **One per store**
- Holds base templates and theme configuration
- Caches product data from Shopify
- Manages store-wide settings

#### Shopper DO
- **One per active shopper**
- Maintains shopper state in SQLite
- Generates personalized HTML
- Caches generated output for 60 seconds

### 3. Shopify Integration

- **Storefront API:** Product catalog, collections, checkout
- **Admin API:** Inventory management, order processing
- **Webhooks:** Real-time updates for cache invalidation

### 4. Storage (R2)

- Static assets (CSS, JS, images)
- Store theme files
- Generated storefront snapshots (future)

## Data Flow

### Shopper Request Flow

```
1. Shopper requests /s/magic-wands?shopper=abc123
   │
   ▼
2. Worker checks Cache API
   ├── HIT → Return cached HTML
   └── MISS → Continue
   │
   ▼
3. Worker routes to Shopper DO
   │
   ▼
4. Shopper DO checks in-memory cache
   ├── FRESH (< 60s) → Return cached HTML
   └── STALE → Continue
   │
   ▼
5. Shopper DO fetches data
   ├── From SQLite (shopper state)
   └── From Shopify (products)
   │
   ▼
6. Shopper DO renders HTML template
   │
   ▼
7. Response returned to Worker
   │
   ▼
8. Worker stores in Cache API
   │
   ▼
9. HTML returned to shopper
```

### Cache Invalidation Flow

```
1. Shopify webhook (product updated)
   │
   ▼
2. Worker receives webhook
   │
   ▼
3. Purge Cache API for affected stores
   │
   ▼
4. Notify Store DO to refresh product cache
   │
   ▼
5. Shopper DOs regenerate on next request
```

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Edge Cache Hit | < 10ms | Cached responses |
| DO Warm Response | 10-50ms | In-memory cache hit |
| DO Cold Response | 50-100ms | SQLite + generation |
| Full Generation | < 200ms | Fetch + render |
| Time to First Byte | < 100ms | Global average |

## Security Considerations

- All HTML output is escaped to prevent XSS
- Shopper IDs are validated before DO lookup
- Shopify API tokens are stored as Worker secrets
- Rate limiting per IP and per shopper

## Future Enhancements

- [ ] WebSocket hibernation for real-time features
- [ ] Container-based AI inference for advanced personalization
- [ ] Edge-side A/B testing
- [ ] Multi-region DO placement

---

*See also:*
- [Infrastructure Setup](../infrastructure/)
- [Architecture Decisions](../decisions/)
