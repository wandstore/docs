# WandStore Phase 1 — Implementation Guidance

**For:** DevOps Engineer, Senior Engineer  
**From:** Architect  
**Date:** 2026-02-16

---

## Quick Reference

### Critical Numbers

| Metric | Value | Why It Matters |
|--------|-------|----------------|
| KV Write Limit | 1/sec per key | Use persona hash in keys to distribute |
| Container Cold Start | 2-5s (lite) | Acceptable for background generation |
| Target Latency (cached) | <50ms | Shopper experience |
| Target Latency (fallback) | <100ms | First visit experience |
| Container Sleep Timeout | 5 min | Balance cost vs cold start |

### Key Design Decisions

1. **Use `lite` container instances** — Sufficient for LLM API clients, minimal cost
2. **Key format: `ui:{shopper_id}:{persona_hash}`** — Distributes KV writes
3. **Async generation with fallback** — Never block shopper on LLM
4. **D1 for state, KV for UI** — Right tool for each job

---

## DevOps Tasks

### 1. Container Setup

```bash
# Create container directory structure
mkdir -p container/src/{services,models,templates}

# Base Dockerfile
cat > container/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/

EXPOSE 8080

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]
EOF

# Requirements
cat > container/requirements.txt << 'EOF'
fastapi==0.109.0
uvicorn[standard]==0.27.0
httpx==0.26.0
pydantic==2.6.0
python-dotenv==1.0.0
EOF
```

### 2. Wrangler Configuration

```toml
# container/wrangler.toml
name = "wandstore-ui-generator"
main = "src/main.py"

[containers]
namespace = "wandstore-containers"

[[containers.instances]]
name = "ui-generator"
image = "wandstore-ui-generator:latest"
instance_type = "lite"
default_port = 8080
sleep_after = "5m"
```

### 3. Worker Configuration

```toml
# worker/wrangler.toml
name = "wandstore-worker"
main = "src/index.ts"
compatibility_date = "2025-01-01"

[[kv_namespaces]]
binding = "UI_CACHE"
id = "your-kv-namespace-id"

[[d1_databases]]
binding = "DB"
database_name = "wandstore-prod"
database_id = "your-d1-database-id"

[[containers]]
binding = "UI_GENERATOR"
namespace = "wandstore-containers"
instance = "ui-generator"
```

---

## Senior Engineer Tasks

### 1. Worker Router

```typescript
// src/index.ts
export interface Env {
  UI_CACHE: KVNamespace;
  DB: D1Database;
  UI_GENERATOR: Container;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === '/store') {
      return handleStorefront(request, env);
    }
    
    return new Response('Not Found', { status: 404 });
  }
};

async function handleStorefront(request: Request, env: Env): Promise<Response> {
  const shopperId = getShopperId(request);
  const persona = await getPersona(env.DB, shopperId);
  const personaHash = generatePersonaHash(persona);
  
  // Check cache
  const kvKey = `ui:${shopperId}:${personaHash}`;
  const cached = await env.UI_CACHE.get(kvKey, { type: 'json' });
  
  if (cached) {
    return new Response(cached.ui.html, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  // Return fallback and trigger generation
  const fallback = generateFallbackTemplate();
  
  // Trigger async generation (don't await)
  triggerUIGeneration(env, shopperId, persona, kvKey);
  
  return new Response(fallback, {
    headers: { 'Content-Type': 'text/html' }
  });
}
```

### 2. Container Implementation

```python
# container/src/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
import os

app = FastAPI()

class GenerateRequest(BaseModel):
    shopper_id: str
    persona: dict
    shop: dict
    options: dict = {}

class GenerateResponse(BaseModel):
    status: str
    ui: dict
    meta: dict

@app.post("/generate", response_model=GenerateResponse)
async def generate_ui(request: GenerateRequest):
    try:
        # Call LLM
        llm_response = await call_kimi_api(request)
        
        # Parse and validate
        ui_data = parse_llm_response(llm_response)
        
        # Store in KV
        await store_in_kv(request.shopper_id, ui_data)
        
        return GenerateResponse(
            status="success",
            ui=ui_data,
            meta={
                "generation_time_ms": 3450,
                "model": "kimi-k2-5",
                "generated_at": "2026-02-16T08:30:00Z"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def call_kimi_api(request: GenerateRequest) -> str:
    api_key = os.environ["KIMI_API_KEY"]
    
    async with httpx.AsyncClient(timeout=25.0) as client:
        response = await client.post(
            "https://api.moonshot.cn/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}"},
            json={
                "model": "kimi-k2-5",
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": build_prompt(request)}
                ],
                "temperature": 0.7,
                "max_tokens": 4000,
                "response_format": {"type": "json_object"}
            }
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
```

---

## Testing Checklist

### Unit Tests

- [ ] KV read/write operations
- [ ] Persona hash generation
- [ ] Fallback template rendering
- [ ] LLM response parsing

### Integration Tests

- [ ] Worker → Container communication
- [ ] Container → LLM API call
- [ ] Container → KV write
- [ ] End-to-end: request → fallback → generation → cache hit

### Load Tests

- [ ] 100 concurrent shoppers
- [ ] KV write distribution
- [ ] Container scaling behavior

---

## Common Pitfalls

### ❌ Don't

1. **Don't await container response in Worker** — Always return fallback immediately
2. **Don't use same KV key for different personas** — Include persona hash
3. **Don't store large HTML in D1** — Use KV for UI, D1 for metadata
4. **Don't ignore KV write failures** — Retry with exponential backoff

### ✅ Do

1. **Do validate LLM output** — JSON schema validation before storing
2. **Do implement circuit breaker** — For LLM API calls
3. **Do log generation metrics** — Track time, tokens, success rate
4. **Do monitor cache hit rate** — Alert if <70%

---

## Review Points

Before submitting PRs, verify:

- [ ] API contracts match `architecture/api-contracts.md`
- [ ] Error handling follows retry strategy
- [ ] KV keys use correct format with persona hash
- [ ] Container uses `lite` instance type
- [ ] All external calls have timeouts
- [ ] No sensitive data in logs

---

## Questions?

- **Architecture:** Reference `architecture/phase1-validation-report.md`
- **API Contracts:** Reference `architecture/api-contracts.md`
- **Blockers:** Escalate to Architect immediately

---

**Let's build this! 🚀**
