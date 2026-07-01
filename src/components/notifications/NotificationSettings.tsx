// src/components/notifications/NotificationSettings.js
// Componente de Configurações de Notificações - NOVAIX FITNESS

import React from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

const REMINDER_TIMES = ['07:00', '12:00', '18:00', '19:00', '20:00'];

export default function NotificationSettings({
  pushEnabled,
  handlePushToggle,
  notifGroups,
  prefs,
  handleNotifToggle,
  reminderTime,
  setReminderTime,
}) {
  return (
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
          <Switch
            value={pushEnabled}
            onValueChange={handlePushToggle}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={pushEnabled ? COLORS.background : COLORS.textMuted}
          />
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
                  <Switch
                    value={enabled}
                    onValueChange={() => handleNotifToggle(opt.key)}
                    trackColor={{ false: COLORS.border, true: COLORS.primary }}
                    thumbColor={enabled ? COLORS.background : COLORS.textMuted}
                  />
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
            <TouchableOpacity
              key={time}
              style={[styles.timeChip, reminderTime === time && styles.timeChipActive]}
              onPress={() => setReminderTime(time)}
              activeOpacity={0.7}
            >
              <Text style={[styles.timeChipText, reminderTime === time && styles.timeChipTextActive]}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  configContent: { padding: SPACING.lg, gap: SPACING.xl },
  configSection: { marginBottom: SPACING.md },
  configItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  configLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  configIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  configInfo: { flex: 1 },
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.sm },
  timeChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  timeChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  timeChipText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textMuted },
  timeChipTextActive: { color: COLORS.background, fontFamily: 'Montserrat_700Bold' },
});
