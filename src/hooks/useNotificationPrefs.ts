// Hook de lógica para Notificações - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { getPrefsForSettings, setNotificationPref, getNotificationPrefs } from '../services/notifications-real';
import { registerForPushNotificationsAsync } from '../services/notifications';
import { Notification } from '../types';

interface QuietHoursOption {
  label: string;
  start: number | null;
  end: number | null;
}

interface NotifGroup {
  [key: string]: unknown;
}

interface UseNotificationPrefsReturn {
  notifications: Notification[];
  loading: boolean;
  refreshing: boolean;
  prefs: Record<string, boolean>;
  reminderTime: string;
  setReminderTime: (val: string) => void;
  pushEnabled: boolean;
  quietHours: QuietHoursOption;
  unreadCount: number;
  notifGroups: NotifGroup[];
  onRefresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
  handleNotifToggle: (key: string) => Promise<void>;
  handlePushToggle: (value: boolean) => Promise<void>;
}

const QUIET_HOURS_OPTIONS: QuietHoursOption[] = [
  { label: 'Desligado', start: null, end: null },
  { label: '22:00 - 07:00', start: 22, end: 7 },
  { label: '23:00 - 08:00', start: 23, end: 8 },
];

export function useNotificationPrefs(): UseNotificationPrefsReturn {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});
  const [reminderTime, setReminderTime] = useState<string>('19:00');
  const [pushEnabled, setPushEnabled] = useState<boolean>(true);
  const [quietHours, setQuietHours] = useState<QuietHoursOption>(QUIET_HOURS_OPTIONS[0]);

  const fetchNotifications = useCallback(async (): Promise<void> => {
    if (!user?.id) return;
    try {
      const { data } = await supabase.from('notifications').select('*')
        .eq('user_id', user.id).order('created_at', { ascending: false }).limit(50);
      setNotifications((data as Notification[]) || []);
    } catch (err) { if (__DEV__) console.error(err); }
    finally { setLoading(false); setRefreshing(false); }
  }, [user?.id]);

  const fetchSettings = useCallback(async (): Promise<void> => {
    if (!user?.id) return;
    try {
      const userPrefs = await getNotificationPrefs(user.id);
      setPrefs(userPrefs);
      const { data } = await supabase.from('profiles').select('notification_settings')
        .eq('id', user.id).single();
      if (data?.notification_settings?.reminder_time) setReminderTime(data.notification_settings.reminder_time);
      if (data?.notification_settings?.push_enabled !== undefined) setPushEnabled(data.notification_settings.push_enabled);
      if (data?.notification_settings?.quiet_hours) {
        const qh = QUIET_HOURS_OPTIONS.find(o => o.start === data.notification_settings.quiet_hours.start);
        if (qh) setQuietHours(qh);
      }
    } catch (e) { if (__DEV__) console.warn('useNotificationPrefs:', e); }
  }, [user?.id]);

  useEffect(() => { fetchNotifications(); fetchSettings(); }, [fetchNotifications, fetchSettings]);

  const onRefresh = async (): Promise<void> => { setRefreshing(true); await fetchNotifications(); };

  const markAsRead = async (id: string): Promise<void> => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = async (): Promise<void> => {
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = async (): Promise<void> => {
    await supabase.from('notifications').delete().eq('user_id', user.id);
    setNotifications([]);
  };

  const handleNotifToggle = async (key: string): Promise<void> => {
    const enabled = !prefs[key];
    setPrefs(prev => ({ ...prev, [key]: enabled }));
    await setNotificationPref(user.id, key, enabled);
  };

  const handlePushToggle = async (value: boolean): Promise<void> => {
    setPushEnabled(value);
    await supabase.from('profiles').update({ notification_settings: { push_enabled: value } }).eq('id', user.id);
    if (value) await registerForPushNotificationsAsync(user.id);
  };

  const unreadCount: number = notifications.filter(n => !n.read).length;

  return {
    notifications, loading, refreshing, prefs, reminderTime, setReminderTime,
    pushEnabled, quietHours, unreadCount, notifGroups: getPrefsForSettings(),
    onRefresh, markAsRead, markAllAsRead, clearAll,
    handleNotifToggle, handlePushToggle,
  };
}
