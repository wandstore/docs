# Deployment Runbook

Step-by-step guide for deploying WandStore to production.

## Pre-Deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] Changes reviewed and approved (PR merged)
- [ ] Staging deployment verified
- [ ] Database migrations reviewed (if applicable)
- [ ] Secrets updated (if needed)

## Deployment Process

### 1. Prepare Release

```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Create a release tag
git tag -a v1.2.3 -m "Release v1.2.3 - Description"
git push origin v1.2.3
```

### 2. Deploy to Staging

```bash
# Deploy to staging environment
npx wrangler deploy --env staging

# Verify staging is healthy
curl https://wandstore-staging.workers.dev/health
```

### 3. Run Smoke Tests on Staging

```bash
# Test storefront generation
curl "https://wandstore-staging.workers.dev/s/test-store?shopper=test123"

# Test Shopify integration
curl "https://wandstore-staging.workers.dev/api/products"

# Verify caching
# (Make same request twice, second should be faster)
```

### 4. Deploy to Production

```bash
# Deploy to production
npx wrangler deploy

# Or via GitHub Actions (preferred)
git push origin main
```

### 5. Verify Production

```bash
# Health check
curl https://wandstore.io/health

# Check error rates in Cloudflare Dashboard
# https://dash.cloudflare.com → Workers & Pages → wandstore
```

## Rollback Procedure

If issues are detected:

```bash
# Rollback to previous version
git checkout v1.2.2
npx wrangler deploy

# Or rollback via Cloudflare Dashboard
# Workers & Pages → wandstore → Rollback
```

## Post-Deployment

- [ ] Monitor error rates for 30 minutes
- [ ] Check latency metrics
- [ ] Verify critical user flows
- [ ] Announce deployment in #deployments Slack channel

## Emergency Hotfix

For critical issues requiring immediate fix:

```bash
# Create hotfix branch from main
git checkout -b hotfix/critical-fix main

# Make minimal fix
# ... edit files ...

# Deploy directly (bypass staging for critical fixes)
npx wrangler deploy

# Follow up with proper PR and staging deployment
```

## Monitoring During Deployment

Watch these metrics in Cloudflare Dashboard:

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Error Rate | < 0.1% | 0.1-1% | > 1% |
| P95 Latency | < 100ms | 100-500ms | > 500ms |
| DO Instances | Stable | Fluctuating | Spike |

## Troubleshooting

### Deployment Fails

1. Check wrangler logs: `npx wrangler deploy --verbose`
2. Verify secrets are set: `npx wrangler secret list`
3. Check for syntax errors: `npm run typecheck`

### High Error Rate After Deploy

1. Check Cloudflare Logs: `npx wrangler tail`
2. Rollback immediately if > 5% errors
3. Investigate in staging

### DO Migration Issues

If Durable Object migrations fail:

```bash
# List migrations
npx wrangler d1 migrations list

# Apply pending migrations
npx wrangler d1 migrations apply
```

---

*For incident response, see [Incident Response](./incident-response.md)*
