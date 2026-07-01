// src/hooks/useRealNotifications.ts
// Hook com notificacoes reais + realtime

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../config/supabase';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, getUnreadCount } from '../services/notifications-real';
import { useAuth } from '../context/AuthContext';
import type { Notification } from '../types';

const ICON_MAP: Record<string, { icon: string; color: string }> = {
  like: { icon: 'heart', color: '#F02849' },
  comment: { icon: 'chatbubble', color: '#4A90D9' },
  new_follower: { icon: 'person-add', color: '#CCFF00' },
  achievement_unlocked: { icon: 'trophy', color: '#F7B928' },
  workout_reminder: { icon: 'flame', color: '#F02849' },
  live_started: { icon: 'videocam', color: '#E74C3C' },
  system: { icon: 'notifications', color: '#7F8C8D' },
};

export interface NotificationItem extends Notification {
  icon: string;
  color: string;
  timeAgo: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Agora';
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function mapNotification(n: Notification): NotificationItem {
  const { icon, color } = ICON_MAP[n.type] || { icon: 'notifications-outline', color: '#7F8C8D' };
  return { ...n, icon, color, timeAgo: timeAgo(n.created_at) };
}

export function useRealNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const callbacksRef = useRef({ onInsert: null as ((n: NotificationItem) => void) | null });

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const [data, count] = await Promise.all([
      getNotifications(user.id),
      getUnreadCount(user.id),
    ]);
    setNotifications(data.map(mapNotification));
    setUnreadCount(count);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, async (payload) => {
        const item = mapNotification(payload.new as Notification);
        setNotifications(prev => [item, ...prev]);
        setUnreadCount(prev => prev + 1);
        callbacksRef.current.onInsert?.(item);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
        const updated = payload.new as Notification;
        setNotifications(prev => prev.map(n => n.id === updated.id ? mapNotification(updated) : n));
        if (updated.read) setUnreadCount(prev => Math.max(0, prev - 1));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
        const deleted = payload.old as Notification;
        setNotifications(prev => prev.filter(n => n.id !== deleted.id));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  const markRead = useCallback(async (id: string) => {
    await markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllRead = useCallback(async () => {
    if (!user?.id) return;
    await markAllAsRead(user.id);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [user?.id]);

  const remove = useCallback(async (id: string) => {
    await deleteNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return { notifications, unreadCount, loading, markRead, markAllRead, remove, refresh: load };
}
