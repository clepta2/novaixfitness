// src/services/notifications.js
// Servico de notificacoes push - NOVAIX FITNESS

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../config/supabase';
import { APP_CONFIG } from '../config/app';

export {
  sendWorkoutCompletedNotification,
  sendStreakNotification,
  sendAchievementNotification,
  sendLevelUpNotification,
  sendNewWorkoutNotification,
  sendWeeklySummaryNotification,
  sendRestReminder,
  sendMotivationalNotification,
} from './notifications-sender';

const { workoutReminder, weeklyPlan, restDay, types } = APP_CONFIG.notifications;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermission() {
  if (Platform.OS === 'web') return false;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
}

export async function registerForPushNotifications(userId) {
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

export async function scheduleWorkoutReminder(hour, minute) {
  const h = hour ?? workoutReminder.hour;
  const m = minute ?? workoutReminder.minute;
  await Notifications.cancelScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Hora de treinar!', body: 'Seu streak esta em risco! Nao esqueca do treino de hoje.', data: { type: 'workout_reminder' } },
    trigger: { hour: h, minute: m, repeats: true },
  });
}

export async function scheduleWeeklyPlanReminder() {
  const { weekday, hour, minute } = weeklyPlan;
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Seu plano da semana esta pronto!', body: 'Novos treinos disponiveis. Confira seu cronograma.', data: { type: 'weekly_plan' } },
    trigger: { weekday, hour, minute, repeats: true },
  });
}

export async function scheduleRestDayReminder() {
  const { weekday, hour, minute } = restDay;
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Dia de descanso', body: 'Recuperacao e importante! Volte amanha com tudo.', data: { type: 'rest_day' } },
    trigger: { weekday, hour, minute, repeats: true },
  });
}

export async function saveNotificationToDB(userId, type, title, body, data = {}) {
  if (!userId) return;
  try {
    await supabase.from('notifications').insert({ user_id: userId, type, title, body, data });
  } catch (err) {
    console.error('Erro ao salvar notificacao:', err);
  }
}

export async function getUnreadCount(userId) {
  if (!userId) return 0;
  try {
    const { count } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('read', false);
    return count || 0;
  } catch { return 0; }
}

export async function clearAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.dismissAllNotificationsAsync();
}

export async function getScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}

export function setupNotificationListeners(navigation) {
  Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    handleNotificationNavigation(data, navigation);
  });
}

function handleNotificationNavigation(data, navigation) {
  const route = types[data?.type]?.route;
  if (route) navigation?.navigate?.(route);
}
