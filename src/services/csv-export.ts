import { supabase } from '../config/supabase';
import { formatDateBR } from '../helpers/dates';
import { tryIf } from '../utils/tryIf';
import { convertToCSV, saveAndShareCSV, saveAndShareJSON } from './csv-helpers';

export async function exportWorkoutHistory(userId) {
  if (!userId) throw new Error('Usuario nao autenticado');
  const result = await tryIf(async () => {
    const { data: workouts } = await supabase
      .from('user_workouts')
      .select('completed_at, duration, rating, notes, workouts(title, category, level)')
      .eq('user_id', userId).order('completed_at', { ascending: false });

    const rows = (workouts || []).map((w: any) => ({
      data: formatDateBR(w.completed_at), treino: w.workouts?.title || '',
      categoria: w.workouts?.category || '', nivel: w.workouts?.level || '',
      duracao_min: w.duration || 0, avaliacao: w.rating || '', notas: w.notes || '',
    }));
    return saveAndShareCSV(convertToCSV(rows, ['data', 'treino', 'categoria', 'nivel', 'duracao_min', 'avaliacao', 'notas']), 'novaix_historico_treinos.csv');
  }, { retries: 1, baseDelay: 500 });
  if (result.ok) return result.data;
  if (__DEV__) console.error('Erro ao exportar historico:', result.error);
  throw result.error;
}

export async function exportProgressData(userId) {
  if (!userId) throw new Error('Usuario nao autenticado');
  const result = await tryIf(async () => {
    const [{ data: profile }, { data: weightLogs }] = await Promise.all([
      supabase.from('profiles').select('name, email, total_xp, total_workouts, total_minutes, max_streak, created_at').eq('id', userId).single(),
      supabase.from('weight_logs').select('weight, recorded_at').eq('user_id', userId).order('recorded_at', { ascending: true }),
    ]);

    const profileCSV = convertToCSV([{
      nome: profile?.name || '', email: profile?.email || '',
      xp_total: profile?.total_xp || 0, treinos_total: profile?.total_workouts || 0,
      minutos_total: profile?.total_minutes || 0, melhor_streak: profile?.max_streak || 0,
      membro_desde: formatDateBR(profile?.created_at),
    }], ['nome', 'email', 'xp_total', 'treinos_total', 'minutos_total', 'melhor_streak', 'membro_desde']);

    const weightData = (weightLogs || []).map(w => ({ data: formatDateBR(w.recorded_at), peso_kg: w.weight }));
    const weightCSV = weightData.length > 0 ? convertToCSV(weightData, ['data', 'peso_kg']) : 'data,peso_kg\n( sem dados )';
    return saveAndShareCSV(`=== PERFIL ===\n${profileCSV}\n\n=== PESO ===\n${weightCSV}`, 'novaix_progresso.csv');
  }, { retries: 1, baseDelay: 500 });
  if (result.ok) return result.data;
  if (__DEV__) console.error('Erro ao exportar progresso:', result.error);
  throw result.error;
}

export async function exportAnalyticsData(userId, period = 'month') {
  if (!userId) throw new Error('Usuario nao autenticado');
  const result = await tryIf(async () => {
    const startDate = new Date();
    switch (period) {
      case 'week': startDate.setDate(startDate.getDate() - 7); break;
      case 'month': startDate.setMonth(startDate.getMonth() - 1); break;
      case 'quarter': startDate.setMonth(startDate.getMonth() - 3); break;
      case 'year': startDate.setFullYear(startDate.getFullYear() - 1); break;
    }
    const { data: workouts } = await supabase.from('user_workouts')
      .select('completed_at, duration, workouts(category)').eq('user_id', userId).eq('completed', true)
      .gte('completed_at', startDate.toISOString()).order('completed_at', { ascending: true });

    const rows = (workouts || []).map((w: any) => ({
      data: formatDateBR(w.completed_at), categoria: w.workouts?.category || 'Outro', duracao_min: w.duration || 0,
    }));
    return saveAndShareCSV(convertToCSV(rows, ['data', 'categoria', 'duracao_min']), `novaix_analytics_${period}.csv`);
  }, { retries: 1, baseDelay: 500 });
  if (result.ok) return result.data;
  if (__DEV__) console.error('Erro ao exportar analytics:', result.error);
  throw result.error;
}

