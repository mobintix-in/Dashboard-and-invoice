
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // Fallback to placeholder values to prevent build errors if env vars are missing
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

    return createBrowserClient(
        supabaseUrl,
        supabaseKey
    )
}
