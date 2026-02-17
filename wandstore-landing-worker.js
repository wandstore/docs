// src/index.js
var index_default = {
  async fetch(request, env, ctx) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WandStore — A storefront that adapts to every visitor</title>
  <meta name="description" content="AI-generated storefronts that adapt to each shopper in real time.">
  
  <!-- Inter Font -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
          },
          colors: {
            neutral: {
              50: '#FAFAFA',
              100: '#F5F5F5',
              200: '#E5E5E5',
              300: '#D4D4D4',
              400: '#A3A3A3',
              500: '#737373',
              600: '#525252',
              700: '#404040',
              800: '#262626',
              900: '#171717',
              950: '#0A0A0A',
            }
          },
          animation: {
            'fade-in': 'fadeIn 0.6s ease-out forwards',
            'slide-up': 'slideUp 0.5s ease-out forwards',
            'float': 'float 6s ease-in-out infinite',
          },
          keyframes: {
            fadeIn: {
              '0%': { opacity: '0' },
              '100%': { opacity: '1' },
            },
            slideUp: {
              '0%': { transform: 'translateY(20px)', opacity: '0' },
              '100%': { transform: 'translateY(0)', opacity: '1' },
            },
            float: {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-10px)' },
            }
          }
        }
      }
    }
  <\/script>
  <style>
    * {
      font-family: 'Inter', system-ui, sans-serif;
    }
    
    /* Smooth scrolling */
    html {
      scroll-behavior: smooth;
    }
    
    /* Custom selection */
    ::selection {
      background: #171717;
      color: #FAFAFA;
    }
    
    /* Code block styling */
    .code-block {
      background: #0A0A0A;
      border-radius: 12px;
      overflow: hidden;
    }
    
    .code-header {
      background: #171717;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid #262626;
    }
    
    .code-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    
    .code-content {
      padding: 20px 24px;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
      font-size: 14px;
      line-height: 1.6;
      overflow-x: auto;
    }
    
    .code-keyword { color: #FF79C6; }
    .code-function { color: #50FA7B; }
    .code-string { color: #F1FA8C; }
    .code-comment { color: #6272A4; }
    .code-variable { color: #8BE9FD; }
    
    /* Subtle gradient backgrounds */
    .gradient-subtle {
      background: linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%);
    }
    
    .gradient-hero {
      background: 
        radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 120, 120, 0.1) 0%, transparent 50%),
        radial-gradient(ellipse 60% 40% at 80% 60%, rgba(150, 150, 150, 0.05) 0%, transparent 50%);
    }
    
    /* Button styles */
    .btn-primary {
      background: #0A0A0A;
      color: #FAFAFA;
      transition: all 0.2s ease;
    }
    
    .btn-primary:hover {
      background: #262626;
      transform: translateY(-1px);
    }
    
    .btn-secondary {
      background: transparent;
      color: #0A0A0A;
      border: 1px solid #E5E5E5;
      transition: all 0.2s ease;
    }
    
    .btn-secondary:hover {
      border-color: #0A0A0A;
      background: #FAFAFA;
    }
    
    /* Card hover effect */
    .card-hover {
      transition: all 0.3s ease;
    }
    
    .card-hover:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.1);
    }
    
    /* Pricing card featured */
    .pricing-featured {
      border: 2px solid #0A0A0A;
      position: relative;
    }
    
    .pricing-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: #0A0A0A;
      color: #FAFAFA;
      padding: 4px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #FAFAFA;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #D4D4D4;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #A3A3A3;
    }
    
    /* Mobile menu */
    .mobile-menu {
      display: none;
    }
    
    .mobile-menu.active {
      display: block;
    }
  </style>