export async function exportAchievements(userId) {
  if (!userId) throw new Error('Usuario nao autenticado');
  const result = await tryIf(async () => {
    const { ACHIEVEMENTS } = require('../constants/gamification');
    const { data } = await supabase.from('user_achievements')
      .select('achievement_id, unlocked_at').eq('user_id', userId).order('unlocked_at', { ascending: false });

    const rows = (data || []).map(a => {
      const ach = ACHIEVEMENTS.find(x => x.id === a.achievement_id);
      return {
        conquista: ach?.name || a.achievement_id, descricao: ach?.description || '',
        categoria: ach?.category || '', xp_ganho: ach?.xpReward || 0,
        desbloqueada_em: formatDateBR(a.unlocked_at),
      };
    });
    return saveAndShareCSV(convertToCSV(rows, ['conquista', 'descricao', 'categoria', 'xp_ganho', 'desbloqueada_em']), 'novaix_conquistas.csv');
  }, { retries: 1, baseDelay: 500 });
  if (result.ok) return result.data;
  if (__DEV__) console.error('Erro ao exportar conquistas:', result.error);
  throw result.error;
}

export async function exportProfileData(userId) {
  if (!userId) throw new Error('Usuario nao autenticado');
  const result = await tryIf(async () => {
    const [{ data: profile }, { data: obv2 }] = await Promise.all([
      supabase.from('profiles').select('name, email, cpf, phone, subscription_status, subscription_plan, total_xp, total_workouts, total_minutes, max_streak, streak, created_at').eq('id', userId).single(),
      supabase.from('onboarding_v2').select('goal, level').eq('user_id', userId).maybeSingle(),
    ]);

    const row = {
      nome: profile?.name || '', email: profile?.email || '', cpf: profile?.cpf || '',
      telefone: profile?.phone || '', plano: profile?.subscription_plan || 'free',
      status_assinatura: profile?.subscription_status || 'free', xp_total: profile?.total_xp || 0,
      treinos_total: profile?.total_workouts || 0, minutos_total: profile?.total_minutes || 0,
      melhor_streak: profile?.max_streak || 0, streak_atual: profile?.streak || 0,
      objetivo: obv2?.goal || '', nivel: obv2?.level || '', membro_desde: formatDateBR(profile?.created_at),
    };
    return saveAndShareCSV(convertToCSV([row], Object.keys(row)), 'novaix_perfil.csv');
  }, { retries: 1, baseDelay: 500 });
  if (result.ok) return result.data;
  if (__DEV__) console.error('Erro ao exportar perfil:', result.error);
  throw result.error;
}

export async function exportChatHistory(userId) {
  if (!userId) throw new Error('Usuario nao autenticado');
  const result = await tryIf(async () => {
    const { data: messages } = await supabase.from('coach_chat_messages')
      .select('message, is_user, created_at').eq('user_id', userId).order('created_at', { ascending: true });

    const rows = (messages || []).map(m => ({
      data: formatDateBR(m.created_at), hora: new Date(m.created_at).toLocaleTimeString('pt-BR'),
      remetente: m.is_user ? 'Voce' : 'Coach IA', mensagem: m.message || '',
    }));
    return saveAndShareCSV(convertToCSV(rows, ['data', 'hora', 'remetente', 'mensagem']), 'novaix_chat_historico.csv');
  }, { retries: 1, baseDelay: 500 });
  if (result.ok) return result.data;
  if (__DEV__) console.error('Erro ao exportar chat:', result.error);
  throw result.error;
}

export async function exportAllData(userId) {
  if (!userId) throw new Error('Usuario nao autenticado');
  const result = await tryIf(async () => {
    const tables = ['profiles', 'user_workouts', 'weight_logs', 'favorites', 'posts', 'user_achievements', 'coach_chat_messages', 'injury_details'];
    const keys = ['profile', 'workouts', 'weightLogs', 'favorites', 'posts', 'achievements', 'chatMessages', 'injuries'];
    const results = await Promise.all(tables.map(t => supabase.from(t).select('*').eq(t === 'profiles' ? 'id' : 'user_id', userId)));
    const allData = {};
    keys.forEach((k, i) => { allData[k] = results[i].data || (k === 'profile' ? {} : []); });
    return saveAndShareJSON(allData, 'novaix_todos_dados.json');
  }, { retries: 1, baseDelay: 500 });
  if (result.ok) return result.data;
  if (__DEV__) console.error('Erro ao exportar todos dados:', result.error);
  throw result.error;
}

// deleteAllUserData removido — usar deleteAccount() de lgpd.ts
