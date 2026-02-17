# R2 Bucket Setup

## Status
Already configured. The R2 bucket `wandstore-generated-ui` is active and bound as `UI_STORAGE` in `wrangler.toml`.

## How It's Used

The DO alarm handler stores generated HTML in R2 after each successful LLM generation:

```
Key pattern: generated/{storeSlug}:{shopperId}.html
Metadata: shopperId, storeSlug, generatedAt, persona, source
```

The worker checks R2 first on each storefront request (before KV), since R2 has permanent retention vs KV's 1-hour TTL.

## Manual Setup (if recreating)

1. Go to: https://dash.cloudflare.com/61709e52b392b237c89ee049f6a0e4a5/r2
2. Create bucket: `wandstore-generated-ui`
3. The binding in `wrangler.toml` is already configured:
   ```toml
   [[r2_buckets]]
   binding = "UI_STORAGE"
   bucket_name = "wandstore-generated-ui"
   ```
4. Deploy: `cd wandstore-runtime/worker && npx wrangler deploy`
