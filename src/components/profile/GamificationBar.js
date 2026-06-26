// src/components/profile/GamificationBar.js
// Barra de XP e nível - NOVAIX FITNESS

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { getXPProgress } from '../../constants/gamification';

function GamificationBar({ xp = 0 }) {
  const { current, next, progress, xpInLevel, xpNeeded } = getXPProgress(xp);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Ionicons name={current.icon} size={18} color={current.color} />
          <Text style={[styles.levelText, { color: current.color }]}>Nv. {current.level}</Text>
        </View>
        <Text style={styles.levelName}>{current.name}</Text>
        <Text style={styles.xpText}>{xp} XP</Text>
      </View>

      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${Math.max(progress * 100, 2)}%`, backgroundColor: current.color }]} />
      </View>

      {next && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>{xpInLevel} / {xpNeeded} XP</Text>
          <Text style={styles.footerText}>Próximo: {next.name}</Text>
        </View>
      )}

      {!next && (
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: COLORS.primary }]}>Nível máximo atingido!</Text>
        </View>
      )}
    </View>
  );
}

export default memo(GamificationBar);

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.xl },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: 999, marginRight: SPACING.sm },
  levelText: { fontFamily: 'Montserrat_700Bold', fontSize: 12 },
  levelName: { flex: 1, fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  xpText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.primary },
  progressBg: { height: 8, backgroundColor: COLORS.background, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.sm },
  footerText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
});
