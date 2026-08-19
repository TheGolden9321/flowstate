'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export interface AuthResponse {
  success: boolean;
  message: string;
}

export async function signUpAction(formData: FormData): Promise<AuthResponse> {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const acceptedTerms = formData.get('terms') === 'on';

  // 1. Strict Server-Side Validation
  if (!fullName || !email || !password || !confirmPassword) {
    return { success: false, message: 'All fields are required.' };
  }

  if (!acceptedTerms) {
    return { success: false, message: 'You must agree to the Terms of Service.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: 'Please provide a valid email address.' };
  }

  if (password.length < 8) {
    return { success: false, message: 'Password must be at least 8 characters long.' };
  }

  if (password !== confirmPassword) {
    return { success: false, message: 'Passwords do not match.' };
  }

  // 2. Initialize Supabase SSR Client
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? null;
        },
        set() {
          // No writable cookie API available in this environment.
          return;
        },
        remove() {
          // No writable cookie API available in this environment.
          return;
        },
      },
    }
  );

  // 3. Register user with Supabase Auth
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    message: 'Account created! Please check your email to confirm your registration.',
  };
}