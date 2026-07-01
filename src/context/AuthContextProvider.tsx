// src/context/AuthContextProvider.tsx
// Provider de autenticacao com middlewares

import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { getClientIp } from '../helpers/auth';
import { validate, sanitizeString } from '../middleware/validation';
import { rateLimit } from '../middleware/rateLimit';
import { saveOnboardingData } from '../services/onboardingService';
import type { Profile, OnboardingData } from '../types';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  onboarding: OnboardingData | Record<string, unknown> | null;
  profile: Profile | null;
  loading: boolean;
}

export function useAuthState() {
  const [state, setState] = useState<AuthState>({ user: null, session: null, onboarding: null, profile: null, loading: true });

  const loadProfile = async (userId: string) => {
    if (!userId) return;
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      const { data: obv2 } = await supabase.from('onboarding_v2').select('*').eq('user_id', userId).maybeSingle();
      setState(prev => ({ ...prev, profile: data as Profile, onboarding: obv2 || {} }));
    } catch (err) { if (__DEV__) console.error('Erro ao carregar perfil:', err); }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({ ...prev, session, user: session?.user ?? null, loading: false }));
      if (session?.user) loadProfile(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(prev => ({ ...prev, session, user: session?.user ?? null }));
      if (session?.user) loadProfile(session.user.id);
      else setState(prev => ({ ...prev, profile: null, onboarding: null }));
    });
    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const emailCheck = validate('email', email);
    if (!emailCheck.valid) throw new Error(emailCheck.error);
    const passCheck = validate('password', password);
    if (!passCheck.valid) throw new Error(passCheck.error);
    const rateCheck = rateLimit('login_' + email, 5, 60000);
    if (!rateCheck.allowed) throw new Error('Muitas tentativas. Aguarde ' + rateCheck.retryAfter + 's');

    const clientIp = await getClientIp();
    try {
      await supabase.rpc('check_login_rate_limit', { client_email: email });
      const { data: isBlocked } = await supabase.rpc('is_ip_blocked');
      if (isBlocked) throw new Error('Acesso bloqueado temporariamente.');
    } catch (e) { if (e instanceof Error && e.message.includes('bloqueado')) throw e; }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');
      await supabase.from('login_attempts').insert({ ip: clientIp, email: maskedEmail, is_successful: !error && !!data.user });
      if (error) throw error;
      return data;
    } catch (loginError) {
      const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');
      await supabase.from('login_attempts').insert({ ip: clientIp, email: maskedEmail, is_successful: false });
      throw loginError;
    }
  };

  const signUpWithEmail = async (email: string, password: string, metadata: { name?: string; [key: string]: unknown } = {}) => {
    const emailCheck = validate('email', email);
    if (!emailCheck.valid) throw new Error(emailCheck.error);
    const passCheck = validate('password', password);
    if (!passCheck.valid) throw new Error(passCheck.error);
    if (metadata.name) { const nameCheck = validate('name', sanitizeString(metadata.name)); if (!nameCheck.valid) throw new Error(nameCheck.error); }
    const signupIp = await getClientIp();
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { ...metadata, signup_ip: signupIp } } });
    if (error) throw error;
    if (data.user) {
      try { await supabase.rpc('create_profile', { user_id: data.user.id, user_email: data.user.email || '', user_name: sanitizeString(metadata.name || '') }); }
      catch (rpcError) { if (__DEV__) console.warn('Auth: erro ao criar profile:', rpcError); }
    }
    return data;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'novaix://', skipBrowserRedirect: true } });
    if (error) throw error;
    return data;
  };

  const signInWithApple = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'apple', options: { redirectTo: 'novaix://', skipBrowserRedirect: true } });
    if (error) throw error;
    return data;
  };

  const resetPassword = async (email: string) => {
    const emailCheck = validate('email', email);
    if (!emailCheck.valid) throw new Error(emailCheck.error);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setState(prev => ({ ...prev, onboarding: null }));
  };

  const saveOnboarding = async (data: Record<string, unknown>) => {
    setState(prev => ({ ...prev, onboarding: data }));
    if (!state.user) return;
    await saveOnboardingData(state.user.id, data as any);
    await loadProfile(state.user.id);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!state.user?.id) return;
    const { error } = await supabase.from('profiles').upsert({ id: state.user.id, ...updates }, { onConflict: 'id' });
    if (error) throw error;
    await loadProfile(state.user.id);
  };

  return {
    ...state, signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithApple,
    resetPassword, signOut, saveOnboarding, loadProfile, updateProfile,
  };
}
