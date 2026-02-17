# Guides

Practical how-tos and runbooks for the WandStore team.

## Available Guides

| Guide | Purpose | Audience |
|-------|---------|----------|
| [Developer Onboarding](./developer-onboarding.md) | Set up local environment | New developers |
| [Deployment Runbook](./deployment-runbook.md) | Deploy to production | All developers |
| [Incident Response](./incident-response.md) | Handle outages/incidents | On-call engineer |
| [Adding a New Store](./adding-a-store.md) | Onboard new merchant | Operations |

## Quick Reference

### Common Commands

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production

# View logs
wrangler tail

# Run tests
npm test

# Type check
npm run typecheck
```

### Useful Links

- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [Shopify Admin](https://admin.shopify.com)
- [GitHub Repository](https://github.com/wandstore/storefront)

---

*Need a new guide? Create one and add it to the index above.*
