// src/context/AuthContext.js
// Context para Autenticação - NOVAIX FITNESS

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [onboarding, setOnboarding] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOnboarding = async (userId) => {
    if (userId) {
      const { data } = await supabase
        .from('profiles')
        .select('onboarding')
        .eq('id', userId)
        .single();
      if (data?.onboarding) setOnboarding(data.onboarding);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadOnboarding(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUpWithEmail = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    if (error) throw error;
    if (data.user) {
      try {
        await supabase.rpc('create_profile', {
          user_id: data.user.id,
          user_email: data.user.email || '',
          user_name: metadata.name || '',
        });
      } catch (rpcError) {
        console.log('RPC create_profile falhou, o perfil deve ser criado pelo trigger do banco:', rpcError);
      }
    }
    return data;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'novaix://',
        skipBrowserRedirect: true,
      },
    });
    if (error) throw error;
    return data;
  };

  const signInWithApple = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: 'novaix://',
        skipBrowserRedirect: true,
      },
    });
    if (error) throw error;
    return data;
  };

  const resetPassword = async (email) => {
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
    if (user) {
      await supabase
        .from('profiles')
        .upsert({ id: user.id, onboarding: data }, { onConflict: 'id' });
    }
  };



  const updateProfile = async (updates) => {
    if (!user?.id) return;
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...updates }, { onConflict: 'id' });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      onboarding,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signInWithApple,
      resetPassword,
      signOut,
      saveOnboarding,
      loadOnboarding,
      updateProfile,
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
