// src/components/workout/WorkoutAchievements.js
// Conquistas desbloqueadas no treino - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function AchievementBadge({ achievement, index }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, tension: 30, friction: 8, delay: index * 100, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.iconContainer}>
        <Ionicons name={achievement.icon || 'trophy'} size={20} color={COLORS.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{achievement.title}</Text>
        <Text style={styles.desc}>{achievement.description}</Text>
      </View>
      {achievement.xp > 0 && (
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>+{achievement.xp} XP</Text>
        </View>
      )}
    </Animated.View>
  );
}

export default function WorkoutAchievements({ achievements }) {
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
  title: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  desc: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  xpBadge: { backgroundColor: COLORS.primary + '20', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  xpText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.primary },
});
