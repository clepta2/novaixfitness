import { supabase } from '../config/supabase';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { tryIf } from '../utils/tryIf';

export async function exportUserData(userId) {
  if (!userId) throw new Error('Usuário não autenticado');
  const result = await tryIf(async () => {
    const [profileRes, workoutsRes, favoritesRes, postsRes, achievementsRes, paymentsRes, onboardingRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('user_workouts').select('*, workouts(title, category, level)').eq('user_id', userId),
      supabase.from('favorites').select('*, workouts(title)').eq('user_id', userId),
      supabase.from('posts').select('*').eq('user_id', userId),
      supabase.from('user_achievements').select('*').eq('user_id', userId),
      supabase.from('payments').select('*').eq('user_id', userId),
      supabase.from('onboarding_v2').select('*').eq('user_id', userId).maybeSingle(),
    ]);

    const userData = {
      exportDate: new Date().toISOString(),
      app: 'NOVAIX FITNESS',
      profile: profileRes.data ? {
        name: profileRes.data.name,
        email: profileRes.data.email,
        created_at: profileRes.data.created_at,
        onboarding: onboardingRes.data || {},
        physical_data: profileRes.data.physical_data,
        subscription_status: profileRes.data.subscription_status,
        subscription_plan: profileRes.data.subscription_plan,
        total_workouts: profileRes.data.total_workouts,
        total_minutes: profileRes.data.total_minutes,
        total_xp: profileRes.data.total_xp,
        streak: profileRes.data.max_streak,
      } : null,
      workouts: workoutsRes.data || [],
      favorites: favoritesRes.data || [],
      posts: postsRes.data || [],
      achievements: achievementsRes.data || [],
      payments: paymentsRes.data?.map(p => ({
        plan_type: p.plan_type,
        amount: p.amount,
        status: p.status,
        created_at: p.created_at,
      })) || [],
    };

    return JSON.stringify(userData, null, 2);
  }, { retries: 2, baseDelay: 500 });

  if (!result.ok) {
    if (__DEV__) console.error('Erro ao exportar dados LGPD:', result.error);
    throw result.error!;
  }
  return result.data!;
}

export async function downloadUserData(userId) {
  const result = await tryIf(async () => {
    const json = await exportUserData(userId);
    const fileName = `novaix_fitness_dados_${Date.now()}.json`;
    const fileUri = (FileSystem as any).documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, json, { encoding: FileSystem.EncodingType.UTF8 });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Exportar dados NOVAIX FITNESS',
        UTI: 'public.json',
      });
    }

    return fileUri;
  }, { retries: 2, baseDelay: 500 });

  if (!result.ok) {
    if (__DEV__) console.error('Erro ao baixar dados:', result.error);
    throw result.error!;
  }
  return result.data!;
}

export async function deleteAccount(userId) {
  if (!userId) throw new Error('Usuário não autenticado');
  const result = await tryIf(async () => {
    const tables = [
      'user_achievements', 'payments', 'subscriptions', 'favorites',
      'post_likes', 'post_comments', 'coupon_usage', 'referrals',
      'user_workouts', 'posts', 'profiles',
    ];

    for (const table of tables) {
      await supabase.from(table).delete().eq('user_id', userId);
    }

    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
      if (__DEV__) console.warn('Erro ao deletar do auth:', error.message);
    }

    await supabase.auth.signOut();
    return true;
  }, { retries: 3, baseDelay: 1000 });

  if (!result.ok) {
    if (__DEV__) console.error('Erro ao deletar conta:', result.error);
    throw result.error!;
  }
  return result.data!;
}

export async function getConsentSettings(userId) {
  if (!userId) return null;
  const result = await tryIf(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('consent_marketing, consent_analytics, consent_third_party, consent_updated_at')
      .eq('id', userId)
      .single();

    return {
      marketing: data?.consent_marketing ?? false,
      analytics: data?.consent_analytics ?? false,
      thirdParty: data?.consent_third_party ?? false,
      updatedAt: data?.consent_updated_at,
    };
  }, { retries: 1, baseDelay: 500 });

  if (!result.ok) {
    if (__DEV__) console.error('Erro ao buscar consentimentos:', result.error);
    return { marketing: false, analytics: false, thirdParty: false, updatedAt: null };
  }
  return result.data!;
}

export async function updateConsentSettings(userId, settings) {
  if (!userId) throw new Error('Usuário não autenticado');
  const result = await tryIf(async () => {
    const { error } = await supabase
      .from('profiles')
      .update({
        consent_marketing: settings.marketing,
        consent_analytics: settings.analytics,
        consent_third_party: settings.thirdParty,
        consent_updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;
    return true;
  }, { retries: 3, baseDelay: 1000 });

  if (!result.ok) {
    if (__DEV__) console.error('Erro ao atualizar consentimentos:', result.error);
    throw result.error!;
  }
  return result.data!;
}

export async function requestDataDeletion(userId) {
  if (!userId) throw new Error('Usuário não autenticado');
  const result = await tryIf(async () => {
    await supabase.from('data_deletion_requests').insert({
      user_id: userId,
      status: 'pending',
      requested_at: new Date().toISOString(),
    });
    return true;
  }, { retries: 3, baseDelay: 1000 });

  if (!result.ok) {
    if (__DEV__) console.error('Erro ao solicitar exclusao:', result.error);
    throw result.error!;
  }
  return result.data!;
}
