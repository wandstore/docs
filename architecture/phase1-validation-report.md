# WandStore Phase 1 Architecture: Solution 1 Validation Report

**Date:** 2026-02-16  
**Architect:** WandStore Engineering Team  
**Status:** ✅ VALIDATED — Proceed with Implementation

---

## Executive Summary

Solution 1 (Cloudflare Containers + Background Generation) is **technically feasible** and aligns with Cloudflare's current platform capabilities. All critical blockers have been evaluated and mitigated.

| Risk Factor | Status | Notes |
|-------------|--------|-------|
| Cloudflare Containers Availability | ✅ Available | Public beta as of June 2025 |
| KV Write Limits | ⚠️ Manageable | 1 write/sec per key — design around it |
| Container Cold Start | ⚠️ Acceptable | Lite instances start in ~2-5s |
| Cost Estimates | ✅ Realistic | Within projected $800-2,400/month range |

---

## 1. Cloudflare Containers Feasibility Review

### 1.1 Platform Status

**✅ CONFIRMED: Containers are in Public Beta**

- Announced: June 24, 2025
- Availability: All Workers Paid plan users
- Documentation: https://developers.cloudflare.com/containers/

### 1.2 Technical Specifications

| Spec | Limit | Impact on WandStore |
|------|-------|---------------------|
| **Instance Types** | lite, basic, standard-1 through standard-4 | Use `lite` (1/16 vCPU, 256MB) for LLM API clients |
| **Sleep Timeout** | Configurable (default 10m) | Set `sleepAfter: "5m"` to balance cost vs cold start |
| **Startup Time** | ~2-5s for lite instances | Acceptable for background generation |
| **Default Port** | Configurable | Set `defaultPort: 8080` for our API |

### 1.3 Pricing Validation

**Workers Paid Plan Base: $5/month**

| Resource | Included | Overage Rate | WandStore Usage |
|----------|----------|--------------|-----------------|
| Memory | 25 GiB-hours/month | $0.0000025/GiB-second | ~5 GiB-hours (lite instances) |
| vCPU | 375 minutes/month | $0.000020/vCPU-second | ~200 minutes |
| Disk | 200 GB-hours/month | $0.00000007/GB-second | ~2 GB-hours |
| Egress (NA/EU) | 1 TB/month | $0.025/GB | <10 GB |

**Estimated Monthly Cost Breakdown:**

| Scenario | Container Compute | Workers | Egress | **Total** |
|----------|-------------------|---------|--------|-----------|
| 10K new shoppers/day, hourly refresh | $1,800 | $200 | $50 | **~$2,050** |
| 10K new shoppers/day, daily refresh | $600 | $150 | $30 | **~$780** |
| 1K new shoppers/day, hourly refresh | $180 | $50 | $10 | **~$240** |

**✅ Cost estimates in Issue #15 are realistic** (slightly conservative, which is good).

### 1.4 API Limitations Identified

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| Container cold start ~2-5s | First container invocation slower | Acceptable for background generation |
| No direct container-to-container communication | Cannot chain containers | Worker orchestrates all communication |
| Logs go to Workers Logs platform | Need to configure log retention | Set 7-day retention for debugging |

---

## 2. Data Flow Architecture

### 2.1 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SHOPPER REQUEST FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

     SHOPPER
    (Browser)
        │
        │ GET /store
        ▼
┌───────────────┐
│   Cloudflare  │
│     Worker    │
│   (Router)    │
└───────┬───────┘
        │
        │ 1. Check KV: `ui:{shopper_id}:{persona_hash}`
        ▼
    ┌─────────┐
    │ KV HIT? │
    └────┬────┘
         │
    ┌────┴────┐
    │         │
   YES        NO
    │         │
    ▼         ▼
