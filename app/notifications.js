import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';
import { APP_CONFIG } from '../src/config/app';
import { layout, typography } from '../src/styles';
import NotificationItem from '../src/components/notifications/NotificationItem';
import { getPrefsForSettings, setNotificationPref, getNotificationPrefs } from '../src/services/notificationPrefs';
import { scheduleWorkoutReminder } from '../src/services/notifications';
import { registerForPushNotificationsAsync } from '../src/services/pushNotifications';
import { TutorialOverlay, ErrorBoundary } from '../src/components';
import { useTutorial } from '../src/hooks/useTutorial';

const NOTIFICATION_TYPES = APP_CONFIG.notifications.types;
const REMINDER_TIMES = ['07:00', '12:00', '18:00', '19:00', '20:00'];
const QUIET_HOURS_OPTIONS = [
  { label: 'Desligado', start: null, end: null },
  { label: '22:00 - 07:00', start: 22, end: 7 },
  { label: '23:00 - 08:00', start: 23, end: 8 },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('list');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [prefs, setPrefs] = useState({});
  const [reminderTime, setReminderTime] = useState('19:00');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [quietHours, setQuietHours] = useState(QUIET_HOURS_OPTIONS[0]);
  const { visible: tutorialVisible, steps: tutorialSteps, handleComplete, handleSkip } = useTutorial('notifications', true);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50);
      setNotifications(data || []);
    } catch (err) { if (__DEV__) console.error(err); }
    finally { setLoading(false); setRefreshing(false); }
  }, [user?.id]);

  const fetchSettings = useCallback(async () => {
    if (!user?.id) return;
    try {
      const userPrefs = await getNotificationPrefs(user.id);
      setPrefs(userPrefs);
      const { data } = await supabase.from('profiles').select('notification_settings').eq('id', user.id).single();
      if (data?.notification_settings?.reminder_time) setReminderTime(data.notification_settings.reminder_time);
      if (data?.notification_settings?.push_enabled !== undefined) setPushEnabled(data.notification_settings.push_enabled);
      if (data?.notification_settings?.quiet_hours) {
        const qh = QUIET_HOURS_OPTIONS.find(o => o.start === data.notification_settings.quiet_hours.start);
        if (qh) setQuietHours(qh);
      }
    } catch {}
  }, [user?.id]);

  useEffect(() => { fetchNotifications(); fetchSettings(); }, [fetchNotifications, fetchSettings]);

  const onRefresh = async () => { setRefreshing(true); await fetchNotifications(); };

  const markAsRead = async (id) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = async () => {
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = async () => {
    await supabase.from('notifications').delete().eq('user_id', user.id);
    setNotifications([]);
  };

  const handleNotifToggle = async (key) => {
    const enabled = !prefs[key];
    setPrefs(prev => ({ ...prev, [key]: enabled }));
    await setNotificationPref(user.id, key, enabled);
  };

  const handlePushToggle = async (value) => {
    setPushEnabled(value);
    await supabase.from('profiles').update({ notification_settings: { push_enabled: value } }).eq('id', user.id);
    if (value) await registerForPushNotificationsAsync(user.id);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const notifGroups = getPrefsForSettings();

  const TABS = [
    { key: 'list', label: 'Lista', icon: 'list' },
    { key: 'config', label: 'Config', icon: 'settings' },
  ];

  return (
    <ErrorBoundary screenName="Notifications">
    <View style={layout.screen}>
      <TutorialOverlay visible={tutorialVisible} steps={tutorialSteps} onComplete={handleComplete} onSkip={handleSkip} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={typography.h2}>Notificações</Text>
          {unreadCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{unreadCount}</Text></View>}
        </View>
        <View style={styles.headerActions}>
          {activeTab === 'list' && unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead} style={styles.headerBtn}>
              <Ionicons name="checkmark-done" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          )}
          {activeTab === 'list' && notifications.length > 0 && (
            <TouchableOpacity onPress={clearAll} style={styles.headerBtn}>
              <Ionicons name="trash-outline" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab.key} style={[styles.tab, activeTab === tab.key && styles.tabActive]} onPress={() => setActiveTab(tab.key)}>
            <Ionicons name={tab.icon} size={16} color={activeTab === tab.key ? COLORS.primary : COLORS.textMuted} />
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'list' ? (
        notifications.length === 0 && !loading ? (
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={48} color={COLORS.textMuted} />
            <Text style={typography.h5}>Nenhuma notificação</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NotificationItem item={item} onPress={() => { markAsRead(item.id); const route = NOTIFICATION_TYPES[item.type]?.route; if (route) router.push(route); }} />
            )}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        )
      ) : (
        <ScrollView contentContainerStyle={styles.configContent} showsVerticalScrollIndicator={false}>
          <View style={styles.configSection}>
            <Text style={typography.label}>PUSH</Text>
            <View style={styles.configItem}>
              <View style={styles.configLeft}>
                <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
                <View style={styles.configInfo}>
                  <Text style={typography.h5}>Notificações push</Text>
                  <Text style={typography.caption}>Receba avisos com o app fechado</Text>
                </View>
              </View>
              <Switch value={pushEnabled} onValueChange={handlePushToggle} trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor={pushEnabled ? COLORS.background : COLORS.textMuted} />
            </View>
          </View>

          <View style={styles.configSection}>
            <Text style={typography.label}>TIPOS</Text>
            {notifGroups.map((group) => (
              <View key={group.title}>
                <Text style={[typography.caption, { marginBottom: SPACING.xs, marginTop: SPACING.md }]}>{group.title}</Text>
                {group.items.map((opt) => {
                  const enabled = prefs[opt.key] !== false;
                  return (
                    <View key={opt.key} style={styles.configItem}>
                      <View style={styles.configLeft}>
                        <View style={[styles.configIcon, { backgroundColor: opt.color + '15' }]}>
                          <Ionicons name={opt.icon} size={18} color={opt.color} />
                        </View>
                        <View style={styles.configInfo}>
                          <Text style={typography.h5}>{opt.label}</Text>
                          <Text style={typography.caption}>{opt.desc}</Text>
                        </View>
                      </View>
                      <Switch value={enabled} onValueChange={() => handleNotifToggle(opt.key)} trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor={enabled ? COLORS.background : COLORS.textMuted} />
                    </View>
                  );
                })}
              </View>
            ))}
          </View>

          <View style={styles.configSection}>
            <Text style={typography.label}>HORÁRIO DO LEMBRETE</Text>
            <View style={styles.timeRow}>
              {REMINDER_TIMES.map((time) => (
                <TouchableOpacity key={time} style={[styles.timeChip, reminderTime === time && styles.timeChipActive]} onPress={() => setReminderTime(time)}>
                  <Text style={[styles.timeChipText, reminderTime === time && styles.timeChipTextActive]}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  headerActions: { flexDirection: 'row', gap: SPACING.sm },
  headerBtn: { padding: SPACING.sm },
  badge: { backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: SPACING.sm, paddingVertical: 2 },
  badgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.background },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, paddingVertical: SPACING.md },
  tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  tabText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primary },
  list: { padding: SPACING.md },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md },
  configContent: { padding: SPACING.xl },
  configSection: { marginBottom: SPACING.xl },
  configItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.xs, borderWidth: 1, borderColor: COLORS.border },
  configLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  configIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  configInfo: { flex: 1 },
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  timeChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border },
  timeChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  timeChipText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted },
  timeChipTextActive: { color: COLORS.background },
});
