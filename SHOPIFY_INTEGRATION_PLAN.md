# WandStore Shopify Integration Research & Plan

## Executive Summary

This document outlines the research findings and implementation plan for integrating WandStore with real Shopify stores. The goal is to move from mock data to live Shopify Storefront API connections while maintaining the AI-powered personalization engine.

---

## 1. Shopify Demo Store Setup

### 1.1 Demo Store Purpose
- **Showroom**: Demonstrate WandStore capabilities to potential merchants
- **Testing Ground**: Validate persona detection and AI generation with real data
- **Documentation**: Provide working examples for developers

### 1.2 Recommended Demo Store Configuration

#### Products (20-30 items across categories)
| Category | Count | Purpose |
|----------|-------|---------|
| Electronics | 6-8 | High-consideration purchases (dealhunters) |
| Fashion/Apparel | 6-8 | Style/explorer persona testing |
| Home & Garden | 4-6 | Lifestyle/explorer appeal |
| Health & Beauty | 4-6 | Repeat purchase (loyalist testing) |
| Accessories | 3-4 | Low-ticket impulse buys |

#### Collections to Create
1. **Featured** - Hero products for all personas
2. **New Arrivals** - Explorer-focused
3. **Sale/Deals** - Dealhunter-focused
4. **Bestsellers** - Social proof for explorers
5. **Staff Picks** - Curated for loyalists
6. **Under $50** - Price-conscious segment

#### Themes
- Use **Dawn** (free, modern, customizable)
- Keep default for baseline comparison
- WandStore will override with AI-generated UIs

### 1.3 Setup Steps
```bash
# 1. Create development store via Partner Dashboard
# 2. Enable Customer Accounts (Settings > Customer accounts)
# 3. Generate test data (Shopify Admin > Settings > Development stores)
# 4. Create Storefront API access token
# 5. Configure webhooks for product/collection updates
```

---

## 2. Shopify Storefront API Integration

### 2.1 Authentication Options

| Method | Use Case | Complexity | Features Available |
|--------|----------|------------|-------------------|
| **Tokenless** | Public browsing, basic products | Low | Products, Collections, Cart, Search |
| **Public Access Token** | Browser/mobile apps | Medium | + Product Tags, Metafields |
| **Private Access Token** | Server-side (WandStore) | Medium | Full access including customer data |

**Recommendation**: Use **Private Access Token** for WandStore container (server-side) and **Tokenless** for initial page loads.

### 2.2 Required GraphQL Queries

#### Core Store Data
```graphql
query GetShopInfo {
  shop {
    name
    description
    primaryDomain { url }
    moneyFormat
    currencyCode
    brand {
      logo { image { url } }
      colors { primary { background } }
    }
  }
}
```

#### Products with Pagination
```graphql
query GetProducts($first: Int!, $after: String) {
  products(first: $first, after: $after) {
    edges {
      node {
        id
        title
        description
        descriptionHtml
        handle
        tags
        vendor
        productType
        priceRange {
          minVariantPrice { amount currencyCode }
          maxVariantPrice { amount currencyCode }
        }
        compareAtPriceRange {
          minVariantPrice { amount currencyCode }
        }
        images(first: 5) {
          edges { node { url altText } }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
            }
          }
        }
        collections(first: 5) {
          edges { node { title handle } }
        }
      }
      cursor
    }
    pageInfo { hasNextPage }
  }
}
```

#### Collections
```graphql
query GetCollections($first: Int!) {
  collections(first: $first) {
    edges {
      node {
        id
        title
        handle
        description
        image { url }
        products(first: 10) {
          edges { node { id title handle } }
        }
      }
    }
  }
}
```

#### Search (for minimalist quick-find)
```graphql
query SearchProducts($query: String!, $first: Int!) {
  search(query: $query, first: $first, types: PRODUCT) {
    edges {
      node {
        ... on Product {
          id
          title
          handle
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          images(first: 1) {
            edges { node { url } }
          }
        }
      }
    }
  }
}
```

### 2.3 Rate Limits & Caching Strategy

