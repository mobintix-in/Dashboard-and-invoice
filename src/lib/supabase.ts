import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debugging: Log the first few characters to verify loading (safe to expose first 5 chars)
console.log('Supabase Config:', {
    url: !!supabaseUrl,
    keyPrefix: supabaseAnonKey ? supabaseAnonKey.substring(0, 5) + '...' : 'undefined'
});

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ CRITICAL: Supabase credentials are missing in process.env');
}

export const supabase = createBrowserClient(supabaseUrl!, supabaseAnonKey!)
