// src/components/profile/GamificationBar.js
// Barra de XP e nível animada - NOVAIX FITNESS

import React, { useRef, useEffect, memo } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { getXPProgress } from '../../constants/gamification';
import { LABELS } from '../../data/profileTexts';

interface Props { xp?: number }

export default memo(function GamificationBar({ xp = 0 }: Props) {
  const { current, next, progress, xpInLevel, xpNeeded } = getXPProgress(xp);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(progressAnim, { toValue: progress * 100, duration: 1000, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [progress]);

  const barWidth = progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['2%', '100%'] });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <View style={[styles.levelBadge, { backgroundColor: current.color + '15' }]}>
          <Ionicons name={current.icon as any} size={16} color={current.color} />
          <Text style={[styles.levelText, { color: current.color }]}>Nv. {current.level}</Text>
        </View>
        <Text style={styles.levelName}>{current.name}</Text>
        <Text style={styles.xpText}>{xp} XP</Text>
      </View>

      <View style={styles.progressBg}>
        <Animated.View style={[styles.progressFill, { width: barWidth, backgroundColor: current.color }]} />
      </View>

      {next ? (
        <View style={styles.footer}>
          <Text style={styles.footerText}>{xpInLevel} / {xpNeeded} XP</Text>
          <Text style={styles.footerText}>{LABELS.nextLevel}: {next.name}</Text>
        </View>
      ) : (
        <View style={styles.footer}>
          <Ionicons name="trophy" size={14} color={COLORS.primary} />
          <Text style={[styles.footerText, { color: COLORS.primary }]}>{LABELS.maxLevel}</Text>
        </View>
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.xl },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.full, marginRight: SPACING.sm },
  levelText: { fontFamily: 'Montserrat_700Bold', fontSize: 12 },
  levelName: { flex: 1, fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  xpText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.primary },
  progressBg: { height: 8, backgroundColor: COLORS.background, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACING.sm },
  footerText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
});
