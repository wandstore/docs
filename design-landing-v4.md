# WandStore Landing Page v4 — Design System

## Overview
Clerk.com-inspired redesign for WandStore landing page. Clean, minimal, world-class aesthetic with strong typography hierarchy and professional color palette.

---

## Design Philosophy

### Core Principles (Clerk-inspired)
1. **Radical Simplicity** — Every element earns its place
2. **Typography-First** — Let type do the heavy lifting
3. **Generous Whitespace** — Breathing room creates premium feel
4. **Subtle Sophistication** — Refined over flashy
5. **Content-Focused** — Design serves the message

---

## Color Palette

### Primary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg-primary` | `#FFFFFF` | Main background |
| `--color-bg-secondary` | `#FAFAFA` | Section alternates, cards |
| `--color-bg-tertiary` | `#F5F5F5` | Subtle backgrounds, code blocks |

### Text Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-text-primary` | `#0A0A0A` | Headlines, primary text |
| `--color-text-secondary` | `#525252` | Body text, descriptions |
| `--color-text-tertiary` | `#737373` | Captions, metadata |
| `--color-text-muted` | `#A3A3A3` | Placeholders, disabled |

### Accent Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-accent` | `#171717` | Primary buttons, links |
| `--color-accent-hover` | `#000000` | Button hover |
| `--color-accent-light` | `#E5E5E5` | Subtle accents |
| `--color-border` | `#E5E5E5` | Borders, dividers |
| `--color-border-light` | `#F0F0F0` | Subtle separators |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#10B981` | Success states |
| `--color-code-bg` | `#1A1A1A` | Code snippet background |
| `--color-code-text` | `#E5E5E5` | Code text |
| `--color-code-keyword` | `#60A5FA` | Code keywords |
| `--color-code-string` | `#34D399` | Code strings |

---

## Typography System

### Font Family
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
```

### Type Scale

| Style | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| Display | 72px / 4.5rem | 600 | 1.0 | -0.02em | Hero headline |
| H1 | 56px / 3.5rem | 600 | 1.1 | -0.02em | Section titles |
| H2 | 40px / 2.5rem | 600 | 1.2 | -0.01em | Subsection titles |
| H3 | 28px / 1.75rem | 600 | 1.3 | -0.01em | Card titles |
| H4 | 20px / 1.25rem | 600 | 1.4 | 0 | Small headings |
| Body Large | 20px / 1.25rem | 400 | 1.6 | 0 | Lead paragraphs |
| Body | 16px / 1rem | 400 | 1.7 | 0 | Main body text |
| Body Small | 14px / 0.875rem | 400 | 1.6 | 0 | Secondary text |
| Caption | 12px / 0.75rem | 500 | 1.5 | 0.02em | Labels, captions |
| Code | 14px / 0.875rem | 400 | 1.6 | 0 | Code snippets |

### Responsive Typography
- **Desktop (1280px+)**: Full scale as above
- **Tablet (768px-1279px)**: Display: 56px, H1: 44px, H2: 32px
- **Mobile (<768px)**: Display: 40px, H1: 32px, H2: 28px

---

## Spacing System

### Section Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `--section-padding-y` | 120px | Vertical section padding |
| `--section-padding-y-sm` | 80px | Reduced section padding |
| `--section-gap` | 80px | Gap between major elements |

### Content Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Micro spacing |
| `--space-2` | 8px | Tight spacing |
| `--space-3` | 12px | Compact spacing |
| `--space-4` | 16px | Default spacing |
| `--space-6` | 24px | Medium spacing |
| `--space-8` | 32px | Large spacing |
| `--space-10` | 40px | Section internal spacing |
| `--space-12` | 48px | Major element spacing |
| `--space-16` | 64px | Large section gaps |
| `--space-20` | 80px | Extra large gaps |

### Container
| Token | Value | Usage |
|-------|-------|-------|
| `--container-max` | 1200px | Maximum content width |
| `--container-padding` | 24px | Horizontal padding (mobile: 16px) |

---

## Component Specifications

### Buttons

#### Primary Button
```
Background: #171717
Text: #FFFFFF
Padding: 14px 28px
Border Radius: 8px
Font: 16px / 500 weight
Hover: Background #000000, slight scale(1.02)
Transition: all 200ms ease
```

#### Secondary Button
```
Background: transparent
Border: 1px solid #E5E5E5
Text: #0A0A0A
Padding: 14px 28px
Border Radius: 8px
Font: 16px / 500 weight
Hover: Background #FAFAFA
Transition: all 200ms ease
```

#### Ghost Button
```
Background: transparent
Text: #525252
Padding: 8px 0
Font: 14px / 500 weight
Hover: Text #0A0A0A
Underline on hover
```

### Code Snippet Block
```
Background: #1A1A1A
Border Radius: 12px
Padding: 24px
Font: JetBrains Mono, 14px
Line Height: 1.7
Color: #E5E5E5
Max Width: 600px
Box Shadow: 0 20px 40px rgba(0,0,0,0.15)
```

### Cards (Minimal)
```
Background: #FAFAFA
Border Radius: 12px
Padding: 32px
Border: 1px solid #F0F0F0
```

---

## Section Designs

### 1. Navigation
```
Height: 72px
Background: rgba(255,255,255,0.9) with backdrop-blur
Border Bottom: 1px solid #F0F0F0 (subtle)
Position: Fixed top
Z-Index: 50

