'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'                                  
import { Eye, EyeOff, Loader2, Mail } from 'lucide-react'
import { loginAction } from './actions'
import { createBrowserClient } from '@supabase/ssr'

// --- WebGL Fluid Background Placeholder ---
// In a real implementation, this would initialize your existing fluid canvas.
const FluidCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    // WebGL initialization logic goes here to match the home page v0 structure
  }, [])

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 opacity-80"
      style={{ background: '#04050c' }} // var(--hero-base) fallback
    />
  )
}
const GithubIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)
export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await loginAction(formData)

    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.message)
      setIsLoading(false)
    }
  }

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2, ease: [0.2, 0, 0, 1] }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { ease: [0.2, 0, 0, 1], duration: 0.8 } }
  }

  const titleWords = "Welcome back".split(" ")

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#04050c] text-[#eef0f6] font-['Onest',sans-serif]">
      {/* Background Layer */}
      <FluidCanvas />
      {/* Radial Scrim Overlay */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_0%,#04050c_100%)] opacity-90 mix-blend-multiply pointer-events-none" />

      {/* Main Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="flex items-center justify-between p-6 sm:px-12 w-full max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            {/* Flowstate Interleaving Lines Logo */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white group-hover:opacity-80 transition-opacity">
              <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4"/>
            </svg>
            <span className="font-medium text-lg tracking-wide">Flowstate</span>
          </Link>
          <Link 
            href="/auth" 
            className="text-sm font-medium text-[#b9becf] hover:text-white transition-colors"
          >
            Sign Up
          </Link>
        </header>

        {/* Form Container */}
        <main className="flex-1 flex items-center justify-center p-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="w-full max-w-[420px] p-8 sm:p-10 rounded-3xl bg-white/[0.08] border border-white/[0.16] backdrop-blur-[12px] shadow-2xl"
          >
            {/* Headline */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-medium mb-2 flex gap-2">
                {titleWords.map((word, i) => (
                  <motion.span 
                    key={i}
                    initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.8, ease: [0.2, 0, 0, 1] }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
              <motion.p variants={itemVariants} className="text-[#b9becf] text-sm">
                Enter your credentials to enter your flow state.
              </motion.p>
            </div>

            {/* Error Badge */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* OAuth Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col gap-3 mb-6">
              <button 
                onClick={() => handleOAuthLogin('google')}
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 rounded-full bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-colors text-sm font-medium"
              >
                <Mail className="w-4 h-4" />
                Continue with Google
              </button>
              <button 
                onClick={() => handleOAuthLogin('github')}
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 rounded-full bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-colors text-sm font-medium"
              >
                <GithubIcon className="w-4 h-4" />
                Continue with GitHub
              </button>
            </motion.div>

            {/* Divider */}
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
              <div className="h-[1px] flex-1 bg-white/10"></div>
              <span className="text-xs text-[#b9becf] uppercase tracking-wider">or log in with email</span>
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </motion.div>

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#b9becf] ml-1">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="w-full bg-black/20 border border-white/10 rounded-full px-5 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col gap-1.5 relative">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-medium text-[#b9becf]">Password</label>
                  <Link href="/forgot-password" className="text-xs text-[#b9becf] hover:text-white transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-black/20 border border-white/10 rounded-full px-5 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center gap-2 mt-2 ml-1">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={rememberMe}
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-white border-white' : 'bg-transparent border-white/30'}`}
                >
                  {rememberMe && (
                    <svg className="w-3 h-3 text-[#2f2f33]" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
                <span className="text-xs text-[#b9becf] cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                  Remember me
                </span>
              </motion.div>

              <motion.button 
                variants={itemVariants}
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-white text-[#2f2f33] font-medium py-3.5 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
              </motion.button>
            </form>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between w-full max-w-7xl mx-auto text-xs text-[#b9becf]/60">
          <p>© 2026 Flowstate — engineered for deep work.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <Link href="/terms" className="hover:text-[#b9becf] transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-[#b9becf] transition-colors">Privacy</Link>
          </div>
        </footer>
      </div>
    </div>
  )
}