</head>
<body class="bg-neutral-50 text-neutral-950 antialiased">
  
  <!-- Navigation -->
  <nav class="fixed top-0 left-0 right-0 z-50 bg-neutral-50/80 backdrop-blur-xl border-b border-neutral-200/50">
    <div class="max-w-6xl mx-auto px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <a href="#" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-neutral-950 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-neutral-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <span class="text-lg font-semibold tracking-tight">WandStore</span>
        </a>
        
        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-8">
          <a href="#problem" class="text-sm text-neutral-600 hover:text-neutral-950 transition-colors">Problem</a>
          <a href="#solution" class="text-sm text-neutral-600 hover:text-neutral-950 transition-colors">Solution</a>
          <a href="#features" class="text-sm text-neutral-600 hover:text-neutral-950 transition-colors">Features</a>
          <a href="#pricing" class="text-sm text-neutral-600 hover:text-neutral-950 transition-colors">Pricing</a>
        </div>
        
        <!-- CTA -->
        <div class="hidden md:flex items-center gap-4">
          <a href="#" class="text-sm text-neutral-600 hover:text-neutral-950 transition-colors">Sign in</a>
          <a href="#cta" class="btn-primary px-4 py-2 rounded-lg text-sm font-medium">Get started</a>
        </div>
        
        <!-- Mobile menu button -->
        <button id="mobile-menu-btn" class="md:hidden p-2 text-neutral-600 hover:text-neutral-950" aria-label="Toggle mobile menu" aria-expanded="false">
          <svg id="menu-icon-open" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg id="menu-icon-close" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Mobile Menu -->
      <div id="mobile-menu" class="mobile-menu md:hidden py-4 border-t border-neutral-200">
        <div class="flex flex-col gap-4">
          <a href="#problem" class="text-sm text-neutral-600 hover:text-neutral-950">Problem</a>
          <a href="#solution" class="text-sm text-neutral-600 hover:text-neutral-950">Solution</a>
          <a href="#features" class="text-sm text-neutral-600 hover:text-neutral-950">Features</a>
          <a href="#pricing" class="text-sm text-neutral-600 hover:text-neutral-950">Pricing</a>
          <a href="#cta" class="btn-primary px-4 py-2 rounded-lg text-sm font-medium text-center mt-2">Get started</a>
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="relative pt-32 pb-24 lg:pt-40 lg:pb-32 gradient-hero">
    <div class="max-w-6xl mx-auto px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 mb-8 animate-fade-in">
          <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          <span class="text-xs font-medium text-neutral-600">Now in private beta</span>
        </div>
        
        <!-- Headline -->
        <h1 class="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-neutral-950 mb-6 animate-slide-up" style="animation-delay: 0.1s;">
          A storefront that<br>adapts to every visitor
        </h1>
        
        <!-- Subheadline -->
        <p class="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 animate-slide-up" style="animation-delay: 0.2s;">
          AI-generated experiences that convert. Not segments. Not personas. 
          Individual storefronts generated in under 100ms.
        </p>
        
        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style="animation-delay: 0.3s;">
          <a href="#cta" class="btn-primary px-8 py-3.5 rounded-xl text-base font-semibold w-full sm:w-auto">
            Start building
          </a>
          <a href="#solution" class="btn-secondary px-8 py-3.5 rounded-xl text-base font-semibold w-full sm:w-auto">
            See how it works
          </a>
        </div>
        
        <!-- Stats -->
        <div class="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-neutral-200 animate-slide-up" style="animation-delay: 0.4s;">
          <div>
            <div class="text-3xl sm:text-4xl font-bold text-neutral-950">10x</div>
            <div class="text-sm text-neutral-500 mt-1">Conversion lift</div>
          </div>
          <div>
            <div class="text-3xl sm:text-4xl font-bold text-neutral-950">&lt;100ms</div>
            <div class="text-sm text-neutral-500 mt-1">Generation time</div>
          </div>
          <div>
            <div class="text-3xl sm:text-4xl font-bold text-neutral-950">200+</div>
            <div class="text-sm text-neutral-500 mt-1">Brands onboard</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Problem Section -->
  <section id="problem" class="py-24 lg:py-32 bg-white">
    <div class="max-w-6xl mx-auto px-6 lg:px-8">
      <div class="max-w-3xl mx-auto text-center mb-16">
        <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">The Problem</span>
        <h2 class="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950">
          Static storefronts leave money on the table
        </h2>
        <p class="mt-4 text-lg text-neutral-600">
          While your competitors show dynamic, personalized experiences, your storefront looks the same to everyone.
        </p>
      </div>
      
      <!-- Problem Cards -->
      <div class="grid md:grid-cols-3 gap-8">
        <div class="card-hover bg-neutral-50 rounded-2xl p-8 border border-neutral-100">
          <div class="text-5xl font-bold text-neutral-200 mb-4">01</div>
          <h3 class="text-xl font-semibold text-neutral-950 mb-3">Static pages</h3>
          <p class="text-neutral-600 leading-relaxed">
            Your homepage shows the same products to a first-time visitor and a loyal customer. Static pages miss the mark every single time.
          </p>
        </div>
        
        <div class="card-hover bg-neutral-50 rounded-2xl p-8 border border-neutral-100">
          <div class="text-5xl font-bold text-neutral-200 mb-4">02</div>
          <h3 class="text-xl font-semibold text-neutral-950 mb-3">Generic messaging</h3>
          <p class="text-neutral-600 leading-relaxed">
            The same headlines, the same CTAs, the same experience. Generic messaging doesn't resonate with individual shoppers.
          </p>
        </div>
        
        <div class="card-hover bg-neutral-50 rounded-2xl p-8 border border-neutral-100">
          <div class="text-5xl font-bold text-neutral-200 mb-4">03</div>
          <h3 class="text-xl font-semibold text-neutral-950 mb-3">Missed revenue</h3>
          <p class="text-neutral-600 leading-relaxed">
            Every static page is a missed opportunity. The average e-commerce site loses 70% of visitors within 10 seconds.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Solution Section -->
  <section id="solution" class="py-24 lg:py-32 bg-neutral-950 text-neutral-50">
    <div class="max-w-6xl mx-auto px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Left: Content -->
        <div>
          <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">The Solution</span>
          <h2 class="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Generated for every visitor. Delivered at the edge.
          </h2>
          <p class="mt-6 text-lg text-neutral-400 leading-relaxed">
            WandStore generates a unique storefront for every visitor — in under 100ms. No latency, no waiting, just conversion.
          </p>
          
          <div class="mt-10 space-y-6">
            <div class="flex gap-4">
              <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-neutral-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-neutral-50">Lightning fast</h3>
                <p class="text-neutral-500 text-sm mt-1">UI components generated in under 100ms at the edge.</p>
              </div>
            </div>
            
            <div class="flex gap-4">
              <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-neutral-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-neutral-50">Context-aware</h3>
                <p class="text-neutral-500 text-sm mt-1">Device, location, time, browsing history — all factors in.</p>
              </div>
            </div>
            
            <div class="flex gap-4">
              <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-neutral-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-neutral-50">Headless</h3>
                <p class="text-neutral-500 text-sm mt-1">Works with your existing stack. Shopify, BigCommerce, custom.</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right: Code Block -->
        <div class="code-block">
          <div class="code-header">
            <div class="code-dot bg-red-500"></div>
            <div class="code-dot bg-yellow-500"></div>
            <div class="code-dot bg-green-500"></div>
            <span class="ml-2 text-xs text-neutral-500">wandstore.config.js</span>
          </div>
          <div class="code-content text-neutral-300">
            <pre><span class="code-keyword">import</span> { <span class="code-variable">WandStore</span> } <span class="code-keyword">from</span> <span class="code-string">'@wandstore/core'</span>

