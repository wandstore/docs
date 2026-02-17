# WandStore Landing Page v2 — Design System & Mockups

## Overview

This document contains the complete visual design system, mockup specifications, and engineering handoff notes for WandStore Landing Page v2.

---

## 1. Design System

### 1.1 Color Palette

#### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| `--color-primary` | `#0F172A` | Primary text, headings, dark backgrounds |
| `--color-primary-light` | `#1E293B` | Secondary dark, hover states |
| `--color-accent` | `#6366F1` | CTAs, links, highlights, interactive elements |
| `--color-accent-hover` | `#4F46E5` | CTA hover states |
| `--color-accent-light` | `#EEF2FF` | Light accent backgrounds, badges |

#### Neutral Colors
| Name | Hex | Usage |
|------|-----|-------|
| `--color-white` | `#FFFFFF` | Backgrounds, cards |
| `--color-gray-50` | `#F8FAFC` | Page background, subtle sections |
| `--color-gray-100` | `#F1F5F9` | Alternate section backgrounds |
| `--color-gray-200` | `#E2E8F0` | Borders, dividers |
| `--color-gray-400` | `#94A3B8` | Secondary text, placeholders |
| `--color-gray-600` | `#475569` | Body text, descriptions |
| `--color-gray-900` | `#0F172A` | Primary text |

#### Semantic Colors
| Name | Hex | Usage |
|------|-----|-------|
| `--color-success` | `#10B981` | Success states, positive metrics |
| `--color-success-light` | `#D1FAE5` | Success backgrounds |
| `--color-warning` | `#F59E0B` | Warnings, limited availability |
| `--color-error` | `#EF4444` | Errors, critical alerts |

#### Gradient Definitions
```css
/* Hero gradient background */
--gradient-hero: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #312E81 100%);

/* Accent glow */
--gradient-accent: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);

/* Card hover glow */
--glow-accent: 0 0 40px rgba(99, 102, 241, 0.15);
```

### 1.2 Typography

#### Font Stack
```css
--font-heading: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

#### Type Scale
| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| H1 (Hero) | 56px / 3.5rem | 800 | 1.1 | -0.02em |
| H2 (Section) | 40px / 2.5rem | 700 | 1.2 | -0.01em |
| H3 (Card Title) | 24px / 1.5rem | 600 | 1.3 | 0 |
| H4 (Subsection) | 20px / 1.25rem | 600 | 1.4 | 0 |
| Body Large | 20px / 1.25rem | 400 | 1.6 | 0 |
| Body | 16px / 1rem | 400 | 1.6 | 0 |
| Body Small | 14px / 0.875rem | 400 | 1.5 | 0 |
| Caption | 12px / 0.75rem | 500 | 1.4 | 0.05em |
| Button | 16px / 1rem | 600 | 1 | 0 |

#### Responsive Typography (Mobile)
| Element | Size |
|---------|------|
| H1 (Hero) | 36px / 2.25rem |
| H2 (Section) | 28px / 1.75rem |
| H3 (Card Title) | 20px / 1.25rem |

### 1.3 Spacing System

#### Base Unit: 4px
| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight spacing, icon gaps |
| `--space-2` | 8px | Inline elements, small gaps |
| `--space-3` | 12px | Component internal spacing |
| `--space-4` | 16px | Standard spacing |
| `--space-6` | 24px | Section internal padding |
| `--space-8` | 32px | Card padding, section gaps |
| `--space-12` | 48px | Large section gaps |
| `--space-16` | 64px | Section padding (vertical) |
| `--space-20` | 80px | Hero padding, major sections |
| `--space-24` | 96px | Footer spacing |

#### Container Widths
| Breakpoint | Max Width | Padding |
|------------|-----------|---------|
| Mobile | 100% | 16px |
| Tablet (768px) | 100% | 24px |
| Desktop (1024px) | 960px | 32px |
| Wide (1280px) | 1200px | 48px |

### 1.4 Shadows & Effects

```css
/* Card shadow */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Accent glow for CTAs */
--shadow-accent: 0 0 0 3px rgba(99, 102, 241, 0.3);

