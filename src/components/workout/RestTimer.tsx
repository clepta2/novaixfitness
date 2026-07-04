// src/components/workout/RestTimer.tsx
// Timer de descanso - NOVAIX FITNESS

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import RestRing from './RestRing';
import NextExercisePreview from './NextExercisePreview';

interface QuickTime {
  seconds: number;
  label: string;
  icon: string;
}

const QUICK_TIMES: QuickTime[] = [
  { seconds: 15, label: '15s', icon: 'flash' },
  { seconds: 30, label: '30s', icon: 'time' },
  { seconds: 60, label: '1m', icon: 'time' },
  { seconds: 90, label: '1.5m', icon: 'time' },
  { seconds: 120, label: '2m', icon: 'time' },
];

interface RestTimerProps {
  timeRemaining: number;
  totalTime: number;
  nextExercise?: Record<string, unknown>;
  currentSet?: number;
  totalSets?: number;
  onSkip?: () => void;
  onAddTime?: () => void;
  onSubtractTime?: () => void;
  onChangeTime?: (seconds: number) => void;
}

export default function RestTimer({ timeRemaining, totalTime, nextExercise, currentSet, totalSets, onSkip, onAddTime, onSubtractTime, onChangeTime }: RestTimerProps): React.ReactElement {
  const [showQuick, setShowQuick] = useState<boolean>(false);
  const isUrgent = timeRemaining <= 5;
  const timerColor = isUrgent ? COLORS.error : COLORS.success;
  const progress = totalTime > 0 ? (totalTime - timeRemaining) / totalTime : 0;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    if (isUrgent) {
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
      try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    }
    if (timeRemaining === 0) {
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    }
  }, [timeRemaining, isUrgent]);

  const restMinutes = Math.floor(totalTime / 60);
  const restSeconds = totalTime % 60;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Ionicons name="moon" size={18} color={COLORS.success} />
        <Text style={styles.headerTitle}>DESCANSO</Text>
      </View>

      <RestRing timeRemaining={timeRemaining} totalTime={totalTime} pulseAnim={pulseAnim} />

      <View style={styles.timeControls}>
        <TouchableOpacity style={styles.timeBtn} onPress={onSubtractTime} accessibilityLabel="Subtrair 15 segundos" accessibilityRole="button">
          <Ionicons name="remove-circle" size={24} color={COLORS.textMuted} />
          <Text style={styles.timeBtnText}>-15s</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickToggle} onPress={() => setShowQuick(!showQuick)} accessibilityLabel="Mostrar tempos rápidos" accessibilityRole="button">
          <Ionicons name="timer" size={16} color={COLORS.primary} />
          <Text style={styles.quickToggleText}>Tempo Rápido</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.timeBtn} onPress={onAddTime} accessibilityLabel="Adicionar 15 segundos" accessibilityRole="button">
          <Ionicons name="add-circle" size={24} color={COLORS.primary} />
          <Text style={[styles.timeBtnText, { color: COLORS.primary }]}>+15s</Text>
        </TouchableOpacity>
      </View>

      {showQuick && (
        <View style={styles.quickRow}>
          {QUICK_TIMES.map(t => (
            <TouchableOpacity key={t.seconds} style={styles.quickBtn} onPress={() => onChangeTime?.(t.seconds)} accessibilityLabel={`Definir tempo para ${t.label}`} accessibilityRole="button">
              <Ionicons name={t.icon as any} size={14} color={COLORS.primary} />
              <Text style={styles.quickBtnText}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <NextExercisePreview exercise={nextExercise as any} currentSet={currentSet} totalSets={totalSets} />

      <TouchableOpacity style={styles.skipBtn} onPress={onSkip} accessibilityLabel="Iniciar agora" accessibilityRole="button">
        <Ionicons name="play-skip-forward" size={18} color={COLORS.background} />
        <Text style={styles.skipText}>INICIAR AGORA</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.success + '30' } as ViewStyle,
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md } as ViewStyle,
  headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.success, letterSpacing: 1 } as TextStyle,
  timeControls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md } as ViewStyle,
  timeBtn: { alignItems: 'center', gap: 2 } as ViewStyle,
  timeBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted } as TextStyle,
  quickToggle: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.primary + '15', borderRadius: BORDER_RADIUS.sm } as ViewStyle,
  quickToggleText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary } as TextStyle,
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md } as ViewStyle,
  quickBtn: { alignItems: 'center', gap: 2, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border } as ViewStyle,
  quickBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted } as TextStyle,
  skipBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md } as ViewStyle,
  skipText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.background, letterSpacing: 0.5 } as TextStyle,
});
