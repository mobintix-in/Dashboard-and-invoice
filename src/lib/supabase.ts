import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('SUPABASE_CONFIG_CHECK:', {
    hasUrl: !!supabaseUrl,
    urlPrefix: supabaseUrl?.substring(0, 10),
    hasKey: !!supabaseAnonKey,
    keyPrefix: supabaseAnonKey?.substring(0, 10)
});

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ MISSING SUPABASE CREDENTIALS! Please restart your terminal/server and verify .env.local');
} else if (supabaseAnonKey.startsWith('sb_')) {
    console.error('❌ VALIDATION ERROR: Your NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be a STRIPE key (starts with "sb_"). Please use your Supabase ANON key (starts with "eyJ").');
}

export const supabase = createBrowserClient(supabaseUrl || '', supabaseAnonKey || '')