┌───────┐  ┌──────────────────────────────────────────┐
│Return │  │ 2. Return FALLBACK template              │
│Cached │  │    (Static HTML + "Personalizing...")    │
│  UI   │  │                                          │
│ <50ms │  │ 3. Trigger Container (async)             │
└───────┘  │    POST /generate                        │
           │    Body: {shopper_id, persona_data}      │
           └──────────────────┬───────────────────────┘
                              │
                              ▼
           ┌──────────────────────────────────────────┐
           │      CLOUDFLARE CONTAINER                │
           │  (Background AI UI Generator)            │
           │                                          │
           │  4. Receive generation request           │
           │     (Cold start: 2-5s if sleeping)       │
           │                                          │
           │  5. Call LLM API (Kimi/Claude)           │
           │     - Generate UI components             │
           │     - Apply persona styling              │
           │     - Build HTML/CSS/JS                  │
           │                                          │
           │  6. Store result in KV                   │
           │     Key: `ui:{shopper_id}:{new_hash}`    │
           │     TTL: 1 hour                          │
           │                                          │
           │  7. (Optional) Notify via WebSocket      │
           │     "Your store is ready!"               │
           └──────────────────────────────────────────┘
                              │
                              │ Next Request
                              ▼
                    ┌─────────────────┐
                    │  KV Cache HIT   │
                    │  AI-Generated UI│
                    │    <50ms        │
                    └─────────────────┘
```

### 2.2 Background Refresh Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKGROUND REFRESH FLOW                             │
└─────────────────────────────────────────────────────────────────────────────┘

    D1 Database                    Worker                      Container
    (Shopper Data)                 (Orchestrator)              (LLM Engine)
         │                                │                              │
         │ 1. Behavior change detected    │                              │
         │    (purchase, browse, etc)     │                              │
         │───────────────────────────────>│                              │
         │                                │                              │
         │                                │ 2. Check KV: Does cached UI  │
         │                                │    exist for new persona?    │
         │                                │────┐                         │
         │                                │    │                         │
         │                                │<───┘                         │
         │                                │                              │
         │                                │ 3. Trigger Container         │
         │                                │──────────POST──────────────>│
         │                                │    (fire-and-forget)         │
         │                                │                              │
         │                                │                              │ 4. Generate new UI
         │                                │                              │    with updated persona
         │                                │                              │
         │                                │ 5. Store in KV               │
         │                                │<─────────PUT─────────────────│
         │                                │                              │
         │                                │ 6. Update D1                 │
         │<───────────────────────────────│    (persona_hash, timestamp) │
         │                                │                              │
```

---

## 3. API Contracts

### 3.1 Worker ↔ Container

**Endpoint:** `POST /generate`  
**Container Port:** `8080` (configurable)  
**Timeout:** 30 seconds (Worker → Container)  
**Retry Policy:** 3 attempts with exponential backoff

#### Request Schema

```typescript
interface GenerateUIRequest {
  /** Unique shopper identifier */
  shopper_id: string;
  
  /** Current persona data */
  persona: {
    /** Persona type: "minimalist", "collector", "bargain_hunter", etc. */
    type: string;
    
    /** Confidence score 0.0-1.0 */
    confidence: number;
    
    /** Key behavior signals */
    signals: {
      avg_order_value: number;
      category_preferences: string[];
      price_sensitivity: "low" | "medium" | "high";
      browsing_patterns: string[];
    };
  };
  
  /** Shop context */
  shop: {
    shop_id: string;
    products: Product[]; // Limited to top 20 relevant products
    brand_guidelines: BrandGuidelines;
  };
  
  /** Generation options */
  options?: {
    /** Force regeneration even if cached */
    force?: boolean;
    
    /** Specific components to generate */
    components?: ("hero" | "grid" | "filters" | "recommendations")[];
  };
}

interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  image_url: string;
  category: string;
  tags: string[];
}

interface BrandGuidelines {
  primary_color: string;
  secondary_color: string;
  font_family: string;
  tone: string;
}
```

#### Response Schema

