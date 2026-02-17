# Infrastructure

## Overview

WandStore runs entirely on Cloudflare's edge infrastructure. This document covers the setup, deployment pipelines, and monitoring.

## Cloudflare Services

| Service | Purpose | Status |
|---------|---------|--------|
| Workers | Edge compute (API Gateway) | ✅ Active |
| Durable Objects | Stateful compute | ✅ Active |
| R2 | Object storage (assets) | ✅ Active |
| AI Gateway | LLM API management | ✅ Active |
| Cache API | Edge caching | ✅ Active |
| Analytics | Monitoring & logs | ✅ Active |

## Account Information

- **Account ID:** `61709e52b392b237c89ee049f6a0e4a5`
- **Primary Zone:** `wandstore.io`
- **Workers Subdomain:** `wandstore.workers.dev`

## Workers

### Production Workers

| Worker | Purpose | Bindings |
|--------|---------|----------|
| `wandstore` | Main storefront API | SHOPPER_DO, STORE_DO, R2 |
| `wandstore-agents` | Agent coordination | AI Gateway, R2 |
| `wandstore-landing` | Marketing site | R2 |

### Worker Configuration

```toml
# wrangler.toml (production)
name = "wandstore"
main = "src/worker.ts"
compatibility_date = "2024-01-01"

[[durable_objects.bindings]]
name = "SHOPPER_STOREFRONT"
class_name = "ShopperStorefront"

[[durable_objects.bindings]]
name = "STORE_CONFIG"
class_name = "StoreConfig"

[[migrations]]
tag = "v1"
new_classes = ["ShopperStorefront", "StoreConfig"]

[vars]
SHOPIFY_STORE_DOMAIN = "wandstore.myshopify.com"

[env.staging]
name = "wandstore-staging"

[env.staging.vars]
SHOPIFY_STORE_DOMAIN = "wandstore-staging.myshopify.com"
```

## Durable Objects

### Class Definitions

```typescript
// ShopperStorefront DO
export class ShopperStorefront {
  // One instance per shopper
  // Handles: personalization, HTML generation, cart state
}

// StoreConfig DO
export class StoreConfig {
  // One instance per store
  // Handles: templates, themes, product cache
}
```

### Scaling Considerations

- DOs scale automatically per unique ID
- SQLite storage is persistent
- In-memory state is lost on hibernation (use SQLite for persistence)
- WebSocket hibernation available for real-time features

## R2 Buckets

| Bucket | Purpose | Public Access |
|--------|---------|---------------|
| `wandstore-assets` | Static assets (CSS, JS, images) | Yes |
| `wandstore-themes` | Store theme files | No |
| `wandstore-backups` | DO backups, snapshots | No |

### R2 Configuration

```toml
[[r2_buckets]]
binding = "ASSETS"
bucket_name = "wandstore-assets"

[[r2_buckets]]
binding = "THEMES"
bucket_name = "wandstore-themes"
```

## AI Gateway

### Configuration

- **Gateway Name:** `wandstore-ai`
- **Providers:** OpenAI, Anthropic (via Cloudflare AI Gateway)
- **Features:** Caching, rate limiting, logging

### Usage

```typescript
// Example AI Gateway call
const response = await fetch(
  `https://gateway.ai.cloudflare.com/v1/${accountId}/wandstore-ai/openai/chat/completions`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.AI_GATEWAY_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    }),
  }
);
```

## Deployment Pipeline

### GitHub Actions Workflow

```yaml
name: Deploy

on:
  push:
    branches: [main, staging]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Deploy to Staging
        if: github.ref == 'refs/heads/staging'
        run: npx wrangler deploy --env staging
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          
      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        run: npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

### Deployment Checklist

- [ ] Tests pass
- [ ] Migrations reviewed
- [ ] Secrets updated (if needed)
- [ ] Staging deployment verified
- [ ] Production deployment approved

## Monitoring

### Cloudflare Analytics

- **Worker Metrics:** Requests, errors, CPU time
- **DO Metrics:** Active instances, storage usage
- **R2 Metrics:** Requests, egress

### Custom Logging

```typescript
// Structured logging from Workers
console.log(JSON.stringify({
  level: 'info',
  message: 'Shopper storefront generated',
  shopperId,
  storeSlug,
  generationTimeMs,
  timestamp: new Date().toISOString(),
}));
```

### Alerts

| Condition | Severity | Action |
|-----------|----------|--------|
| Error rate > 1% | Warning | Slack notification |
| Error rate > 5% | Critical | PagerDuty |
| P95 latency > 500ms | Warning | Review DO performance |
| DO storage > 80% | Warning | Plan cleanup |

## Secrets Management

Secrets are stored in Cloudflare and bound to Workers:

```bash
# Set a secret
wrangler secret put SHOPIFY_STOREFRONT_TOKEN

# List secrets
wrangler secret list
```

### Required Secrets

| Secret | Description |
|--------|-------------|
| `SHOPIFY_STOREFRONT_TOKEN` | Shopify Storefront API access |
| `SHOPIFY_ADMIN_TOKEN` | Shopify Admin API access |
| `AI_GATEWAY_TOKEN` | Cloudflare AI Gateway |

## Cost Estimation

### Monthly (1M requests/day)

| Service | Estimated Cost |
|---------|----------------|
| Workers (Paid Plan) | $5 |
| Durable Objects | $20-50 |
| R2 | $5-10 |
| AI Gateway | $10-30 |
| **Total** | **$40-95** |

---

*See also:*
- [Architecture Overview](../architecture/)
- [Developer Onboarding](../guides/developer-onboarding.md)
