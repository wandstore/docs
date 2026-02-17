# Developer Onboarding

Welcome to the WandStore team! This guide will get you set up and running locally.

## Prerequisites

- Node.js 20+ 
- Git
- A Cloudflare account (with access to the WandStore account)
- A Shopify partner account (for local development)

## Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/wandstore/storefront.git
cd storefront
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```bash
# Cloudflare
CLOUDFLARE_ACCOUNT_ID=61709e52b392b237c89ee049f6a0e4a5

# Shopify (use your development store)
SHOPIFY_STORE_DOMAIN=your-dev-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your_token_here
```

### 4. Authenticate with Cloudflare

```bash
npx wrangler login
```

### 5. Run Locally

```bash
npm run dev
```

The Worker will start on `http://localhost:8787`

### 6. Test the Setup

```bash
curl http://localhost:8787/s/test-store?shopper=test123
```

You should see a generated storefront HTML response.

## Project Structure

```
storefront/
├── src/
│   ├── worker.ts              # Main Worker entry
│   ├── durable-objects/
│   │   ├── shopper-do.ts      # Per-shopper DO
│   │   └── store-do.ts        # Per-store DO
│   ├── templates/
│   │   └── storefront.ts      # HTML templates
│   ├── shopify/
│   │   ├── client.ts          # Storefront API client
│   │   └── types.ts           # TypeScript types
│   └── utils/
│       └── html.ts            # HTML utilities
├── tests/
│   └── *.test.ts              # Test files
├── wrangler.toml              # Cloudflare config
└── package.json
```

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run with watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Local Testing with Staging Data

To test against real Shopify data:

```bash
# Set staging credentials in .env
SHOPIFY_STORE_DOMAIN=wandstore-staging.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=staging_token

# Run with staging env
npm run dev:staging
```

## Common Issues

### "Cannot resolve module"

Make sure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Durable Object not found"

Ensure migrations are applied:
```bash
npx wrangler d1 migrations apply
```

### "Shopify API returns 401"

Check your Storefront API token:
1. Go to Shopify Admin → Apps → Develop apps
2. Verify the token has `read_products` scope
3. Ensure the store URL is correct

## Next Steps

- Read the [Architecture Overview](../architecture/)
- Review [ADR-001](../decisions/adr-001-runtime-ui-generation.md) to understand the tech choices
- Pick up your first issue from the GitHub backlog

## Getting Help

- **Technical questions:** Post in #dev-wandstore Slack channel
- **Architecture questions:** Tag @architect in your PR
- **Urgent issues:** DM the on-call engineer

---

*Last updated: 2026-02-17*
