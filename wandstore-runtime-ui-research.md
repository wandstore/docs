# Runtime UI Generation with Cloudflare Durable Objects
## Technical Research for WandStore Issue #14

---

## Executive Summary

This document outlines how to generate personalized storefront UIs at runtime using Cloudflare Durable Objects (DOs). The recommended approach uses **HTML template string generation within Durable Objects** combined with **edge-side caching** for optimal performance.

---

## 1. Runtime UI Generation Options

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

### Option C: HTML String Generation in Durable Objects
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

## 2. Durable Objects Role

### Can DOs Generate HTML/CSS/JS Dynamically?

**Yes.** Durable Objects are JavaScript environments that can:
- Execute arbitrary code including template rendering
- Access SQLite storage for state
- Return HTTP responses directly

```typescript
// Example: DO generating personalized HTML
export class ShopperStorefront {
  async fetch(request: Request): Promise<Response> {
    const shopperData = await this.ctx.storage.get('shopper');
    const template = await this.ctx.storage.get('template');
    const html = this.renderTemplate(template, shopperData);
    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
  }
}
```

### Performance: DO → Generated UI

| Metric | Value |
|--------|-------|
| DO Cold Start | ~0-5ms (if hibernated) |
| DO Warm Response | ~1-10ms |
| DO + SQLite Query | ~5-20ms |
| HTML Generation | ~1-5ms (simple templates) |
| **Total (warm)** | **~10-50ms** |
| **Total (cold)** | **~50-100ms** |

**Key Insight:** DOs with WebSocket Hibernation can maintain in-memory state with near-zero overhead.

### State: What Should DOs Hold?

**Per-Store DO:**
```typescript
interface StoreState {
  storeId: string;
  baseTemplate: string;        // Base HTML template
  themeConfig: ThemeConfig;    // Colors, fonts, layout
  productCache: Map<string, Product>; // Recently viewed products
}
```

**Per-Shopper DO:**
```typescript
interface ShopperState {
  shopperId: string;
  storeId: string;
  preferences: ShopperPreferences;
  cart: Cart;
  browsingHistory: string[];
  generatedAt: number;         // For cache invalidation
}
```

### Caching Strategy

**Multi-Layer Caching:**

```
┌─────────────────────────────────────────────────────────────┐
│  L1: Browser Cache (Cache-Control: private, max-age=60)     │
├─────────────────────────────────────────────────────────────┤
│  L2: Cloudflare Edge Cache (Cache API)                      │
│     - Key: /store/:storeId/shopper/:shopperId               │
│     - TTL: 60 seconds (personalized content)                │
├─────────────────────────────────────────────────────────────┤
│  L3: Durable Object In-Memory                               │
│     - Generated HTML cached in DO memory                    │
│     - Invalidated on shopper data change                    │
├─────────────────────────────────────────────────────────────┤
│  L4: Durable Object SQLite Storage                          │
│     - Persistent shopper state                              │
│     - Template versions                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Shopify Integration

### Fetching Product Data at Runtime

**Option 1: Storefront API (Recommended)**
```typescript
// Fetch products via Shopify Storefront API
async function fetchProducts(storeDomain: string, accessToken: string) {
  const query = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            priceRange {
              minVariantPrice { amount currencyCode }
            }
            images(first: 1) { edges { node { url } } }
          }
        }
      }
    }
  `;
  
  const response = await fetch(`https://${storeDomain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { first: 10 } }),
  });
  
  return response.json();
}
```

**Option 2: Admin API (Server-side only)**
- Use for inventory, orders, customer data
- Requires private app credentials

### Injecting Shopper Data into Templates

```typescript
interface TemplateData {
  store: StoreConfig;
  shopper: ShopperData;
  products: Product[];
  cart: Cart;
  recommendations: Product[];
}

