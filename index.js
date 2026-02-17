export default {
  async fetch(request, env, ctx) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WandStore — Generative UI for E-commerce</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: {
              50: '#eef2ff',
              100: '#e0e7ff',
              200: '#c7d2fe',
              300: '#a5b4fc',
              400: '#818cf8',
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
              800: '#3730a3',
              900: '#312e81',
            }
          },
          animation: {
            'fade-in': 'fadeIn 0.5s ease-out',
            'slide-up': 'slideUp 0.6s ease-out',
            'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          },
          keyframes: {
            fadeIn: {
              '0%': { opacity: '0' },
              '100%': { opacity: '1' },
            },
            slideUp: {
              '0%': { transform: 'translateY(20px)', opacity: '0' },
              '100%': { transform: 'translateY(0)', opacity: '1' },
            }
          }
        }
      }
    }
  </script>
  <style>
    .gradient-text {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .gradient-border {
      background: linear-gradient(135deg, #4f46e5, #7c3aed, #db2777);
      padding: 2px;
      border-radius: 1rem;
    }
    .gradient-border-inner {
      background: white;
      border-radius: calc(1rem - 2px);
    }
    .glow {
      box-shadow: 0 0 60px -15px rgba(79, 70, 229, 0.3);
    }
  </style>
</head>
<body class="bg-gray-50 text-gray-900 antialiased">
  <!-- Navigation -->
  <nav class="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">W</span>
          </div>
          <span class="font-bold text-xl">WandStore</span>
        </div>
        <div class="hidden md:flex items-center gap-8">
          <a href="#problem" class="text-gray-600 hover:text-gray-900 transition">Problem</a>
          <a href="#solution" class="text-gray-600 hover:text-gray-900 transition">Solution</a>
          <a href="#differentiation" class="text-gray-600 hover:text-gray-900 transition">Why Us</a>
          <a href="#pricing" class="text-gray-600 hover:text-gray-900 transition">Pricing</a>
        </div>
        <a href="#cta" class="bg-primary-600 text-white px-5 py-2 rounded-full font-medium hover:bg-primary-700 transition">Get Early Access</a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-4xl mx-auto">
        <div class="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-4 py-2 mb-8 animate-fade-in">
          <span class="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></span>
          <span class="text-primary-700 text-sm font-medium">Now in Early Access</span>
        </div>
        <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
          The Storefront That<br>
          <span class="gradient-text">Doesn't Exist</span><br>
          Until Your Customer Arrives
        </h1>
        <p class="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto animate-slide-up" style="animation-delay: 0.1s">
          Generative UI for e-commerce. Every shopper sees a unique storefront built just for them—in real time.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style="animation-delay: 0.2s">
          <a href="#cta" class="bg-primary-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-700 transition shadow-lg shadow-primary-600/25">
            Get Early Access
          </a>
          <a href="#solution" class="bg-white text-gray-700 border border-gray-300 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition">
            See How It Works
          </a>
        </div>
        <p class="text-sm text-gray-500 mt-6 animate-slide-up" style="animation-delay: 0.3s">
          Built for Shopify. No rebuild required.
        </p>
      </div>
    </div>
  </section>

  <!-- Problem Section -->
  <section id="problem" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Static Storefronts Are Leaving Money on the Table</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Your customers are unique. Why show them all the same experience?
        </p>
      </div>
      
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-3">One Size Fits All</h3>
          <p class="text-gray-600">
            Traditional storefronts show the same layout, products, and messaging to every visitor—whether they're a first-time browser or a VIP customer.
          </p>
        </div>
        
        <div class="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-3">Wasted Customer Data</h3>
          <p class="text-gray-600">
            You collect demographics, purchase history, and browsing behavior—but your storefront can't use any of it to personalize the experience.
          </p>
        </div>
        
        <div class="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-3">No Real-Time Adaptation</h3>
          <p class="text-gray-600">
            By the time you realize a promotion isn't working, hours have passed. Static stores can't adapt to context, time of day, or inventory changes instantly.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Solution Section -->
  <section id="solution" class="py-20 bg-gradient-to-b from-gray-50 to-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Generative UI: A Unique Storefront for Every Shopper</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          We generate a personalized shopping experience in real-time—tailored to who they are, where they came from, and what they're looking for.
        </p>
      </div>

      <!-- How It Works -->
      <div class="mb-20">
        <div class="grid md:grid-cols-4 gap-6">
          <div class="relative">
            <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-full">
              <div class="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mb-4">1</div>
              <h3 class="font-semibold text-lg mb-2">Visitor Arrives</h3>
              <p class="text-gray-600 text-sm">
                Customer lands on your store. We instantly analyze 50+ data points: location, device, referral source, time of day, and more.
              </p>
            </div>
            <div class="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary-300"></div>
          </div>
          
          <div class="relative">
            <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-full">
              <div class="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mb-4">2</div>
              <h3 class="font-semibold text-lg mb-2">Data Fusion</h3>
              <p class="text-gray-600 text-sm">
                We unify Shopify data, customer profiles, purchase history, subscriptions, discounts, and real-time behavior into a complete picture.
              </p>
            </div>
            <div class="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary-300"></div>
          </div>
          
          <div class="relative">
            <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-full">
              <div class="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mb-4">3</div>
              <h3 class="font-semibold text-lg mb-2">AI Generation</h3>
              <p class="text-gray-600 text-sm">
                Our AI selects components, layouts, products, and messaging uniquely suited to this specific visitor—all in under 100ms.
              </p>
            </div>
            <div class="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary-300"></div>
          </div>
          
          <div>
            <div class="bg-white rounded-2xl p-6 border border-primary-200 shadow-sm h-full glow">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-4">4</div>
              <h3 class="font-semibold text-lg mb-2">Personalized Store</h3>
              <p class="text-gray-600 text-sm">
                The customer sees a storefront built just for them—different from every other visitor. Higher conversion, happier shoppers.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <h3 class="font-semibold mb-2">Personalized Products</h3>
          <p class="text-gray-600 text-sm">Recommendations based on browsing history, purchase patterns, and similar customers.</p>
        </div>
        
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="font-semibold mb-2">Dynamic Pricing</h3>
          <p class="text-gray-600 text-sm">Show custom offers, discounts, and pricing tiers based on customer segments and behavior.</p>
        </div>
        
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
            </svg>
          </div>
          <h3 class="font-semibold mb-2">Auto Localization</h3>
          <p class="text-gray-600 text-sm">Language, currency, and content automatically adapted to the visitor's location and preferences.</p>
        </div>
        
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="font-semibold mb-2">Adaptive Layouts</h3>
          <p class="text-gray-600 text-sm">UI components rearrange based on device, browsing patterns, and conversion optimization.</p>
        </div>
        
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h3 class="font-semibold mb-2">Edge-Native Speed</h3>
          <p class="text-gray-600 text-sm">Built on Cloudflare Workers for sub-100ms generation globally. Static speed, dynamic power.</p>
        </div>
        
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 class="font-semibold mb-2">Self-Optimizing AI</h3>
          <p class="text-gray-600 text-sm">Machine learning continuously improves conversion by testing and optimizing storefront variations.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Differentiation Section -->
  <section id="differentiation" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Agency-Quality Headless, at 1/10th the Cost, with Superpowers</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Why pay $100K for a static headless store when you can have a generative one for less than your Shopify Plus subscription?
        </p>
      </div>

      <!-- Comparison Tables -->
      <div class="grid lg:grid-cols-2 gap-8 mb-16">
        <!-- vs Agencies -->
        <div class="bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
            <span class="text-red-500">vs.</span> Traditional Agencies
          </h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <span class="text-gray-600">Build Time</span>
              <div class="flex gap-4 text-sm">
                <span class="text-red-600">3-6 months</span>
                <span class="text-green-600 font-semibold">1-2 weeks</span>
              </div>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <span class="text-gray-600">Upfront Cost</span>
              <div class="flex gap-4 text-sm">
                <span class="text-red-600">$50K-$200K</span>
                <span class="text-green-600 font-semibold">$0</span>
              </div>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <span class="text-gray-600">Monthly Cost</span>
              <div class="flex gap-4 text-sm">
                <span class="text-red-600">$5K-$20K retainer</span>
                <span class="text-green-600 font-semibold">$499-$4,999</span>
              </div>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <span class="text-gray-600">Storefront Type</span>
              <div class="flex gap-4 text-sm">
                <span class="text-red-600">One static site</span>
                <span class="text-green-600 font-semibold">∞ personalized</span>
              </div>
            </div>
            <div class="flex items-center justify-between py-3">
              <span class="text-gray-600">Updates</span>
              <div class="flex gap-4 text-sm">
                <span class="text-red-600">Developer required</span>
                <span class="text-green-600 font-semibold">Real-time, automatic</span>
              </div>
            </div>
          </div>
        </div>

        <!-- vs Traditional Headless -->
        <div class="bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
            <span class="text-red-500">vs.</span> Traditional Headless (Hydrogen/Vercel)
          </h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <span class="text-gray-600">Personalization</span>
              <div class="flex gap-4 text-sm">
                <span class="text-red-600">None (static)</span>
                <span class="text-green-600 font-semibold">1:1 generative</span>
              </div>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <span class="text-gray-600">Runtime Adaptation</span>
              <div class="flex gap-4 text-sm">
                <span class="text-red-600">Rebuild required</span>
                <span class="text-green-600 font-semibold">&lt;100ms edge gen</span>
              </div>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <span class="text-gray-600">Data Integration</span>
              <div class="flex gap-4 text-sm">
                <span class="text-red-600">Manual CDP setup</span>
                <span class="text-green-600 font-semibold">Built-in fusion</span>
              </div>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <span class="text-gray-600">AI Optimization</span>
              <div class="flex gap-4 text-sm">
                <span class="text-red-600">Not included</span>
                <span class="text-green-600 font-semibold">Self-improving</span>
              </div>
            </div>
            <div class="flex items-center justify-between py-3">
              <span class="text-gray-600">Time to Value</span>
              <div class="flex gap-4 text-sm">
                <span class="text-red-600">Months</span>
                <span class="text-green-600 font-semibold">Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Differentiation Matrix -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b-2 border-gray-200">
              <th class="text-left py-4 px-4 font-semibold">Capability</th>
              <th class="text-center py-4 px-4 text-gray-600">Traditional Shopify</th>
              <th class="text-center py-4 px-4 text-gray-600">Headless (Hydrogen/Vercel)</th>
              <th class="text-center py-4 px-4 text-gray-600">Personalization Tools</th>
              <th class="text-center py-4 px-4 bg-primary-50 text-primary-700 font-bold rounded-t-lg">WandStore</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-gray-100">
              <td class="py-4 px-4">Static Performance</td>
              <td class="text-center py-4 px-4 text-green-600">✓</td>
              <td class="text-center py-4 px-4 text-green-600">✓</td>
              <td class="text-center py-4 px-4 text-green-600">✓</td>
              <td class="text-center py-4 px-4 bg-primary-50 text-green-600 font-bold">✓</td>
            </tr>
            <tr class="border-b border-gray-100">
              <td class="py-4 px-4">Dynamic Content</td>
              <td class="text-center py-4 px-4 text-red-500">✗</td>
              <td class="text-center py-4 px-4 text-yellow-500">~</td>
              <td class="text-center py-4 px-4 text-green-600">✓ (widgets)</td>
              <td class="text-center py-4 px-4 bg-primary-50 text-green-600 font-bold">✓ (full UI)</td>
            </tr>
            <tr class="border-b border-gray-100">
              <td class="py-4 px-4">True 1:1 Personalization</td>
              <td class="text-center py-4 px-4 text-red-500">✗</td>
              <td class="text-center py-4 px-4 text-red-500">✗</td>
              <td class="text-center py-4 px-4 text-yellow-500">Segments only</td>
              <td class="text-center py-4 px-4 bg-primary-50 text-green-600 font-bold">✓ Individual</td>
            </tr>
            <tr class="border-b border-gray-100">
              <td class="py-4 px-4">Real-time Adaptation</td>
              <td class="text-center py-4 px-4 text-red-500">✗</td>
              <td class="text-center py-4 px-4 text-red-500">✗</td>
              <td class="text-center py-4 px-4 text-yellow-500">Delayed</td>
              <td class="text-center py-4 px-4 bg-primary-50 text-green-600 font-bold">&lt;100ms</td>
            </tr>
            <tr class="border-b border-gray-100">
              <td class="py-4 px-4">Edge-Native Architecture</td>
              <td class="text-center py-4 px-4 text-red-500">✗</td>
              <td class="text-center py-4 px-4 text-red-500">✗</td>
              <td class="text-center py-4 px-4 text-red-500">✗</td>
              <td class="text-center py-4 px-4 bg-primary-50 text-green-600 font-bold">✓</td>
            </tr>
            <tr>
              <td class="py-4 px-4">Price Point</td>
              <td class="text-center py-4 px-4">$29-$2K/mo</td>
              <td class="text-center py-4 px-4">$100K+ build</td>
              <td class="text-center py-4 px-4">$5K-$50K/mo</td>
              <td class="text-center py-4 px-4 bg-primary-50 text-primary-700 font-bold">$499-$4,999/mo</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- Pricing Section -->
  <section id="pricing" class="py-20 bg-gradient-to-b from-gray-50 to-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Start small, scale as you grow. No hidden fees, no surprises.
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <!-- Starter -->
        <div class="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Starter</h3>
            <p class="text-gray-600 text-sm">For growing merchants</p>
          </div>
          <div class="mb-6">
            <span class="text-4xl font-bold">$499</span>
            <span class="text-gray-600">/mo</span>
          </div>
          <p class="text-sm text-gray-500 mb-6">Best for $1M-$5M GMV</p>
          <ul class="space-y-3 mb-8">
            <li class="flex items-start gap-3 text-sm">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Basic generative UI</span>
            </li>
            <li class="flex items-start gap-3 text-sm">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>5 data sources</span>
            </li>
            <li class="flex items-start gap-3 text-sm">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Standard templates</span>
            </li>
            <li class="flex items-start gap-3 text-sm">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Email support</span>
            </li>
          </ul>
          <a href="#cta" class="block w-full text-center bg-gray-100 text-gray-800 py-3 rounded-full font-medium hover:bg-gray-200 transition">
            Get Started
          </a>
        </div>

        <!-- Growth -->
        <div class="bg-white rounded-2xl p-8 border-2 border-primary-500 shadow-lg shadow-primary-500/10 relative">
          <div class="absolute -top-4 left-1/2 -translate-x-1/2">
            <span class="bg-gradient-to-r from-primary-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
              MOST POPULAR
            </span>
          </div>
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Growth</h3>
            <p class="text-gray-600 text-sm">For scaling brands</p>
          </div>
          <div class="mb-6">
            <span class="text-4xl font-bold">$1,499</span>
            <span class="text-gray-600">/mo</span>
          </div>
          <p class="text-sm text-gray-500 mb-6">Best for $5M-$20M GMV</p>
          <ul class="space-y-3 mb-8">
            <li class="flex items-start gap-3 text-sm">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Advanced personalization</span>
            </li>
            <li class="flex items-start gap-3 text-sm">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>15 data sources</span>
            </li>
            <li class="flex items-start gap-3 text-sm">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Custom components</span>
            </li>
            <li class="flex items-start gap-3 text-sm">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>A/B testing</span>
            </li>
            <li class="flex items-start gap-3 text-sm">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Priority support</span>
            </li>
          </ul>
          <a href="#cta" class="block w-full text-center bg-primary-600 text-white py-3 rounded-full font-medium hover:bg-primary-700 transition">
            Get Started
          </a>
        </div>

        <!-- Scale -->
        <div class="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Scale</h3>
            <p class="text-gray-600 text-sm">For enterprise merchants</p>
          </div>
          <div class="mb-6">
            <span class="text-4xl font-bold">$4,999</span>
            <span class="text-gray-600">/mo</span>
          </div>
          <p class="text-sm text-gray-500 mb-6">Best for $20M-$100M GMV</p>
          <ul class="space-y-3 mb-8">
            <li class="flex items-start gap-3 text-sm">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Full generative capabilities</span>
            </li>
            <li class="flex items-start gap-3 text-sm">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Unlimited data sources</span>
            </li>
            <li class="flex items-start gap-3 text-sm">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>AI optimization</span>
            </li>
            <li class="flex items-start gap-3 text-sm">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Dedicated success manager</span>
            </li>
            <li class="flex items-start gap-3 text-sm">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>SLA guarantee</span>
            </li>
          </ul>
          <a href="#cta" class="block w-full text-center bg-gray-900 text-white py-3 rounded-full font-medium hover:bg-gray-800 transition">
            Contact Sales
          </a>
        </div>
      </div>

      <!-- Enterprise CTA -->
      <div class="text-center mt-12">
        <p class="text-gray-600">
          Need something custom? <a href="#cta" class="text-primary-600 font-medium hover:underline">Contact us</a> for Enterprise pricing ($100M+ GMV)
        </p>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section id="cta" class="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl md:text-5xl font-bold text-white mb-6">
        Ready to Give Every Customer Their Own Storefront?
      </h2>
      <p class="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
        Join the early access program and be among the first to offer truly personalized e-commerce experiences.
      </p>
      
      <form class="max-w-md mx-auto mb-8" onsubmit="event.preventDefault(); alert('Thanks for your interest! We\'ll be in touch soon.');">
        <div class="flex flex-col sm:flex-row gap-3">
          <input 
            type="email" 
            placeholder="Enter your email" 
            class="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
            required
          >
          <button 
            type="submit" 
            class="bg-white text-primary-700 px-8 py-4 rounded-full font-bold hover:bg-primary-50 transition shadow-lg"
          >
            Get Early Access
          </button>
        </div>
      </form>
      
      <p class="text-primary-200 text-sm">
        Limited spots available. No credit card required.
      </p>

      <!-- Trust Badges -->
      <div class="mt-12 pt-12 border-t border-white/20">
        <p class="text-primary-200 text-sm mb-6">Built on trusted infrastructure</p>
        <div class="flex flex-wrap justify-center items-center gap-8 opacity-70">
          <div class="text-white font-semibold">Shopify</div>
          <div class="text-white font-semibold">Cloudflare</div>
          <div class="text-white font-semibold">OpenAI</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-900 text-gray-400 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="flex items-center gap-2 mb-4 md:mb-0">
          <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">W</span>
          </div>
          <span class="font-bold text-xl text-white">WandStore</span>
        </div>
        <div class="flex gap-6 text-sm">
          <a href="#" class="hover:text-white transition">Privacy</a>
          <a href="#" class="hover:text-white transition">Terms</a>
          <a href="#" class="hover:text-white transition">Contact</a>
        </div>
      </div>
      <div class="mt-8 pt-8 border-t border-gray-800 text-sm text-center">
        © 2026 WandStore. All rights reserved.
      </div>
    </div>
  </footer>
</body>
</html>`;
    return new Response(html, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }
};