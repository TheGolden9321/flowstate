import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
  )
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
