// src/services/notifications.ts
// Servico de notificacoes push - NOVAIX FITNESS

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../config/supabase';
import { APP_CONFIG } from '../config/app';

import { isNotificationEnabled } from './notifications-real';

const { workoutReminder, weeklyPlan, restDay, types, streakMessages, motivationalTips } = APP_CONFIG.notifications;

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true }),
});

interface Navigation { navigate?: (route: string) => void; }
interface PushMessage { to: string; sound: string; title: string; body: string; data: Record<string, unknown>; channelId: string; }
interface NotificationPayload { title?: string; body?: string; data?: Record<string, unknown>; notification: Notifications.Notification; }

const EXPO_API_URL = 'https://exp.host/--/api/v2/push/send';

function handleNotificationNavigation(data: Record<string, unknown> | null, navigation: Navigation): void {
  const route = types[data?.type as string]?.route;
  if (route) navigation?.navigate?.(route);
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
}

export async function registerForPushNotifications(userId: string | null): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return null;
  try {
    const token = await Notifications.getExpoPushTokenAsync();
    const pushToken = token.data;
    if (userId && pushToken) {
      await supabase.from('profiles').update({ push_token: pushToken }).eq('id', userId);
    }
    return pushToken;
  } catch (err) {
    console.warn('Erro ao obter token de push:', err);
    return null;
  }
}

export async function scheduleWorkoutReminder(hour?: number, minute?: number): Promise<void> {
  const h = hour ?? workoutReminder.hour;
  const m = minute ?? workoutReminder.minute;
  await Notifications.cancelScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Hora de treinar!', body: 'Seu streak esta em risco! Nao esqueca do treino de hoje.', data: { type: 'workout_reminder' } },
    trigger: { hour: h, minute: m, repeats: true },
  });
}

export async function scheduleWeeklyPlanReminder(): Promise<void> {
  const { weekday, hour, minute } = weeklyPlan;
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Seu plano da semana esta pronto!', body: 'Novos treinos disponiveis. Confira seu cronograma.', data: { type: 'weekly_plan' } },
    trigger: { weekday, hour, minute, repeats: true },
  });
}

export async function scheduleRestDayReminder(): Promise<void> {
  const { weekday, hour, minute } = restDay;
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Dia de descanso', body: 'Recuperacao e importante! Volte amanha com tudo.', data: { type: 'rest_day' } },
    trigger: { weekday, hour, minute, repeats: true },
  });
}

export async function saveNotificationToDB(userId: string | null, type: string, title: string, body: string, data: Record<string, unknown> = {}): Promise<void> {
  if (!userId) return;
  try {
    await supabase.from('notifications').insert({ user_id: userId, type, title, body, data });
  } catch (err) { console.error('Erro ao salvar notificacao:', err); }
}

export async function getUnreadCount(userId: string | null): Promise<number> {
  if (!userId) return 0;
  try {
    const { count } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('read', false);
    return count || 0;
  } catch { return 0; }
}

export async function clearAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.dismissAllNotificationsAsync();
}

export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  return await Notifications.getAllScheduledNotificationsAsync();
}

export function setupNotificationListeners(navigation: Navigation): void {
  Notifications.addNotificationResponseReceivedListener((response) => {
    handleNotificationNavigation(response.notification.request.content.data, navigation);
  });
}

export async function sendPushNotification(expoPushToken: string | null, title: string, body: string, data: Record<string, unknown> = {}): Promise<boolean> {
  if (!expoPushToken) return false;
  const message: PushMessage = { to: expoPushToken, sound: 'default', title, body, data, channelId: 'default' };
  try {
    const response = await fetch(EXPO_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(message) });
    const result: { data?: { status?: string } } = await response.json();
    return result.data?.status === 'ok';
  } catch (err) { console.warn('Erro ao enviar push:', err); return false; }
}

