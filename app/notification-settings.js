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
import { layout, typography } from '../src/styles';

const REMINDER_TIMES = ['07:00', '12:00', '18:00', '19:00', '20:00'];

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [prefs, setPrefs] = useState({});
  const [reminderTime, setReminderTime] = useState('19:00');
  const [notifGroups, setNotifGroups] = useState(() => getPrefsForSettings());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      if (!user?.id) return;
      try {
        const userPrefs = await getNotificationPrefs(user.id);
        setPrefs(userPrefs);
        setNotifGroups(getPrefsForSettings());
        const { data } = await supabase.from('profiles').select('notification_settings').eq('id', user.id).single();
        if (data?.notification_settings?.reminder_time) setReminderTime(data.notification_settings.reminder_time);
      } catch (err) {
        if (__DEV__) console.error('Erro ao carregar configuracoes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [user?.id]);

  const handleToggle = async (key) => {
    const enabled = !prefs[key];
    setPrefs(prev => ({ ...prev, [key]: enabled }));
    await setNotificationPref(user.id, key, enabled);
  };

  const handleTimeChange = async (time) => {
    setReminderTime(time);
    const settings = { reminder_time: time };
    await supabase.from('profiles').update({ notification_settings: settings }).eq('id', user.id);
    if (prefs.workout_reminder) await scheduleWorkoutReminder(...time.split(':').map(Number));
  };

  const handleClearAll = async () => {
    await clearAllNotifications();
    Alert.alert('Limpo', 'Todas as notificacoes agendadas foram removidas.');
  };

  const notificationOptions = [
    { key: 'workout_reminder', icon: 'alarm-outline', title: 'Lembrete de treino', desc: 'Receba lembrete diario para treinar' },
    { key: 'weekly_plan', icon: 'calendar-outline', title: 'Plano semanal', desc: 'Notificacao quando novos treinos estiverem disponiveis' },
    { key: 'achievements', icon: 'trophy-outline', title: 'Conquistas', desc: 'Avise quando desbloquear uma conquista' },
    { key: 'streak', icon: 'flame-outline', title: 'Streak', desc: 'Celebre quando manter streak de dias' },
    { key: 'rest_day', icon: 'bed-outline', title: 'Dia de descanso', desc: 'Lembrete para descansar e recuperar' },
    { key: 'motivational', icon: 'bulb-outline', title: 'Motivacao', desc: 'Dicas motivacionais semanais' },
  ];

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
          <Text style={typography.label}>TIPOS DE NOTIFICACAO</Text>
          {notifGroups.map((group) => (
            <View key={group.title}>
              <Text style={[typography.caption, { marginBottom: SPACING.xs, marginTop: SPACING.md }]}>{group.title}</Text>
              {group.items.map((opt) => (
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
                  <Switch
                    value={prefs[opt.key] !== false}
                    onValueChange={() => handleToggle(opt.key)}
                    trackColor={{ false: COLORS.border, true: COLORS.primary }}
                    thumbColor={prefs[opt.key] !== false ? COLORS.background : COLORS.textMuted}
                  />
                </View>
              ))}
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
  reminderStatus: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: 8, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  clearBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.error + '10', borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.error + '30' },
});
