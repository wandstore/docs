# AI Gateway Setup

## Status
Optional. The container can call Kimi API directly or via AI Gateway.

## How It Works

If `AI_GATEWAY_URL` is set as a Cloudflare secret, the container's LLM client routes calls through Cloudflare AI Gateway instead of directly to `api.moonshot.ai`.

## Setup

1. Go to: https://dash.cloudflare.com → AI Gateway
2. Create gateway named `wandstore-ai`
3. Add provider: OpenAI (Kimi uses OpenAI-compatible API)
4. Copy the gateway endpoint URL
5. Set it as a secret:
   ```bash
   cd wandstore-runtime/worker
   echo "https://gateway.ai.cloudflare.com/v1/61709e52b392b237c89ee049f6a0e4a5/wandstore-ai/openai/v1" | wrangler secret put AI_GATEWAY_URL
   ```

## Benefits

| Feature | Benefit |
|---------|---------|
| Caching | Same prompts return cached responses (cheaper) |
| Observability | Dashboard shows token usage, latency, costs |
| Rate Limiting | Prevent runaway API costs |
| Retries | Automatic retry on transient failures |
