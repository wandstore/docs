# Phase 2: AI Template Generation — Architecture Oversight

**Status:** 🔄 IN PROGRESS  
**Owner:** Architect (WandStore Engineering)  
**Scope:** Solution 1 (Containers + Background Generation) from Issue #15

---

## 1. Persona Brief Review

### Current State
The Container (`container/src/index.ts`) currently defines 4 personas inline within the LLM prompt:

```typescript
// From container/src/index.ts
DESIGN PERSONAS (choose based on shopper data):
1. "mystic_scholar" - For returning customers who appreciate detailed product info, dark academia aesthetic
2. "whimsical_wanderer" - For new visitors, playful and inviting, bright colors
3. "master_wizard" - For high cart value customers, premium luxury feel
4. "practical_apprentice" - For price-conscious shoppers, clean and efficient
```

### Review Feedback

#### ✅ Strengths
- **Distinct personas** — Each targets a different shopper segment
- **Clear mapping** — Linked to observable shopper data (visit count, cart value)
- **Aligned with brand** — Magical/wizarding theme consistent with WandStore

#### ⚠️ Issues Identified

| Issue | Severity | Description |
|-------|----------|-------------|
| **Insufficient detail** | HIGH | One-line descriptions won't produce consistent, high-quality output |
| **No visual references** | HIGH | LLM needs concrete design references (designers, styles, color palettes) |
| **No component specs** | MEDIUM | Missing guidance on layout, typography, animation preferences per persona |
| **No accessibility guidance** | MEDIUM | No persona-specific a11y considerations |
| **Hardcoded in prompt** | LOW | Should be externalized for easier iteration |

#### 🔧 Recommendations

**Create structured persona briefs** in `/storefront/personas/`:

```
storefront/personas/
├── mystic-scholar.md
├── whimsical-wanderer.md
├── master-wizard.md
├── practical-apprentice.md
└── _template.md      # Template for creating new personas
```

Each brief should include:
- **Visual Reference** — Specific designer/brand/style (e.g., "Aesop meets dark academia")
- **Color Palette** — Primary, secondary, accent, neutrals (hex codes)
- **Typography** — Font families, sizes, weights
- **Layout Preferences** — Grid density, whitespace, component arrangement
- **Animation Style** — Subtle, dramatic, playful, minimal
- **Content Tone** — Formal, friendly, luxurious, direct
- **Key Components** — Hero style, product grid density, CTA prominence

---

## 2. LLM Integration Validation

### Current Implementation

```typescript
// From container/src/index.ts
const CONFIG = {
  AI_MODEL: 'kimi-k2-5',
  AI_API_URL: 'https://api.moonshot.cn/v1/chat/completions',
  MAX_CONCURRENT_JOBS: 5,
  JOB_TIMEOUT_MS: 60000,
};
```

### Validation Results

#### API Choice: Kimi (Moonshot AI)

| Factor | Assessment | Notes |
|--------|------------|-------|
| **Cost** | ✅ Good | ~$0.08-0.12 per generation (4000 tokens) |
| **Quality** | ✅ Good | K2.5 strong at HTML/CSS generation |
| **Latency** | ⚠️ Acceptable | 3-10s typical, acceptable for background |
| **Rate Limits** | ⚠️ Watch | 100 RPM on standard tier |
| **Availability** | ✅ Good | Stable API, good uptime |

**Alternative Considered:** Claude 3.5 Sonnet
- Better at complex layouts (+)
- Higher cost (~$0.15-0.20 per generation) (-)
- Lower rate limits (-)

**Recommendation:** Stick with Kimi K2.5 for Phase 2. Re-evaluate if quality issues emerge.

#### Prompt Engineering Approach

**Current:** Single-shot prompt with inline persona descriptions

```typescript
// Current approach (simplified)
const prompt = `Generate a personalized storefront UI...
DESIGN PERSONAS (choose based on shopper data):
1. "mystic_scholar" - ...
2. ...

Generate HTML and CSS that matches the chosen persona...`;
```

**Issues:**
1. No few-shot examples
2. No structured output validation
3. Persona logic in prompt (hard to iterate)
4. No retry logic for malformed outputs

**Recommended Improvements:**

```typescript
// Improved approach
interface PromptConfig {
  systemPrompt: string;           // Loaded from file
  personaBrief: string;           // Loaded from persona markdown
  fewShotExamples: Example[];     // 2-3 examples of good output
  outputSchema: JSONSchema;       // Validation schema
}

// Build prompt with examples
const prompt = buildPrompt({
  systemPrompt: await loadSystemPrompt(),
  personaBrief: await loadPersonaBrief(personaKey),
  examples: getFewShotExamples(personaKey),
  shopperContext: buildShopperContext(request),
});
```

#### Error Handling Strategy

**Current State:**
```typescript
// From container/src/index.ts
try {
  const generatedUI = await generateUIWithLLM(job.request);
  await notifyWorker(response);
} catch (error) {
  console.error(`[Job ${job.id}] Generation failed:`, error);
  // Notify worker of failure
  await notifyWorker({ success: false, error: job.error });
}
```