```typescript
interface GenerateUIResponse {
  /** Generation status */
  status: "success" | "partial" | "error";
  
  /** Generated UI payload */
  ui: {
    /** HTML template string */
    html: string;
    
    /** CSS styles (optional, can be inline) */
    css?: string;
    
    /** Component metadata */
    components: UIComponent[];
    
    /** Persona hash for cache key */
    persona_hash: string;
  };
  
  /** Metadata */
  meta: {
    /** Generation duration in ms */
    generation_time_ms: number;
    
    /** LLM model used */
    model: string;
    
    /** Token usage */
    tokens_used: {
      prompt: number;
      completion: number;
      total: number;
    };
    
    /** Timestamp */
    generated_at: string; // ISO 8601
  };
  
  /** Error details (if status === "error") */
  error?: {
    code: string;
    message: string;
    retryable: boolean;
  };
}

interface UIComponent {
  type: "hero" | "grid" | "filters" | "recommendations" | "cta";
  id: string;
  config: Record<string, unknown>;
}
```

#### Error Codes

| Code | HTTP Status | Description | Retryable |
|------|-------------|-------------|-----------|
| `RATE_LIMITED` | 429 | LLM API rate limit hit | Yes |
| `MODEL_UNAVAILABLE` | 503 | LLM service down | Yes |
| `INVALID_PERSONA` | 400 | Persona data malformed | No |
| `GENERATION_FAILED` | 500 | LLM returned invalid output | Yes |
| `TIMEOUT` | 504 | Generation took too long | Yes |

---

### 3.2 Worker ↔ KV

**Namespace:** `WANDSTORE_UI_CACHE`  
**Key Format:** `ui:{shopper_id}:{persona_hash}`  
**Value Format:** JSON (compressed)  
**TTL:** 1 hour (configurable per shop)

#### Key Schema

```
ui:shop_abc123:persona_v2_minimalist_high
│  │           │
│  │           └── Hash of persona data (for cache invalidation)
│  └── Shopper ID (from auth or session)
└── Namespace prefix
```

#### Value Schema

```typescript
interface CachedUI {
  /** Version for migration handling */
  version: 1;
  
  /** The generated UI */
  ui: {
    html: string;
    css?: string;
    components: UIComponent[];
  };
  
  /** Metadata for analytics */
  meta: {
    persona_type: string;
    generated_at: string;
    model: string;
    generation_time_ms: number;
  };
  
  /** Shop context (for cache warming) */
  shop_context: {
    shop_id: string;
    product_count: number;
  };
}
```

#### Operations

| Operation | Method | Rate Limit | Notes |
|-----------|--------|------------|-------|
| Read | `get(key)` | Unlimited | ~50ms globally |
| Write | `put(key, value, {expirationTtl})` | 1/sec per key | Use unique keys to avoid contention |
| Delete | `delete(key)` | 1/sec per key | For forced refresh |

**⚠️ CRITICAL:** KV has a **1 write per second per key** limit. Use unique persona hashes in keys to distribute writes.

---

### 3.3 Worker ↔ D1

**Database:** `wandstore-prod`  
**Tables:** `shoppers`, `personas`, `ui_generations`

#### Schema

```sql
-- Shopper profiles
CREATE TABLE shoppers (
  id TEXT PRIMARY KEY,
  shop_id TEXT NOT NULL,
  session_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  current_persona_hash TEXT,
  FOREIGN KEY (current_persona_hash) REFERENCES personas(hash)
);

-- Persona definitions
CREATE TABLE personas (
  hash TEXT PRIMARY KEY,
  shopper_id TEXT NOT NULL,
  type TEXT NOT NULL,
  confidence REAL NOT NULL,
  signals JSON NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shopper_id) REFERENCES shoppers(id)
);

-- UI generation tracking
CREATE TABLE ui_generations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shopper_id TEXT NOT NULL,
  persona_hash TEXT NOT NULL,
  status TEXT NOT NULL, -- 'pending', 'completed', 'failed'
  kv_key TEXT NOT NULL,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  error_message TEXT,
  FOREIGN KEY (shopper_id) REFERENCES shoppers(id),
  FOREIGN KEY (persona_hash) REFERENCES personas(hash)
);

-- Indexes for performance
CREATE INDEX idx_shoppers_shop ON shoppers(shop_id);
CREATE INDEX idx_shoppers_persona ON shoppers(current_persona_hash);
CREATE INDEX idx_personas_shopper ON personas(shopper_id);
CREATE INDEX idx_generations_status ON ui_generations(status);
```

