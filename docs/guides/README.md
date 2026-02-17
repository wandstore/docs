# Guides

| Guide | Purpose |
|-------|---------|
| [Developer Onboarding](./developer-onboarding.md) | Understand the codebase, set up local dev, deploy |
| [Deployment Runbook](./deployment-runbook.md) | Deploy to production, verify, rollback |

## Quick Reference

```bash
# Deploy (automatic on push to main, or manual)
cd wandstore-runtime/worker && npx wrangler deploy

# Type check
cd wandstore-runtime/worker && npx tsc --noEmit

# Build container
cd wandstore-runtime/container && npm run build

# View live logs
cd wandstore-runtime/worker && npx wrangler tail
```
