# WandStore API Contracts

**Version:** 1.0.0  
**Status:** Phase 1 Implementation  
**Last Updated:** 2026-02-16

---

## Table of Contents

1. [Overview](#overview)
2. [Worker ↔ Container API](#worker--container-api)
3. [Worker ↔ KV API](#worker--kv-api)
4. [Worker ↔ D1 API](#worker--d1-api)
5. [Container ↔ AI (LLM) API](#container--ai-llm-api)
6. [WebSocket Events](#websocket-events)
7. [Error Handling](#error-handling)

---

## Overview

This document defines the API contracts between all components in the WandStore Phase 1 architecture. All APIs use JSON for request/response bodies unless otherwise specified.

### Base URLs

| Component | Environment | Base URL |
|-----------|-------------|----------|
| Worker | Production | `https://wandstore.workers.dev` |
| Container | Production | Internal (via Worker binding) |
| KV | Production | Internal (via Worker binding) |
| D1 | Production | Internal (via Worker binding) |
| Kimi API | Production | `https://api.moonshot.cn/v1` |
| Claude API | Fallback | `https://api.anthropic.com/v1` |

### Authentication

| Component | Method |
|-----------|--------|
| Worker → Container | Service binding (no auth needed) |
| Worker → KV | Service binding (no auth needed) |
| Worker → D1 | Service binding (no auth needed) |
| Container → KV | Cloudflare API Token |
| Container → Kimi | API Key in Authorization header |
| Container → Claude | API Key in x-api-key header |

---

## Worker ↔ Container API

### POST /generate

Generate AI-powered UI for a shopper based on their persona.

**Endpoint:** `POST /generate`  
**Container Port:** `8080`  
**Timeout:** 30 seconds  
**Retry Policy:** 3 attempts with exponential backoff (1s, 2s, 4s)

#### Request

```http
POST /generate HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "shopper_id": "shop_abc123",
  "persona": {
    "type": "minimalist",
    "confidence": 0.85,
    "signals": {
      "avg_order_value": 45.50,
      "category_preferences": ["electronics", "accessories"],
      "price_sensitivity": "medium",
      "browsing_patterns": ["quick_views", "filter_heavy"]
    }
  },
  "shop": {
    "shop_id": "store_xyz789",
    "products": [
      {
        "id": "prod_001",
        "title": "Wireless Earbuds Pro",
        "price": 79.99,
        "currency": "USD",
        "image_url": "https://cdn.example.com/earbuds.jpg",
        "category": "electronics",
        "tags": ["wireless", "bluetooth", "audio"]
      }
    ],
    "brand_guidelines": {
      "primary_color": "#6366F1",
      "secondary_color": "#8B5CF6",
      "font_family": "Inter, sans-serif",
      "tone": "modern, professional, friendly"
    }
  },
  "options": {
    "force": false,
    "components": ["hero", "grid", "filters"]
  }
}
```

#### Response (Success)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "success",
  "ui": {
    "html": "<!DOCTYPE html>...",
    "css": "/* optional styles */",
    "components": [
      {
        "type": "hero",
        "id": "hero_main",
        "config": {
          "title": "Discover Premium Audio",
          "subtitle": "Curated for discerning listeners",
          "cta_text": "Explore Collection"
        }
      },
      {
        "type": "grid",
        "id": "product_grid",
        "config": {
          "columns": 3,
          "show_filters": true,
          "sort_options": ["price", "popularity"]
        }
      }
    ],
    "persona_hash": "v2_minimalist_85_abc123"
  },
  "meta": {
    "generation_time_ms": 3450,
    "model": "kimi-k2-5",
    "tokens_used": {
      "prompt": 1250,
      "completion": 2800,
      "total": 4050
    },
    "generated_at": "2026-02-16T08:30:00Z"
  }
}
```

#### Response (Partial)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "partial",
  "ui": {
    "html": "<!DOCTYPE html>...",
    "components": [
      {
        "type": "hero",
        "id": "hero_main",
        "config": { ... }
      }
    ],
    "persona_hash": "v2_minimalist_85_abc123"
  },
  "meta": { ... },
  "error": {
    "code": "COMPONENT_TIMEOUT",
    "message": "Grid component generation timed out",
    "retryable": true
  }
}
```

#### Response (Error)

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "status": "error",
  "ui": null,
  "meta": {
    "generated_at": "2026-02-16T08:30:00Z"
  },
  "error": {
    "code": "LLM_UNAVAILABLE",
    "message": "Kimi API returned 503 Service Unavailable",
    "retryable": true
  }
}
```

---

### GET /health

Health check endpoint for container monitoring.

**Endpoint:** `GET /health`  
**Timeout:** 5 seconds

#### Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "healthy",
  "version": "1.0.0",
  "uptime_seconds": 3600,
  "checks": {
    "kv_connection": "ok",
    "llm_api": "ok"
  }
}
```

---

## Worker ↔ KV API

### Key Naming Convention

```
{namespace}:{shopper_id}:{persona_hash}
```

| Segment | Format | Example |
|---------|--------|---------|
| namespace | `ui` | `ui` |
| shopper_id | `shop_{uuid}` | `shop_abc123def` |
| persona_hash | `v{version}_{type}_{confidence}_{hash}` | `v2_minimalist_85_abc123` |

### Operations

#### Get UI Cache

```typescript
// TypeScript Worker code
const kvKey = `ui:${shopper_id}:${persona_hash}`;
const cached = await env.UI_CACHE.get(kvKey, { type: "json" });

if (cached) {
  return new Response(cached.ui.html, {
    headers: { "Content-Type": "text/html" }
  });
}
```

#### Set UI Cache

```typescript
const kvKey = `ui:${shopper_id}:${persona_hash}`;
const value: CachedUI = {
  version: 1,
  ui: {
    html: generatedHtml,
    css: generatedCss,
    components: components
  },
  meta: {
    persona_type: persona.type,
    generated_at: new Date().toISOString(),
    model: "kimi-k2-5",
    generation_time_ms: 3450
  },
  shop_context: {
    shop_id: shop.id,
    product_count: products.length
  }
};

// TTL: 1 hour (3600 seconds)
await env.UI_CACHE.put(kvKey, JSON.stringify(value), {
  expirationTtl: 3600
});
```

#### Delete UI Cache

```typescript
const kvKey = `ui:${shopper_id}:${persona_hash}`;
await env.UI_CACHE.delete(kvKey);
```

### Value Schema

```typescript
interface CachedUI {
  version: 1;
  ui: {
    html: string;
    css?: string;
    components: Array<{
      type: "hero" | "grid" | "filters" | "recommendations" | "cta";
      id: string;
      config: Record<string, unknown>;
    }>;
  };
  meta: {
    persona_type: string;
    generated_at: string; // ISO 8601
    model: string;
    generation_time_ms: number;
  };
  shop_context: {
    shop_id: string;
    product_count: number;
  };
}
```

### Rate Limits

| Operation | Limit | Notes |
|-----------|-------|-------|
| Reads | Unlimited | Globally distributed, ~50ms |
| Writes (same key) | 1/second | Use unique persona hashes |
| Writes (different keys) | Unlimited | Distribute across keys |
| List | 1000/operation | Not recommended for runtime |

---

## Worker ↔ D1 API

### Database Schema

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
  confidence REAL NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  signals JSON NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shopper_id) REFERENCES shoppers(id)
);

-- UI generation tracking
CREATE TABLE ui_generations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shopper_id TEXT NOT NULL,
  persona_hash TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  kv_key TEXT NOT NULL,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  error_message TEXT,
  FOREIGN KEY (shopper_id) REFERENCES shoppers(id),
  FOREIGN KEY (persona_hash) REFERENCES personas(hash)
);

-- Indexes
CREATE INDEX idx_shoppers_shop ON shoppers(shop_id);
CREATE INDEX idx_shoppers_persona ON shoppers(current_persona_hash);
CREATE INDEX idx_personas_shopper ON personas(shopper_id);
CREATE INDEX idx_generations_status ON ui_generations(status);
```

### Queries

#### Get Shopper with Persona

```typescript
const result = await env.DB.prepare(`
  SELECT 
    s.id as shopper_id,
    s.shop_id,
    s.current_persona_hash,
    p.type as persona_type,
    p.confidence,
    p.signals
  FROM shoppers s
  LEFT JOIN personas p ON s.current_persona_hash = p.hash
  WHERE s.id = ?
`).bind(shopperId).first();
```

#### Upsert Shopper

```typescript
await env.DB.prepare(`
  INSERT INTO shoppers (id, shop_id, session_id, current_persona_hash)
  VALUES (?, ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    last_seen_at = datetime('now'),
    current_persona_hash = excluded.current_persona_hash
`).bind(shopperId, shopId, sessionId, personaHash).run();
```

#### Insert Persona

```typescript
await env.DB.prepare(`
  INSERT INTO personas (hash, shopper_id, type, confidence, signals)
  VALUES (?, ?, ?, ?, ?)
`).bind(
  personaHash,
  shopperId,
  persona.type,
  persona.confidence,
  JSON.stringify(persona.signals)
).run();
```

#### Record Generation Start

```typescript
const result = await env.DB.prepare(`
  INSERT INTO ui_generations (shopper_id, persona_hash, status, kv_key)
  VALUES (?, ?, 'pending', ?)
  RETURNING id
`).bind(shopperId, personaHash, kvKey).first();

const generationId = result.id;
```

#### Update Generation Status

```typescript
// Success
await env.DB.prepare(`
  UPDATE ui_generations 
  SET status = 'completed', completed_at = datetime('now')
  WHERE id = ?
`).bind(generationId).run();

// Failure
await env.DB.prepare(`
  UPDATE ui_generations 
  SET status = 'failed', completed_at = datetime('now'), error_message = ?
  WHERE id = ?
`).bind(errorMessage, generationId).run();
```

---

## Container ↔ AI (LLM) API

### Kimi API (Primary)

**Base URL:** `https://api.moonshot.cn/v1`  
**Timeout:** 25 seconds  
**Retry:** 2 attempts with 1s delay

#### POST /chat/completions

```http
POST /chat/completions HTTP/1.1
Host: api.moonshot.cn
Authorization: Bearer {KIMI_API_KEY}
Content-Type: application/json

{
  "model": "kimi-k2-5",
  "messages": [
    {
      "role": "system",
      "content": "You are a UI generation engine..."
    },
    {
      "role": "user",
      "content": "Generate a storefront UI for persona: minimalist..."
    }
  ],
  "temperature": 0.7,
  "max_tokens": 4000,
  "response_format": {
    "type": "json_object"
  }
}
```

#### Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1707758400,
  "model": "kimi-k2-5",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "{\"html\":\"<!DOCTYPE html>...\",\"components\":[...],\"persona_hash\":\"...\"}"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 1250,
    "completion_tokens": 2800,
    "total_tokens": 4050
  }
}
```

### Claude API (Fallback)

**Base URL:** `https://api.anthropic.com/v1`  
**Timeout:** 25 seconds

