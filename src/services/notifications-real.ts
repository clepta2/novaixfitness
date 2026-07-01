// src/services/notifications-real.ts
// Servico de notificacoes reais via Supabase

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import type { Notification } from '../types';

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
  await supabase.from('notifications').update({ read: true }).eq('id', notifId);
}

export async function markAllAsRead(userId: string): Promise<void> {
  await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false);
}

export async function deleteNotification(notifId: string): Promise<void> {
  await supabase.from('notifications').delete().eq('id', notifId);
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
