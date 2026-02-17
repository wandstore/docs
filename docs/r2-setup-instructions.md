# R2 Bucket Setup Instructions

## Manual Setup Required

The API token doesn't have R2 permissions. Please create the bucket manually:

### Step 1: Create R2 Bucket
1. Go to: https://dash.cloudflare.com/61709e52b392b237c89ee049f6a0e4a5/r2
2. Click "Create bucket"
3. Name: `wandstore-generated-ui`
4. Location: Auto (default)
5. Click "Create"

### Step 2: Update API Token (Optional)
To enable CLI access, update your API token at:
https://dash.cloudflare.com/profile/api-tokens

Add these permissions:
- Account: R2 Storage:Edit
- Account: R2 Storage:Read

### Step 3: Verify Binding
The wrangler.toml already has the binding:
```toml
[[r2_buckets]]
binding = "UI_STORAGE"
bucket_name = "wandstore-generated-ui"
```

### Step 4: Deploy Worker
After creating the bucket:
```bash
cd wandstore-runtime/worker
wrangler deploy
```

## R2 Usage in Code

The worker can now use R2 for long-term storage:

```typescript
// Store generated UI in R2 (unlimited retention)
await env.UI_STORAGE.put(`ui/${shopperId}.html`, html, {
  httpMetadata: { contentType: 'text/html' },
  customMetadata: { 
    shopperId, 
    persona,
    generatedAt: new Date().toISOString()
  }
});

// Retrieve from R2
const object = await env.UI_STORAGE.get(`ui/${shopperId}.html`);
if (object) {
  return new Response(object.body, {
    headers: { 'Content-Type': 'text/html' }
  });
}
```

## Benefits of R2 vs KV

| Feature | KV | R2 |
|---------|-----|-----|
| **Retention** | 30 days (free) | Unlimited |
| **Size limit** | 25 MB/value | 5 TB/object |
| **Cost** | $0.50/million reads | $0.015/GB stored |
| **Use case** | Short-term cache | Long-term storage |

## Next: AI Gateway Setup

1. Go to: https://dash.cloudflare.com/61709e52b392b237c89ee049f6a0e4a5/ai-gateway
2. Create gateway named `wandstore-ai`
3. Add provider: OpenAI (for Kimi compatibility)
4. Copy endpoint URL and update container env var
