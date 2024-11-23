import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://bbkbepnahvqeqqifbbxk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJia2JlcG5haHZxZXFxaWZiYnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MjI0MTcsImV4cCI6MjAyNTM5ODQxN30.RqOyoVTqPFZAR0GzQqS40tVZFUGEZZGfvgDVZFPBVXg';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);