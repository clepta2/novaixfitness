// app/settings/notifications.js
// Configurações de notificações

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import { SPACING } from '../../src/constants/spacing';
import { useAuth } from '../../src/context/AuthContext';
import { getNotificationPrefs, setNotificationPref, getPrefsForSettings } from '../../src/services/notificationPrefs';
import { ErrorBoundary } from '../../src/components';

export default function NotificationsSettingsScreen() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState({});
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (user?.id) {
      getNotificationPrefs(user.id).then(setPrefs);
      setGroups(getPrefsForSettings());
    }
  }, [user?.id]);

  const togglePref = async (key) => {
    const newValue = !prefs[key];
    setPrefs(prev => ({ ...prev, [key]: newValue }));
    await setNotificationPref(user.id, key, newValue);
  };

  return (
    <ErrorBoundary screenName="NotificationsSettings">
      <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>NOTIFICAÇÕES</Text>
        <Text style={styles.subtitle}>Escolha quais notificações deseja receber</Text>

        {groups.map((group) => (
          <View key={group.title}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            {group.items.map((item) => (
              <View key={item.key} style={styles.optionRow}>
                <View style={styles.optionIcon}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionLabel}>{item.label}</Text>
                  <Text style={styles.optionDesc}>{item.desc}</Text>
                </View>
                <Switch
                  value={prefs[item.key] !== false}
                  onValueChange={() => togglePref(item.key)}
                  trackColor={{ false: COLORS.surface, true: COLORS.primary + '50' }}
                  thumbColor={prefs[item.key] !== false ? COLORS.primary : COLORS.textMuted}
                />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 22, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  groupTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  optionIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  optionInfo: { flex: 1 },
  optionLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },
  optionDesc: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
});