**Assessment:**

| Aspect | Status | Notes |
|--------|--------|-------|
| Retry logic | ❌ Missing | No retry on transient failures |
| Fallback UI | ⚠️ Partial | Worker has fallback, but Container doesn't |
| Error classification | ❌ Missing | All errors treated equally |
| Alerting | ❌ Missing | No monitoring/alerting on failures |

**Recommendations:**

1. **Add retry with exponential backoff:**
```typescript
async function generateWithRetry(prompt: string, maxRetries = 3): Promise<GeneratedUI> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await generateUIWithLLM(prompt);
    } catch (error) {
      if (isTransientError(error) && attempt < maxRetries - 1) {
        await sleep(1000 * Math.pow(2, attempt));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}
```

2. **Classify errors:**
   - `TRANSIENT` — Rate limit, timeout, network → Retry
   - `CONTENT` — Invalid JSON, malformed HTML → Retry with different prompt
   - `PROMPT` — Prompt too long, invalid format → Fail fast, alert
   - `UNKNOWN` — Log and alert

3. **Add circuit breaker:**
   - After N consecutive failures, pause generation
   - Alert on-call engineer
   - Resume after manual review

#### Cost Optimization

**Current Cost Estimate:**
- Per generation: ~4000 tokens × $0.02/1K = $0.08
- 10K generations/day = $800/day = $24K/month

**Optimization Strategies:**

| Strategy | Impact | Implementation |
|----------|--------|----------------|
| **Caching** | 60-80% reduction | Cache by persona + product category hash |
| **Smaller model for simple** | 30% reduction | Use Kimi K2 for new visitors, K2.5 for returning |
| **Batching** | 20% reduction | Queue and batch similar requests |
| **Token optimization** | 15% reduction | Minimize prompt length, use abbreviations |

**Recommended:** Implement caching layer before LLM call:

```typescript
async function generateUIWithLLM(request: GenerationRequest): Promise<GeneratedUI> {
  const cacheKey = generateCacheKey(request);
  
  // Check cache first
  const cached = await checkLLMCache(cacheKey);
  if (cached) return cached;
  
  // Generate and cache
  const result = await callLLM(request);
  await cacheLLMResult(cacheKey, result);
  return result;
}
```

---

## 3. Template Structure Specification

### Current State
The Container generates a flat JSON structure:

```typescript
interface GeneratedUI {
  html: string;           // Complete HTML document
  css: string;            // Complete CSS stylesheet
  persona: string;        // Persona identifier
  generatedAt: number;
  version: string;
  expiresAt: number;
}
```

### Proposed Structure

For better maintainability, modularity, and caching:

```
template/
├── meta/
│   ├── manifest.json          # Template metadata
│   ├── persona.json           # Persona configuration
│   └── dependencies.json      # External resources
├── html/
│   ├── document.html          # Main document structure
│   ├── components/
│   │   ├── header.html
│   │   ├── hero.html
│   │   ├── product-grid.html
│   │   ├── cart.html
│   │   └── footer.html
│   └── partials/
│       ├── head.html
│       └── scripts.html
├── css/
│   ├── main.css               # Core styles
│   ├── components/
│   │   ├── header.css
│   │   ├── hero.css
│   │   ├── product-grid.css
│   │   ├── cart.css
│   │   └── footer.css
│   ├── themes/
│   │   ├── default.css
│   │   └── dark.css
│   └── utilities.css
├── js/
│   ├── main.js
│   ├── components/
│   │   ├── cart.js
│   │   ├── product-grid.js
│   │   └── analytics.js
│   └── vendor/
│       └── shopify-buy.js
└── assets/
    ├── fonts/
    └── images/
```

### Storage Strategy

**KV Storage:**
```typescript
// Store as compressed bundle
const templateBundle = {
  meta: { /* manifest */ },
  html: { /* component map */ },
  css: { /* stylesheet map */ },
  js: { /* script map */ },
};

await env.GENERATED_UI_CACHE.put(
  `template:${shopperId}`,
  JSON.stringify(templateBundle),
  { compression: true }
);
```

**R2 Storage (for large assets):**
- Fonts, images stored in R2
- Templates reference by URL
- Better for >1MB bundles

### Rendering Strategy

**Server-side (Worker):**
```typescript
// Assemble template from components
function renderTemplate(bundle: TemplateBundle, data: RenderData): string {
  const html = assembleHTML(bundle.html, data);
  const css = bundle.css.main + bundle.css.components.header + ...;
  const js = bundle.js.main;
  
  return `<!DOCTYPE html>
<html>
<head>${css}</head>
<body>${html}${js}</body>
</html>`;
}
```

**Benefits:**
- Component-level caching (cache header across shoppers)
- Easier A/B testing (swap components)
- Better debugging (inspect individual parts)

---

## 4. Quality Checklist for Generated Templates

### Pre-Generation Checklist

