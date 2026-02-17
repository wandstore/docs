# AI Gateway Configuration for WandStore

## Overview
AI Gateway provides caching, observability, and rate limiting for LLM API calls.

## Setup Steps

### 1. Create AI Gateway in Cloudflare Dashboard
1. Go to: https://dash.cloudflare.com → AI Gateway
2. Create new gateway named `wandstore-ai`
3. Add provider: OpenAI (for Kimi API compatibility)

### 2. Gateway Endpoint
```
https://gateway.ai.cloudflare.com/v1/{account_id}/wandstore-ai/
```

### 3. Update Container to Use Gateway

Replace direct Kimi API calls with Gateway endpoint:

```typescript
// Before
const response = await fetch('https://api.moonshot.ai/v1/chat/completions', {...})

// After  
const response = await fetch(
  'https://gateway.ai.cloudflare.com/v1/61709e52b392b237c89ee049f6a0e4a5/wandstore-ai/openai/v1/chat/completions',
  {...}
)
```

### 4. Benefits

| Feature | Benefit |
|---------|---------|
| **Caching** | Same prompts return cached responses (faster, cheaper) |
| **Observability** | Dashboard shows token usage, latency, costs |
| **Rate Limiting** | Prevent runaway costs |
| **Retries** | Automatic retry on failures |

### 5. Caching Strategy

- **Cache Key**: Prompt hash + persona type
- **TTL**: 1 hour for UI generation prompts
- **Expected Hit Rate**: 30-50% for similar shopper profiles

## Cost Impact

| Without Gateway | With Gateway (50% hit rate) |
|-----------------|---------------------------|
| ~$500-1000/month | ~$250-500/month |

## Next: R2 Long-term Caching

Store generated UIs in R2 for:
- Unlimited retention (vs KV's 30-day limit on free tier)
- Lower cost for long-term storage
- Versioning of UI generations
