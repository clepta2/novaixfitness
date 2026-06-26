// src/config/supabase.js
// Configuração do Supabase - NOVAIX FITNESS

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://jkoteibpvwlmsilntpof.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb3RlaWJwdndsbXNpbG50cG9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMzIyMDksImV4cCI6MjA5NzkwODIwOX0.XLeqNwjjywQ2jjzMUPzaIHbGVR4IgvrOSeeXyDPDSTY';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase URL ou ANON_KEY não configurados');
}

export const supabase = createClient(
  SUPABASE_URL || '',
  SUPABASE_ANON_KEY || '',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
