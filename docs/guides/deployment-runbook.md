# Deployment Runbook

## How Deployment Works

Push to `main` triggers the `deploy-container.yml` GitHub Actions workflow, which:

1. Builds container TypeScript (`npm run build` in `container/`)
2. Installs worker dependencies (`npm install` in `worker/`)
3. Runs `wrangler deploy` from `worker/` — this builds the Docker image, pushes it to `registry.cloudflare.com`, and deploys the worker + container

No staging environment exists yet. All deploys go straight to production.

## Manual Deploy

```bash
cd wandstore-runtime/worker
npx wrangler deploy
```

## Pre-Deploy Checklist

- [ ] TypeScript compiles cleanly: `cd worker && npx tsc --noEmit`
- [ ] Container builds: `cd container && npm run build`
- [ ] Changes committed and pushed to `main`

## Post-Deploy Verification

```bash
BASE=https://wandstore-runtime.yo-617.workers.dev

# 1. Health check
curl $BASE/health

# 2. Container pool health
curl $BASE/debug/container
# Expect: poolMember: "pool-0", status: 200

# 3. Full generation test (takes ~100s)
curl $BASE/debug/generate
# Expect: status: 200, source: "llm"

# 4. Storefront route
curl -I "$BASE/s/magic-wands?shopper=test-deploy"
# Expect: X-Cache: MISS or HIT
```

## Rollback

Cloudflare keeps previous versions. Rollback via:

1. **Cloudflare Dashboard:** Workers & Pages → wandstore-runtime → Deployments → Rollback
2. **Git revert:** `git revert HEAD && git push` (triggers new deploy)

## Updating Secrets

```bash
# Via CLI
cd wandstore-runtime/worker
wrangler secret put KIMI_API_KEY

# Via GitHub Actions
# Trigger set-secrets.yml workflow manually with the new key
```

## Troubleshooting

### Deploy Fails in CI

Check the GitHub Actions log. Common issues:
- Missing `CLOUDFLARE_API_TOKEN` secret in GitHub
- Container build failure (TypeScript errors in `container/`)
- Docker setup issues

### Container Not Starting

Check `/debug/container`. If status is 503:
- Container image may have failed to build — check CI logs
- Container may be crashing on startup — check `wrangler tail` for errors

### Generation Returns Error

Check `/debug/errors?shopper=X&store=Y`. Common issues:
- `KIMI_API_KEY` not set or invalid
- Kimi API rate limit hit
- Container timeout (generation > inactivity timeout)
