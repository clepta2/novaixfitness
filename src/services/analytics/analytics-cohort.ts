// src/services/analytics/analytics-cohort.ts
// Cohort analysis, retention, segmentation e funis

import { supabase } from '../../config/supabase';
import { TABLES } from '../../config/tables';
import { createServiceGuard } from '../../utils/serviceGuard';
import { tryIf } from '../../utils/tryIf';

const guard = createServiceGuard({ serviceName: 'analyticsCohort' });

export interface ChurnRiskUser {
  id: string;
  email: string;
  last_active_at: string;
}

const COHORT_PERIODS = { daily: 1, weekly: 7, monthly: 30 };

export async function getCohortAnalysis(period = 'weekly', startDate: string | null = null, endDate: string | null = null) {
  const result = await guard.guard(async () => {
    const start = startDate || new Date(Date.now() - 90 * 86400000).toISOString();
    const end = endDate || new Date().toISOString();
    const { data, error } = await supabase.rpc('get_cohort_analysis', {
      p_start_date: start, p_end_date: end, p_period_days: COHORT_PERIODS[period] || 7,
    });
    if (error) throw error;
    return data || [];
  });
  return result.ok ? result.data : [];
}

export async function getUserRetention(userId: string, days = 30) {
  const result = await guard.guard(async () => {
    const since = new Date(Date.now() - days * 86400000).toISOString();
    const { data, error } = await supabase
      .from(TABLES.ANALYTICS_EVENTS)
      .select('timestamp')
      .eq('user_id', userId)
      .gte('timestamp', since)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    const daysActive = new Set((data || []).map(e => new Date(e.timestamp).toDateString())).size;
    return { daysActive, retentionRate: (daysActive / days) * 100, totalEvents: data?.length || 0 };
  });
  return result.ok ? result.data : { daysActive: 0, retentionRate: 0, totalEvents: 0 };
}

export async function getCohortRetention(startDate: string, endDate: string): Promise<unknown> {
  const result = await guard.guard(async () => {
    const { data, error } = await supabase.rpc('get_cohort_retention', { start_date: startDate, end_date: endDate });
    if (error) throw error;
    return data;
  });
  return result.ok ? result.data : null;
}

export async function getFunnelConversion(funnelName: string, startDate: string | null = null, endDate: string | null = null) {
  const result = await guard.guard(async () => {
    const start = startDate || new Date(Date.now() - 30 * 86400000).toISOString();
    const end = endDate || new Date().toISOString();
    const { data, error } = await supabase.rpc('get_funnel_conversion', {
      p_funnel_name: funnelName, p_start_date: start, p_end_date: end,
    });
    if (error) throw error;
    return data || [];
  });
  return result.ok ? result.data : [];
}

export async function getConversionFunnel(startDate: string, endDate: string): Promise<unknown> {
  const result = await guard.guard(async () => {
    const { data, error } = await supabase.rpc('get_conversion_funnel', { start_date: startDate, end_date: endDate });
    if (error) throw error;
    return data;
  });
  return result.ok ? result.data : null;
}

export async function getUserSegmentation() {
  const result = await guard.guard(async () => {
    const { data: users, error } = await supabase
      .from(TABLES.PROFILES)
      .select('id, subscription_plan, level, total_workouts, created_at');

    if (error) throw error;

    interface ProfileRow { id: string; subscription_plan?: string; level?: string; total_workouts?: number; created_at?: string; }

    const segments: Record<string, ProfileRow[]> = { free: [], basic: [], premium: [], power_users: [], at_risk: [], new_users: [] };
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);

    for (const user of users || []) {
      if (user.subscription_plan === 'free') segments.free.push(user);
      else if (user.subscription_plan === 'basic') segments.basic.push(user);
      else if (user.subscription_plan === 'premium') segments.premium.push(user);
      if (user.total_workouts >= 50) segments.power_users.push(user);
      if (new Date(user.created_at) > thirtyDaysAgo) segments.new_users.push(user);
    }

    return {
      segments,
      stats: {
        total: users?.length || 0,
        free: segments.free.length, basic: segments.basic.length, premium: segments.premium.length,
        powerUsers: segments.power_users.length, newUsers: segments.new_users.length,
      },
    };
  });
  return result.ok ? result.data : { segments: {}, stats: { total: 0, free: 0, basic: 0, premium: 0, powerUsers: 0, newUsers: 0 } };
}

export async function getChurnRiskUsers(): Promise<ChurnRiskUser[]> {
  const result = await guard.guard(async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .select('id, email, last_active_at')
      .lt('last_active_at', thirtyDaysAgo.toISOString())
      .eq('subscription_status', 'active');
    if (error) throw error;
    return (data || []) as ChurnRiskUser[];
  });
  return result.ok ? result.data : [];
}
