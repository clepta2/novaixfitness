// src/services/notifications/notifications-real.ts
// Notificações reais via Supabase — com error handling

import { supabase } from '../../config/supabase';
import { TABLES } from '../../config/tables';
import { tryIf } from '../../utils/tryIf';
import type { Notification } from '../../types';

type NotificationRow = Notification;

export async function getNotifications(userId: string, limit = 30): Promise<NotificationRow[]> {
  const result = await tryIf(async () => {
    const { data, error } = await supabase
      .from(TABLES.NOTIFICATIONS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []) as NotificationRow[];
  }, { retries: 1, baseDelay: 500 });
  return result.ok ? (result.data as NotificationRow[]) : [];
}

export async function markAsRead(notifId: string): Promise<void> {
  await tryIf(async () => {
    const { error } = await supabase.from(TABLES.NOTIFICATIONS).update({ read: true }).eq('id', notifId);
    if (error) throw error;
  }, { retries: 1, baseDelay: 500 });
}

export async function markAllAsRead(userId: string): Promise<void> {
  await tryIf(async () => {
    const { error } = await supabase.from(TABLES.NOTIFICATIONS).update({ read: true }).eq('user_id', userId).eq('read', false);
    if (error) throw error;
  }, { retries: 1, baseDelay: 500 });
}

export async function deleteNotification(notifId: string): Promise<void> {
  await tryIf(async () => {
    const { error } = await supabase.from(TABLES.NOTIFICATIONS).delete().eq('id', notifId);
    if (error) throw error;
  }, { retries: 1, baseDelay: 500 });
}

export async function getUnreadCount(userId: string): Promise<number> {
  const result = await tryIf(async () => {
    const { count, error } = await supabase
      .from(TABLES.NOTIFICATIONS)
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);
    if (error) throw error;
    return count || 0;
  }, { retries: 1, baseDelay: 500 });
  return result.ok ? (result.data as number) : 0;
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