**Key Finding**: Storefront API has **NO rate limits** on request count (unlike Admin API).

However:
- **Tokenless access**: Query complexity limit of 1,000 points
- **Bot protection**: 430 Shopify Security Rejection for suspicious traffic
- **Best practice**: Include `Shopify-Storefront-Buyer-IP` header with actual shopper IP

#### Recommended Caching Strategy

| Data Type | Cache Duration | Storage | Invalidation |
|-----------|---------------|---------|--------------|
| Shop info | 1 hour | KV | Webhook on shop update |
| Products | 5 minutes | KV + R2 | Webhook on product change |
| Collections | 15 minutes | KV | Webhook on collection change |
| Search results | 30 seconds | KV only | No caching (real-time) |
| Customer data | Session | KV only | On logout/token expiry |

---

## 3. Customer Identification

### 3.1 Shopper Types

| Type | Identification | Data Available | Privacy Level |
|------|---------------|----------------|---------------|
| **Anonymous/Guest** | Fingerprint (device + IP hash) | Browse history, cart | Minimal |
| **Recognized** | Persistent cookie ID | Cross-session history | Low |
| **Authenticated** | Customer Access Token | Orders, addresses, preferences | High |

### 3.2 Customer Accounts API (New - 2024)

Shopify introduced a new **Customer Account API** for headless stores:

**Authentication Flow (OAuth 2.0 + PKCE)**:
```
1. Discovery: GET /.well-known/openid-configuration
2. Authorize: Redirect to Shopify login
3. Callback: Receive authorization code
4. Token Exchange: POST to token endpoint
5. API Access: Use access_token for GraphQL queries
```

**Discovery Endpoints**:
- `https://{store}.myshopify.com/.well-known/openid-configuration`
- `https://{store}.myshopify.com/.well-known/customer-account-api`

**Key Queries**:
```graphql
query GetCustomer {
  customer {
    id
    firstName
    lastName
    email
    phone
    defaultAddress { ... }
    orders(first: 10) {
      edges {
        node {
          id
          orderNumber
          totalPrice { amount }
          lineItems(first: 10) { ... }
        }
      }
    }
  }
}
```

### 3.3 Privacy/GDPR Considerations

**Data Minimization**:
- Only collect data essential for personalization
- Hash/anonimize identifiers where possible
- Store minimal PII in KV (prefer session tokens)

**Consent Management**:
- Use `@inContext(visitorConsent: {...})` directive
- Store consent preferences with shopper session
- Respect `analytics`, `marketing`, `preferences`, `saleOfData` flags

**Data Retention**:
- KV entries: Auto-expire after 30 days (configurable)
- R2 storage: Clean up generated UIs after 90 days
- Session data: Delete on logout + 7 days

**Shopper Rights**:
- `/api/shopper/export` - Export all data
- `/api/shopper/delete` - Right to be forgotten

### 3.4 Non-Creepy Tracking Guidelines

**DO**:
- Aggregate behavior patterns ("users like you")
- Surface explicit preferences ("based on your likes")
- Make personalization transparent ("why am I seeing this?")
- Allow opt-out of personalization

**DON'T**:
- Show you know too much ("we saw you looking at...")
- Cross-reference without consent
- Retain data indefinitely
- Share with third parties

---

## 4. App/Extension Architecture

### 4.1 Integration Options Comparison

| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| **Shopify App** | Native install, webhooks, admin UI | Review process, hosting required | Full-featured integration |
| **Standalone (API Key)** | Quick setup, no approval | Manual configuration, no webhooks | MVP, tech-savvy merchants |
| **Theme App Extension** | In-theme integration | Limited to Online Store 2.0 themes | UI widgets |
| **Headless Custom** | Full control | Complex, requires dev | Enterprise |

### 4.2 Recommended: Hybrid Approach

**Phase 1 (MVP)**: Standalone with API Key
- Merchant provides Storefront Access Token
- WandStore fetches data via API
- Manual webhook configuration (optional)

**Phase 2**: Shopify App
- OAuth installation flow
- Automatic webhook registration
- Admin dashboard for settings

