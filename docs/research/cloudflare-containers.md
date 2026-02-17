# Cloudflare Containers Research

## Executive Summary

After researching **Cloudflare Containers** (now in public beta as of June 2025), we determined that while Containers are a powerful addition to the Cloudflare platform, **they are NOT the optimal choice for WandStore's runtime UI generation use case** due to cold start latency (1-5 seconds vs. milliseconds for Durable Objects).

**Recommendation:** Use **Durable Objects with HTML template generation** for the MVP. Consider Containers only for specific resource-intensive workloads (e.g., AI-powered personalization, image processing).

## Research Date
2026-02-17

## What Are Cloudflare Containers?

Cloudflare Containers are **serverless containers** that run on Cloudflare's global network, integrated deeply with Workers and Durable Objects.

### Key Characteristics

| Feature | Description |
|---------|-------------|
| **Runtime** | Full Linux containers (Docker-compatible) |
| **Languages** | Any (Node.js, Python, Go, Rust, etc.) |
| **Integration** | Controlled via Workers + Durable Objects |
| **Scaling** | Scale-to-zero (no cost when idle) |
| **State** | Ephemeral disk (no persistent volumes yet) |
| **Location** | Region: Earth (global scheduling) |

### Instance Types

| Instance | vCPU | Memory | Disk | Best For |
|----------|------|--------|------|----------|
| `lite` | 1/16 | 256 MiB | 2 GB | Microservices, health checks |
| `basic` | 1/4 | 1 GiB | 4 GB | Small web servers |
| `standard-1` | 1/2 | 4 GiB | 8 GB | Medium workloads |
| `standard-2` | 1 | 6 GiB | 12 GB | Heavy processing |
| `standard-3` | 2 | 8 GiB | 16 GB | AI/ML inference |
| `standard-4` | 4 | 12 GiB | 20 GB | Video processing |

## Performance Comparison: Containers vs Durable Objects

### Cold Start Latency

| Platform | Cold Start | Warm Response |
|----------|------------|---------------|
| **Workers** | 0-5ms | 1-10ms |
| **Durable Objects** | 0-5ms | 1-10ms |
| **Containers (lite)** | 500ms-2s | 10-50ms |
| **Containers (standard-2)** | 1-5s | 10-50ms |

**Critical Issue:** Containers have **cold starts measured in seconds**, not milliseconds. This is unacceptable for storefront UI generation where shoppers expect instant page loads.

### Why Are Containers Slower?

```
Container Cold Start Timeline:
├── Image Pull (if not cached): 500ms - 2s
├── Container Runtime Init:     200ms - 500ms
├── Application Boot:           300ms - 2s
└── First Request Handling:     10ms - 50ms
    TOTAL: 1-5 seconds
```

## Use Case Analysis: When to Use What

### ✅ Use Durable Objects When:

| Scenario | Why DOs Win |
|----------|-------------|
| **Sub-100ms response required** | 0-5ms cold start vs. 1-5s for Containers |
| **Stateful shopper sessions** | SQLite storage + in-memory state |
| **Template-based UI generation** | HTML string generation is fast in V8 |
| **High-frequency requests** | No container warmup needed |
| **Cost-sensitive workloads** | Pay only for actual compute time |

### ✅ Use Containers When:

| Scenario | Why Containers Win |
|----------|-------------------|
| **AI-powered personalization** | Need GPU or heavy ML models |
| **Image/video processing** | FFmpeg, Sharp, etc. |
| **Legacy app migration** | Existing Docker images |
| **Multi-language requirements** | Python data science libs, etc. |
| **Complex rendering pipelines** | Puppeteer, headless Chrome |

## WandStore-Specific Analysis

### Current Requirements

1. ✅ Generate personalized storefronts at runtime
2. ✅ Response time < 100ms
3. ✅ Stateful shopper sessions
4. ✅ Shopify integration
5. ✅ One template per shopper (MVP)

### Recommendation Matrix

| Approach | Cold Start | Warm Latency | Personalization | Cost | Fit |
|----------|------------|--------------|-----------------|------|-----|
| **DO + HTML Templates** | **5ms** | **10ms** | ⭐⭐⭐⭐⭐ | $ | ✅ **Best** |
| DO + Hono JSX | 5ms | 15ms | ⭐⭐⭐⭐⭐ | $ | ✅ Good |
| Container + Express | 2s | 50ms | ⭐⭐⭐⭐⭐ | $$ | ❌ Too slow |
| Container (always warm) | 0ms | 50ms | ⭐⭐⭐⭐⭐ | $$$ | ❌ Expensive |

## Hybrid Architecture (Future-Proofing)

For future AI-powered features, consider a **hybrid approach**:

```
Shopper Request → Worker → Route Decision
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
            Standard      Personalized     AI Features
            (DO)          (DO)             (Container)
            < 50ms        < 100ms          Async
```

## Pricing Comparison

### Durable Objects
- **Requests:** $0.12/million requests
- **Storage:** $0.20/GB-month
- **Compute:** Included in Workers plan ($5/month)

### Containers
| Resource | Price |
|----------|-------|
| CPU | $0.000020/vCPU-second |
| Memory | $0.0000025/GB-second |
| Disk | $0.00000007/GB-second |
| Egress | $0.025/GB (1TB free) |

### Cost Example: 1M Requests/Month

**Scenario:** 1M storefront page views, avg 100ms compute time

| Approach | Estimated Cost |
|----------|----------------|
| DO + HTML | ~$5 (Workers plan) |
| Container (cold) | ~$50-100 (cold starts) |
| Container (warm) | ~$200-400 (always on) |

## Final Recommendation

### For WandStore MVP

**Use Durable Objects with HTML template generation.**

Containers are powerful but the **cold start latency (1-5 seconds) is unacceptable** for storefront UI generation where shoppers expect instant page loads.

### When to Revisit Containers

Consider Containers when WandStore needs:
1. **AI-powered personalization** (LLM inference)
2. **Image generation/processing** (product visuals)
3. **PDF generation** (invoices, reports)
4. **Video processing** (product demos)

## References

- [Cloudflare Containers Documentation](https://developers.cloudflare.com/containers/)
- [Containers Announcement Blog](https://blog.cloudflare.com/cloudflare-containers-coming-2025/)
- [Containers Pricing](https://developers.cloudflare.com/containers/pricing/)
- Issue #14: Runtime UI Generation

---

*Research completed: 2026-02-17*
