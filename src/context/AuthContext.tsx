// src/context/AuthContext.tsx
// Context para Autenticação — provider + profile loading + auth actions

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { supabase } from '../config/supabase';
import { useAuthActions } from '../hooks/useAuthActions';
import { User, Session } from '@supabase/supabase-js';

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

interface AuthContextType {
  user: User | null;
  session: Session | null;
  onboarding: OnboardingData | null;
  profile: Profile | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string, metadata?: Record<string, any>) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signInWithApple: () => Promise<any>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  saveOnboarding: (data: OnboardingData) => Promise<void>;
  loadProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const profileLoadIdRef = useRef(0);

  const loadProfile = async (userId: string): Promise<void> => {
    if (!userId) return;
    const loadId = ++profileLoadIdRef.current;
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (loadId !== profileLoadIdRef.current) return;
      setProfile(data as Profile);

      const { data: obv2 } = await supabase
        .from('onboarding_v2')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (loadId !== profileLoadIdRef.current) return;
      setOnboarding(obv2 as OnboardingData || null);
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar perfil:', err);
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

  const authActions = useAuthActions(user, loadProfile, setOnboarding);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
    setProfile(null);
    setOnboarding(null);
  };

  return (
    <AuthContext.Provider value={{
      user, session, onboarding, profile, loading,
      ...authActions,
      loadProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
}
