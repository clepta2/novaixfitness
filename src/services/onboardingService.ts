import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { OnboardingData } from '../types';

interface OnboardingRow {
  user_id: string;
  goal?: string;
  age_range?: string;
  gender?: string;
  weight?: number;
  height?: number;
  cep?: string;
  state?: string;
  city?: string;
  body_model?: string;
  level?: string;
  days_per_week?: number;
  workout_location?: string;
  gym_type?: string;
  injuries?: string[];
  preferred_time?: string;
  stress_sleep?: string;
  preferred_muscles?: string[];
  dietary_restrictions?: string[];
  instructor_type?: string;
  notification_channels?: string[];
  notification_types?: string[];
  referral_source?: string;
  current_step?: string;
  updated_at: string;
  created_at?: string;
}

export async function saveOnboardingData(userId: string, data: OnboardingData): Promise<void> {
  const { data: existing } = await supabase
    .from(TABLES.ONBOARDING_V2)
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  const row: OnboardingRow = {
    user_id: userId,
    goal: data.goal,
    age_range: data.age_range,
    gender: data.gender,
    body_model: data.body_model,
    level: data.experience_level,
    days_per_week: data.days_per_week,
    workout_location: data.location,
    preferred_time: data.preferred_time,
    stress_sleep: data.stress_level,
    preferred_muscles: data.preferred_muscles || [],
    dietary_restrictions: data.dietary_restrictions || [],
    instructor_type: data.instructor_type,
    referral_source: data.referral_source,
    current_step: 'completed',
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    await supabase.from(TABLES.ONBOARDING_V2).update(row).eq('id', existing.id);
  } else {
    row.created_at = new Date().toISOString();
    await supabase.from(TABLES.ONBOARDING_V2).insert(row);
  }

  await supabase.from(TABLES.PROFILES).update({ current_step: 'home' }).eq('id', userId);
}
