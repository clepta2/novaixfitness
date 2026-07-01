// RestRing.tsx
import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

const CIRCLE_SIZE = 160;
const STROKE = 8;
const RADIUS = (CIRCLE_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface RestRingProps {
  timeRemaining: number;
  totalTime: number;
  pulseAnim: Animated.Value;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function RestRing({ timeRemaining, totalTime, pulseAnim }: RestRingProps): React.ReactElement {
  const isUrgent = timeRemaining <= 5;
  const timerColor = isUrgent ? COLORS.error : COLORS.success;
  const progress = totalTime > 0 ? (totalTime - timeRemaining) / totalTime : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const restMinutes = Math.floor(totalTime / 60);
  const restSeconds = totalTime % 60;

  return (
    <View style={styles.section}>
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
        <View style={styles.overlay}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Text style={[styles.time, { color: timerColor }]}>{formatTime(timeRemaining)}</Text>
          </Animated.View>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>Descanso configurado</Text>
        <Text style={styles.value}>{restMinutes}min {restSeconds > 0 ? `${restSeconds}s` : ''}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xl, marginBottom: SPACING.md },
  timerWrap: { position: 'relative', width: CIRCLE_SIZE, height: CIRCLE_SIZE },
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  time: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 36, letterSpacing: 2 },
  info: { flex: 1 },
  label: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  value: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginTop: 2 },
});
