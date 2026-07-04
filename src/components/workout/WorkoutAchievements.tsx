// src/components/workout/WorkoutAchievements.tsx
// Conquistas desbloqueadas no treino - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface Achievement {
  icon?: string;
  title: string;
  description: string;
  xp?: number;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  index: number;
}

function AchievementBadge({ achievement, index }: AchievementBadgeProps): React.ReactElement {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, tension: 30, friction: 8, delay: index * 100, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.iconContainer}>
        <Ionicons name={(achievement.icon || 'trophy') as any} size={20} color={COLORS.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{achievement.title}</Text>
        <Text style={styles.desc}>{achievement.description}</Text>
      </View>
      {achievement.xp && achievement.xp > 0 && (
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>+{achievement.xp} XP</Text>
        </View>
      )}
    </Animated.View>
  );
}

interface WorkoutAchievementsProps {
  achievements?: Achievement[];
}

export default function WorkoutAchievements({ achievements }: WorkoutAchievementsProps): React.ReactElement | null {
  if (!achievements || achievements.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="ribbon" size={16} color={COLORS.attention} />
        <Text style={styles.title}>CONQUISTAS DESBLOQUEADAS</Text>
      </View>
      {achievements.map((ach, i) => (
        <AchievementBadge key={i} achievement={ach} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.xl },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1 },
  card: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.sm, padding: SPACING.md, marginBottom: SPACING.xs, borderWidth: 1, borderColor: COLORS.attention + '30' },
  iconContainer: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.attention + '15', justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1 },
  desc: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  xpBadge: { backgroundColor: COLORS.primary + '20', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  xpText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.primary },
});