/* Card hover */
--shadow-card-hover: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### 1.5 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Small buttons, tags |
| `--radius-md` | 8px | Inputs, small cards |
| `--radius-lg` | 12px | Cards, containers |
| `--radius-xl` | 16px | Large cards, modals |
| `--radius-2xl` | 24px | Hero elements, feature cards |
| `--radius-full` | 9999px | Pills, avatars, buttons |

---

## 2. Component Library

### 2.1 Buttons

#### Primary Button
```
Background: #6366F1
Text: #FFFFFF
Padding: 16px 32px
Border Radius: 9999px (full)
Font: 16px / 600 weight
Shadow: 0 4px 14px rgba(99, 102, 241, 0.4)
Hover: Background #4F46E5, translateY(-1px)
Active: translateY(0)
```

#### Secondary Button
```
Background: transparent
Border: 2px solid #E2E8F0
Text: #0F172A
Padding: 14px 30px
Border Radius: 9999px
Hover: Border #6366F1, Text #6366F1
```

#### Ghost Button
```
Background: transparent
Text: #6366F1
Padding: 12px 24px
Hover: Background #EEF2FF
```

### 2.2 Cards

#### Feature Card
```
Background: #FFFFFF
Border: 1px solid #E2E8F0
Border Radius: 16px
Padding: 32px
Shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05)
Hover: Shadow 0 20px 25px -5px rgba(0, 0, 0, 0.1), translateY(-4px)
```

#### Pricing Card
```
Background: #FFFFFF
Border: 1px solid #E2E8F0
Border Radius: 24px
Padding: 40px
Shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05)

/* Popular variant */
Border: 2px solid #6366F1
Background: linear-gradient(180deg, #FFFFFF 0%, #EEF2FF 100%)
Badge: "Most Popular" - top right, accent background
```

### 2.3 Navigation

#### Header
```
Height: 72px
Background: rgba(255, 255, 255, 0.8)
Backdrop Filter: blur(12px)
Border Bottom: 1px solid rgba(226, 232, 240, 0.6)
Position: fixed, z-index 50
```

#### Logo
```
Font: 24px / 700 weight
Color: #0F172A
Icon: Wand icon (20x20) in accent color
```

---

## 3. Section Mockups

### 3.1 Hero Section

**Layout:**
- Full viewport height (100vh, min-height 700px)
- Two-column layout on desktop (55% text / 45% visual)
- Single column, stacked on mobile
- Background: Gradient from #0F172A to #1E293B with subtle animated gradient overlay

**Content:**
```
Badge (top): "🚀 Now in Private Beta" - pill shape, accent light bg
Headline: "Turn Every Visitor Into a Buyer" - white, 56px, max-width 600px
Subheadline: "AI-generated storefronts that adapt to each shopper in real time" - gray-400, 20px, max-width 500px
CTA Button: "Join 200+ Brands Already Converting More" - primary button, full width mobile, auto desktop
Trust Bar: "Trusted by 200+ brands" + 5 company logos (grayscale, opacity 0.6)
```

**Visual Element (Right Side):**
- Abstract 3D visualization of AI generating UI
- Dark card mockup with glowing accent elements
- Floating UI components with subtle animation
- Dimensions: ~500px wide on desktop

**Metrics Row (Bottom):**
- 3-column grid showing: "10x Conversion Lift", "<100ms Generation", "1/10th Agency Cost"
- Large numbers in accent color, labels in gray-400

**Mobile Adaptation:**
- Stacked layout, text centered
- Visual element below text, 80% width
- Metrics stacked vertically

---

### 3.2 Problem Section

**Layout:**
- Background: #F8FAFC (gray-50)
- Padding: 96px vertical
- Two-column asymmetric layout

**Content:**
```
Section Label: "THE PROBLEM" - caption style, accent color, uppercase
Headline: "Your Store Is Stuck in 2019" - 40px, dark
Body: "While your competitors show dynamic, personalized experiences, your storefront looks the same to everyone. Static pages. Generic messaging. Missed revenue." - 18px, gray-600, max-width 540px
```