### 4.3 OAuth Flow for Shopify App

```
Merchant clicks "Install" → Redirect to Shopify OAuth
                                    ↓
                    Shopify redirects to our app with `code`
                                    ↓
                    Exchange code for access_token
                                    ↓
                    Store: shop domain, access_token, scopes
                                    ↓
                    Register webhooks
                                    ↓
                    Redirect to app dashboard
```

**Required Scopes**:
- `read_products`
- `read_collections`
- `read_customers` (optional, for personalization)
- `read_orders` (optional, for loyalist detection)

**Webhook Subscriptions**:
- `products/create`
- `products/update`
- `products/delete`
- `collections/create`
- `collections/update`
- `collections/delete`
- `app/uninstalled` (cleanup)

### 4.4 Webhook Handling

**Endpoint**: `POST /webhook/shopify`

**Verification**:
```typescript
// Verify HMAC signature
const hmac = request.headers.get('X-Shopify-Hmac-Sha256');
const body = await request.text();
const calculated = crypto.createHmac('sha256', WEBHOOK_SECRET)
  .update(body, 'utf8')
  .digest('base64');
  
if (hmac !== calculated) {
  return new Response('Unauthorized', { status: 401 });
}
```

**Processing**:
```typescript
const topic = request.headers.get('X-Shopify-Topic');
const shop = request.headers.get('X-Shopify-Shop-Domain');
const data = JSON.parse(body);

switch (topic) {
  case 'products/update':
    await invalidateProductCache(shop, data.id);
    await queueRegenerationForAffectedShoppers(shop, data.id);
    break;
  case 'app/uninstalled':
    await cleanupStoreData(shop);
    break;
}
```

---

## 5. Data Flow Design

### 5.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              SHOPPER                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                  │
│  │   Browser   │───→│  WandStore  │───→│   Shopify   │                  │
│  │             │←────│   Worker    │←────│   Store     │                  │
│  └─────────────┘    └──────┬──────┘    └─────────────┘                  │
│                            │                                            │
│                            ↓                                            │
│                     ┌─────────────┐                                     │
│                     │  AI Container │ (background)                       │
│                     │  (Kimi/LLM)   │                                    │
│                     └─────────────┘                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Detailed Data Flow

**First Visit (Cold Cache)**:
```
1. Shopper visits /s/{storeSlug}?shopper={id}
2. Worker checks KV cache → MISS
3. Worker returns fallback template (instant)
4. Worker triggers background generation:
   a. Fetch shop info from Shopify (cached 1hr)
   b. Fetch products from Shopify (cached 5min)
   c. Load persona brief
   d. Call Kimi LLM
   e. Store result in KV + R2
5. Shopper refreshes → gets AI-generated UI
```

**Return Visit (Warm Cache)**:
```
1. Shopper visits /s/{storeSlug}?shopper={id}
2. Worker checks R2 → HIT
3. Return cached AI-generated UI (< 50ms)
4. Background: Update session, check for new products
```

**Product Update (Webhook)**:
```
1. Shopify sends webhook to /webhook/shopify
2. Worker invalidates product cache
3. Worker queues UI regeneration for affected shoppers
4. Container regenerates UIs with new product data
```

### 5.3 Persona Detection Data Requirements

| Persona | Signals Needed | Data Source |
|---------|---------------|-------------|
| **Minimalist** | Quick exit, search-heavy, few page views | Session analytics |
| **Explorer** | Long sessions, many categories, no purchase | Session analytics |
| **Deal Hunter** | Sort by price, filter sales, cart abandonment | Session + Shopify cart |
| **Loyalist** | Repeat visits, order history, loyalty points | Shopify Customer API |

### 5.4 Caching Strategy Details

**Multi-Tier Caching**:

