'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, Variants, AnimatePresence } from 'framer-motion'
import { 
  Monitor, 
  Cpu, 
  Smartphone, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Lock,
  Workflow
} from 'lucide-react'

// --- WebGL Fluid Background ---
const FluidCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    // Placeholder for your WebGL fluid simulation initialization.
    // Ensure this matches the exact implementation from your home page.
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#04050c'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 opacity-80"
      style={{ background: '#04050c' }}
    />
  )
}

// --- TypeScript Interfaces ---
interface ProductCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  tags: string[]
}

interface FeatureTab {
  id: string
  label: string
  features: string[]
}

// --- Data ---
const productsData: ProductCard[] = [
  {
    id: 'desktop',
    title: 'Flowstate Desktop',
    description: 'Native spatial workspace, offline local-first sync, smart distraction blocking, and ambient soundscapes.',
    icon: <Monitor className="w-6 h-6 text-white" />,
    tags: ['Deep Work Engine', 'Mac & Windows']
  },
  {
    id: 'ai',
    title: 'Flowstate AI',
    description: 'Auto-prioritization, context-aware scheduling, meeting summarization, and focus trajectory analytics.',
    icon: <Cpu className="w-6 h-6 text-white" />,
    tags: ['Context Assistant', 'Automated']
  },
  {
    id: 'mobile',
    title: 'Flowstate Mobile',
    description: 'Haptic focus timers, silent notification batching, and seamless cross-device state syncing.',
    icon: <Smartphone className="w-6 h-6 text-white" />,
    tags: ['Focus On-The-Go', 'iOS & Android']
  },
  {
    id: 'teams',
    title: 'Flowstate Teams',
    description: 'Synchronized focus hours, status broadcast without interruption, and team velocity metrics.',
    icon: <Users className="w-6 h-6 text-white" />,
    tags: ['Organizational Flow', 'Enterprise']
  }
]

const featuresData: FeatureTab[] = [
  {
    id: 'individual',
    label: 'Individual',
    features: ['Offline-first local data syncing', 'Biometric focus tracking', 'Customized ambient soundscapes', 'Aggressive distraction blocking']
  },
  {
    id: 'teams',
    label: 'Teams',
    features: ['Synchronized deep-work sessions', 'Asynchronous status broadcasting', 'Velocity and burnout analytics', 'Role-based access control']
  },
  {
    id: 'ai',
    label: 'AI & Automation',
    features: ['Predictive task prioritization', 'Automated meeting summaries', 'Context-aware schedule adjusting', 'Focus trajectory modeling']
  },
  {
    id: 'integrations',
    label: 'Integrations',
    features: ['Linear & Jira native sync', 'Google & Outlook Calendar API', 'Slack & Teams silent modes', 'Zapier webhooks']
  }
]

