---
name: Shopify Integration
about: Track Shopify demo store setup and integration progress
title: '[Shopify] '
labels: ['shopify', 'integration']
assignees: ''

---

## Overview
Set up Shopify demo store and integrate with WandStore for real product data.

## Checklist

### Phase 1: Store Setup
- [ ] Create Shopify Partner account
- [ ] Create development store "WandStore Demo"
- [ ] Add 20-30 sample products
- [ ] Create collections (Featured, New Arrivals, Sale, Bestsellers, Staff Picks, Under $50)
- [ ] Configure store settings (currency, timezone, etc.)

### Phase 2: API Integration
- [ ] Generate Storefront API access token
- [ ] Create `shopify.ts` integration module
- [ ] Update Worker to fetch real products
- [ ] Add shop info fetching
- [ ] Test API connection

### Phase 3: Configuration
- [ ] Add Shopify credentials to Worker secrets
- [ ] Update environment variables
- [ ] Deploy updated Worker
- [ ] Verify products load from Shopify

### Phase 4: Documentation
- [ ] Document store credentials
- [ ] Create setup guide
- [ ] Update README with Shopify instructions

## Store Details

| Field | Value |
|-------|-------|
| Store Name | WandStore Demo |
| Store URL | https://wandstore-demo.myshopify.com |
| Partner Account | (to be filled) |
| Storefront Token | (to be filled - save in 1Password) |

## API Credentials

```bash
# Add to Cloudflare Worker secrets
SHOPIFY_STORE=wandstore-demo.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=shpat_xxxxxxxxxxxxxxxx
```

## Notes

- Storefront API has no rate limits
- Products should be published to "Online Store" channel
- Use test data for development
- Keep credentials secure

## Related Issues

- #2: Implement Shopify Storefront API Integration
- #3: Implement Multi-Tier Caching Strategy
- #4: Implement Webhook Handlers