#### POST /messages

```http
POST /messages HTTP/1.1
Host: api.anthropic.com
x-api-key: {CLAUDE_API_KEY}
Content-Type: application/json

{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 4000,
  "temperature": 0.7,
  "system": "You are a UI generation engine...",
  "messages": [
    {
      "role": "user",
      "content": "Generate a storefront UI for persona: minimalist..."
    }
  ]
}
```

---

## WebSocket Events

### Connection

WebSocket connections are established via the Worker for real-time UI updates.

```
wss://wandstore.workers.dev/ws?shopper_id={shopper_id}
```

### Events

#### Server → Client

```typescript
// UI Ready
{
  "type": "ui_ready",
  "data": {
    "persona_hash": "v2_minimalist_85_abc123",
    "generated_at": "2026-02-16T08:30:00Z"
  }
}

// Generation Progress
{
  "type": "generation_progress",
  "data": {
    "status": "generating" | "storing" | "complete",
    "progress_percent": 75
  }
}

// Error
{
  "type": "error",
  "data": {
    "code": "GENERATION_FAILED",
    "message": "Unable to generate UI at this time"
  }
}
```

#### Client → Server

```typescript
// Request Refresh
{
  "type": "request_refresh",
  "data": {
    "force": false
  }
}

// Acknowledge UI
{
  "type": "ui_acknowledged",
  "data": {
    "persona_hash": "v2_minimalist_85_abc123"
  }
}
```