```
┌────────────────────────────────────────────────────────────┐
│  TIER 1: Browser Cache (Generated HTML)                    │
│  - Duration: 5 minutes                                     │
│  - Key: shopper session                                    │
│  - Purpose: Instant repeat views                           │
├────────────────────────────────────────────────────────────┤
│  TIER 2: Cloudflare Cache (Edge)                           │
│  - Duration: 1 minute                                      │
│  - Key: /s/{store}:{shopper}                               │
│  - Purpose: Reduce KV reads                                │
├────────────────────────────────────────────────────────────┤
│  TIER 3: R2 (Long-term UI Storage)                         │
│  - Duration: 90 days                                       │
│  - Key: generated/{store}:{shopper}.html                   │
│  - Purpose: Persistent personalization                     │
├────────────────────────────────────────────────────────────┤
│  TIER 4: KV (Short-term + Metadata)                        │
│  - Duration: 24 hours                                      │
│  - Keys: ui:*, session:*, products:*                       │
│  - Purpose: Fast edge access                               │
├────────────────────────────────────────────────────────────┤
│  TIER 5: Shopify API (Source of Truth)                     │
│  - Duration: Real-time                                     │
│  - Purpose: Product data, customer info                    │
└────────────────────────────────────────────────────────────┘
```

---

## 6. Implementation Plan

### Phase 1: Foundation (Week 1-2)

**Goals**:
- Set up demo store
- Implement basic Storefront API integration
- Replace mock data with real Shopify data

**Tasks**:
1. Create Shopify Partner account and demo store
2. Generate test data (products, collections)
3. Create Storefront Access Token
4. Implement `fetchShopifyData()` with real API
5. Add error handling and fallback to mock
6. Update prompts to use real product data
7. Test persona generation with real products

**Deliverables**:
- Working demo store with 20+ products
- Container fetching real Shopify data
- AI-generated UIs using actual products

### Phase 2: Caching & Performance (Week 3)

**Goals**:
- Implement efficient caching
- Reduce Shopify API calls
- Improve response times

**Tasks**:
1. Implement KV caching for shop info (1hr TTL)
2. Implement KV caching for products (5min TTL)
3. Add cache invalidation on webhook
4. Implement R2 storage for generated UIs
5. Add cache warming for popular products
6. Monitor cache hit rates

**Deliverables**:
- < 50ms response for cached UIs
- < 5 Shopify API calls per shopper session
- Webhook handlers for cache invalidation

### Phase 3: Customer Identification (Week 4)

**Goals**:
- Support authenticated shoppers
- Implement privacy-compliant tracking
- Enhance persona detection

**Tasks**:
1. Implement anonymous shopper fingerprinting
2. Add Customer Accounts API integration
3. Implement OAuth flow for login
4. Add consent management (@inContext)
5. Create shopper data export/delete endpoints
6. Enhance persona detection with order history

**Deliverables**:
- Guest vs authenticated shopper support
- GDPR-compliant data handling
- Loyalist persona working with real order data

### Phase 4: App Architecture (Week 5-6)

**Goals**:
- Build Shopify App for easy installation
- Automate webhook registration
- Create merchant dashboard

**Tasks**:
1. Set up Shopify App in Partner Dashboard
2. Implement OAuth installation flow
3. Create webhook registration endpoint
4. Build merchant settings dashboard
5. Add store connection management
6. Implement app uninstall cleanup

**Deliverables**:
- Installable Shopify App
- One-click store connection
- Merchant dashboard for settings

### Phase 5: Polish & Launch (Week 7-8)

**Goals**:
- Production hardening
- Documentation
- Launch preparation

**Tasks**:
1. Security audit (secrets, tokens, webhooks)
2. Performance optimization
3. Error monitoring and alerting
4. Create documentation for merchants
5. Create developer documentation
6. Beta testing with select merchants

**Deliverables**:
- Production-ready integration
- Complete documentation
- Beta program launched

---

## 7. GitHub Issues

### Issue #1: Set up Shopify Demo Store
**Labels**: `shopify`, `setup`, `demo`
**Priority**: High
**Description**:
- Create Shopify Partner account
- Set up development store
- Generate test data (20-30 products across categories)
- Create collections (Featured, New Arrivals, Sale, etc.)
- Create Storefront Access Token
- Document store credentials in 1Password