**Visual Element:**
- Side-by-side comparison illustration
- Left: Dated, static storefront (muted colors, generic layout)
- Right: Modern, dynamic storefront (vibrant, personalized)
- Visual treatment: Split screen with diagonal divider

**Pain Points (3 cards below):**
- Card 1: "One Size Fits None" - Icon: Users - "Your homepage shows the same products to every visitor"
- Card 2: "Conversion Plateaus" - Icon: TrendingDown - "A/B testing gives marginal gains at best"
- Card 3: "Agency Costs Skyrocket" - Icon: DollarSign - "Custom builds cost $100K+ and take 6 months"

---

### 3.3 Solution Section

**Layout:**
- Background: #0F172A (dark)
- Padding: 96px vertical
- Centered content with code preview on right

**Content:**
```
Section Label: "THE SOLUTION" - caption, accent color
Headline: "Meet the Storefront That Sells For You" - 40px, white
Body: "WandStore generates a unique storefront for every visitor — in under 100ms." - 18px, gray-400
```

**Feature Grid (4 items):**
- Lightning Fast Generation - Icon: Zap - "UI components generated in under 100ms at the edge"
- Context-Aware Intelligence - Icon: Brain - "Device, location, time, history — all factor in"
- Headless & Composable - Icon: Puzzle - "Works with Shopify, BigCommerce, custom backends"
- Enterprise Reliability - Icon: Shield - "99.99% uptime SLA, SOC 2 Type II compliant"

**Code Preview Card:**
- Dark card with syntax highlighting
- Shows API call and response
- Animated typing effect on load

---

### 3.4 Pricing Section

**Layout:**
- Background: #FFFFFF
- Padding: 96px vertical
- Centered headline, 3-column pricing grid

**Content:**
```
Section Label: "PRICING" - caption, accent
Headline: "Agency Quality. 1/10th the Cost. Zero Wait." - 40px, centered
Subheadline: "No setup fees. No hidden costs. Cancel anytime." - gray-600
```

**Pricing Cards:**

| Starter | Growth (Popular) | Scale |
|---------|------------------|-------|
| $499/mo | $1,499/mo | $4,999/mo |
| 50K pageviews | 500K pageviews | Unlimited |
| 5 templates | Unlimited templates | Everything + Custom AI |
| Basic personalization | Advanced personalization | Dedicated manager |
| Email support | Priority + Slack | 24/7 + SLA |

**Card Styling:**
- Equal height cards
- Growth card elevated (scale 1.02, accent border)
- "Most Popular" badge on Growth card
- Feature list with checkmarks (accent color)

---

### 3.5 CTA Section

**Layout:**
- Background: Gradient (accent to purple)
- Padding: 80px vertical
- Centered content

**Content:**
```
Headline: "Join 200+ Brands Already Converting More" - 40px, white, centered
Subheadline: "No credit card required. Free 14-day trial included." - white/80% opacity
CTA Button: "Get Started Free" - white bg, dark text, large size
Secondary Text: "Limited spots available for private beta"
```

**Trust Elements:**
- Row of company logos (white/light versions)
- "Rated 4.9/5 on G2" badge

---

### 3.6 Footer

**Layout:**
- Background: #0F172A
- Padding: 64px top, 32px bottom
- 4-column grid (Logo+desc, Product, Company, Legal)

**Content:**
```
Column 1: WandStore logo + "The storefront that doesn't exist until the customer arrives."
Column 2: Product links (Features, Pricing, Integrations, API Docs)
Column 3: Company links (About, Blog, Careers, Contact)
Column 4: Legal links (Privacy, Terms, Security)

Bottom Bar: © 2026 WandStore. All rights reserved. + Social icons
```

---

## 4. Responsive Breakpoints

| Breakpoint | Width | Key Changes |
|------------|-------|-------------|
| Mobile | < 640px | Single column, stacked layout, reduced font sizes, hamburger menu |
| Tablet | 640px - 1024px | 2-column where appropriate, adjusted spacing |
| Desktop | 1024px - 1280px | Full layout, max-width containers |
| Wide | > 1280px | Centered content, increased whitespace |

