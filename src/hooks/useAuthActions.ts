// src/hooks/useAuthActions.ts
// Auth operations: signIn, signUp, OAuth, reset, onboarding

import { useCallback } from 'react';
import { supabase } from '../config/supabase';
import { getClientIp } from '../helpers/auth';
import { validate, sanitizeString } from '../middleware/validation';
import { rateLimit } from '../middleware/rateLimit';
import type { User } from '@supabase/supabase-js';

interface OnboardingData {
  id?: string;
  goal?: string;
  age_range?: string;
  ageRange?: string;
  gender?: string;
  weight?: number;
  height?: number;
  cep?: string;
  state?: string;
  city?: string;
  body_model?: string;
  model?: string;
  level?: string;
  days_per_week?: number;
  daysPerWeek?: number;
  workout_location?: string;
  location?: string;
  gym_type?: string;
  gymType?: string;
  injuries?: string[];
  preferred_time?: string;
  preferredTime?: string;
  stress_sleep?: string;
  stressSleep?: string;
  preferred_muscles?: string[];
  preferredMuscles?: string[];
  dietary_restrictions?: string;
  dietaryRestrictions?: string;
  instructor_type?: string;
  instructorType?: string;
  notification_channels?: string[];
  notificationChannels?: string[];
  notification_types?: string[];
  notificationTypes?: string[];
  referral_source?: string;
  referralSource?: string;
  current_step?: string;
  currentStep?: string;
  created_at?: string;
  updated_at?: string;
}

interface Profile {
  id: string;
  email?: string;
  name?: string;
  total_xp?: number;
  total_workouts?: number;
  total_minutes?: number;
  max_streak?: number;
  current_step?: string;
  [key: string]: any;
}

type LoadProfileFn = (userId: string) => Promise<void>;

export function useAuthActions(
  user: User | null,
  loadProfile: LoadProfileFn,
  setOnboarding: (data: OnboardingData | null) => void,
) {
  const signInWithEmail = useCallback(async (email: string, password: string) => {
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
    } catch (e: any) {
      if (e.message.includes('bloqueado')) throw e;
    }
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
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, metadata: Record<string, any> = {}) => {
    const emailCheck = validate('email', email);
    if (!emailCheck.valid) throw new Error(emailCheck.error);
    const passCheck = validate('password', password);
    if (!passCheck.valid) throw new Error(passCheck.error);
    if (metadata.name) {
      const nameCheck = validate('name', sanitizeString(metadata.name));
      if (!nameCheck.valid) throw new Error(nameCheck.error);
    }

    const signupIp = await getClientIp();
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { ...metadata, signup_ip: signupIp } },
    });
    if (error) throw error;
    if (data.user) {
      try {
        await supabase.rpc('create_profile', {
          user_id: data.user.id, user_email: data.user.email || '', user_name: sanitizeString(metadata.name || ''),
        });
      } catch (rpcError) {}
    }
    return data;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'novaix://', skipBrowserRedirect: true } });
    if (error) throw error;
    return data;
  }, []);

  const signInWithApple = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'apple', options: { redirectTo: 'novaix://', skipBrowserRedirect: true } });
    if (error) throw error;
    return data;
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const emailCheck = validate('email', email);
    if (!emailCheck.valid) throw new Error(emailCheck.error);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setOnboarding(null);
  }, [setOnboarding]);

  const saveOnboarding = useCallback(async (data: OnboardingData) => {
    setOnboarding(data);
    if (!user) return;

    const { data: existing } = await supabase
      .from('onboarding_v2')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    const row: Record<string, any> = {
      user_id: user.id,
      goal: data.goal,
      age_range: data.age_range || data.ageRange,
      gender: data.gender,
      weight: data.weight,
      height: data.height,
      cep: data.cep,
      state: data.state,
      city: data.city,
      body_model: data.body_model || data.model,
      level: data.level,
      days_per_week: data.days_per_week || data.daysPerWeek,
      workout_location: data.workout_location || data.location,
      gym_type: data.gym_type || data.gymType,
      injuries: data.injuries || [],
      preferred_time: data.preferred_time || data.preferredTime,
      stress_sleep: data.stress_sleep || data.stressSleep,
      preferred_muscles: data.preferred_muscles || data.preferredMuscles || [],
      dietary_restrictions: data.dietary_restrictions || data.dietaryRestrictions,
      instructor_type: data.instructor_type || data.instructorType,
      notification_channels: data.notification_channels || data.notificationChannels || [],
      notification_types: data.notification_types || data.notificationTypes || [],
      referral_source: data.referral_source || data.referralSource,
      current_step: data.current_step || data.currentStep || 'completed',
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      await supabase.from('onboarding_v2').update(row).eq('id', existing.id);
    } else {
      row.created_at = new Date().toISOString();
      await supabase.from('onboarding_v2').insert(row);
    }

    await supabase.from('profiles').update({ current_step: 'home' }).eq('id', user.id);
    await loadProfile(user.id);
  }, [user, loadProfile, setOnboarding]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user?.id) return;
    const { error } = await supabase.from('profiles').upsert({ id: user.id, ...updates }, { onConflict: 'id' });
    if (error) throw error;
    await loadProfile(user.id);
  }, [user, loadProfile]);

  return {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithApple,
    resetPassword,
    signOut,
    saveOnboarding,
    updateProfile,
  };
}
