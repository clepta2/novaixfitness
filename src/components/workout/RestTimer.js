// src/components/workout/RestTimer.js
// Timer de repouso entre séries com ações rápidas - NOVAIX FITNESS

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const CIRCLE_SIZE = 160;
const STROKE = 8;
const RADIUS = (CIRCLE_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const QUICK_TIMES = [
  { seconds: 15, label: '15s', icon: 'flash' },
  { seconds: 30, label: '30s', icon: 'time' },
  { seconds: 60, label: '1m', icon: 'time' },
  { seconds: 90, label: '1.5m', icon: 'time' },
  { seconds: 120, label: '2m', icon: 'time' },
];

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function RestTimer({
  timeRemaining,
  totalTime,
  nextExercise,
  currentSet,
  totalSets,
  onSkip,
  onAddTime,
  onSubtractTime,
  onChangeTime,
}) {
  const [showQuick, setShowQuick] = useState(false);
  const isUrgent = timeRemaining <= 5;
  const timerColor = isUrgent ? COLORS.error : COLORS.success;
  const progress = totalTime > 0 ? (totalTime - timeRemaining) / totalTime : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

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
        <Text style={styles.headerTitle}>REPENTO</Text>
      </View>

      <View style={styles.timerSection}>
        <View style={styles.timerWrap}>
          <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
            <Defs>
              <LinearGradient id="restGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={timerColor} />
                <Stop offset="1" stopColor={timerColor} stopOpacity="0.4" />
              </LinearGradient>
            </Defs>
            <Circle cx={CIRCLE_SIZE / 2} cy={CIRCLE_SIZE / 2} r={RADIUS} stroke={COLORS.surfaceOverlay} strokeWidth={STROKE} fill="none" />
            <Circle
              cx={CIRCLE_SIZE / 2} cy={CIRCLE_SIZE / 2} r={RADIUS}
              stroke="url(#restGrad)" strokeWidth={STROKE} fill="none"
              strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeDashoffset}
              strokeLinecap="round" transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
            />
          </Svg>
          <View style={styles.timerOverlay}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Text style={[styles.timerText, { color: timerColor }]}>{formatTime(timeRemaining)}</Text>
            </Animated.View>
          </View>
        </View>

        <View style={styles.restInfo}>
          <Text style={styles.restLabel}>Descanso configurado</Text>
          <Text style={styles.restValue}>{restMinutes}min {restSeconds > 0 ? `${restSeconds}s` : ''}</Text>
        </View>
      </View>

      <View style={styles.timeControls}>
        <TouchableOpacity style={styles.timeBtn} onPress={onSubtractTime}>
          <Ionicons name="remove-circle" size={24} color={COLORS.textMuted} />
          <Text style={styles.timeBtnText}>-15s</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickToggle} onPress={() => setShowQuick(!showQuick)}>
          <Ionicons name="timer" size={16} color={COLORS.primary} />
          <Text style={styles.quickToggleText}>Tempo Rápido</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.timeBtn} onPress={onAddTime}>
          <Ionicons name="add-circle" size={24} color={COLORS.primary} />
          <Text style={[styles.timeBtnText, { color: COLORS.primary }]}>+15s</Text>
        </TouchableOpacity>
      </View>

      {showQuick && (
        <View style={styles.quickRow}>
          {QUICK_TIMES.map(t => (
            <TouchableOpacity key={t.seconds} style={styles.quickBtn} onPress={() => onChangeTime(t.seconds)}>
              <Ionicons name={t.icon} size={14} color={COLORS.primary} />
              <Text style={styles.quickBtnText}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {nextExercise && (
        <View style={styles.nextCard}>
          <View style={styles.nextHeader}>
            <Ionicons name="arrow-forward-circle" size={16} color={COLORS.primary} />
            <Text style={styles.nextLabel}>PRÓXIMO</Text>
          </View>
          <Text style={styles.nextName}>{nextExercise.name}</Text>
          <Text style={styles.nextMeta}>
            {nextExercise.sets || 4}x{nextExercise.reps || 10} • {nextExercise.muscle || 'Geral'}
          </Text>
          {currentSet && totalSets && (
            <Text style={styles.setInfo}>Série {currentSet} de {totalSets}</Text>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.skipBtn} onPress={onSkip}>
        <Ionicons name="play-skip-forward" size={18} color={COLORS.background} />
        <Text style={styles.skipText}>INICIAR AGORA</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.success + '30' },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.success, letterSpacing: 1 },
  timerSection: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xl, marginBottom: SPACING.md },
  timerWrap: { position: 'relative', width: CIRCLE_SIZE, height: CIRCLE_SIZE },
  timerOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  timerText: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 36, letterSpacing: 2 },
  restInfo: { flex: 1 },
  restLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  restValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginTop: 2 },
  timeControls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  timeBtn: { alignItems: 'center', gap: 2 },
  timeBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted },
  quickToggle: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.primary + '15', borderRadius: BORDER_RADIUS.sm },
  quickToggleText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  quickBtn: { alignItems: 'center', gap: 2, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border },
  quickBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted },
  nextCard: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, alignItems: 'center', marginBottom: SPACING.md },
  nextHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.xs },
  nextLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary, letterSpacing: 1 },
  nextName: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  nextMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  setInfo: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: SPACING.xs },
  skipBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md },
  skipText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.background, letterSpacing: 0.5 },
});
