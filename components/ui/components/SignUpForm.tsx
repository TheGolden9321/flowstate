'use client';
import React, { useState, useTransition, useEffect } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { signUpAction, type AuthResponse } from '@/app/actions/auth';

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<AuthResponse | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      const isBackForward = navEntries.length > 0 && navEntries[0].type === 'back_forward';

      if (event.persisted || isBackForward) {
        window.location.reload();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    const form = event.currentTarget;
    const formData = new FormData(form);

    // Client-side quick checks
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const terms = formData.get('terms');

    if (!terms) {
      setStatus({ success: false, message: 'You must agree to the Terms of Service.' });
      return;
    }
    if (password !== confirmPassword) {
      setStatus({ success: false, message: 'Passwords do not match.' });
      return;
    }

    startTransition(async () => {
      const response = await signUpAction(formData);
      setStatus(response);
      if (response.success) {
        form.reset();
      }
    });
  };

  const headlineWords = ['Start', 'your', 'flow', 'state'];

  return (
    <div className="w-full max-w-md mx-auto z-20 relative px-4 sm:px-0">
      <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Animated Headline Reveal */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2 flex justify-center flex-wrap gap-x-2">
            {headlineWords.map((word, i) => (
              <span
                key={word}
                className="inline-block animate-fade-in-up"
                style={{
                  animationDelay: `${i * 120}ms`,
                  animationFillMode: 'both',
                }}
              >
                {word}
              </span>
            ))}
          </h1>
          <p className="text-sm text-[#b9becf] font-normal leading-relaxed">
            Create an account to reclaim your focus and deep work.
          </p>
        </div>

        {/* Status Notification Banner */}
        {status && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-start gap-3 text-sm transition-all duration-300 ${
              status.success
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
            }`}
          >
            {status.success ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        {/* Social OAuth Options */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => handleOAuthSignIn('google')}
            className="w-full py-3 px-4 glass-card hover:bg-white/10 rounded-full font-medium text-sm text-[#eef0f6] flex items-center justify-center gap-3 transition-all duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn('github')}
            className="w-full py-3 px-4 glass-card hover:bg-white/10 rounded-full font-medium text-sm text-[#eef0f6] flex items-center justify-center gap-3 transition-all duration-200"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative px-3 text-xs text-[#b9becf] bg-[#0c0d16] rounded-full uppercase tracking-widest">
            or sign up with email
          </span>
        </div>

        {/* Standard Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#b9becf] mb-1.5 ml-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              placeholder="Elena Rostova"
              className="w-full px-4 py-3 rounded-2xl glass-input text-sm placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#b9becf] mb-1.5 ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="elena@flowstate.dev"
              className="w-full px-4 py-3 rounded-2xl glass-input text-sm placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#b9becf] mb-1.5 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                minLength={8}
                placeholder="••••••••••••"
                className="w-full pl-4 pr-11 py-3 rounded-2xl glass-input text-sm placeholder:text-white/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#b9becf] hover:text-white transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#b9becf] mb-1.5 ml-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                minLength={8}
                placeholder="••••••••••••"
                className="w-full pl-4 pr-11 py-3 rounded-2xl glass-input text-sm placeholder:text-white/30"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#b9becf] hover:text-white transition-colors"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                name="terms"
                required
                className="mt-1 h-4 w-4 rounded border-white/20 bg-black/40 text-white focus:ring-0 focus:ring-offset-0 transition"
              />
              <span className="text-xs text-[#b9becf] leading-relaxed">
                I agree to the{' '}
                <a href="/terms" className="text-white underline hover:opacity-80">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-white underline hover:opacity-80">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          </div>

          {/* Solid White Pill Primary CTA */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-4 py-3.5 px-6 rounded-full font-medium text-sm bg-white text-[#2f2f33] hover:bg-white/90 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-white/5 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#2f2f33]" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function setError(arg0: null) {
  throw new Error('Function not implemented.');
}
function setIsLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}

