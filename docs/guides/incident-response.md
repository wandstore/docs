# Incident Response

How to handle outages and incidents for WandStore.

## Severity Levels

| Level | Description | Response Time | Examples |
|-------|-------------|---------------|----------|
| **P1** | Complete outage | 15 minutes | All storefronts down, checkout broken |
| **P2** | Major degradation | 1 hour | Slow responses, partial feature failure |
| **P3** | Minor issue | 4 hours | Single store affected, non-critical bug |
| **P4** | Cosmetic | 24 hours | UI glitches, minor display issues |

## On-Call Responsibilities

1. Acknowledge alerts within SLA
2. Assess severity and impact
3. Communicate in #incidents Slack channel
4. Coordinate response
5. Document timeline and resolution

## Response Playbooks

### P1: Complete Outage

```
1. ACKNOWLEDGE (0-5 min)
   → Post in #incidents: "Investigating P1 outage"
   → Check Cloudflare Status: https://www.cloudflarestatus.com

2. ASSESS (5-15 min)
   → Check Worker error rates in Dashboard
   → Test critical endpoints manually
   → Identify scope (all stores vs specific)

3. MITIGATE (15-30 min)
   → If code issue: Rollback to last known good
   → If upstream issue: Enable fallback mode
   → If Cloudflare issue: Wait + communicate

4. COMMUNICATE (ongoing)
   → Post updates every 15 min in #incidents
   → Notify stakeholders if customer-facing

5. RESOLVE
   → Verify all systems healthy
   → Post incident summary
   → Schedule post-mortem
```

### High Error Rate

**Symptoms:** Error rate > 5% in Cloudflare Dashboard

```bash
# Check recent logs
npx wrangler tail --format=pretty

# Look for patterns
# - Specific error messages
# - Specific stores/shopper affected
# - Recent deployments
```

**Common Causes:**
- Bad deployment → Rollback
- Shopify API issues → Enable cache-only mode
- DO migration issue → Check migration status

### Slow Response Times

**Symptoms:** P95 latency > 500ms

**Investigation:**
1. Check DO hibernation rates
2. Verify Shopify API response times
3. Check for N+1 queries in DO code

**Mitigation:**
- Increase edge cache TTL temporarily
- Enable aggressive DO caching
- Scale up if hitting limits

## Communication Templates

### Initial Alert (Slack #incidents)

```
🚨 P[1-2] Incident: [Brief description]

Impact: [What's affected]
Started: [Time]
Detecting: [How we found out]
Status: Investigating

Thread for updates ↓
```

### Status Update

```
⏳ Update [X min in]:

Current: [What we know]
Actions: [What we're doing]
ETA: [When we expect resolution]
```

### All Clear

```
✅ Resolved: [Brief description]

Duration: [X minutes]
Resolution: [What fixed it]
Post-mortem: [Link or scheduled time]
```

## Runbook: Common Issues

### Issue: DO Storage Full

```bash
# Check storage usage
npx wrangler d1 info

# If near limit:
# 1. Identify large DOs
# 2. Archive old data to R2
# 3. Implement cleanup job
```

### Issue: Shopify Rate Limiting

```bash
# Check Shopify API rate limits
# In Shopify Partner Dashboard → Apps → wandstore

# Mitigation:
# 1. Enable aggressive caching
# 2. Reduce sync frequency
# 3. Contact Shopify support if persistent
```

### Issue: Cache Poisoning

```bash
# Purge all cache
npx wrangler cache purge

# Or selective purge by tag
npx wrangler cache purge --tag=store:magic-wands
```

## Post-Incident Process

1. **Within 24 hours:** Write incident summary
2. **Within 1 week:** Conduct post-mortem meeting
3. **Within 2 weeks:** Implement action items

### Post-Mortem Template

```markdown
# Post-Mortem: [Incident Title]

## Summary
- **Date:** YYYY-MM-DD
- **Duration:** X minutes
- **Severity:** P[1-4]
- **Impact:** [What was affected]

## Timeline
- 10:00 - Issue detected via alert
- 10:05 - On-call acknowledged
- 10:15 - Root cause identified
- 10:30 - Mitigation deployed
- 10:45 - All systems healthy

## Root Cause
[What caused the issue]

## Resolution
[How we fixed it]

## Action Items
- [ ] [Action] - Owner - Due date
- [ ] [Action] - Owner - Due date

## Lessons Learned
[What we learned]
```

## Escalation

If you need help:

1. **Technical:** Tag @platform-team in Slack
2. **Business:** Contact @product-manager
3. **External:** Cloudflare Enterprise Support (if available)

## Useful Links

- [Cloudflare Status](https://www.cloudflarestatus.com)
- [Shopify Status](https://status.shopify.com)
- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [Internal Metrics Dashboard](https://...)

---

*On-call rotation: [Link to PagerDuty/Opsgenie]*
