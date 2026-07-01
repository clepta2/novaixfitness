// src/config/supabase.ts
// Cliente Supabase para Backend

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const useServiceKey = !!(serviceKey && !serviceKey.includes('sua_') && serviceKey !== '');

if (!useServiceKey) {
  console.warn('[Supabase] SUPABASE_SERVICE_ROLE_KEY ausente ou inválida. Usando ANON_KEY — operações admin falharão sob RLS.');
}

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = useServiceKey ? (serviceKey as string) : (process.env.SUPABASE_ANON_KEY || '');

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabase;
