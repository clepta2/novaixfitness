// src/context/AuthContext.js
// Context para Autenticação - COM MIDDLEWARES

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { getClientIp } from '../helpers/auth';
import { validate, sanitizeString } from '../middleware/validation';
import { rateLimit } from '../middleware/rateLimit';
import { handleApiError } from '../middleware/errorHandler';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [onboarding, setOnboarding] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId) => {
    if (!userId) return;
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      setProfile(data);

      const { data: obv2 } = await supabase
        .from('onboarding_v2')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (obv2) {
        setOnboarding(obv2);
      } else if (data?.onboarding && Object.keys(data.onboarding).length > 0) {
        setOnboarding(data.onboarding);
      }
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else { setProfile(null); setOnboarding(null); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email, password) => {
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
    } catch (e) {
      if (e.message.includes('bloqueado')) throw e;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      await supabase.from('login_attempts').insert({ ip: clientIp, email, is_successful: !error && !!data.user });
      if (error) throw error;
      return data;
    } catch (loginError) {
      await supabase.from('login_attempts').insert({ ip: clientIp, email, is_successful: false });
      throw loginError;
    }
  };

  const signUpWithEmail = async (email, password, metadata = {}) => {
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

  const resetPassword = async (email) => {
    const emailCheck = validate('email', email);
    if (!emailCheck.valid) throw new Error(emailCheck.error);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setOnboarding(null);
  };

  const saveOnboarding = async (data) => {
    setOnboarding(data);
    if (!user) return;

    const { data: existing } = await supabase
      .from('onboarding_v2')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    const row = {
      user_id: user.id,
      goal: data.goal || data.goal,
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
  };

  const updateProfile = async (updates) => {
    if (!user?.id) return;
    const { error } = await supabase.from('profiles').upsert({ id: user.id, ...updates }, { onConflict: 'id' });
    if (error) throw error;
    await loadProfile(user.id);
  };

  return (
    <AuthContext.Provider value={{
      user, session, onboarding, profile, loading,
      signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithApple,
      resetPassword, signOut, saveOnboarding, loadProfile, updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
}