function renderStorefrontTemplate(data: TemplateData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>${data.store.name} - Welcome ${data.shopper.firstName}</title>
  <style>${data.store.themeCss}</style>
</head>
<body>
  <header>
    <h1>Welcome back, ${escapeHtml(data.shopper.firstName)}!</h1>
    <p>Based on your browsing history, you might like:</p>
  </header>
  
  <main class="product-grid">
    ${data.recommendations.map(p => `
      <article class="product-card">
        <img src="${p.images[0]?.url}" alt="${escapeHtml(p.title)}" />
        <h3>${escapeHtml(p.title)}</h3>
        <p class="price">${p.priceRange.minVariantPrice.amount} ${p.priceRange.minVariantPrice.currencyCode}</p>
        <button data-product-id="${p.id}" class="add-to-cart">Add to Cart</button>
      </article>
    `).join('')}
  </main>
  
  <script>
    // Client-side cart handling
    window.shopConfig = {
      storeId: '${data.store.id}',
      shopperId: '${data.shopper.id}',
      checkoutUrl: '${data.cart.checkoutUrl}'
    };
  </script>
  <script src="/static/cart.js"></script>
</body>
</html>
  `;
}
```

### Checkout: Redirecting to Shopify Checkout

**Flow:**
```
1. Shopper clicks "Checkout" on custom storefront
2. Client JS calls Worker to create/update cart
3. Worker uses Storefront API to get checkoutUrl
4. Worker returns checkoutUrl to client
5. Client redirects to Shopify hosted checkout
6. After checkout, Shopify redirects back to custom storefront
```

```typescript
// Create cart and get checkout URL
async function createCheckout(storeDomain: string, lineItems: CartItem[]) {
  const mutation = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise { ... on ProductVariant { id title } }
              }
            }
          }
        }
        userErrors { field message }
      }
    }
  `;
  
  const variables = {
    input: {
      lines: lineItems.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity,
      })),
    },
  };
  
  const response = await fetch(`https://${storeDomain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: mutation, variables }),
  });
  
  const { data } = await response.json();
  return data.cartCreate.cart.checkoutUrl; // Redirect shopper here
}
```

---

## 4. Recommended Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SHOPPER BROWSER                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Request: wandstore.io/s/magic-wands?shopper=abc123                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLOUDFLARE EDGE (Worker)                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  1. Parse request (store slug, shopper ID)                          │   │
│  │  2. Check Cache API: GET /store/:store/shopper/:shopper             │   │
│  │  3. Cache HIT? → Return cached HTML                                 │   │
│  │  4. Cache MISS? → Call Durable Object                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DURABLE OBJECT (Per-Shopper Instance)                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  State (In-Memory + SQLite):                                        │   │
│  │    - shopperId: "abc123"                                            │   │
│  │    - preferences: { theme: "dark", categories: ["wands"] }          │   │
│  │    - cart: { items: [...], checkoutUrl: "..." }                     │   │
│  │    - cachedHtml: "..." // Generated HTML cache                      │   │
│  │                                                                     │   │
│  │  5. Check if cachedHtml is fresh (< 60s)                            │   │
│  │  6. If stale:                                                       │   │
│  │       a. Fetch products from Shopify Storefront API                 │   │
│  │       b. Apply personalization logic                                │   │
│  │       c. Render HTML template                                       │   │
│  │       d. Store in cachedHtml                                        │   │
│  │  7. Return HTML to Worker                                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLOUDFLARE EDGE (Worker)                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  8. Store response in Cache API (TTL: 60s)                          │   │
│  │  9. Return HTML to shopper                                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Shopper   │────▶│   Worker    │────▶│     DO      │────▶│   Shopify   │
│   Request   │     │   (Edge)    │     │  (Stateful) │     │   API       │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       │                   │◄──────────────────┘                   │
       │                   │    HTML + Cache                       │
       │                   │                                       │
       │◄──────────────────┘                                       │
       │    Personalized HTML                                      │
       │                                                           │
       │◄──────────────────────────────────────────────────────────┘
       │    Checkout Redirect (after cart creation)
```

---

## 5. Implementation Example

### Project Structure

```
wandstore/
├── src/
│   ├── worker.ts              # Main Worker entry
│   ├── durable-objects/
│   │   ├── store-do.ts        # Per-store DO
│   │   └── shopper-do.ts      # Per-shopper DO
│   ├── templates/
│   │   └── storefront.ts      # HTML template functions
│   ├── shopify/
│   │   ├── client.ts          # Storefront API client
│   │   └── types.ts           # TypeScript types
│   └── utils/
│       └── html.ts            # HTML escaping utilities
├── wrangler.toml
└── package.json
```

### Worker Entry (worker.ts)

```typescript
import { ShopperStorefront } from './durable-objects/shopper-do';
import { StoreConfig } from './durable-objects/store-do';

export { ShopperStorefront, StoreConfig };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Parse route: /s/:storeSlug?shopper=:shopperId
    const match = url.pathname.match(/^\/s\/([^\/]+)$/);
    if (!match) {
      return new Response('Not Found', { status: 404 });
    }
    
    const storeSlug = match[1];
    const shopperId = url.searchParams.get('shopper');
    
    if (!shopperId) {
      return new Response('Shopper ID required', { status: 400 });
    }
    
    // Check edge cache first
    const cacheKey = new Request(`https://cache/store/${storeSlug}/shopper/${shopperId}`);
    const cache = caches.default;
    const cached = await cache.match(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    // Get or create shopper DO
    const doId = env.SHOPPER_STOREFRONT.idFromName(`${storeSlug}:${shopperId}`);
    const doStub = env.SHOPPER_STOREFRONT.get(doId);
    
    // Forward request to DO
    const response = await doStub.fetch(request);
    
    // Cache the response
    const responseToCache = response.clone();
    ctx.waitUntil(cache.put(cacheKey, responseToCache));
    
    return response;
  },
};

