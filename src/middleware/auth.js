// src/middleware/auth.js
// Middleware de autenticação

import { supabase } from '../config/supabase';

export async function validateSession(userId) {
  if (!userId) return { valid: false, error: 'Não autenticado' };
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) return { valid: false, error: 'Sessão expirada' };
    const { data: profile } = await supabase.from('profiles').select('id').eq('id', userId).single();
    if (!profile) return { valid: false, error: 'Perfil não encontrado' };
    return { valid: true };
  } catch { return { valid: false, error: 'Erro ao validar' }; }
}

export async function checkSubscription(userId) {
  const { data } = await supabase.from('profiles').select('subscription_status, subscription_plan').eq('id', userId).single();
  return { isActive: data?.subscription_status === 'active', plan: data?.subscription_plan || 'free' };
}