// --- Main Page Component ---
export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<string>('individual')

  // --- Animation Variants ---
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    show: { opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.8, ease: [0.2, 0, 0, 1] } }
  }

  const badgeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { delay: 0.32, duration: 0.6, ease: [0.2, 0, 0, 1] } }
  }

  const headingWords = "Tools Designed for Pure Focus".split(" ")
  const sublineWords = "Explore our suite of deep-work applications, intelligent focus blockers, and biomechanic productivity engines.".split(" ")

  const cardContainerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 1.4 }
    }
  }

  const cardItemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0, 0, 1] } }
  }

  const activeTabData = featuresData.find((tab: FeatureTab) => tab.id === activeTab)

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#04050c] text-[#eef0f6] font-['Onest',sans-serif] selection:bg-white/20">
      
      {/* Required CSS Variables for Glass UI */}
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --glass-fill: rgba(255, 255, 255, 0.08);
          --glass-border: rgba(255, 255, 255, 0.16);
          --scrim-radial: radial-gradient(115% 95% at 50% 46%, rgba(4,5,12,0.68) 0%, rgba(4,5,12,0.46) 52%, rgba(4,5,12,0.12) 100%);
        }
      `}} />

      <FluidCanvas />
      
      {/* Global Radial Scrim Overlay */}
      <div 
        className="fixed inset-0 z-[1] pointer-events-none" 
        style={{ background: 'var(--scrim-radial)' }} 
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* A. Navigation Header */}
        <motion.header 
          variants={headerVariants}
          initial="hidden"
          animate="show"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 sm:px-12 w-full max-w-7xl mx-auto"
        >
          <Link href="/" className="flex items-center gap-2 group">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white group-hover:opacity-80 transition-opacity">
              <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4"/>
            </svg>
            <span className="font-medium text-lg tracking-wide hidden sm:block">Flowstate</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 px-8 py-3 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
            <Link href="/howItWorks" className="text-sm text-[#b9becf] hover:text-white transition-colors">How it works?</Link>
            <Link href="/pricing" className="text-sm text-[#b9becf] hover:text-white transition-colors">Pricing</Link>
            <Link href="/products" className="text-sm text-white font-medium">Products</Link>
            <Link href="/blog" className="text-sm text-[#b9becf] hover:text-white transition-colors">Blog</Link>
          </nav>

          <Link href="/auth" className="px-6 py-2.5 rounded-full bg-white text-[#04050c] text-sm font-medium hover:bg-gray-200 transition-colors">
            Get Started
          </Link>
        </motion.header>

        <main className="flex-1 pt-32 pb-24 px-6 sm:px-12 w-full max-w-7xl mx-auto">
          
          {/* B. Products Hero Section */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-24 mt-12">
            <motion.div 
              variants={badgeVariants}
              initial="hidden"
              animate="show"
              className="px-4 py-1.5 rounded-full border border-white/[0.16] bg-white/[0.04] backdrop-blur-sm mb-8"
            >
              <span className="text-xs font-medium uppercase tracking-widest text-[#b9becf]">The Flowstate Ecosystem</span>
            </motion.div>

            <h1 className="text-5xl sm:text-7xl font-medium tracking-tight mb-6 leading-tight flex flex-wrap justify-center gap-x-3 gap-y-2">
              {headingWords.map((word: string, i: number) => (
                <motion.span 
                  key={`heading-${i}`}
                  initial={{ opacity: 0, filter: 'blur(12px)', y: 20 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  transition={{ delay: 0.48 + (i * 0.085), duration: 0.8, ease: [0.2, 0, 0, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            
            <p className="text-lg sm:text-xl text-[#b9becf] flex flex-wrap justify-center max-w-2xl gap-x-1.5">
              {sublineWords.map((word: string, i: number) => (
                <motion.span 
                  key={`subline-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.15 + (i * 0.022), duration: 0.6 }}
                >
                  {word}
                </motion.span>
              ))}
            </p>
          </div>

          {/* C. Featured Products Grid */}
          <motion.div 
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-32"
          >
            {productsData.map((product: ProductCard) => (
              <motion.div 
                key={product.id}
                variants={cardItemVariants}
                className="group relative flex flex-col p-8 sm:p-10 rounded-3xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.16] transition-all duration-500 backdrop-blur-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center mb-8 shadow-inner">
                    {product.icon}
                  </div>
                  
                  <h3 className="text-2xl font-medium mb-3">{product.title}</h3>
                  <p className="text-[#b9becf] mb-8 leading-relaxed flex-1">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/[0.08]">
                    <div className="flex gap-2">
                      {product.tags.map((tag: string, idx: number) => (
                        <span key={idx} className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-white/[0.06] text-[#b9becf]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button type="button" className="text-white hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* D. Interactive Feature Matrix */}
          <div className="mb-32">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-medium mb-4">Under the Hood</h2>
              <p className="text-[#b9becf]">Dive into the mechanics of our focus engines.</p>
            </div>

            <div className="max-w-4xl mx-auto border border-white/[0.08] rounded-3xl p-2 bg-white/[0.02] backdrop-blur-sm">
              <div className="flex flex-wrap sm:flex-nowrap gap-2 p-2 mb-6 bg-black/20 rounded-2xl">
                {featuresData.map((tab: FeatureTab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeTab === tab.id 
                        ? 'bg-white/[0.12] text-white shadow-lg border border-white/[0.08]' 
                        : 'text-[#b9becf] hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 sm:p-8 min-h-[200px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  >
                    {activeTabData?.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                        <CheckCircle2 className="w-5 h-5 text-white/70 shrink-0 mt-0.5" />
                        <span className="text-[#b9becf] leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* E. Call to Action Banner */}
          <div className="relative rounded-[2.5rem] p-10 sm:p-16 border border-white/[0.16] bg-white/[0.06] backdrop-blur-xl overflow-hidden text-center max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-medium mb-6">Ready to enter your flow?</h2>
              <p className="text-[#b9becf] text-lg mb-10 max-w-xl mx-auto">
                Join thousands of professionals reclaiming their attention and achieving peak cognitive performance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full sm:w-auto min-w-[280px] bg-black/40 border border-white/10 rounded-full px-6 py-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                />
                <button type="button" className="w-full sm:w-auto bg-white text-[#04050c] px-8 py-4 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* F. Global Footer */}
        <footer className="border-t border-white/[0.08] bg-black/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4"/>
              </svg>
              <span className="font-medium text-sm">Flowstate</span>
            </div>
            
            <p className="text-xs text-[#b9becf]/60">
              © 2026 Flowstate — engineered for deep work.
            </p>
            
            <div className="flex gap-6 text-xs text-[#b9becf]/60">
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}