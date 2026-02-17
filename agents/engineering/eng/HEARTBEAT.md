# HEARTBEAT.md — Engineering Heartbeat Checklist

Run through this checklist on every wake. Respond HEARTBEAT_OK if nothing needs attention.

## 1. Check WORKING.md
- [ ] Read memory/WORKING.md for active PRs and in-progress work.
- [ ] Any stale PRs (open >24h without review)?
- [ ] Any known bugs that need attention?

## 2. Check Mentions and Messages
- [ ] Any new @eng mentions in Telegram?
- [ ] Any new tasks assigned to you in Mission Control?
- [ ] Any messages from Ops about new priorities?

## 3. CI/CD Check
- [ ] Is the main branch build green?
- [ ] Any failing tests? If yes: investigate and fix or log as flaky.
- [ ] Any pending deployments waiting for approval?

## 4. Storefront Health
- [ ] Any error spikes in logs?
- [ ] Any reported customer-facing issues from Support?

## 5. Act or Report
If action is needed: handle it, update WORKING.md, and report.
If nothing needs attention: respond HEARTBEAT_OK with a one-line summary.