---

## Error Handling

### Error Codes

| Code | HTTP Status | Description | Retryable |
|------|-------------|-------------|-----------|
| `RATE_LIMITED` | 429 | LLM API rate limit hit | Yes (exponential backoff) |
| `MODEL_UNAVAILABLE` | 503 | LLM service down | Yes (with fallback) |
| `INVALID_PERSONA` | 400 | Persona data malformed | No |
| `GENERATION_FAILED` | 500 | LLM returned invalid output | Yes (max 3 attempts) |
| `TIMEOUT` | 504 | Generation took too long | Yes |
| `KV_WRITE_FAILED` | 500 | Unable to write to KV | Yes (max 3 attempts) |
| `CONTAINER_ERROR` | 500 | Container internal error | Yes |

### Retry Strategy

```typescript
interface RetryConfig {
  maxAttempts: 3;
  backoffMultiplier: 2;
  initialDelayMs: 1000;
  maxDelayMs: 10000;
  retryableStatuses: [429, 500, 502, 503, 504];
}

// Pseudocode
async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig
): Promise<T> {
  let attempt = 0;
  let delay = config.initialDelayMs;
  
  while (attempt < config.maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      attempt++;
      
      if (!isRetryable(error) || attempt >= config.maxAttempts) {
        throw error;
      }
      
      await sleep(delay);
      delay = Math.min(delay * config.backoffMultiplier, config.maxDelayMs);
    }
  }
  
  throw new Error("Max retries exceeded");
}
```

### Circuit Breaker

For LLM API calls, implement a circuit breaker pattern:

```typescript
interface CircuitBreakerConfig {
  failureThreshold: 5;      // Open after 5 failures
  successThreshold: 3;      // Close after 3 successes
  timeoutMs: 30000;         // Half-open after 30s
}

// States: CLOSED → OPEN → HALF_OPEN → CLOSED
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-16 | Initial Phase 1 contracts |

---

## Contact

For questions or clarifications on these API contracts:

- **Architecture Issues:** Tag `@architect` in GitHub issues
- **Implementation Questions:** Tag `@senior-engineer` or `@devops`
