import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be defined'
  );
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (e) {
  throw new Error(
    'Invalid VITE_SUPABASE_URL: Please provide a valid Supabase project URL from your project settings'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);