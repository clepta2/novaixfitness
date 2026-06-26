// app/notifications.js
// Centro de Notificacoes - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';
import { layout, typography } from '../src/styles';

const NOTIFICATION_ICONS = {
  workout_reminder: { icon: 'alarm', color: '#FFD600' },
  workout_completed: { icon: 'checkmark-circle', color: '#00E676' },
  streak: { icon: 'flame', color: '#FF6B35' },
  achievement: { icon: 'trophy', color: '#FFD600' },
  level_up: { icon: 'trending-up', color: '#CCFF00' },
  weekly_plan: { icon: 'calendar', color: '#00E676' },
  new_workout: { icon: 'barbell', color: '#CCFF00' },
  weekly_summary: { icon: 'stats-chart', color: '#00E676' },
  motivational: { icon: 'bulb', color: '#FFD600' },
  rest_day: { icon: 'bed', color: '#94A3B8' },
  system: { icon: 'information-circle', color: '#94A3B8' },
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      setNotifications(data || []);
    } catch (err) {
      console.error('Erro ao buscar notificacoes:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
  };

  const markAsRead = async (id) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = async () => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = async (id) => {
    await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = async () => {
    await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user.id);

    setNotifications([]);
  };

  const handleNotificationPress = (notification) => {
    markAsRead(notification.id);

    switch (notification.type) {
      case 'workout_reminder':
      case 'workout_completed':
      case 'new_workout':
        router.push('/(tabs)/home');
        break;
      case 'achievement':
      case 'level_up':
      case 'streak':
        router.push('/(tabs)/perfil');
        break;
      case 'weekly_plan':
        router.push('/(tabs)/library');
        break;
      default:
        break;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };

  const renderNotification = ({ item }) => {
    const iconData = NOTIFICATION_ICONS[item.type] || NOTIFICATION_ICONS.system;

    return (
      <TouchableOpacity
        style={[styles.notifItem, !item.read && styles.notifUnread]}
        onPress={() => handleNotificationPress(item)}
        onLongPress={() => deleteNotification(item.id)}
      >
        <View style={[styles.notifIcon, { backgroundColor: iconData.color + '20' }]}>
          <Ionicons name={iconData.icon} size={20} color={iconData.color} />
        </View>
        <View style={styles.notifContent}>
          <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
          <Text style={styles.notifTime}>{formatTime(item.created_at)}</Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={layout.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={typography.h2}>Notificacoes</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead} style={styles.headerBtn}>
              <Ionicons name="checkmark-done" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          )}
          {notifications.length > 0 && (
            <TouchableOpacity onPress={clearAll} style={styles.headerBtn}>
              <Ionicons name="trash-outline" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {notifications.length === 0 && !loading ? (
        <View style={styles.empty}>
          <Ionicons name="notifications-off-outline" size={48} color={COLORS.textMuted} />
          <Text style={typography.h5}>Nenhuma notificacao</Text>
          <Text style={typography.bodyMuted}>Suas notificacoes aparecerão aqui</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  headerBtn: { padding: SPACING.sm },
  badge: { backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.background },
  list: { padding: SPACING.md },
  notifItem: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  notifUnread: { borderColor: COLORS.primary + '40', backgroundColor: COLORS.primary + '05' },
  notifIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  notifContent: { flex: 1 },
  notifTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle, marginBottom: 2 },
  notifTitleUnread: { color: COLORS.primary },
  notifBody: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  notifTime: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginLeft: SPACING.sm, marginTop: SPACING.sm },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md },
});
