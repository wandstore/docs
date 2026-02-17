# Runtime UI Generation with Cloudflare Durable Objects

## Executive Summary

This document outlines how to generate personalized storefront UIs at runtime using Cloudflare Durable Objects (DOs). The recommended approach uses **HTML template string generation within Durable Objects** combined with **edge-side caching** for optimal performance.

## Research Date
2026-02-17

## Options Evaluated

### Option A: SSR with Workers (Recommended for MVP)

**Approach:** Use Cloudflare Workers to render HTML templates at the edge.

**Pros:**
- 0ms cold start
- Sub-50ms response times globally
- Native integration with Cache API
- Simple mental model

**Cons:**
- Limited to template string generation (no React/Vue runtime)
- No client-side hydration without additional JS bundle

**Best For:** MVP with simple personalization needs

---

### Option B: Edge-Side Template Compilation

**Approach:** Pre-compile templates (Handlebars, EJS, Mustache) into Workers, render at edge.

**Pros:**
- Mature templating ecosystems
- Logic-less templates enforce separation of concerns
- Fast rendering (compiled templates)

**Cons:**
- Additional bundle size
- Limited dynamic capabilities

**Best For:** Complex template logic, multi-store setups

---

### Option C: HTML String Generation in Durable Objects (SELECTED)

**Approach:** DOs store shopper state + templates, generate HTML on-demand.

**Pros:**
- Stateful personalization (session history, preferences)
- Strong consistency for shopper data
- Can cache generated HTML per-shopper

**Cons:**
- DO location = first request location (may not be optimal)
- Higher latency than pure Worker (adds ~10-50ms)

**Best For:** High-personalization scenarios with stateful shopper sessions

---

### Option D: JSX/React Rendering at Edge

**Approach:** Use React/Preact SSR within Workers (e.g., Flareact, Hono JSX).

**Pros:**
- Familiar React patterns
- Component reusability
- Rich ecosystem

**Cons:**
- Larger bundle size (~100KB+ vs ~5KB)
- Slower cold starts
- Memory pressure in Workers

**Best For:** Complex interactive UIs, team with React expertise

---

### Option E: Hono + JSX (Balanced Approach)

**Approach:** Lightweight JSX framework designed for edge.

**Pros:**
- ~5KB runtime (vs 100KB+ React)
- JSX familiarity without React overhead
- Excellent TypeScript support
- Built for Cloudflare Workers

**Cons:**
- Smaller ecosystem than React
- Learning curve for non-JSX developers

**Best For:** Best balance of DX and performance

---

## Performance Comparison

| Approach | Cold Start | Warm Response | Bundle Size | Personalization |
|----------|------------|---------------|-------------|-----------------|
| Worker + Templates | 0-5ms | 1-10ms | ~5KB | ⭐⭐ |
| DO + Templates | 0-5ms | 10-50ms | ~5KB | ⭐⭐⭐⭐⭐ |
| Hono JSX | 0-5ms | 5-15ms | ~5KB | ⭐⭐⭐ |
| React SSR | 50-100ms | 10-50ms | ~100KB | ⭐⭐⭐⭐⭐ |

## Recommendation

**For MVP:** Use **Durable Objects with HTML template strings**

**Rationale:**
1. Stateful personalization is a core requirement
2. 10-50ms warm response is acceptable
3. Simplest implementation
4. Easy to optimize later

**For Future:** Consider Hono JSX if template complexity grows

## References

- [Cloudflare Durable Objects Documentation](https://developers.cloudflare.com/durable-objects/)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- Issue #14: Runtime UI Generation

---

*Research completed: 2026-02-17*
