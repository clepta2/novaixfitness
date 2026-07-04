import React, { memo, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import TimerRing from './TimerRing';
import TimerStats from './TimerStats';

const MODE_CONFIG = {
  countdown: { icon: 'timer', label: 'CRONÔMETRO', color: COLORS.primary },
  stopwatch: { icon: 'stopwatch', label: 'CRONÔMETRO CORRIDO', color: COLORS.success },
  free: { icon: 'infinite', label: 'MODO LIVRE', color: COLORS.info },
};

type TimerMode = keyof typeof MODE_CONFIG;

interface LogEntry {
  exerciseName: string;
  [key: string]: any;
}

interface WorkoutTimerProps {
  timeRemaining: number;
  totalTime: number;
  phase: string;
  exerciseName?: string;
  setInfo?: string;
  currentSet?: number;
  totalSets?: number;
  logs?: LogEntry[];
  calories?: number;
  xpEarned?: number;
  timerMode?: TimerMode;
  elapsed?: number;
}

function formatTime(seconds: number): string {
  const abs = Math.abs(seconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function WorkoutTimer({ timeRemaining, totalTime, phase, exerciseName, setInfo, currentSet, totalSets, logs, calories, xpEarned, timerMode = 'countdown', elapsed = 0 }: WorkoutTimerProps): React.ReactElement {
  const isResting = phase === 'resting';
  const isPaused = phase === 'paused';
  const modeConfig = MODE_CONFIG[timerMode] || MODE_CONFIG.countdown;
  const color = isResting ? COLORS.success : modeConfig.color;

  let displayTime: number;
  let progress: number;
  if (timerMode === 'stopwatch' || timerMode === 'free') {
    displayTime = elapsed;
    progress = 0;
  } else {
    displayTime = timeRemaining;
    progress = totalTime > 0 ? (totalTime - timeRemaining) / totalTime : 0;
  }

  const pulseAnim = useRef(Animated.Value(1)).current;
  const scaleAnim = useRef(Animated.Value(0.9)).current;
  const prevPhaseRef = useRef(phase);
  const prevTimeRef = useRef(timeRemaining);

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, tension: 30, friction: 8, useNativeDriver: true }).start();
  }, [scaleAnim]);

  useEffect(() => {
    if (phase === 'exercising' && !isPaused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.02, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [phase, isPaused]);

  useEffect(() => {
    if (prevPhaseRef.current !== phase) prevPhaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (timerMode === 'countdown' && timeRemaining <= 5 && timeRemaining > 0 && timeRemaining !== prevTimeRef.current) {
      try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    }
    if (timeRemaining === 0 && prevTimeRef.current > 0) {
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    }
    prevTimeRef.current = timeRemaining;
  }, [timeRemaining, timerMode]);

  const completedSets = logs?.filter((l: LogEntry) => l.exerciseName === exerciseName).length || 0;
  const isUrgent = timerMode === 'countdown' && timeRemaining <= 5 && timeRemaining > 0 && !isResting;
  const isLow = timerMode === 'countdown' && timeRemaining <= 10 && timeRemaining > 5 && !isResting;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.timerWrap, { transform: [{ scale: Animated.multiply(pulseAnim, scaleAnim) }] }]}>
        <TimerRing color={color} progress={progress} isUrgent={isUrgent} />

        <View style={styles.overlay}>
          <View style={[styles.phaseContainer, { backgroundColor: color + '20' }]}>
            <Ionicons name={modeConfig.icon as any} size={12} color={color} />
            <Text style={[styles.phase, { color }]}>{isResting ? 'DESCANSO' : isPaused ? 'PAUSADO' : modeConfig.label}</Text>
          </View>

          <Text style={[styles.time, { color }, isUrgent && styles.timeUrgent, isLow && styles.timeLow]}>{formatTime(displayTime)}</Text>

          {timerMode === 'countdown' && <Text style={styles.progress}>{Math.round(progress * 100)}%</Text>}
          {exerciseName && <Text style={styles.exerciseName} numberOfLines={1}>{exerciseName}</Text>}

          {setInfo && (
            <View style={styles.setBadge}>
              <Text style={styles.setText}>{setInfo}</Text>
            </View>
          )}

          {!isResting && (totalSets ?? 0) > 0 && timerMode === 'countdown' && (
            <View style={styles.repRow}>
              {Array.from({ length: totalSets! }).map((_, i) => (
                <View key={i} style={[styles.repDot, i < completedSets && styles.repDotDone]} />
              ))}
            </View>
          )}
        </View>
      </Animated.View>

      <TimerStats calories={calories ?? 0} xpEarned={xpEarned ?? 0} />
    </View>
  );
}

export default memo(WorkoutTimer);

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  timerWrap: { alignItems: 'center', justifyContent: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  phaseContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.md, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm, marginBottom: SPACING.sm },
  phase: { fontFamily: 'Montserrat_700Bold', fontSize: 10, letterSpacing: 2 },
  time: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 56, letterSpacing: 2 },
  timeUrgent: { color: COLORS.error },
  timeLow: { color: COLORS.attention },
  progress: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  exerciseName: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.sm, textAlign: 'center', maxWidth: 180 },
  setBadge: { backgroundColor: COLORS.surfaceOverlay, paddingHorizontal: SPACING.md, paddingVertical: 3, borderRadius: BORDER_RADIUS.sm, marginTop: SPACING.xs },
  setText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textTitle },
  repRow: { flexDirection: 'row', gap: 6, marginTop: SPACING.md },
  repDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.surfaceOverlay },
  repDotDone: { backgroundColor: COLORS.primary },
});
