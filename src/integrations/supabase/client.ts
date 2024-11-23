import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bbkbepnahvqeqqifbbxk.supabase.co';
const supabaseAnonKey = 'YOUR_ANON_KEY'; // You'll need to provide this

export const supabase = createClient(supabaseUrl, supabaseAnonKey);