<span class="code-keyword">const</span> <span class="code-variable">store</span> = <span class="code-keyword">new</span> <span class="code-function">WandStore</span>({
  <span class="code-variable">apiKey</span>: <span class="code-string">'ws_live_...'</span>,
  <span class="code-variable">platform</span>: <span class="code-string">'shopify'</span>,
  
  <span class="code-comment">// Personalization rules</span>
  <span class="code-variable">personalization</span>: {
    <span class="code-variable">returningCustomer</span>: <span class="code-keyword">true</span>,
    <span class="code-variable">device</span>: <span class="code-string">'mobile'</span>,
    <span class="code-variable">location</span>: <span class="code-string">'NYC'</span>,
    <span class="code-variable">timeOfDay</span>: <span class="code-string">'evening'</span>
  }
})

<span class="code-comment">// Generate personalized storefront</span>
<span class="code-keyword">await</span> <span class="code-variable">store</span>.<span class="code-function">generate</span>({
  <span class="code-variable">visitorId</span>: <span class="code-string">'user_123'</span>,
  <span class="code-variable">context</span>: <span class="code-variable">personalization</span>
})</pre>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="py-24 lg:py-32 bg-white">
    <div class="max-w-6xl mx-auto px-6 lg:px-8">
      <div class="max-w-3xl mx-auto text-center mb-16">
        <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Features</span>
        <h2 class="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950">
          Everything you need to convert
        </h2>
        <p class="mt-4 text-lg text-neutral-600">
          Powerful features designed to turn browsers into buyers, automatically.
        </p>
      </div>
      
      <!-- Features Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="p-6 rounded-2xl border border-neutral-200 hover:border-neutral-300 transition-colors">
          <div class="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <h3 class="font-semibold text-neutral-950 mb-2">Real-time analytics</h3>
          <p class="text-sm text-neutral-600">Track conversion lifts, A/B test results, and revenue impact in real-time.</p>
        </div>
        
        <div class="p-6 rounded-2xl border border-neutral-200 hover:border-neutral-300 transition-colors">
          <div class="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
            </svg>
          </div>
          <h3 class="font-semibold text-neutral-950 mb-2">Visual editor</h3>
          <p class="text-sm text-neutral-600">Fine-tune AI-generated designs with our intuitive drag-and-drop editor.</p>
        </div>
        
        <div class="p-6 rounded-2xl border border-neutral-200 hover:border-neutral-300 transition-colors">
          <div class="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"/>
            </svg>
          </div>
          <h3 class="font-semibold text-neutral-950 mb-2">200+ integrations</h3>
          <p class="text-sm text-neutral-600">Connect with your existing tools — Shopify, Klaviyo, Segment, and more.</p>
        </div>
        
        <div class="p-6 rounded-2xl border border-neutral-200 hover:border-neutral-300 transition-colors">
          <div class="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <h3 class="font-semibold text-neutral-950 mb-2">Enterprise security</h3>
          <p class="text-sm text-neutral-600">99.99% uptime SLA. Edge-deployed globally. SOC 2 Type II compliant.</p>
        </div>
        
        <div class="p-6 rounded-2xl border border-neutral-200 hover:border-neutral-300 transition-colors">
          <div class="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </div>
          <h3 class="font-semibold text-neutral-950 mb-2">A/B testing</h3>
          <p class="text-sm text-neutral-600">Built-in experimentation. Test variants and optimize automatically.</p>
        </div>
        
        <div class="p-6 rounded-2xl border border-neutral-200 hover:border-neutral-300 transition-colors">
          <div class="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          </div>
          <h3 class="font-semibold text-neutral-950 mb-2">Edge delivery</h3>
          <p class="text-sm text-neutral-600">Global CDN with 300+ locations. Sub-100ms response times worldwide.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Pricing Section -->
  <section id="pricing" class="py-24 lg:py-32 bg-neutral-50">
    <div class="max-w-6xl mx-auto px-6 lg:px-8">
      <div class="max-w-3xl mx-auto text-center mb-16">
        <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Pricing</span>
        <h2 class="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950">
          Simple pricing, no surprises
        </h2>
        <p class="mt-4 text-lg text-neutral-600">
          No setup fees. No hidden costs. Cancel anytime.
        </p>
      </div>
      
      <!-- Pricing Cards -->
      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <!-- Starter -->
        <div class="bg-white rounded-2xl p-8 border border-neutral-200">
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-neutral-950">Starter</h3>
            <p class="text-sm text-neutral-500 mt-1">For growing brands</p>
          </div>
          <div class="mb-6">
            <span class="text-4xl font-bold text-neutral-950">$499</span>
            <span class="text-neutral-500">/mo</span>
          </div>
          <ul class="space-y-4 mb-8">
            <li class="flex items-center gap-3 text-sm text-neutral-600">
              <svg class="w-5 h-5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Up to 50K pageviews/mo
            </li>
            <li class="flex items-center gap-3 text-sm text-neutral-600">
              <svg class="w-5 h-5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              5 AI-generated templates
            </li>
            <li class="flex items-center gap-3 text-sm text-neutral-600">
              <svg class="w-5 h-5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Basic personalization
            </li>
            <li class="flex items-center gap-3 text-sm text-neutral-600">
              <svg class="w-5 h-5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Email support
            </li>
          </ul>
          <button class="w-full py-3 rounded-xl border border-neutral-200 text-neutral-950 font-semibold hover:border-neutral-400 transition-colors">
            Get started
          </button>
        </div>
        
        <!-- Growth - Featured -->
        <div class="pricing-featured bg-white rounded-2xl p-8">
          <span class="pricing-badge">MOST POPULAR</span>
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-neutral-950">Growth</h3>
            <p class="text-sm text-neutral-500 mt-1">For scaling businesses</p>
          </div>
          <div class="mb-6">
            <span class="text-4xl font-bold text-neutral-950">$1,499</span>
            <span class="text-neutral-500">/mo</span>
          </div>
          <ul class="space-y-4 mb-8">
            <li class="flex items-center gap-3 text-sm text-neutral-600">
              <svg class="w-5 h-5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Up to 500K pageviews/mo
            </li>
            <li class="flex items-center gap-3 text-sm text-neutral-600">
              <svg class="w-5 h-5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Unlimited templates
            </li>
            <li class="flex items-center gap-3 text-sm text-neutral-600">
              <svg class="w-5 h-5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Advanced personalization
            </li>
            <li class="flex items-center gap-3 text-sm text-neutral-600">
              <svg class="w-5 h-5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Priority support + Slack
            </li>
            <li class="flex items-center gap-3 text-sm text-neutral-600">
              <svg class="w-5 h-5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              A/B testing built-in
            </li>
          </ul>
          <button class="w-full py-3 rounded-xl bg-neutral-950 text-white font-semibold hover:bg-neutral-800 transition-colors">
            Get started
          </button>
        </div>
        
        <!-- Scale -->
        <div class="bg-white rounded-2xl p-8 border border-neutral-200">
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-neutral-950">Scale</h3>
            <p class="text-sm text-neutral-500 mt-1">For enterprise brands</p>
          </div>
          <div class="mb-6">
            <span class="text-4xl font-bold text-neutral-950">$4,999</span>
            <span class="text-neutral-500">/mo</span>
          </div>
          <ul class="space-y-4 mb-8">
            <li class="flex items-center gap-3 text-sm text-neutral-600">
              <svg class="w-5 h-5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Unlimited pageviews
            </li>
            <li class="flex items-center gap-3 text-sm text-neutral-600">
              <svg class="w-5 h-5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Everything in Growth
            </li>
            <li class="flex items-center gap-3 text-sm text-neutral-600">
              <svg class="w-5 h-5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Dedicated success manager
            </li>
            <li class="flex items-center gap-3 text-sm text-neutral-600">
              <svg class="w-5 h-5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              SLA & 24/7 support
            </li>
            <li class="flex items-center gap-3 text-sm text-neutral-600">
              <svg class="w-5 h-5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Custom AI training
            </li>
          </ul>
          <button class="w-full py-3 rounded-xl border border-neutral-200 text-neutral-950 font-semibold hover:border-neutral-400 transition-colors">
            Contact sales
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section id="cta" class="py-24 lg:py-32 bg-neutral-950 text-neutral-50">
    <div class="max-w-4xl mx-auto px-6 lg:px-8 text-center">
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
        Ready to convert more visitors?
      </h2>
      <p class="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto">
        Join 200+ brands already using WandStore to deliver personalized experiences. 
        Limited spots available for private beta.
      </p>
      
      <form class="max-w-md mx-auto mb-8" onsubmit="event.preventDefault(); handleSubmit(this);">
        <div class="flex flex-col sm:flex-row gap-3">
          <input 
            type="email" 
            placeholder="Enter your email" 
            class="flex-1 px-5 py-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
            required
          >
          <button 
            type="submit" 
            class="px-8 py-3.5 rounded-xl bg-white text-neutral-950 font-semibold hover:bg-neutral-100 transition-colors whitespace-nowrap"
          >
            Get early access
          </button>
        </div>
      </form>
      
      <p class="text-sm text-neutral-500">
        No credit card required. Free 14-day trial included.
      </p>
      
      <!-- Trust badges -->
      <div class="mt-12 flex flex-wrap justify-center gap-8 items-center">
        <div class="flex items-center gap-2 text-neutral-500">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
          </svg>
          <span class="text-sm">SOC 2 Compliant</span>
        </div>
        <div class="flex items-center gap-2 text-neutral-500">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span class="text-sm">99.99% Uptime</span>
        </div>
        <div class="flex items-center gap-2 text-neutral-500">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          <span class="text-sm">4.9/5 Rating</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-16 bg-neutral-50 border-t border-neutral-200">
    <div class="max-w-6xl mx-auto px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        <!-- Logo column -->
        <div class="col-span-2">
          <a href="#" class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-neutral-950 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-neutral-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <span class="text-lg font-semibold tracking-tight">WandStore</span>
          </a>
          <p class="text-sm text-neutral-500 mb-6 max-w-xs">
            AI-generated storefronts that adapt to each shopper in real time.
          </p>
          <div class="flex gap-4">
            <a href="#" class="text-neutral-400 hover:text-neutral-950 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
            <a href="#" class="text-neutral-400 hover:text-neutral-950 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="#" class="text-neutral-400 hover:text-neutral-950 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          </div>
        </div>
        
        <!-- Product -->
        <div>
          <h4 class="text-sm font-semibold text-neutral-950 mb-4">Product</h4>
          <ul class="space-y-3">
            <li><a href="#" class="text-sm text-neutral-500 hover:text-neutral-950 transition-colors">Features</a></li>
            <li><a href="#" class="text-sm text-neutral-500 hover:text-neutral-950 transition-colors">Pricing</a></li>
            <li><a href="#" class="text-sm text-neutral-500 hover:text-neutral-950 transition-colors">Integrations</a></li>
            <li><a href="#" class="text-sm text-neutral-500 hover:text-neutral-950 transition-colors">Changelog</a></li>
          </ul>
        </div>
        
        <!-- Company -->
        <div>
          <h4 class="text-sm font-semibold text-neutral-950 mb-4">Company</h4>
          <ul class="space-y-3">
            <li><a href="#" class="text-sm text-neutral-500 hover:text-neutral-950 transition-colors">About</a></li>
            <li><a href="#" class="text-sm text-neutral-500 hover:text-neutral-950 transition-colors">Blog</a></li>
            <li><a href="#" class="text-sm text-neutral-500 hover:text-neutral-950 transition-colors">Careers</a></li>
            <li><a href="#" class="text-sm text-neutral-500 hover:text-neutral-950 transition-colors">Contact</a></li>
          </ul>
        </div>
        
        <!-- Legal -->
        <div>
          <h4 class="text-sm font-semibold text-neutral-950 mb-4">Legal</h4>
          <ul class="space-y-3">
            <li><a href="#" class="text-sm text-neutral-500 hover:text-neutral-950 transition-colors">Privacy</a></li>
            <li><a href="#" class="text-sm text-neutral-500 hover:text-neutral-950 transition-colors">Terms</a></li>
            <li><a href="#" class="text-sm text-neutral-500 hover:text-neutral-950 transition-colors">Security</a></li>
          </ul>
        </div>
      </div>
      
      <div class="pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-sm text-neutral-500">© 2025 WandStore. All rights reserved.</p>
        <p class="text-sm text-neutral-400">Made with AI. Powered by the edge.</p>
      </div>
    </div>
  </footer>

  <script>
    // Mobile menu toggle
    (function() {
      const mobileMenuBtn = document.getElementById('mobile-menu-btn');
      const mobileMenu = document.getElementById('mobile-menu');
      const menuIconOpen = document.getElementById('menu-icon-open');
      const menuIconClose = document.getElementById('menu-icon-close');
      
      if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
          const isOpen = mobileMenu.classList.toggle('active');
          mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          if (menuIconOpen && menuIconClose) {
            menuIconOpen.classList.toggle('hidden', isOpen);
            menuIconClose.classList.toggle('hidden', !isOpen);
          }
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('#mobile-menu a').forEach(function(link) {
          link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            if (menuIconOpen && menuIconClose) {
              menuIconOpen.classList.remove('hidden');
              menuIconClose.classList.add('hidden');
            }
          });
        });
      }
    })();
    
    // Form submission handler
    function handleSubmit(form) {
      const email = form.querySelector('input[type="email"]').value;
      alert("Thanks for your interest! We will be in touch at " + email + " soon.");
      form.reset();
    }
  <\/script>
</body>
</html>`;
    return new Response(html, {
      headers: { "Content-Type": "text/html;charset=UTF-8" }
    });
  }
};
export {
  index_default as default
};