Logo: WandStore wordmark, 20px, weight 600
Nav Links: 14px, weight 500, color #525252
CTA Button: "Get Started" — Primary button style
```

### 2. Hero Section
```
Padding: 160px top (account for nav), 120px bottom
Background: #FFFFFF
Text Align: Center
Max Width: 900px centered

Headline: Display size (72px desktop)
"A storefront that adapts to every visitor"
Color: #0A0A0A

Subheadline: Body Large (20px)
"Transform every visitor into a buyer with AI-powered personalization."
Color: #525252
Max Width: 600px

CTA Group: 
- Primary: "Get Started Free" 
- Secondary: "View Demo"
Gap: 16px
Margin Top: 40px

Visual: Abstract gradient mesh or subtle animated gradient
Position: Below content, full width, 400px height
Gradient: Subtle warm/cool blend (peach to lavender)
```

### 3. Problem Section
```
Padding: 120px vertical
Background: #FAFAFA

Layout: Single column, centered text
Max Width: 800px

Eyebrow: Caption style, uppercase, tracking wide
"THE PROBLEM"
Color: #737373

Headline: H1 size (56px)
"Static storefronts leave money on the table"
Color: #0A0A0A

Body: Body Large (20px)
"Every visitor is unique. Their needs, preferences, and intent differ. Yet most storefronts show the same experience to everyone — missing opportunities to connect and convert."
Color: #525252

Narrative Flow (no icon cards):
Three short statements with subtle dividers:
1. "Generic experiences don't resonate"
2. "Missed personalization = missed revenue"  
3. "Your competitors are already adapting"

Each: Body size, #525252, with 32px spacing
```

### 4. Solution Section
```
Padding: 120px vertical
Background: #FFFFFF

Layout: Two columns on desktop
Left: Text content (max 500px)
Right: Code snippet visual

Eyebrow: Caption style
"THE SOLUTION"

Headline: H1 size
"Generated for every visitor. Delivered at the edge."

Body: Body size
"Our AI analyzes each visitor in real-time and generates a personalized storefront experience — instantly, at the edge, anywhere in the world."

Code Snippet (right side):
```javascript
// Every visitor gets a unique experience
const storefront = await wandstore.generate({
  visitor: {
    location: 'Tokyo, Japan',
    device: 'mobile',
    referrer: 'instagram',
    interests: ['skincare', 'minimalism']
  },
  optimizeFor: 'conversion'
});

// Delivered in <100ms from 300+ edge locations
await storefront.render();
```

