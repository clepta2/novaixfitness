// src/services/notifications-real.ts
// Servico de notificacoes reais via Supabase

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { APP_CONFIG } from '../config/app';
import type { Notification } from '../types';

const { defaultPrefs, types } = APP_CONFIG.notifications;

type NotificationRow = Notification;

export async function getNotifications(userId: string, limit = 30): Promise<NotificationRow[]> {
  const { data } = await supabase
    .from(TABLES.NOTIFICATIONS)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data || []) as NotificationRow[];
}

export async function markAsRead(notifId: string): Promise<void> {
  await supabase.from(TABLES.NOTIFICATIONS).update({ read: true }).eq('id', notifId);
}

export async function markAllAsRead(userId: string): Promise<void> {
  await supabase.from(TABLES.NOTIFICATIONS).update({ read: true }).eq('user_id', userId).eq('read', false);
}

export async function deleteNotification(notifId: string): Promise<void> {
  await supabase.from(TABLES.NOTIFICATIONS).delete().eq('id', notifId);
}

export async function getUnreadCount(userId: string): Promise<number> {
  const { count } = await supabase
    .from(TABLES.NOTIFICATIONS)
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false);
  return count || 0;
}

const NOTIF_ICON_MAP: Record<string, { icon: string; color: string }> = {
  like: { icon: 'heart', color: '#F02849' },
  comment: { icon: 'chatbubble', color: '#4A90D9' },
  new_follower: { icon: 'person-add', color: '#CCFF00' },
  achievement_unlocked: { icon: 'trophy', color: '#F7B928' },
  workout_reminder: { icon: 'flame', color: '#F02849' },
  live_started: { icon: 'videocam', color: '#E74C3C' },
  system: { icon: 'notifications', color: '#7F8C8D' },
};

export function getNotifDisplay(type: string): { icon: string; color: string } {
  return NOTIF_ICON_MAP[type] || { icon: 'notifications-outline', color: '#7F8C8D' };
}

// --- Notification preferences (merged from notificationPrefs.js) ---

export async function getNotificationPrefs(userId: string): Promise<Record<string, boolean>> {
  if (!userId) return defaultPrefs;
  try {
    const { data } = await supabase.from('profiles').select('notification_prefs').eq('id', userId).single();
    return { ...defaultPrefs, ...(data?.notification_prefs || {}) };
  } catch {
    return defaultPrefs;
  }
}

export async function setNotificationPref(userId: string, type: string, enabled: boolean): Promise<Record<string, boolean> | undefined> {
  if (!userId) return;
  try {
    const current = await getNotificationPrefs(userId);
    const updated = { ...current, [type]: enabled };
    await supabase.from('profiles').update({ notification_prefs: updated }).eq('id', userId);
    return updated;
  } catch (err) {
    console.error('Erro ao salvar preferencia:', err);
  }
}

export async function isNotificationEnabled(userId: string, type: string): Promise<boolean> {
  if (!userId) return true;
  const prefs = await getNotificationPrefs(userId);
  return prefs[type] !== false;
}

export function getNotificationGroups(): Record<string, Array<{ key: string } & Record<string, unknown>>> {
  const groups: Record<string, Array<{ key: string } & Record<string, unknown>>> = {};
  for (const [key, config] of Object.entries(types)) {
    if (!(config as Record<string, unknown>).label) continue;
    const group = (config as Record<string, unknown>).group || 'outros';
    if (!groups[group]) groups[group] = [];
    groups[group].push({ key, ...(config as Record<string, unknown>) });
  }
  return groups;
}

export function getPrefsForSettings(): Array<{ title: string; items: Array<{ key: string; icon: string; label: string; desc: string; color: string }> }> {
  const groups = getNotificationGroups();
  return Object.entries(groups).map(([group, items]) => ({
    title: group.toUpperCase(),
    items: items.map(item => ({
      key: item.key,
      icon: (item.icon as string) + '-outline',
      label: item.label as string,
      desc: item.desc as string,
      color: item.color as string,
    })),
  }));
}