export async function sendPushToUser(userId: string, title: string, body: string, data: Record<string, unknown> = {}): Promise<boolean> {
  try {
    const { data: profile } = await supabase.from('profiles').select('push_token, notification_prefs').eq('id', userId).single();
    if (!profile?.push_token) return false;
    const prefs: Record<string, boolean> = profile.notification_prefs || APP_CONFIG.notifications.defaultPrefs;
    const type = data?.type as string;
    if (type && prefs[type] === false) return false;
    return sendPushNotification(profile.push_token, title, body, data);
  } catch { return false; }
}

export async function sendBatchPushNotifications(tokens: (string | null)[], title: string, body: string, data: Record<string, unknown> = {}): Promise<void> {
  const messages: PushMessage[] = tokens.filter(Boolean).map(token => ({ to: token as string, sound: 'default', title, body, data, channelId: 'default' }));
  if (messages.length === 0) return;
  try {
    await fetch(EXPO_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(messages) });
  } catch (err) { console.warn('Erro ao enviar batch push:', err); }
}

export function addNotificationReceivedListener(handler: (payload: NotificationPayload) => void): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener((notification) => {
    const { title, body, data } = notification.request.content;
    handler?.({ title, body, data, notification });
  });
}

export function addNotificationResponseListener(navigation: Navigation): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const { data } = response.notification.request.content;
    handleNotificationNavigation(data as Record<string, unknown> | null, navigation);
  });
}

export const registerForPushNotificationsAsync = registerForPushNotifications;

// --- Notification sender functions (merged from notifications-sender.js) ---

async function shouldSend(userId: string, type: string): Promise<boolean> {
  return isNotificationEnabled(userId, type);
}

async function saveAndSend(userId: string, type: string, title: string, body: string, data: Record<string, unknown> = {}): Promise<boolean> {
  if (!(await shouldSend(userId, type))) return false;
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data: { ...data, type } },
    trigger: null,
  });
  if (userId) {
    try { await supabase.from('notifications').insert({ user_id: userId, type, title, body, data }); } catch {}
  }
  return true;
}

export async function sendWorkoutCompletedNotification(workoutName: string, xpGained: number, userId: string): Promise<boolean> {
  return saveAndSend(userId, 'workout_completed', 'Treino concluido!', `${workoutName} finalizado. +${xpGained} XP ganho!`);
}

export async function sendStreakNotification(days: number, userId: string): Promise<boolean> {
  return saveAndSend(userId, 'streak', `Streak de ${days} dias!`, streakMessages[days] || 'Continue assim! Voce esta indo muito bem.');
}

export async function sendAchievementNotification(achievementName: string, xpReward: number, userId: string): Promise<boolean> {
  return saveAndSend(userId, 'achievement', 'Conquista desbloqueada!', `${achievementName} +${xpReward} XP`);
}

export async function sendLevelUpNotification(levelName: string, newLevel: number, userId: string): Promise<boolean> {
  return saveAndSend(userId, 'level_up', `Nivel ${newLevel}!`, `Parabens! Voce alcancou o nivel ${levelName}!`);
}

export async function sendNewWorkoutNotification(workoutName: string, userId: string): Promise<boolean> {
  return saveAndSend(userId, 'new_workout', 'Novo treino disponivel!', `${workoutName} acabou de chegar. Confira agora!`);
}

export async function sendWeeklySummaryNotification(workoutsCompleted: number, minutesTrained: number, userId: string): Promise<boolean> {
  return saveAndSend(userId, 'weekly_summary', 'Resumo da semana', `${workoutsCompleted} treinos, ${minutesTrained} minutos. Continue firme!`);
}

export async function sendRestReminder(userId: string): Promise<boolean> {
  return saveAndSend(userId, 'rest_day', 'Dia de descanso', 'Recuperacao e importante! Volte amanha com tudo.');
}

export async function sendMotivationalNotification(userId: string): Promise<boolean> {
  const tip = motivationalTips[Math.floor(Math.random() * motivationalTips.length)];
  return saveAndSend(userId, 'motivational', 'Motivacao do dia', tip);
}