Features List (below code):
- "Sub-100ms response times"
- "300+ global edge locations"
- "Real-time visitor analysis"

Each with subtle check indicator, 14px text
```

### 5. Pricing Section
```
Padding: 120px vertical
Background: #FAFAFA

Header: Centered
Eyebrow: "PRICING"
Headline: "Simple pricing, no surprises"
Subheadline: "Start free, scale as you grow"

Pricing Cards: 3-column grid on desktop

Free Tier:
- Background: #FFFFFF
- Border: 1px solid #E5E5E5
- Price: "$0" / month
- Description: "Perfect for trying out"
- Features: 3-4 key features
- CTA: "Get Started" (secondary button)

Pro Tier (Featured):
- Background: #0A0A0A
- Text: #FFFFFF
- Badge: "Most Popular"
- Price: "$49" / month
- Description: "For growing stores"
- Features: All features
- CTA: "Start Free Trial" (primary, inverted)

Enterprise Tier:
- Background: #FFFFFF
- Border: 1px solid #E5E5E5
- Price: "Custom"
- Description: "For large-scale operations"
- Features: Plus dedicated support
- CTA: "Contact Sales" (secondary button)

Card Specs:
- Padding: 40px
- Border Radius: 16px
- Gap between: 24px
```

### 6. CTA Section
```
Padding: 120px vertical
Background: #0A0A0A (inverted)
Text: #FFFFFF

Layout: Centered, max-width 700px

Headline: H1 size, white
"Ready to transform your storefront?"

Subheadline: Body Large, #A3A3A3
"Join thousands of stores already using WandStore to convert more visitors."

CTA Button: Primary style, inverted
Background: #FFFFFF, Text: #0A0A0A
"Get Started Free"

Secondary text below:
"No credit card required • 14-day free trial"
Caption style, #737373
```

### 7. Footer
```
Padding: 80px top, 40px bottom
Background: #FAFAFA
Border Top: 1px solid #E5E5E5

Layout: 
- Top row: Logo + tagline left, nav links right
- Bottom row: Copyright left, social links right

Logo: WandStore, 18px, weight 600
Tagline: "AI-powered storefronts" — Body Small, #737373

Nav Columns:
Product, Company, Resources, Legal
Each: Caption header, Body Small links

Copyright: "© 2024 WandStore. All rights reserved."
Body Small, #737373
```

---

## Animation Specifications

### Page Load Sequence
1. Navbar fades in (0ms, 400ms duration)
2. Hero headline fades up + in (100ms delay, 600ms duration)
3. Hero subheadline fades up + in (200ms delay, 600ms duration)
4. Hero CTAs fade up + in (300ms delay, 400ms duration)

### Scroll Reveals
```css
/* Standard reveal */
opacity: 0 -> 1
transform: translateY(24px) -> translateY(0)
duration: 600ms
easing: cubic-bezier(0.16, 1, 0.3, 1)
trigger: when 20% of element is visible
```

### Hover States
```css
/* Buttons */
transform: scale(1.02)
duration: 200ms

/* Links */
color transition: 200ms ease

/* Cards */
box-shadow: 0 4px 20px rgba(0,0,0,0.08)
transform: translateY(-2px)
duration: 300ms
```

### Code Snippet
```css
/* Typing effect or fade in line by line */
Each line fades in with 100ms stagger
Duration: 400ms per line
```

---

## Responsive Breakpoints

| Breakpoint | Width | Key Changes |
|------------|-------|-------------|
| Desktop XL | 1440px+ | Full layout, max spacing |
| Desktop | 1280px | Standard layout |
| Laptop | 1024px | Slightly reduced spacing |
| Tablet | 768px | Stack columns, reduce type |
| Mobile | 640px | Single column, mobile nav |
| Mobile SM | 480px | Compact spacing |

### Mobile Adaptations
- Navigation: Hamburger menu
- Hero: Reduced type sizes, stacked CTAs
- Problem/Solution: Single column, code scrolls horizontally
- Pricing: Stacked cards, featured card first
- Footer: Collapsible sections or stacked

---

## Assets Needed

### Images
- Hero gradient/mesh visual (SVG or CSS)
- Optional: Abstract product screenshot for social sharing

### Icons (Minimal set)
- Check mark (for feature lists)
- Arrow right (for links)
- Menu (for mobile nav)
- External link indicator

Use: Lucide icons or similar, 20px default, stroke width 1.5

### Fonts
- Inter (Google Fonts or self-hosted)
- JetBrains Mono (for code snippets)

---

## Implementation Notes

### CSS Architecture
```
Recommended: Tailwind CSS with custom config

