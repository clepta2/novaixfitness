// src/components/workout/SmartRestTimer.tsx
// Timer de descanso inteligente com deteccao automatica - NOVAIX FITNESS

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../../constants/colors';
import SpaceBetween from '../ui/SpaceBetween';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing'
import { useColors } from '../../context/ThemeContext';

const CIRCLE_SIZE = 180;
const CIRCLE_STROKE = 8;
const CIRCLE_RADIUS = (CIRCLE_SIZE - CIRCLE_STROKE) / 2;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const REST_PRESETS: Record<string, number> = {
  compound: 120,
  isolation: 60,
  cardio: 30,
  heavy: 180,
  default: 90,
};

function getRestTime(exerciseType?: string): number {
  const type = (exerciseType || '').toLowerCase();
  if (type.includes('agachamento') || type.includes('deadlift') || type.includes('terra')) return REST_PRESETS.heavy;
  if (type.includes('supino') || type.includes('barra') || type.includes('leg press')) return REST_PRESETS.compound;
  if (type.includes('curl') || type.includes('extensao') || type.includes('fly')) return REST_PRESETS.isolation;
  return REST_PRESETS.default;
}

interface SmartRestTimerProps {
  isResting: boolean;
  totalTime: number;
  exerciseType?: string;
  nextExercise?: { name?: string; sets?: number; reps?: number; muscle?: string };
  restHistory?: number[];
  onSkip: () => void;
  onAddTime: () => void;
  onSubtractTime: () => void;
}

export default function SmartRestTimer({
  isResting, totalTime, exerciseType, nextExercise, restHistory = [], onSkip, onAddTime, onSubtractTime,
}: SmartRestTimerProps): React.ReactElement | null {
  const colors = useColors();
  const styles = useMemo(() => StyleSheet.create({
    container: { backgroundColor: colors.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: colors.success + '30', alignItems: 'center' } as ViewStyle,
    header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md } as ViewStyle,
    headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: colors.success, letterSpacing: 2 } as TextStyle,
    timerWrap: { position: 'relative', width: CIRCLE_SIZE, height: CIRCLE_SIZE, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md } as ViewStyle,
    timerOverlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' } as ViewStyle,
    timerText: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 42, letterSpacing: 2 } as TextStyle,
    progressLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: colors.textMuted, marginTop: 4 } as TextStyle,
    infoRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md } as ViewStyle,
    infoChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: colors.surfaceOverlay, borderRadius: BORDER_RADIUS.sm } as ViewStyle,
    infoText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.textDescription } as TextStyle,
    controls: { flexDirection: 'row', gap: SPACING.xl, marginBottom: SPACING.md } as ViewStyle,
    ctrlBtn: { alignItems: 'center', gap: 2 } as ViewStyle,
    ctrlText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: colors.textMuted } as TextStyle,
    nextCard: { alignItems: 'center', backgroundColor: colors.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: colors.border, width: '100%' } as ViewStyle,
    nextLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: colors.primary, letterSpacing: 1, marginTop: 4 } as TextStyle,
    nextName: { fontFamily: 'Montserrat_700Bold', fontSize: 15, color: colors.textTitle, marginTop: 4 } as TextStyle,
    nextMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.textDescription, marginTop: 2 } as TextStyle,
    skipBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: colors.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, width: '100%' } as ViewStyle,
    skipText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: colors.background, letterSpacing: 0.5 } as TextStyle,
  }), [colors]);
  const [elapsed, setElapsed] = useState(0);
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [pulseAnim] = useState(() => new Animated.Value(1));
  const prevTimeRef = useRef(totalTime);

  const timeRemaining = Math.max(0, totalTime - elapsed);
  const progress = totalTime > 0 ? elapsed / totalTime : 0;
  const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - Math.min(progress, 1));
  const isUrgent = timeRemaining <= 5;
  const timerColor = isUrgent ? colors.error : colors.success;

  const avgRest = restHistory.length > 0
    ? Math.round(restHistory.reduce((a, b) => a + b, 0) / restHistory.length)
    : getRestTime(exerciseType);

  const defaultRest = getRestTime(exerciseType);

  useEffect(() => {
    if (isResting) {
      setElapsed(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }
  }, [isResting]);

  useEffect(() => {
    if (!isResting) return;
    const interval = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, [isResting]);

  useEffect(() => {
    if (isUrgent && isResting) {
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 150, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    if (timeRemaining === 0 && prevTimeRef.current > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    prevTimeRef.current = timeRemaining;
  }, [timeRemaining, isUrgent, isResting]);

  const formatTime = useCallback((s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }, []);

  if (!isResting) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <SpaceBetween style={styles.header}>
        <Ionicons name="moon" size={16} color={colors.success} />
        <Text style={styles.headerTitle}>DESCANSO</Text>
      </SpaceBetween>

      <View style={styles.timerWrap}>
        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
          <Defs>
            <LinearGradient id="smartRestGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={timerColor} />
              <Stop offset="1" stopColor={timerColor} stopOpacity="0.4" />
            </LinearGradient>
          </Defs>
          <Circle cx={CIRCLE_SIZE / 2} cy={CIRCLE_SIZE / 2} r={CIRCLE_RADIUS}
            stroke={colors.surfaceOverlay} strokeWidth={CIRCLE_STROKE} fill="none" />
          <Circle cx={CIRCLE_SIZE / 2} cy={CIRCLE_SIZE / 2} r={CIRCLE_RADIUS}
            stroke="url(#smartRestGrad)" strokeWidth={CIRCLE_STROKE} fill="none"
            strokeDasharray={CIRCLE_CIRCUMFERENCE} strokeDashoffset={strokeDashoffset}
            strokeLinecap="round" transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`} />
        </Svg>
        <View style={styles.timerOverlay}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Text style={[styles.timerText, { color: timerColor }]}>{formatTime(timeRemaining)}</Text>
          </Animated.View>
          <Text style={styles.progressLabel}>{Math.round(progress * 100)}%</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoChip}>
          <Ionicons name="analytics" size={12} color={colors.primary} />
          <Text style={styles.infoText}>Padrao: {formatTime(defaultRest)}</Text>
        </View>
        {restHistory.length > 0 && (
          <View style={styles.infoChip}>
            <Ionicons name="trending-up" size={12} color={colors.secondary} />
            <Text style={styles.infoText}>Media: {formatTime(avgRest)}</Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.ctrlBtn} onPress={onSubtractTime} accessibilityLabel="Menos 15s">
          <Ionicons name="remove-circle" size={22} color={colors.textMuted} />
          <Text style={styles.ctrlText}>-15s</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctrlBtn} onPress={onAddTime} accessibilityLabel="Mais 15s">
          <Ionicons name="add-circle" size={22} color={colors.primary} />
          <Text style={[styles.ctrlText, { color: colors.primary }]}>+15s</Text>
        </TouchableOpacity>
      </View>

      {nextExercise && (
        <View style={styles.nextCard}>
          <Ionicons name="arrow-forward-circle" size={16} color={colors.primary} />
          <Text style={styles.nextLabel}>PROXIMO</Text>
          <Text style={styles.nextName}>{nextExercise.name}</Text>
          <Text style={styles.nextMeta}>{nextExercise.sets || 4}x{nextExercise.reps || 10} · {nextExercise.muscle || ''}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.skipBtn} onPress={onSkip} accessibilityLabel="Pular descanso">
        <Ionicons name="play-skip-forward" size={18} color={colors.background} />
        <Text style={styles.skipText}>INICIAR AGORA</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
