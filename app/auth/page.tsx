export const dynamic = 'force-dynamic';
import Link from 'next/link';
import FluidCanvas from '@/components/ui/components/FluidCanvas';
import SignUpForm from '@/components/ui/components/SignUpForm';
export const metadata = {
  title: 'Sign Up — Flowstate',
  description: 'Create an account to reclaim your focus and deep work.',
};

export default function SignUpPage() {
  return (
    <main className="min-h-screen w-full relative flex flex-col justify-between selection:bg-white/20 selection:text-white">
      {/* Background WebGL Fluid Canvas + Scrim (z-0 & z-10) */}
      <FluidCanvas />

      {/* Header / Navigation (z-20) */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* Flowstate Interleaving Flow Lines SVG Glyph */}
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
          </div>
          <span className="font-semibold text-lg tracking-tight text-[#eef0f6]">
            Flowstate
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-xs text-[#b9becf] hidden sm:inline-block">
            Already have an account?
          </span>
          <Link
            href="/login"
            className="px-5 py-2 rounded-full text-xs font-medium bg-white/10 hover:bg-white/15 text-[#eef0f6] border border-white/10 transition-all duration-200"
          >
            Log In
          </Link>
        </div>
      </header>

      {/* Center Container: Registration Form (z-20) */}
      <section className="relative z-20 my-auto py-12 flex items-center justify-center">
        <SignUpForm />
      </section>

      {/* Footer (z-20) */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#b9becf] border-t border-white/5">
        <p>© 2026 Flowstate — engineered for deep work.</p>
        <div className="flex items-center gap-6">
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <Link href="/security" className="hover:text-white transition-colors">
            Security
          </Link>
        </div>
      </footer>
    </main>
  );
}

function setIsLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}
function setError(arg0: null) {
  throw new Error('Function not implemented.');
}

