'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// --- Types & Interfaces ---
interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  author: {
    name: string
    role: string
  }
  imageUrl?: string
}

// --- Mock Data ---
const FEATURED_POST: BlogPost = {
  id: 'featured-1',
  title: 'Architecting Focus in an Overstimulated World',
  excerpt: 'An exploration into the cognitive mechanics of deep work, and how spatial interfaces can fundamentally alter our relationship with digital distraction.',
  category: 'Deep Work',
  date: 'Aug 14, 2026',
  readTime: '8 min read',
  author: {
    name: 'Elena Rostova',
    role: 'Lead Cognitive Engineer'
  }
}

const LATEST_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Cost of Context Switching',
    excerpt: 'Quantifying the mental tax of rapid application toggling and how batching notifications restores baseline attention.',
    category: 'Productivity',
    date: 'Aug 02, 2026',
    readTime: '5 min read',
    author: { name: 'Marcus Chen', role: 'Product Researcher' }
  },
  {
    id: 'post-2',
    title: 'Building WebGL Interfaces with React',
    excerpt: 'Deep dive into our engineering stack: integrating high-performance fluid dynamics seamlessly into the DOM.',
    category: 'Engineering',
    date: 'Jul 28, 2026',
    readTime: '12 min read',
    author: { name: 'David Kim', role: 'Graphics Engineer' }
  },
  {
    id: 'post-3',
    title: 'Designing Zero-Distraction Interfaces',
    excerpt: 'Why dark mode, low-contrast UI elements, and spatial audio create the ultimate environment for sustained focus.',
    category: 'Design',
    date: 'Jul 15, 2026',
    readTime: '6 min read',
    author: { name: 'Sarah Jenkins', role: 'UX Director' }
  },
  {
    id: 'post-4',
    title: 'AI as a Context Assistant, Not a Creator',
    excerpt: 'Positioning machine learning models to handle scheduling and triaging so you can reserve your cognitive load for actual creation.',
    category: 'AI & Automation',
    date: 'Jun 30, 2026',
    readTime: '7 min read',
    author: { name: 'Dr. Aris Vane', role: 'Head of AI' }
  },
  {
    id: 'post-5',
    title: 'The Physics of Flow State',
    excerpt: 'Analyzing the neurochemical markers of flow and how software can trigger the optimal balance of challenge and skill.',
    category: 'Deep Work',
    date: 'Jun 12, 2026',
    readTime: '9 min read',
    author: { name: 'Elena Rostova', role: 'Lead Cognitive Engineer' }
  },
  {
    id: 'post-6',
    title: 'Async Communication in Remote Teams',
    excerpt: 'Breaking the synchronous dependency loop. How top engineering teams use broadcast statuses instead of instant messages.',
    category: 'Productivity',
    date: 'May 24, 2026',
    readTime: '4 min read',
    author: { name: 'Julian Hayes', role: 'Operations' }
  }
]

const CATEGORIES = ['All', 'Deep Work', 'AI & Automation', 'Productivity', 'Engineering', 'Design']

// --- Styles ---
const globalStyles = `
  :root {
    --hero-base: #04050c;
    --heading: #eef0f6;
    --body-muted: #b9becf;
    --glass-fill: rgba(255, 255, 255, 0.03);
    --glass-border: rgba(255, 255, 255, 0.08);
    --glass-hover: rgba(255, 255, 255, 0.08);
    --glass-border-hover: rgba(255, 255, 255, 0.16);
    --scrim: radial-gradient(115% 95% at 50% 46%, rgba(4,5,12,0.75) 0%, rgba(4,5,12,0.46) 52%, rgba(4,5,12,0.15) 100%);
  }

  body {
    background-color: var(--hero-base);
    color: var(--heading);
    font-family: 'Onest', sans-serif;
    margin: 0;
    overflow-x: hidden;
  }

  .fluid-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
    opacity: 0.8;
  }

  .scrim-overlay {
    position: fixed;
    inset: 0;
    background: var(--scrim);
    z-index: 1;
    pointer-events: none;
    mix-blend-mode: multiply;
  }

  .content-layer {
    position: relative;
    z-index: 10;
  }

  .glass-bar {
    background: var(--glass-fill);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .glass-card {
    background: var(--glass-fill);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(16px);
    transition: all 0.4s cubic-bezier(0.2, 0, 0, 1);
  }
  
  .glass-card:hover {
    background: var(--glass-hover);
    border-color: var(--glass-border-hover);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
  }

  .pill {
    background: var(--glass-fill);
    border: 1px solid var(--glass-border);
    border-radius: 9999px;
    padding: 0.375rem 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--body-muted);
    transition: all 0.3s ease;
  }

  .pill:hover, .pill.active {
    background: rgba(255, 255, 255, 0.1);
    color: var(--heading);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .reveal-container {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s cubic-bezier(0.2, 0, 0, 1), transform 0.8s cubic-bezier(0.2, 0, 0, 1);
  }

  .is-in .reveal-container {
    opacity: 1;
    transform: translateY(0);
  }

  .word {
    display: inline-block;
    opacity: 0;
    filter: blur(8px);
    transform: translateY(10px);
    transition: opacity 0.8s cubic-bezier(0.2, 0, 0, 1), filter 0.8s ease, transform 0.8s cubic-bezier(0.2, 0, 0, 1);
  }

  .is-in .word {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }
`

