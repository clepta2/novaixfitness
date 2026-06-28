// src/services/csv-export.js
// Servico de exportacao CSV - NOVAIX FITNESS

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { supabase } from '../config/supabase';

function convertToCSV(data, headers) {
  const rows = [headers.join(',')];
  data.forEach(row => {
    const values = headers.map(h => {
      const val = row[h] ?? '';
      const str = String(val);
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"` : str;
    });
    rows.push(values.join(','));
  });
  return rows.join('\n');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

export async function exportWorkoutHistory(userId) {
  if (!userId) throw new Error('Usuario nao autenticado');

  const { data: workouts } = await supabase
    .from('user_workouts')
    .select('completed_at, duration, rating, notes, workouts(title, category, level)')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  const rows = (workouts || []).map(w => ({
    data: formatDate(w.completed_at),
    treino: w.workouts?.title || '',
    categoria: w.workouts?.category || '',
    nivel: w.workouts?.level || '',
    duracao_min: w.duration || 0,
    avaliacao: w.rating || '',
    notas: w.notes || '',
  }));

  const headers = ['data', 'treino', 'categoria', 'nivel', 'duracao_min', 'avaliacao', 'notas'];
  const csv = convertToCSV(rows, headers);

  return saveAndShareCSV(csv, 'novaix_historico_treinos.csv');
}

export async function exportProgressData(userId) {
  if (!userId) throw new Error('Usuario nao autenticado');

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, email, total_xp, total_workouts, total_minutes, max_streak, created_at')
    .eq('id', userId)
    .single();

  const { data: weightLogs } = await supabase
    .from('weight_logs')
    .select('weight, recorded_at')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: true });

  const profileData = [{
    nome: profile?.name || '',
    email: profile?.email || '',
    xp_total: profile?.total_xp || 0,
    treinos_total: profile?.total_workouts || 0,
    minutos_total: profile?.total_minutes || 0,
    melhor_streak: profile?.max_streak || 0,
    membro_desde: formatDate(profile?.created_at),
  }];

  const profileCSV = convertToCSV(profileData, Object.keys(profileData[0]));

  const weightData = (weightLogs || []).map(w => ({
    data: formatDate(w.recorded_at),
    peso_kg: w.weight,
  }));

  const weightCSV = weightData.length > 0
    ? convertToCSV(weightData, ['data', 'peso_kg'])
    : 'data,peso_kg\n( sem dados )';

  const csv = `=== PERFIL ===\n${profileCSV}\n\n=== PESO ===\n${weightCSV}`;

  return saveAndShareCSV(csv, 'novaix_progresso.csv');
}

export async function exportAnalyticsData(userId, period = 'month') {
  if (!userId) throw new Error('Usuario nao autenticado');

  const now = new Date();
  const startDate = new Date(now);
  switch (period) {
    case 'week': startDate.setDate(now.getDate() - 7); break;
    case 'month': startDate.setMonth(now.getMonth() - 1); break;
    case 'quarter': startDate.setMonth(now.getMonth() - 3); break;
    case 'year': startDate.setFullYear(now.getFullYear() - 1); break;
  }

  const { data: workouts } = await supabase
    .from('user_workouts')
    .select('completed_at, duration, workouts(category)')
    .eq('user_id', userId)
    .eq('completed', true)
    .gte('completed_at', startDate.toISOString())
    .order('completed_at', { ascending: true });

  const rows = (workouts || []).map(w => ({
    data: formatDate(w.completed_at),
    categoria: w.workouts?.category || 'Outro',
    duracao_min: w.duration || 0,
  }));

  const headers = ['data', 'categoria', 'duracao_min'];
  const csv = convertToCSV(rows, headers);

  return saveAndShareCSV(csv, `novaix_analytics_${period}.csv`);
}

export async function exportAchievements(userId) {
  if (!userId) throw new Error('Usuario nao autenticado');

  const { data } = await supabase
    .from('user_achievements')
    .select('achievement_id, unlocked_at')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false });

  const { ACHIEVEMENTS } = require('../constants/gamification');

  const rows = (data || []).map(a => {
    const ach = ACHIEVEMENTS.find(x => x.id === a.achievement_id);
    return {
      conquista: ach?.name || a.achievement_id,
      descricao: ach?.description || '',
      categoria: ach?.category || '',
      xp_ganho: ach?.xpReward || 0,
      desbloqueada_em: formatDate(a.unlocked_at),
    };
  });

  const headers = ['conquista', 'descricao', 'categoria', 'xp_ganho', 'desbloqueada_em'];
  const csv = convertToCSV(rows, headers);

  return saveAndShareCSV(csv, 'novaix_conquistas.csv');
}

