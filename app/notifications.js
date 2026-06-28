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
import { APP_CONFIG } from '../src/config/app';
import { layout, typography } from '../src/styles';
import NotificationItem from '../src/components/notifications/NotificationItem';
import { TutorialOverlay } from '../src/components';
import { useTutorial } from '../src/hooks/useTutorial';

const NOTIFICATION_TYPES = APP_CONFIG.notifications.types;

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { visible: tutorialVisible, steps: tutorialSteps, handleComplete, handleSkip } = useTutorial('notifications', true);

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
      if (__DEV__) console.error('Erro ao buscar notificacoes:', err);
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
    const route = NOTIFICATION_TYPES[notification.type]?.route;
    if (route) router.push(route);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={layout.screen}>
      <TutorialOverlay
        visible={tutorialVisible}
        steps={tutorialSteps}
        onComplete={handleComplete}
        onSkip={handleSkip}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={typography.h2}>Notificacoes</Text>
          {unreadCount > 0 && (
            <View style={styles.badge} testID="badge">
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead} style={styles.headerBtn} testID="markAllBtn">
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
          renderItem={({ item }) => (
            <NotificationItem item={item} onPress={() => handleNotificationPress(item)} onLongPress={() => deleteNotification(item.id)} />
          )}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
          testID="list"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  headerBtn: { padding: SPACING.sm },
  badge: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.sm + 2, paddingHorizontal: SPACING.sm, paddingVertical: 2 },
  badgeText: { ...typography.buttonSmall, color: COLORS.background },
  list: { padding: SPACING.md },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md },
});