// --- Utility Components ---
const AnimatedText = ({ text, delayOffset = 0, className = "" }: { text: string, delayOffset?: number, className?: string }) => {
  const words = text.split(" ")
  return (
    <span className={className}>
          {words.map((word, i) => (
              <React.Fragment key={i}>
                  <span
                      className="word"
                      style={{ transitionDelay: `\${delayOffset + (i * 0.04)}s` }}
                  >
                      {word}
                  </span>
                  {i < words.length - 1 && " "}
              </React.Fragment>
          ))}
    </span>
  )
            }       

// --- Icons ---
const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
)
const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
)
const IconLogo = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12"/>
    <path d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12" strokeDasharray="4 4"/>
  </svg>
)

export default function BlogPage() {
  const [isIn, setIsIn] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Initialization & Animations
  useEffect(() => {
    setIsIn(true)

    // Smooth Scroll Integration
    let lenis: any
    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({ 
        duration: 1.2, 
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
      })
      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
    }).catch(console.warn)

    // WebGL Canvas Fallback Initialization
    const initCanvas = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      const resize = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        
        // Render 2D radial gradient fallback
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, canvas.width
        )
        gradient.addColorStop(0, '#101428')
        gradient.addColorStop(1, '#04050c')
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      window.addEventListener('resize', resize)
      resize()
      return () => window.removeEventListener('resize', resize)
    }

    const cleanupCanvas = initCanvas()

    return () => {
      lenis?.destroy()
      cleanupCanvas?.()
    }
  }, [])

  const filteredPosts = activeCategory === 'All' 
    ? LATEST_POSTS 
    : LATEST_POSTS.filter(post => post.category === activeCategory)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      
      {/* Background Layer */}
      <canvas ref={canvasRef} className="fluid-canvas" />
      <div className="scrim-overlay" />

      {/* Main Layout */}
      <div className={`content-layer ${isIn ? 'is-in' : ''}`}>
        
        {/* 1. Global Navigation */}
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 sm:px-12 w-full max-w-7xl mx-auto reveal-container" style={{ transitionDelay: '0.1s' }}>
          <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
            <IconLogo />
            <span className="font-medium text-lg tracking-wide hidden sm:block">Flowstate</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 px-8 py-3 rounded-full glass-bar">
            <Link  href="/howItWorks" className="text-sm text-[var(--body-muted)] hover:text-white transition-colors">How it works?</Link>
            <Link  href="/pricing" className="text-sm text-[var(--body-muted)] hover:text-white transition-colors">Pricing</Link>
            <Link  href="/products" className="text-sm text-[var(--body-muted)] hover:text-white transition-colors">Products</Link>
            <Link  href="/blog" className="text-sm text-white font-medium" style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>Blog</Link>
          </nav>

          <Link href="/auth" className="px-6 py-2.5 rounded-full bg-white text-[#04050c] text-sm font-medium hover:bg-gray-200 transition-colors">
            Get Started
          </Link>
        </header>

        <main className="pt-32 pb-24 px-6 sm:px-12 w-full max-w-7xl mx-auto flex flex-col items-center">
          
          {/* 2. Hero Section */}
          <section className="text-center w-full max-w-4xl mx-auto mb-20 flex flex-col items-center">
            <div className="reveal-container" style={{ transitionDelay: '0.2s' }}>
              <div className="pill mb-8 inline-block">Articles & Insights</div>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-medium tracking-tight mb-6 leading-[1.1] max-w-3xl">
              <AnimatedText text="Architecting Focus in an Overstimulated World" delayOffset={0.3} />
            </h1>
            
            <p className="text-lg sm:text-xl text-[var(--body-muted)] max-w-2xl mx-auto mb-12">
              <AnimatedText text="Deep dives into productivity physics, workflow automation, and the science of deep work." delayOffset={0.7} />
            </p>

            {/* Search & Category Filter */}
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 reveal-container" style={{ transitionDelay: '1.2s' }}>
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                {CATEGORIES.map((cat) => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)}
                    className={`pill cursor-pointer ${activeCategory === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className="relative w-full md:w-64">
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  className="w-full glass-bar rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[var(--body-muted)] focus:outline-none focus:border-white/30 transition-colors"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--body-muted)]">
                  <IconSearch />
                </div>
              </div>
            </div>
          </section>

          {/* 3. Featured Post */}
          <section className="w-full mb-20 reveal-container" style={{ transitionDelay: '1.4s' }}>
            <Link href={`/blog/${FEATURED_POST.id}`} className="block group">
              <div className="glass-card rounded-[2rem] overflow-hidden flex flex-col lg:flex-row h-full lg:h-[420px]">
                {/* Image Placeholder */}
                <div className="w-full lg:w-1/2 h-64 lg:h-full bg-black/40 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#1a1c29] to-transparent opacity-50 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 flex items-center justify-center text-[var(--body-muted)]/20">
                    <IconLogo />
                  </div>
                </div>
                
                <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative">
                  <div className="absolute top-0 right-0 p-8 text-[var(--body-muted)] text-sm font-medium">
                    {FEATURED_POST.readTime}
                  </div>
                  <div className="mb-4">
                    <span className="pill !text-[10px] !py-1 !px-2.5 bg-white/10 text-white border-white/20">
                      {FEATURED_POST.category}
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-medium mb-4 group-hover:text-white transition-colors">
                    {FEATURED_POST.title}
                  </h2>
                  <p className="text-[var(--body-muted)] text-lg mb-8 line-clamp-3">
                    {FEATURED_POST.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs">
                        {FEATURED_POST.author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{FEATURED_POST.author.name}</p>
                        <p className="text-xs text-[var(--body-muted)]">{FEATURED_POST.date}</p>
                      </div>
                    </div>
                    <div className="text-white bg-white/10 p-3 rounded-full group-hover:bg-white group-hover:text-black transition-colors">
                      <IconArrowRight />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>

          {/* 4. Blog Posts Grid */}
          <section className="w-full mb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, i) => (
                <Link href={`/blog/${post.id}`} key={post.id} className="block group">
                  <div 
                    className="glass-card rounded-3xl p-6 sm:p-8 h-full flex flex-col reveal-container"
                    style={{ transitionDelay: `\${1.5 + (i * 0.1)}s` }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--body-muted)] border border-white/10 px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-[var(--body-muted)]">{post.readTime}</span>
                    </div>
                    
                    <h3 className="text-xl font-medium mb-3 group-hover:text-white transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-sm text-[var(--body-muted)] mb-8 flex-1 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-white/[0.08] mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-white">{post.author.name}</span>
                        <span className="text-[10px] text-[var(--body-muted)]">{post.date}</span>
                      </div>
                      <IconArrowRight />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-20 text-[var(--body-muted)]">
                No articles found in this category.
              </div>
            )}
          </section>

          {/* 5. Newsletter CTA Box */}
          <section className="w-full max-w-4xl mx-auto reveal-container" style={{ transitionDelay: '0.2s' }}>
            <div className="glass-card rounded-[2rem] p-10 sm:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-medium mb-4">Never miss a flow state.</h2>
                <p className="text-[var(--body-muted)] mb-8 max-w-md mx-auto">
                  Get the latest insights on cognitive performance, deep work architecture, and product updates delivered straight to your inbox.
                </p>
                <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    required
                    className="flex-1 glass-bar rounded-full px-6 py-3.5 text-sm text-white placeholder:text-[var(--body-muted)] focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <button type="submit" className="bg-white text-[#04050c] px-8 py-3.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>

        {/* 6. Global Footer */}
        <footer className="border-t border-white/[0.08] bg-black/20 backdrop-blur-md reveal-container" style={{ transitionDelay: '0.4s' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
              <IconLogo />
              <span className="font-medium text-sm">Flowstate</span>
            </div>
            
            <p className="text-xs text-[var(--body-muted)]/80">
              © {new Date().getFullYear()} Flowstate — engineered for deep work.
            </p>
            
            <div className="flex gap-6 text-xs text-[var(--body-muted)]/80">
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}