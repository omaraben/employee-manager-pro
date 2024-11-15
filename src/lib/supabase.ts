import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate URL format
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return url.includes('supabase.co');
  } catch {
    return false;
  }
};

if (!supabaseUrl || !isValidUrl(supabaseUrl)) {
  throw new Error(
    'Invalid VITE_SUPABASE_URL: Please update your .env file with a valid Supabase project URL from your project settings'
  );
}

if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key') {
  throw new Error(
    'Invalid VITE_SUPABASE_ANON_KEY: Please update your .env file with your Supabase anon key from your project settings'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);