interface Env {
  SHOPPER_STOREFRONT: DurableObjectNamespace<ShopperStorefront>;
  STORE_CONFIG: DurableObjectNamespace<StoreConfig>;
  SHOPIFY_STORE_DOMAIN: string;
  SHOPIFY_STOREFRONT_TOKEN: string;
}
```

### Shopper Durable Object (shopper-do.ts)

```typescript
import { renderStorefrontTemplate } from '../templates/storefront';
import { ShopifyClient } from '../shopify/client';

export class ShopperStorefront {
  private sql: SqlStorage;
  
  constructor(private ctx: DurableObjectState, private env: Env) {
    this.sql = ctx.storage.sql;
    
    // Initialize SQLite schema
    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS shopper_state (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at INTEGER
      )
    `);
  }
  
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const shopperId = url.searchParams.get('shopper')!;
    const storeSlug = url.pathname.split('/')[2];
    
    // Check in-memory cache first
    const cachedHtml = await this.ctx.storage.get<string>('cached_html');
    const cachedAt = await this.ctx.storage.get<number>('cached_at');
    
    if (cachedHtml && cachedAt && Date.now() - cachedAt < 60000) {
      return new Response(cachedHtml, {
        headers: { 'Content-Type': 'text/html' },
      });
    }
    
    // Fetch fresh data
    const [shopperData, products] = await Promise.all([
      this.getShopperData(shopperId),
      this.fetchProducts(),
    ]);
    
    // Generate personalized recommendations
    const recommendations = this.getRecommendations(products, shopperData);
    
    // Render HTML
    const html = renderStorefrontTemplate({
      store: { id: storeSlug, name: 'Magic Wands' },
      shopper: shopperData,
      products,
      recommendations,
      cart: shopperData.cart,
    });
    
    // Cache in DO storage
    await this.ctx.storage.put('cached_html', html);
    await this.ctx.storage.put('cached_at', Date.now());
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'private, max-age=60',
      },
    });
  }
  
  private async getShopperData(shopperId: string) {
    const row = this.sql.exec(
      'SELECT value FROM shopper_state WHERE key = ?',
      shopperId
    ).one();
    
    if (row) {
      return JSON.parse(row.value as string);
    }
    
    // Default shopper data
    return {
      id: shopperId,
      firstName: 'Wizard',
      preferences: {},
      cart: { items: [] },
    };
  }
  
  private async fetchProducts() {
    const client = new ShopifyClient(
      this.env.SHOPIFY_STORE_DOMAIN,
      this.env.SHOPIFY_STOREFRONT_TOKEN
    );
    return client.getProducts(20);
  }
  
  private getRecommendations(products: Product[], shopperData: any): Product[] {
    // Simple recommendation logic
    const viewed = shopperData.browsingHistory || [];
    return products
      .filter(p => !viewed.includes(p.id))
      .slice(0, 6);
  }
}
```

### HTML Template (templates/storefront.ts)

```typescript
export interface StorefrontData {
  store: { id: string; name: string; themeCss?: string };
  shopper: { id: string; firstName: string };
  products: Product[];
  recommendations: Product[];
  cart: Cart;
}

export function renderStorefrontTemplate(data: StorefrontData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(data.store.name)}</title>
  <style>
    ${data.store.themeCss || defaultTheme}
  </style>
</head>
<body>
  <nav class="navbar">
    <a href="/s/${data.store.id}" class="logo">${escapeHtml(data.store.name)}</a>
    <div class="nav-actions">
      <span class="greeting">Hello, ${escapeHtml(data.shopper.firstName)}!</span>
      <a href="${data.cart.checkoutUrl || '#'}" class="cart-btn">
        Cart (${data.cart.items?.length || 0})
      </a>
    </div>
  </nav>
  
  <main class="container">
    <section class="hero">
      <h1>Welcome to ${escapeHtml(data.store.name)}</h1>
      <p>Handcrafted wands for every wizard and witch.</p>
    </section>
    
    <section class="recommendations">
      <h2>Recommended for You</h2>
      <div class="product-grid">
        ${data.recommendations.map(renderProductCard).join('')}
      </div>
    </section>
    
    <section class="all-products">
      <h2>All Wands</h2>
      <div class="product-grid">
        ${data.products.map(renderProductCard).join('')}
      </div>
    </section>
  </main>
  
  <script>
    window.__SHOP_CONFIG__ = {
      storeId: '${data.store.id}',
      shopperId: '${data.shopper.id}',
      cartId: '${data.cart.id || ''}'
    };
  </script>
  <script src="/static/store.js"></script>
</body>
</html>`;
}

function renderProductCard(product: Product): string {
  const price = product.priceRange?.minVariantPrice;
  return `
    <article class="product-card" data-product-id="${product.id}">
      <img src="${product.images?.[0]?.url || '/placeholder.jpg'}" 
           alt="${escapeHtml(product.title)}" 
           loading="lazy">
      <h3>${escapeHtml(product.title)}</h3>
      <p class="price">${price?.amount} ${price?.currencyCode}</p>
      <button class="btn-primary add-to-cart" data-variant-id="${product.variants?.[0]?.id}">
        Add to Cart
      </button>
    </article>
  `;
}

function escapeHtml(text: string): string {
  const div = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text?.replace(/[&<>"']/g, m => div[m as keyof typeof div]) || '';
}

const defaultTheme = `
  :root { --primary: #6366f1; --bg: #f8fafc; --card: #fff; }
  * { box-sizing: border-box; margin: 0; }
  body { font-family: system-ui, sans-serif; background: var(--bg); }
  .navbar { display: flex; justify-content: space-between; padding: 1rem 2rem; background: var(--card); }
  .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; padding: 2rem; }
  .product-card { background: var(--card); border-radius: 8px; padding: 1rem; }
  .product-card img { width: 100%; height: 200px; object-fit: cover; border-radius: 4px; }
  .btn-primary { background: var(--primary); color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
`;
```

### Wrangler Configuration

```toml
name = "wandstore"
main = "src/worker.ts"
compatibility_date = "2024-01-01"

[[durable_objects.bindings]]
name = "SHOPPER_STOREFRONT"
class_name = "ShopperStorefront"

[[durable_objects.bindings]]
name = "STORE_CONFIG"
class_name = "StoreConfig"

[[migrations]]
tag = "v1"
new_classes = ["ShopperStorefront", "StoreConfig"]

[vars]
SHOPIFY_STORE_DOMAIN = "your-store.myshopify.com"

[env.production.vars]
SHOPIFY_STORE_DOMAIN = "your-store.myshopify.com"
```

---

## 6. Decision Matrix

| Approach | Complexity | Performance | Personalization | Best For |
|----------|------------|-------------|-----------------|----------|
| Worker + Template Strings | Low | ⭐⭐⭐⭐⭐ | ⭐⭐ | Static-like, simple |
| Worker + Hono JSX | Low-Med | ⭐⭐⭐⭐ | ⭐⭐⭐ | Balance of DX/perf |
| **DO + Template Strings** | **Med** | **⭐⭐⭐⭐** | **⭐⭐⭐⭐⭐** | **Stateful personalization** |
| DO + React SSR | Med-High | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Complex interactive UIs |
| Pre-rendered + Edge Cache | Low | ⭐⭐⭐⭐⭐ | ⭐ | No personalization needed |

---

## 7. Recommendations

### For MVP (Current Phase)

**Use: DO + Template String Generation**

1. **One DO per shopper** for stateful personalization
2. **HTML template strings** for fastest rendering
3. **Cache API** for 60s edge caching
4. **SQLite in DO** for shopper state persistence

### For Future Scaling

1. **Add Hono JSX** if template complexity grows
2. **Implement cache invalidation** via Shopify webhooks
3. **Add WebSocket hibernation** for real-time features
4. **Consider R2** for storing generated storefront snapshots

### Key Implementation Notes

1. **DO Naming:** Use deterministic IDs (`storeSlug:shopperId`) for consistent routing
2. **Cache Invalidation:** Use Shopify webhooks to purge cache on product updates
3. **Security:** Always escape HTML to prevent XSS
4. **Monitoring:** Track DO hibernation rates and cold start times

---

## References

- [Cloudflare Durable Objects Documentation](https://developers.cloudflare.com/durable-objects/)
- [Cloudflare Cache API](https://developers.cloudflare.com/workers/runtime-apis/cache/)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Shopify Customer Account API](https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api)
- [Hono Framework](https://hono.dev/)

---

*Research completed for WandStore Issue #14*
