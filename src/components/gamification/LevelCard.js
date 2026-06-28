// src/components/gamification/LevelCard.js
// Card de nivel e progresso XP - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { getXPProgress } from '../../constants/gamification';

export default function LevelCard({ xp = 0 }) {
  const { current, next, progress, xpInLevel, xpNeeded } = getXPProgress(xp);
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(barAnim, { toValue: progress * 100, duration: 1000, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [progress]);

  const barWidth = barAnim.interpolate({ inputRange: [0, 100], outputRange: ['2%', '100%'] });
  const xpRemaining = next ? next.xpRequired - xp : 0;

  return (
    <View style={styles.container} accessibilityLabel={`Nivel ${current.level} - ${current.name}`}>
      <View style={[styles.iconWrap, { backgroundColor: current.color + '20' }]}>
        <Ionicons name={current.icon} size={32} color={current.color} />
      </View>

      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={[styles.levelBadge, { color: current.color }]}>NV. {current.level}</Text>
          <Text style={styles.levelName}>{current.name}</Text>
        </View>
        <Text style={styles.xpValue}>{xp} XP</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: barWidth, backgroundColor: current.color }]} />
        </View>
        {next ? (
          <Text style={styles.progressText}>Faltam {xpRemaining} XP para o proximo nivel</Text>
        ) : (
          <Text style={[styles.progressText, { color: current.color }]}>Nivel maximo atingido!</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  iconWrap: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: SPACING.md },
  info: { alignItems: 'center', marginBottom: SPACING.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  levelBadge: { fontFamily: 'Montserrat_700Bold', fontSize: 12, letterSpacing: 1 },
  levelName: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  xpValue: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
  progressContainer: { gap: SPACING.xs },
  progressBar: { height: 8, backgroundColor: COLORS.background, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, textAlign: 'center' },
});
