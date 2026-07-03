// src/services/pushNotifications.js
// Servico de push notifications - NOVAIX FITNESS

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../../config/supabase';
import { APP_CONFIG } from '../../config/app';
import { tryIf } from '../../utils/tryIf';

const EXPO_API_URL = 'https://exp.host/--/api/v2/push/send';

const ROUTE_MAP = {
  workout_reminder: '/(tabs)/home',
  workout_completed: '/(tabs)/home',
  new_workout: '/(tabs)/library',
  streak: '/(tabs)/perfil',
  achievement: '/(tabs)/perfil',
  level_up: '/(tabs)/perfil',
  weekly_plan: '/(tabs)/library',
  weekly_summary: '/(tabs)/home',
  rest_day: '/(tabs)/home',
  motivational: '/(tabs)/home',
  workout_detail: '/workout-detail',
};

export async function registerForPushNotificationsAsync(userId) {
  if (Platform.OS === 'web') return null;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;

  const result = await tryIf(async () => {
    const tokenData = await Notifications.getExpoPushTokenAsync();
    const pushToken = tokenData.data;

    if (userId && pushToken) {
      await supabase
        .from('profiles')
        .update({ push_token: pushToken })
        .eq('id', userId);
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'NOVAIX Fitness',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    return pushToken;
  }, { retries: 2, baseDelay: 500 });

  return result.ok ? result.data : null;
}

export function addNotificationReceivedListener(handler) {
  return Notifications.addNotificationReceivedListener((notification) => {
    const { title, body, data } = notification.request.content;
    handler?.({ title, body, data, notification });
  });
}

export function addNotificationResponseListener(navigation) {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const { data } = response.notification.request.content;
    handleDeepLink(data, navigation);
  });
}

function handleDeepLink(data, navigation) {
  if (!navigation || !data) return;
    const type = (data as any)?.type;
  const route = ROUTE_MAP[type] || ROUTE_MAP[data?.route];
  if (!route) return;

  const params: any = {};
  if ((data as any)?.workout_id) params.id = (data as any).workout_id;
  if ((data as any)?.achievement_id) params.id = (data as any).achievement_id;

  navigation.navigate(route, Object.keys(params).length ? params : undefined);
}

export async function sendPushNotification(expoPushToken, title, body, data = {}) {
  if (!expoPushToken) return false;

  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data,
    channelId: 'default',
  };

  const result = await tryIf(async () => {
    const response = await fetch(EXPO_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    const result = await response.json();
    return result.data?.status === 'ok';
  }, { retries: 2, baseDelay: 500 });

  return result.ok ? result.data! : false;
}

export async function sendPushToUser(userId, title, body, data = {}) {
  const result = await tryIf(async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('push_token, notification_prefs')
      .eq('id', userId)
      .single();

    if (!profile?.push_token) return false;
    const prefs = profile.notification_prefs || APP_CONFIG.notifications.defaultPrefs;
    const type = (data as any)?.type;
    if (type && prefs[type] === false) return false;

    return sendPushNotification(profile.push_token, title, body, data);
  }, { retries: 1, baseDelay: 500 });

  return result.ok ? result.data! : false;
}

export async function sendBatchPushNotifications(tokens, title, body, data = {}) {
  const messages = tokens
    .filter(Boolean)
    .map((token) => ({
      to: token,
      sound: 'default',
      title,
      body,
      data,
      channelId: 'default',
    }));

  if (messages.length === 0) return;

  await tryIf(async () => {
    await fetch(EXPO_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messages),
    });
  }, { retries: 2, baseDelay: 500 });
}
