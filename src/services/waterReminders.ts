// src/services/waterReminders.ts
// Lembretes de hidratação - NOVAIX FITNESS

import * as Notifications from 'expo-notifications';
import { supabase } from '../config/supabase';

type PreferredTime = 'morning' | 'afternoon' | 'night';

export async function scheduleWaterReminders(dailyGoal: number, preferredTime: PreferredTime): Promise<boolean> {
  const hasPermission = await Notifications.requestPermissionsAsync();
  if (hasPermission.status !== 'granted') return false;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const timeMap: Record<PreferredTime, number> = { morning: 7, afternoon: 12, night: 18 };
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
      trigger: { hour, minute: 0, repeats: true } as any,
    });
  }

  return true;
}

function getWaterTip(): string {
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

export async function logWaterIntake(userId: string, amountML: number): Promise<void> {
  if (!userId) return;
  try {
    await supabase.from('water_logs').insert({
      user_id: userId,
      amount_ml: amountML,
      logged_at: new Date().toISOString(),
    });
  } catch (error) {
    if (__DEV__) console.error('Erro ao registrar água:', error);
  }
}

export async function getWaterLogs(userId: string, date?: string): Promise<any[]> {
  if (!userId) return [];

  const targetDate = date || new Date().toISOString().split('T')[0];
  const startDate = `${targetDate}T00:00:00`;
  const endDate = `${targetDate}T23:59:59`;

  const { data } = await supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', startDate)
    .lte('logged_at', endDate)
    .order('logged_at', { ascending: true });

  return data || [];
}

export async function getWaterTotal(userId: string, date?: string): Promise<number> {
  const logs = await getWaterLogs(userId, date);
  return logs.reduce((sum, log) => sum + (log.amount_ml || 0), 0);
}