**Acceptance Criteria**:
- [ ] Demo store accessible at {store}.myshopify.com
- [ ] 20+ products with images, descriptions, prices
- [ ] 5+ collections created
- [ ] Storefront Access Token generated
- [ ] Credentials documented securely

---

### Issue #2: Implement Shopify Storefront API Integration
**Labels**: `shopify`, `api`, `container`
**Priority**: High
**Description**:
Replace mock data in container with real Shopify Storefront API calls.

**Tasks**:
- [ ] Update `fetchShopifyData()` to use real GraphQL endpoint
- [ ] Implement shop info query
- [ ] Implement products query with pagination
- [ ] Implement collections query
- [ ] Add error handling with fallback to mock
- [ ] Add request logging

**Acceptance Criteria**:
- [ ] Container fetches real product data from Shopify
- [ ] AI-generated UIs use actual product images, prices, descriptions
- [ ] Graceful fallback if Shopify API fails
- [ ] Logs show successful API calls

---

### Issue #3: Implement Multi-Tier Caching Strategy
**Labels**: `performance`, `caching`, `kv`, `r2`
**Priority**: High
**Description**:
Implement efficient caching to minimize Shopify API calls and improve response times.

**Tasks**:
- [ ] Implement KV caching for shop info (1hr TTL)
- [ ] Implement KV caching for products (5min TTL)
- [ ] Implement R2 storage for generated UIs (90 days)
- [ ] Add cache key generation logic
- [ ] Add cache invalidation endpoint
- [ ] Add cache metrics/logging

**Acceptance Criteria**:
- [ ] Shop info cached for 1 hour
- [ ] Products cached for 5 minutes
- [ ] Generated UIs stored in R2
- [ ] Cache hit/miss rates logged
- [ ] < 50ms response for cached UIs

---

### Issue #4: Implement Webhook Handlers
**Labels**: `shopify`, `webhooks`, `cache`
**Priority**: Medium
**Description**:
Handle Shopify webhooks to keep cache in sync with store changes.

**Tasks**:
- [ ] Create `/webhook/shopify` endpoint
- [ ] Implement HMAC signature verification
- [ ] Handle `products/create`, `products/update`, `products/delete`
- [ ] Handle `collections/create`, `collections/update`, `collections/delete`
- [ ] Implement cache invalidation on product changes
- [ ] Queue UI regeneration for affected shoppers

**Acceptance Criteria**:
- [ ] Webhook endpoint accepts Shopify webhooks
- [ ] HMAC signatures verified
- [ ] Product changes invalidate cache within 30 seconds
- [ ] Affected shopper UIs regenerated

---

### Issue #5: Implement Customer Identification
**Labels**: `privacy`, `customer`, `authentication`
**Priority**: Medium
**Description**:
Support both anonymous and authenticated shoppers with privacy-compliant tracking.

**Tasks**:
- [ ] Implement anonymous shopper fingerprinting
- [ ] Add Customer Accounts API integration
- [ ] Implement OAuth discovery endpoints
- [ ] Add login/logout flow
- [ ] Implement consent management (@inContext)
- [ ] Create `/api/shopper/export` endpoint
- [ ] Create `/api/shopper/delete` endpoint

**Acceptance Criteria**:
- [ ] Anonymous shoppers get fingerprint ID
- [ ] Authenticated shoppers can log in via Shopify
- [ ] Consent preferences stored and respected
- [ ] Data export returns all shopper data
- [ ] Data delete removes all shopper data

---

### Issue #6: Build Shopify App for Easy Installation
**Labels**: `shopify`, `app`, `oauth`
**Priority**: Medium
**Description**:
Create a Shopify App that merchants can install with one click.

**Tasks**:
- [ ] Set up app in Shopify Partner Dashboard
- [ ] Implement OAuth installation flow
- [ ] Create app installation landing page
- [ ] Implement automatic webhook registration
- [ ] Create merchant settings dashboard
- [ ] Handle app uninstall cleanup

**Acceptance Criteria**:
- [ ] App listed in Shopify App Store (or unlisted install)
- [ ] One-click installation works
- [ ] Webhooks auto-registered on install
- [ ] Merchant can configure settings in dashboard
- [ ] Uninstall cleans up all data