### Mobile-Specific Adaptations:
- Hero: Stacked, centered text, reduced headline (36px)
- Navigation: Hamburger menu with slide-out drawer
- Pricing: Horizontal scroll or stacked cards
- Problem/Solution: Single column, full-width visuals
- Reduce section padding to 64px vertical

---

## 5. Assets & Specifications

### 5.1 Icons

**Source:** Lucide React icons
**Size:** 24px default, 20px for inline
**Stroke Width:** 2px

**Required Icons:**
- Zap (speed)
- Brain (AI)
- Puzzle (integrations)
- Shield (security)
- Users (personalization)
- TrendingUp / TrendingDown (metrics)
- DollarSign (pricing)
- Check (feature lists)
- Menu (mobile nav)
- X (close)
- ChevronRight (links)
- ArrowRight (CTAs)

### 5.2 Images

**Hero Visual:**
- Abstract 3D illustration of AI generating UI
- Dark theme matching brand colors
- Format: SVG (preferred) or PNG with transparency
- Dimensions: 600x500px
- Optimization: Lazy load, blur-up placeholder

**Company Logos (Trust Bar):**
- 5 placeholder logos (ACME, Globex, Initech, Hooli, Massive)
- Grayscale, opacity 0.6
- Format: SVG
- Height: 32px

**Problem Comparison:**
- Side-by-side illustration
- Format: SVG
- Dimensions: 600x400px

### 5.3 Performance Specs

- **Images:** Max 200KB each, WebP with PNG fallback
- **Fonts:** Inter from Google Fonts, font-display: swap
- **CSS:** Tailwind with purge, target < 50KB critical CSS
- **Animations:** CSS transforms only, no layout thrashing
- **Lighthouse Targets:** 95+ Performance, 100 Accessibility

---

## 6. Engineering Handoff Notes

### 6.1 Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS 3.4+
- **Components:** shadcn/ui base
- **Animations:** Framer Motion (subtle, performance-conscious)
- **Icons:** Lucide React

### 6.2 Tailwind Config Additions
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F172A',
          light: '#1E293B',
        },
        accent: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          light: '#EEF2FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradient 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
}
```

### 6.3 Accessibility Checklist
- [ ] All interactive elements have focus states
- [ ] Color contrast ratio 4.5:1 minimum for text
- [ ] Alt text for all images
- [ ] Semantic HTML (header, main, section, footer)
- [ ] ARIA labels where needed
- [ ] Keyboard navigation support
- [ ] Reduced motion media query support

### 6.4 Animation Guidelines
- **Hero elements:** Subtle fade-in + translateY on load (staggered)
- **Cards:** Scale 1.02 + shadow on hover, 200ms ease-out
- **Buttons:** translateY(-1px) on hover
- **Metrics:** Count-up animation on scroll into view
- **Code preview:** Typing animation, once on load

### 6.5 File Structure
```
app/
├── sections/
│   ├── Hero.tsx
│   ├── Problem.tsx
│   ├── Solution.tsx
│   ├── Pricing.tsx
│   ├── CTA.tsx
│   └── Footer.tsx
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   └── AnimatedCounter.tsx
├── hooks/
│   └── useInView.ts
├── lib/
│   └── utils.ts
├── page.tsx
└── layout.tsx
```

---

## 7. Design Principles

1. **Clarity First:** Every element serves a purpose. No decorative fluff.
2. **Trust Through Polish:** Professional, refined details build credibility.
3. **Performance as Design:** Fast feels good. Optimize everything.
4. **Mobile-First:** Design for thumbs, scale up for desktops.
5. **Accessible by Default:** Everyone should be able to use this.

---

## 8. Open Questions for Engineering

1. Should we implement the code preview with live syntax highlighting or static image?
2. Preferred animation library: Framer Motion, GSAP, or CSS-only?
3. Do we need dark mode toggle, or is dark hero + light sections sufficient?
4. Should pricing toggle between monthly/annual?
5. Any specific performance budget numbers to hit?

---

*Design prepared by: Designer Agent*  
*Date: 2026-02-16*  
*Version: 1.0*