tailwind.config.js extensions:
- colors: As defined in palette
- fontFamily: Inter, JetBrains Mono
- fontSize: Custom scale
- spacing: Custom scale
- animation: Custom keyframes
```

### Performance
- Use `font-display: swap` for fonts
- Lazy load below-fold sections
- Optimize code snippet rendering
- Use CSS animations over JS where possible

### Accessibility
- Maintain 4.5:1 contrast ratio minimum
- Focus visible states on all interactive elements
- Semantic HTML structure
- ARIA labels where needed
- Reduced motion media query support

---

## Deliverables Checklist

- [x] Color palette defined
- [x] Typography system specified
- [x] Spacing system defined
- [x] Component specifications
- [x] Section-by-section designs
- [x] Animation guidelines
- [x] Responsive breakpoints
- [x] Asset requirements
- [x] Implementation notes

---

## Design Preview

```
┌─────────────────────────────────────────────────────────────┐
│  [WandStore]          Product  Pricing  Docs    [Get Started│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              A storefront that adapts                       │
│                 to every visitor                            │
│                                                             │
│     Transform every visitor into a buyer with AI-powered    │
│                    personalization                          │
│                                                             │
│         [Get Started Free]  [View Demo]                     │
│                                                             │
│     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~        │
│     ~                                              ~        │
│     ~         [Gradient/Mesh Visual]               ~        │
│     ~                                              ~        │
│     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  THE PROBLEM                                                │
│                                                             │
│     Static storefronts leave money on the table             │
│                                                             │
│     Every visitor is unique. Their needs, preferences,      │
│     and intent differ. Yet most storefronts show the same   │
│     experience to everyone...                               │
│                                                             │
│     • Generic experiences don't resonate                    │
│     • Missed personalization = missed revenue               │
│     • Your competitors are already adapting                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  THE SOLUTION                                               │
│                                                             │
│  Generated for every visitor.          ┌──────────────────┐ │
│     Delivered at the edge.             │ const storefront │ │
│                                        │   = await wand.. │ │
│     Our AI analyzes each visitor in    │                  │ │
│     real-time and generates a          │ // Delivered in  │ │
│     personalized storefront...         │ // <100ms from.. │ │
│                                        └──────────────────┘ │
│     ✓ Sub-100ms response times                              │
│     ✓ 300+ global edge locations                            │
│     ✓ Real-time visitor analysis                            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  PRICING                                                    │
│                                                             │
│     Simple pricing, no surprises                            │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │   $0     │  │   $49    │  │  Custom  │                   │
│  │          │  │[Popular] │  │          │                   │
│  │  Free    │  │   Pro    │  │Enterprise│                   │
│  │[Start]   │  │[Trial]   │  │[Contact] │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     Ready to transform your storefront?                     │
│                                                             │
│     Join thousands of stores already using WandStore...     │
│                                                             │
│              [Get Started Free]                             │
│                                                             │
│         No credit card required • 14-day free trial         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [WandStore]              Product  Company  Resources  Legal│
│  AI-powered storefronts                                     │
│                                                             │
│  © 2024 WandStore                         [Twitter] [GitHub]│
└─────────────────────────────────────────────────────────────┘
```

---

*Design System v1.0 — Ready for Engineering Handoff*