---

### Issue #7: Enhance Persona Detection with Real Data
**Labels**: `ai`, `persona`, `analytics`
**Priority**: Low
**Description**:
Improve persona detection using real shopper behavior and order history.

**Tasks**:
- [ ] Track shopper behavior (page views, time on site, clicks)
- [ ] Integrate with Shopify cart for deal hunter detection
- [ ] Use order history for loyalist detection
- [ ] Implement A/B testing for persona accuracy
- [ ] Add persona confidence scoring

**Acceptance Criteria**:
- [ ] Persona detection uses real behavior signals
- [ ] Deal hunters identified by cart patterns
- [ ] Loyalists identified by order history
- [ ] Persona accuracy > 80%

---

### Issue #8: Production Hardening & Documentation
**Labels**: `production`, `docs`, `security`
**Priority**: Low
**Description**:
Prepare for production launch with security audit and documentation.

**Tasks**:
- [ ] Security audit (secrets, tokens, webhooks)
- [ ] Performance optimization
- [ ] Set up error monitoring (Sentry)
- [ ] Create merchant documentation
- [ ] Create developer/API documentation
- [ ] Write launch blog post

**Acceptance Criteria**:
- [ ] Security audit passed
- [ ] All secrets in environment variables
- [ ] Error monitoring active
- [ ] Documentation complete
- [ ] Blog post published

---

## 8. Technical Specifications

### 8.1 Environment Variables

```bash
# Shopify
SHOPIFY_STORE=your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your_storefront_access_token
SHOPIFY_ADMIN_TOKEN=your_admin_api_token (for webhooks)

# Customer Accounts API
SHOPIFY_CLIENT_ID=your_customer_api_client_id
SHOPIFY_CLIENT_SECRET=your_customer_api_client_secret

# Webhook
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret

# AI
KIMI_API_KEY=your_kimi_api_key
AI_GATEWAY_URL=https://gateway.ai.cloudflare.com/...

# Cloudflare
CF_ACCOUNT_ID=your_account_id
CF_API_TOKEN=your_api_token
```

### 8.2 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/s/{storeSlug}` | GET | Main storefront (personalized) |
| `/api/shopper/track` | POST | Track shopper behavior |
| `/api/shopper/export` | GET | Export shopper data (GDPR) |
| `/api/shopper/delete` | POST | Delete shopper data (GDPR) |
| `/api/generation/status` | GET | Check UI generation status |
| `/webhook/shopify` | POST | Shopify webhooks |
| `/webhook/generation-complete` | POST | Container completion webhook |
| `/health` | GET | Health check |

### 8.3 KV Namespace Structure

```
ui:{storeSlug}:{shopperId}           → Generated HTML
session:{shopperId}                  → Shopper preferences & history
products:{storeSlug}:{productId}     → Cached product data
shop:{storeSlug}                     → Cached shop info
collections:{storeSlug}              → Cached collections
job:{jobId}                          → Generation job status
```

---

## 9. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Shopify API rate limiting | Low | High | No rate limits on Storefront API; implement caching |
| Webhook delivery failures | Medium | Medium | Retry logic; periodic sync as backup |
| LLM generation failures | Medium | Low | Fallback to templates; retry logic |
| Customer data breach | Low | Critical | Minimal PII storage; encryption; GDPR compliance |
| App rejection from Shopify | Medium | Medium | Follow guidelines; start with unlisted |

---

## 10. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page load time (cached) | < 100ms | Cloudflare Analytics |
| Page load time (first visit) | < 2s | Cloudflare Analytics |
| Shopify API calls per session | < 5 | Worker logs |
| Cache hit rate | > 90% | KV metrics |
| AI generation success rate | > 95% | Container logs |
| Persona detection accuracy | > 80% | A/B testing |
| Merchant satisfaction | > 4.5/5 | Post-install survey |

---

*Document Version: 1.0*
*Last Updated: 2026-02-17*
*Author: WandStore Engineering*