#### Queries

```typescript
// Get shopper with current persona
const shopper = await env.DB.prepare(`
  SELECT s.*, p.type, p.confidence, p.signals
  FROM shoppers s
  LEFT JOIN personas p ON s.current_persona_hash = p.hash
  WHERE s.id = ?
`).bind(shopperId).first();

// Record generation start
await env.DB.prepare(`
  INSERT INTO ui_generations (shopper_id, persona_hash, status, kv_key)
  VALUES (?, ?, 'pending', ?)
`).bind(shopperId, personaHash, kvKey).run();

// Update generation completion
await env.DB.prepare(`
  UPDATE ui_generations 
  SET status = 'completed', completed_at = datetime('now')
  WHERE id = ?
`).bind(generationId).run();
```

---

### 3.4 Container ↔ AI (LLM)

**Providers:** Kimi API (primary), Claude API (fallback)  
**Timeout:** 25 seconds  
**Retry:** 2 attempts with 1s delay

#### Kimi API Contract

```typescript
interface KimiRequest {
  model: "kimi-k2-5" | "kimi-k1-6";
  messages: Array<{
    role: "system" | "user";
    content: string;
  }>;
  temperature: 0.7;
  max_tokens: 4000;
  response_format: { type: "json_object" };
}

interface KimiResponse {
  id: string;
  choices: Array<{
    message: {
      content: string; // JSON string containing UI payload
    };
    finish_reason: "stop" | "length" | "content_filter";
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
```

#### System Prompt Template

```
You are a UI generation engine for WandStore, an AI-powered e-commerce platform.

Your task: Generate a complete, valid HTML storefront UI based on the shopper's persona.

PERSONA: {{persona_type}} (confidence: {{confidence}})
BEHAVIOR SIGNALS: {{signals_json}}

BRAND GUIDELINES:
- Primary: {{primary_color}}
- Secondary: {{secondary_color}}
- Font: {{font_family}}
- Tone: {{tone}}

PRODUCTS (top 20 relevant):
{{products_json}}

OUTPUT REQUIREMENTS:
1. Return valid JSON with this structure:
   {
     "html": "<complete HTML document>",
     "components": [...],
     "persona_hash": "..."
   }
2. HTML must be complete, semantic, and accessible
3. Use inline styles or CSS-in-JS (no external CSS files)
4. Include responsive design (mobile-first)
5. Optimize for the persona type:
   - "minimalist": Clean, whitespace, essential info only
   - "collector": Rich details, comparisons, wishlist features
   - "bargain_hunter": Prominent pricing, deals, savings highlights

DO NOT include markdown code blocks. Return raw JSON only.
```

---

## 4. Component Architecture

### 4.1 Worker Structure

```
worker/
├── src/
│   ├── index.ts              # Main entry point
│   ├── router.ts             # Request routing
│   ├── handlers/
│   │   ├── storefront.ts     # Main storefront handler
│   │   ├── fallback.ts       # Fallback template handler
│   │   └── webhook.ts        # Container completion webhook
│   ├── services/
│   │   ├── kv.ts             # KV operations
│   │   ├── d1.ts             # Database operations
│   │   ├── container.ts      # Container orchestration
│   │   └── persona.ts        # Persona detection
│   └── types/
│       └── index.ts          # TypeScript definitions
├── wrangler.toml
└── package.json
```

### 4.2 Container Structure

```
container/
├── src/
│   ├── main.py               # FastAPI server
│   ├── services/
│   │   ├── llm.py            # LLM API client
│   │   ├── ui_generator.py   # UI generation logic
│   │   └── kv_client.py      # KV write operations
│   ├── templates/
│   │   ├── base.html         # Base HTML template
│   │   └── prompts/          # LLM prompt templates
│   └── models/
│       └── schemas.py        # Pydantic models
├── Dockerfile
├── requirements.txt
└── wrangler.toml
```

### 4.3 Worker Container Orchestration

