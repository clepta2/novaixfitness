// src/services/waterReminders.js
// Lembretes de hidratação -类似于 apps de beber água

import * as Notifications from 'expo-notifications';
import { supabase } from '../config/supabase';

export async function scheduleWaterReminders(dailyGoal, preferredTime) {
  const hasPermission = await Notifications.requestPermissionsAsync();
  if (hasPermission.status !== 'granted') return false;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const timeMap = { morning: 7, afternoon: 12, night: 18 };
  const startHour = timeMap[preferredTime] || 7;
  const hoursUntilSleep = 22 - startHour;
  const interval = Math.max(1, Math.floor(hoursUntilSleep / 6));

  for (let i = 0; i < 6; i++) {
    const hour = startHour + (i * interval);
    if (hour > 22) break;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hora de beber água! 💧',
        body: getWaterTip(),
        data: { type: 'water_reminder' },
      },
      trigger: { hour, minute: 0, repeats: true },
    });
  }

  return true;
}

function getWaterTip() {
  const tips = [
    'Mantenha uma garrafa por perto!',
    'Beba um copo ao acordar.',
    'Água antes, durante e depois do treino.',
    'Se a urina estiver escura, beba mais água.',
    'Coma frutas com muita água (melancia, pepino).',
    'Beba um copo 30 minutos antes das refeições.',
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

export async function logWaterIntake(userId, amountML) {
  if (!userId) return;
  try {
    await supabase.from('water_logs').insert({
      user_id: userId,
      amount_ml: amountML,
      logged_at: new Date().toISOString(),
    });
  } catch (err) {
    if (__DEV__) console.error('Erro ao registrar água:', err);
  }
}

export async function getTodayWater(userId) {
  if (!userId) return 0;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data } = await supabase.from('water_logs').select('amount_ml').eq('user_id', userId).gte('logged_at', today.toISOString());
    return data?.reduce((sum, item) => sum + item.amount_ml, 0) || 0;
  } catch (err) {
    if (__DEV__) console.error('Erro ao buscar água:', err);
    return 0;
  }
}

export async function getWaterHistory(userId, days = 7) {
  if (!userId) return [];
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const { data } = await supabase.from('water_logs').select('amount_ml, logged_at').eq('user_id', userId).gte('logged_at', startDate.toISOString()).order('logged_at', { ascending: true });
    return data || [];
  } catch (err) {
    if (__DEV__) console.error('Erro ao buscar histórico de água:', err);
    return [];
  }
}
