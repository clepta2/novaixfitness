// src/lib/supabase.js
// Admin usa APENAS anon key — operacoes privilegiadas passam pelo backend API
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL ou KEY não configurados em .env (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
