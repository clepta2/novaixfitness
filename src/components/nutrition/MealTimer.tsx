// src/components/nutrition/MealTimer.js
// Lembretes de refeições - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const MEAL_TIMES = [
  { id: 'cafe', label: 'Café da Manhã', time: '07:00', icon: 'sunny', color: COLORS.attention, hour: 7, min: 0 },
  { id: 'lanche_manha', label: 'Lanche Manhã', time: '10:00', icon: 'cafe', color: COLORS.info, hour: 10, min: 0 },
  { id: 'almoco', label: 'Almoço', time: '12:30', icon: 'restaurant', color: COLORS.primary, hour: 12, min: 30 },
  { id: 'lanche_tarde', label: 'Lanche Tarde', time: '15:30', icon: 'nutrition', color: COLORS.success, hour: 15, min: 30 },
  { id: 'jantar', label: 'Jantar', time: '19:00', icon: 'moon', color: COLORS.info, hour: 19, min: 0 },
  { id: 'ceia', label: 'Ceia', time: '21:30', icon: 'glass', color: COLORS.secondary, hour: 21, min: 30 },
];

function NotificationItem({ meal, enabled, onToggle }) {
  return (
    <TouchableOpacity style={[styles.item, enabled && styles.itemEnabled]} onPress={onToggle}>
      <View style={[styles.iconContainer, { backgroundColor: meal.color + '20' }]}>
        <Ionicons name={meal.icon} size={20} color={meal.color} />
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>{meal.label}</Text>
        <Text style={styles.time}>{meal.time}</Text>
      </View>
      <View style={[styles.toggle, enabled && styles.toggleActive]}>
        <View style={[styles.toggleDot, enabled && styles.toggleDotActive]} />
      </View>
    </TouchableOpacity>
  );
}

export default function MealTimer() {
  const [enabled, setEnabled] = useState(() => new Set(['cafe', 'almoco', 'jantar']));
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const toggleMeal = async (meal) => {
    const newEnabled = new Set(enabled);
    if (newEnabled.has(meal.id)) {
      newEnabled.delete(meal.id);
    } else {
      newEnabled.add(meal.id);
      if (hasPermission) {
        await scheduleNotification(meal);
      }
    }
    setEnabled(newEnabled);
  };

  const scheduleNotification = async (meal) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Hora de ${meal.label}! 🍽️`,
          body: 'Não esqueça de registrar sua refeição no app.',
          data: { mealId: meal.id },
        },
        trigger: {
          hour: meal.hour,
          minute: meal.min,
          repeats: true,
        } as any,
      });
    } catch (err) {
      if (__DEV__) console.error('Erro ao agendar notificação:', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="alarm" size={18} color={COLORS.primary} />
        <Text style={styles.title}>LEMBRETES DE REFEIÇÕES</Text>
      </View>

      {!hasPermission && (
        <View style={styles.permAlert}>
          <Ionicons name="notifications-off" size={16} color={COLORS.attention} />
          <Text style={styles.permText}>Ative as notificações para receber lembretes</Text>
        </View>
      )}

      <View style={styles.list}>
        {MEAL_TIMES.map(meal => (
          <NotificationItem
            key={meal.id}
            meal={meal}
            enabled={enabled.has(meal.id)}
            onToggle={() => toggleMeal(meal)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  permAlert: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.attention + '15', padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm, marginBottom: SPACING.md },
  permText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.attention, flex: 1 },
  list: { gap: SPACING.xs },
  item: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm },
  itemEnabled: { backgroundColor: COLORS.primary + '08' },
  iconContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1 },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  time: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  toggle: { width: 44, height: 24, borderRadius: 12, backgroundColor: COLORS.surfaceOverlay, justifyContent: 'center', paddingHorizontal: 3 },
  toggleActive: { backgroundColor: COLORS.primary },
  toggleDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.background },
  toggleDotActive: { alignSelf: 'flex-end' },
});
