import React, { useRef, useEffect, useMemo } from 'react';
import { Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { STREAK_LEVELS as STREAK_LEVELS_CONFIG } from '../../config/gamificationConfig';

export const STREAK_LEVELS = STREAK_LEVELS_CONFIG.map(l => ({ ...l, color: COLORS[l.colorKey as keyof typeof COLORS] }));

export function FlameIcon({ level, size = 24 }: any) {
  const pulseAnim = useMemo(() => new Animated.Value(1), []);

  useEffect(() => {
    if (level >= 7) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [level]);

  const config = STREAK_LEVELS.slice().reverse().find(l => level >= l.min) || STREAK_LEVELS[0];

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }], width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center' }}>
      <Ionicons name={config.icon as any} size={size} color={config.color} />
    </Animated.View>
  );
}

export function calculateCurrentStreak(uniqueDays: any[]) {
  let current = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 90; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    if (uniqueDays.includes(checkDate.toDateString())) {
      current++;
    } else if (i > 0) break;
  }
  return current;
}

export function calculateBestStreak(uniqueDays: any[]) {
  let best = 0, curr = 0;
  for (let i = uniqueDays.length - 1; i >= 0; i--) {
    if (i === uniqueDays.length - 1) { curr = 1; }
    else {
      const diff = (new Date(uniqueDays[i + 1]).getTime() - new Date(uniqueDays[i]).getTime()) / 86400000;
      if (diff === 1) curr++;
      else { best = Math.max(best, curr); curr = 1; }
    }
  }
  return Math.max(best, curr);
}

export function generateWeekDots(uniqueDays: any[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    last7.push({
      day: d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3),
      active: uniqueDays.includes(d.toDateString()),
      isToday: i === 0,
    });
  }
  return last7;
}