- [ ] **Persona brief is complete** — All required fields populated
- [ ] **Prompt is validated** — No syntax errors, proper escaping
- [ ] **Output schema is defined** — JSON schema for validation
- [ ] **Fallback template is ready** — In case generation fails

### Post-Generation Checklist

#### Quality & Consistency

- [ ] **HTML is valid** — Passes W3C validator
- [ ] **CSS is valid** — No syntax errors, proper vendor prefixes
- [ ] **Persona alignment** — Output matches persona brief
- [ ] **Brand consistency** — Uses store theme colors, fonts
- [ ] **No AI artifacts** — No placeholder text, "lorem ipsum", broken links

#### Responsive Design

- [ ] **Mobile-first** — Base styles for mobile, media queries for larger
- [ ] **Breakpoints** — 320px, 768px, 1024px, 1440px
- [ ] **Touch targets** — Minimum 44×44px for interactive elements
- [ ] **Viewport meta** — Proper viewport configuration
- [ ] **Fluid typography** — Uses clamp() or similar for scaling

#### Performance

- [ ] **No render-blocking** — CSS inlined or properly loaded
- [ ] **Image optimization** — Lazy loading, proper formats
- [ ] **Minimal DOM** — No unnecessary nesting
- [ ] **Efficient selectors** — No deep nesting, avoids universal selectors
- [ ] **Bundle size** — HTML+CSS+JS < 100KB (gzipped)

#### Security

- [ ] **No XSS vulnerabilities** — All user input escaped
- [ ] **No inline event handlers** — Uses addEventListener
- [ ] **CSP-compatible** — No eval(), inline scripts minimized
- [ ] **No external resources** — Or only from trusted domains
- [ ] **HTTPS only** — All resources loaded over HTTPS

#### Accessibility

- [ ] **Semantic HTML** — Proper use of header, main, nav, article, etc.
- [ ] **ARIA labels** — For interactive elements
- [ ] **Color contrast** — WCAG AA minimum (4.5:1 for text)
- [ ] **Focus states** — Visible focus indicators
- [ ] **Alt text** — For all images
- [ ] **Keyboard navigation** — All functionality accessible via keyboard

### Automated Validation

```typescript
// Validation pipeline
async function validateTemplate(template: GeneratedUI): Promise<ValidationResult> {
  const checks = await Promise.all([
    validateHTML(template.html),
    validateCSS(template.css),
    validateSecurity(template),
    validateAccessibility(template),
    validatePerformance(template),
  ]);
  
  return {
    passed: checks.every(c => c.passed),
    checks,
    score: calculateScore(checks),
  };
}
```

---

## 5. Blockers & Risks

### Current Blockers

| Blocker | Status | Impact | Mitigation |
|---------|--------|--------|------------|
| **Persona briefs incomplete** | 🔴 ACTIVE | HIGH | Create detailed briefs before generation |
| **No output validation** | 🔴 ACTIVE | HIGH | Implement validation pipeline |
| **No retry logic** | 🟡 MONITOR | MEDIUM | Add exponential backoff |
| **Cost uncertainty** | 🟡 MONITOR | MEDIUM | Implement caching, monitor usage |

### Watch List

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **LLM API rate limits** | Medium | High | Implement queue + backoff |
| **Poor template quality** | Medium | High | Validation pipeline + human review |
| **High generation costs** | Medium | Medium | Caching + smaller model for simple |
| **Security vulnerabilities** | Low | Critical | Automated security scanning |

---

## 6. Architecture Decisions

### Decision Log

| Date | Decision | Rationale | Status |
|------|----------|-----------|--------|
| 2026-02-16 | Use Kimi K2.5 for generation | Cost-effective, good quality | ✅ APPROVED |
| 2026-02-16 | Externalize persona briefs | Easier iteration, better quality | 🔄 PENDING |
| 2026-02-16 | Implement component-based templates | Better caching, maintainability | 🔄 PENDING |
| 2026-02-16 | Add validation pipeline | Quality assurance | 🔄 PENDING |

---

## 7. Next Steps

### Immediate (This Week)

1. [ ] Create detailed persona briefs (4 files)
2. [ ] Implement output validation pipeline
3. [ ] Add retry logic with exponential backoff
4. [ ] Set up cost monitoring

### Short-term (Next 2 Weeks)

1. [ ] Implement component-based template structure
2. [ ] Add LLM response caching
3. [ ] Create automated quality checks
4. [ ] Set up alerting for failures

### Medium-term (Next Month)

1. [ ] A/B test persona effectiveness
2. [ ] Optimize prompts based on results
3. [ ] Consider model fine-tuning if needed
4. [ ] Document lessons learned

---

## 8. Deliverables Summary

| Deliverable | Status | Location |
|-------------|--------|----------|
| Persona brief review feedback | ✅ Complete | This document |
| LLM integration validation | ✅ Complete | This document |
| Template structure specification | ✅ Complete | This document |
| Quality checklist | ✅ Complete | This document |
| Updated GitHub issue | 🔄 Pending | Issue #15 |

---

*Document Version: 1.0*  
*Last Updated: 2026-02-16*  
*Author: WandStore Architect*