export async function exportProfileData(userId) {
  if (!userId) throw new Error('Usuario nao autenticado');

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, email, cpf, phone, subscription_status, subscription_plan, onboarding, total_xp, total_workouts, total_minutes, max_streak, streak, created_at')
    .eq('id', userId)
    .single();

  const { data: obv2 } = await supabase
    .from('onboarding_v2')
    .select('goal, level')
    .eq('user_id', userId)
    .maybeSingle();

  const row = {
    nome: profile?.name || '',
    email: profile?.email || '',
    cpf: profile?.cpf || '',
    telefone: profile?.phone || '',
    plano: profile?.subscription_plan || 'free',
    status_assinatura: profile?.subscription_status || 'free',
    xp_total: profile?.total_xp || 0,
    treinos_total: profile?.total_workouts || 0,
    minutos_total: profile?.total_minutes || 0,
    melhor_streak: profile?.max_streak || 0,
    streak_atual: profile?.streak || 0,
    objetivo: obv2?.goal || '',
    nivel: obv2?.level || '',
    membro_desde: formatDate(profile?.created_at),
  };

  const csv = convertToCSV([row], Object.keys(row));
  return saveAndShareCSV(csv, 'novaix_perfil.csv');
}

export async function exportChatHistory(userId) {
  if (!userId) throw new Error('Usuario nao autenticado');

  const { data: messages } = await supabase
    .from('coach_chat_messages')
    .select('message, is_user, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  const rows = (messages || []).map(m => ({
    data: formatDate(m.created_at),
    hora: new Date(m.created_at).toLocaleTimeString('pt-BR'),
    remetente: m.is_user ? 'Voce' : 'Coach IA',
    mensagem: m.message || '',
  }));

  const csv = convertToCSV(rows, ['data', 'hora', 'remetente', 'mensagem']);
  return saveAndShareCSV(csv, 'novaix_chat_historico.csv');
}

export async function exportAllData(userId) {
  if (!userId) throw new Error('Usuario nao autenticado');

  const allData = {};

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
  allData.profile = profile || {};

  const { data: workouts } = await supabase.from('user_workouts').select('*, workouts(title, category)').eq('user_id', userId);
  allData.workouts = workouts || [];

  const { data: weights } = await supabase.from('weight_logs').select('*').eq('user_id', userId);
  allData.weightLogs = weights || [];

  const { data: favorites } = await supabase.from('favorites').select('*').eq('user_id', userId);
  allData.favorites = favorites || [];

  const { data: posts } = await supabase.from('posts').select('*').eq('user_id', userId);
  allData.posts = posts || [];

  const { data: achievements } = await supabase.from('user_achievements').select('*').eq('user_id', userId);
  allData.achievements = achievements || [];

  const { data: chat } = await supabase.from('coach_chat_messages').select('*').eq('user_id', userId);
  allData.chatMessages = chat || [];

  const { data: injuries } = await supabase.from('injury_details').select('*').eq('user_id', userId);
  allData.injuries = injuries || [];

  const json = JSON.stringify(allData, null, 2);
  const fileUri = FileSystem.documentDirectory + 'novaix_todos_dados.json';
  await FileSystem.writeAsStringAsync(fileUri, json, { encoding: FileSystem.EncodingType.UTF8 });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: 'Exportar todos os dados (LGPD)',
    });
  }

  return fileUri;
}

export async function deleteAllUserData(userId) {
  if (!userId) throw new Error('Usuario nao autenticado');

  await supabase.from('coach_chat_messages').delete().eq('user_id', userId);
  await supabase.from('user_achievements').delete().eq('user_id', userId);
  await supabase.from('favorites').delete().eq('user_id', userId);
  await supabase.from('post_likes').delete().eq('user_id', userId);
  await supabase.from('post_comments').delete().eq('user_id', userId);
  await supabase.from('posts').delete().eq('user_id', userId);
  await supabase.from('user_workouts').delete().eq('user_id', userId);
  await supabase.from('weight_logs').delete().eq('user_id', userId);
  await supabase.from('water_logs').delete().eq('user_id', userId);
  await supabase.from('injury_details').delete().eq('user_id', userId);

  await supabase.from('profiles').update({
    name: 'Conta excluida',
    email: `deleted_${userId}@novaix.fitness`,
    cpf: null,
    phone: null,
    onboarding: null,
    subscription_status: 'cancelled',
  }).eq('id', userId);
}

async function saveAndShareCSV(csv, filename) {
  const fileUri = FileSystem.documentDirectory + filename;
  await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/csv',
      dialogTitle: `Exportar ${filename}`,
      UTI: 'public.comma-separated-values-text',
    });
  }

  return fileUri;
}
