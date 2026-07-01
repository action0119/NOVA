import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

// Force https regardless of how the source secret is configured — an http://
// URL gets silently blocked as mixed content on the https-served GitHub Pages
// deploy, which breaks every Supabase call with no visible error.
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseUrl = rawSupabaseUrl.replace(/^http:\/\//, 'https://')
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