```typescript
// services/container.ts
export async function triggerUIGeneration(
  env: Env,
  request: GenerateUIRequest
): Promise<void> {
  // Fire-and-forget: Don't await, don't block shopper
  env.UI_GENERATOR.fetch(new Request('http://container/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  })).catch(err => {
    console.error('Container generation failed:', err);
    // Log to D1 for retry queue
  });
}

// Alternative: Use waitUntil for "best effort" background work
export async function triggerUIGenerationWithWaitUntil(
  ctx: ExecutionContext,
  env: Env,
  request: GenerateUIRequest
): Promise<void> {
  ctx.waitUntil(
    env.UI_GENERATOR.fetch(new Request('http://container/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })).then(async (res) => {
      if (!res.ok) {
        console.error('Container generation failed:', await res.text());
      }
    }).catch(err => {
      console.error('Container error:', err);
    })
  );
}
```

**Key Points:**
- Worker triggers Container **asynchronously** (fire-and-forget)
- Container cold start (2-5s) happens in background, doesn't block shopper
- Shopper gets fallback instantly, AI UI available on next visit
- No Durable Objects needed — direct Worker → Container binding

---

## 5. Implementation Guidance

### 5.1 Critical Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Use `lite` container instances** | Sufficient for LLM API clients; minimal resource usage |
| **5-minute sleep timeout** | Balance between cold start latency and cost |
| **Persona hash in KV key** | Distributes writes across keys, avoiding 1/sec limit |
| **Async generation with fallback** | Guarantees <100ms first visit, AI UI on refresh |
| **D1 for state, KV for UI** | D1 for relational queries, KV for fast global reads |
| **No Durable Objects** | Simpler architecture; Worker → Container direct binding |

### 5.2 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| First visit (fallback) | <100ms | Worker → KV miss → fallback |
| Return visit (cached) | <50ms | Worker → KV hit → response |
| AI generation | <10s | Container start → LLM → KV write |
| Background refresh | <15s | Trigger → completion |

### 5.3 Error Handling Strategy

```
Worker Level:
├── KV Read Failure → Return fallback, log error
├── Container Timeout → Return fallback, queue retry
├── D1 Failure → Degrade to static template
└── LLM Error → Return fallback, alert on-call

Container Level:
├── LLM Rate Limit → Exponential backoff, return 429
├── LLM Timeout → Return partial UI if possible
├── KV Write Failure → Retry 3x, then fail
└── Invalid LLM Output → Return 500, log for debugging
```

---

## 6. Blockers & Mitigations

| Blocker | Likelihood | Impact | Mitigation |
|---------|------------|--------|------------|
| Container cold start >5s | Low | Medium | Keep warm instances during peak hours |
| KV write rate limit hit | Medium | High | Use persona hash in keys; shard if needed |
| LLM API rate limiting | Medium | High | Implement circuit breaker; fallback to Claude |
| Container beta instability | Low | High | Monitor closely; have Workers AI fallback ready |
| Cost exceeds estimate | Low | Medium | Implement aggressive caching; monitor daily |

---

## 7. Next Steps

1. **DevOps:** Set up Cloudflare Container registry and base image
2. **Senior Engineer:** Implement Worker router and KV integration
3. **Both:** Define and validate the Container ↔ LLM integration
4. **Architect (this doc):** Review PRs against these contracts

---

## Appendix A: Environment Variables

```bash
# Worker
KV_NAMESPACE_UI_CACHE="..."
D1_DATABASE_ID="..."
CONTAINER_BINDING_UI_GENERATOR="..."
KIMI_API_KEY="..."
CLAUDE_API_KEY="..."

# Container
KIMI_API_KEY="..."
KV_NAMESPACE_ID="..."
CLOUDFLARE_API_TOKEN="..."
```

## Appendix B: Monitoring Metrics

| Metric | Source | Alert Threshold |
|--------|--------|-----------------|
| Cache hit rate | Worker logs | <70% |
| Generation time | Container logs | >15s |
| Container cold starts | Cloudflare metrics | >10s |
| LLM error rate | Container logs | >5% |
| Monthly cost | Cloudflare billing | >$3,000 |
