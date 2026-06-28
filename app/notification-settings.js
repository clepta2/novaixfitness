// app/notification-settings.js
// Configuracoes de notificacoes - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';
import { scheduleWorkoutReminder, clearAllNotifications } from '../src/services/notifications';
import { getPrefsForSettings, setNotificationPref, getNotificationPrefs } from '../src/services/notificationPrefs';
import { registerForPushNotificationsAsync } from '../src/services/pushNotifications';
import { layout, typography } from '../src/styles';

const REMINDER_TIMES = ['07:00', '12:00', '18:00', '19:00', '20:00'];
const QUIET_HOURS_OPTIONS = [
  { label: 'Desligado', start: null, end: null },
  { label: '22:00 - 07:00', start: 22, end: 7 },
  { label: '23:00 - 08:00', start: 23, end: 8 },
  { label: '00:00 - 06:00', start: 0, end: 6 },
];

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [prefs, setPrefs] = useState({});
  const [reminderTime, setReminderTime] = useState('19:00');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [quietHours, setQuietHours] = useState(QUIET_HOURS_OPTIONS[0]);
  const [notifGroups, setNotifGroups] = useState(() => getPrefsForSettings());

  useEffect(() => {
    async function loadSettings() {
      if (!user?.id) return;
      try {
        const userPrefs = await getNotificationPrefs(user.id);
        setPrefs(userPrefs);
        setNotifGroups(getPrefsForSettings());
        const { data } = await supabase.from('profiles').select('notification_settings').eq('id', user.id).single();
        if (data?.notification_settings?.reminder_time) setReminderTime(data.notification_settings.reminder_time);
        if (data?.notification_settings?.push_enabled !== undefined) setPushEnabled(data.notification_settings.push_enabled);
        if (data?.notification_settings?.quiet_hours) {
          const qh = QUIET_HOURS_OPTIONS.find(o => o.start === data.notification_settings.quiet_hours.start);
          if (qh) setQuietHours(qh);
        }
      } catch (err) {
        if (__DEV__) console.error('Erro ao carregar configuracoes:', err);
      }
    }
    loadSettings();
  }, [user?.id]);

  const handleToggle = async (key) => {
    const enabled = !prefs[key];
    setPrefs(prev => ({ ...prev, [key]: enabled }));
    await setNotificationPref(user.id, key, enabled);
  };

  const saveSettings = async (overrides = {}) => {
    const settings = { reminder_time: reminderTime, push_enabled: pushEnabled, quiet_hours: quietHours.start !== null ? quietHours : null, ...overrides };
    await supabase.from('profiles').update({ notification_settings: settings }).eq('id', user.id);
  };

  const handleTimeChange = async (time) => {
    setReminderTime(time);
    await saveSettings({ reminder_time: time });
    if (prefs.workout_reminder) await scheduleWorkoutReminder(...time.split(':').map(Number));
  };

  const handleClearAll = async () => {
    await clearAllNotifications();
    Alert.alert('Limpo', 'Todas as notificacoes agendadas foram removidas.');
  };

  const handlePushToggle = async (value) => {
    setPushEnabled(value);
    await saveSettings({ push_enabled: value });
    if (value) await registerForPushNotificationsAsync(user.id);
  };

  const handleQuietHoursChange = async (option) => {
    setQuietHours(option);
    await saveSettings({ quiet_hours: option.start !== null ? option : null });
  };

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>Notificacoes</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.section}>
          <Text style={typography.label}>PUSH NOTIFICATIONS</Text>
          <View style={styles.optionItem}>
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: COLORS.primary + '15' }]}>
                <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={typography.h5}>Notificacoes push</Text>
                <Text style={typography.caption}>Receba avisos mesmo com o app fechado</Text>
              </View>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={handlePushToggle}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={pushEnabled ? COLORS.background : COLORS.textMuted}
            />
          </View>
        </View>

        {pushEnabled && (
          <View style={styles.section}>
            <Text style={typography.label}>HORARIO SILENCIOSO</Text>
            <View style={styles.timeOptions}>
              {QUIET_HOURS_OPTIONS.map((option) => {
                const active = quietHours.label === option.label;
                return (
                  <TouchableOpacity key={option.label} style={[styles.timeOption, active && styles.timeOptionActive]} onPress={() => handleQuietHoursChange(option)}>
                    <Text style={[typography.bodySmall, active && styles.timeTextActive]}>{option.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={typography.label}>TIPOS DE NOTIFICACAO</Text>
          {notifGroups.map((group) => (
            <View key={group.title}>
              <Text style={[typography.caption, { marginBottom: SPACING.xs, marginTop: SPACING.md }]}>{group.title}</Text>
              {group.items.map((opt) => {
                const enabled = prefs[opt.key] !== false;
                return (
                  <View key={opt.key} style={styles.optionItem}>
                    <View style={styles.optionLeft}>
                      <View style={[styles.optionIcon, { backgroundColor: opt.color + '15' }]}>
                        <Ionicons name={opt.icon} size={20} color={opt.color} />
                      </View>
                      <View style={styles.optionInfo}>
                        <Text style={typography.h5}>{opt.label}</Text>
                        <Text style={typography.caption}>{opt.desc}</Text>
                      </View>
                    </View>
                    <Switch value={enabled} onValueChange={() => handleToggle(opt.key)} trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor={enabled ? COLORS.background : COLORS.textMuted} />
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={typography.label}>HORARIO DO LEMBRETE</Text>
          <View style={styles.timeOptions}>
            {REMINDER_TIMES.map((time) => (
              <TouchableOpacity
                key={time}
                style={[styles.timeOption, reminderTime === time && styles.timeOptionActive]}
                onPress={() => handleTimeChange(time)}
              >
                <Text style={[typography.bodySmall, reminderTime === time && styles.timeTextActive]}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
          <Ionicons name="trash-outline" size={18} color={COLORS.error} />
          <Text style={[typography.h5, { color: COLORS.error }]}>Limpar notificacoes agendadas</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
  section: { marginBottom: SPACING.xl },
  optionItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  optionIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center' },
  optionInfo: { flex: 1 },
  timeOptions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  timeOption: { flex: 1, paddingVertical: SPACING.md, backgroundColor: COLORS.surface, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  timeOptionActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  timeTextActive: typography.chipActive,
  clearBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.error + '10', borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.error + '30' },
});
