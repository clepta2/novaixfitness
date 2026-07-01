// src/context/AuthContextTypes.ts
// Tipos do contexto de autenticacao

import type { User, Session } from '@supabase/supabase-js';
import type { Profile, OnboardingData } from '../types';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  onboarding: OnboardingData | Record<string, unknown> | null;
  profile: Profile | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ user: User; session: Session }>;
  signUpWithEmail: (email: string, password: string, metadata?: { name?: string; [key: string]: unknown }) => Promise<{ user: User | null; session: Session | null }>;
  signInWithGoogle: () => Promise<{ provider: string; url: string }>;
  signInWithApple: () => Promise<{ provider: string; url: string }>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  saveOnboarding: (data: Record<string, unknown>) => Promise<void>;
  loadProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}
