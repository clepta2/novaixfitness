// src/components/gamification/XpBreakdown.js
// Detalhamento de XP por categoria - NOVAIX FITNESS

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const SOURCES = [
  { key: 'workout', label: 'Treinos', icon: 'barbell', color: COLORS.primary },
  { key: 'streak', label: 'Sequencia', icon: 'flame', color: COLORS.secondary },
  { key: 'social', label: 'Social', icon: 'chatbubble', color: COLORS.info },
  { key: 'nutrition', label: 'Nutricao', icon: 'nutrition', color: COLORS.success },
];

function XpBreakdown({ breakdown = {} }) {
  const total = Math.max(1, SOURCES.reduce((s, src) => s + (breakdown[src.key] || 0), 0));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DISTRIBUICAO DE XP</Text>

      <View style={styles.bar}>
        {SOURCES.map(src => {
          const amount = breakdown[src.key] || 0;
          const pct = (amount / total) * 100;
          if (pct <= 0) return null;
          return <View key={src.key} style={[styles.barSegment, { flex: pct, backgroundColor: src.color }]} />;
        })}
      </View>

      <View style={styles.legend}>
        {SOURCES.map(src => {
          const amount = breakdown[src.key] || 0;
          const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
          return (
            <View key={src.key} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: src.color }]} />
              <Ionicons name={src.icon} size={12} color={src.color} />
              <Text style={styles.legendLabel}>{src.label}</Text>
              <Text style={styles.legendValue}>{amount} XP</Text>
              <Text style={styles.legendPct}>{pct}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default memo(XpBreakdown);

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, letterSpacing: 1, marginBottom: SPACING.md },
  bar: { flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: SPACING.md, backgroundColor: COLORS.background },
  barSegment: { minWidth: 4 },
  legend: { gap: SPACING.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  dot: { width: 6, height: 6, borderRadius: 3 },
  legendLabel: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textTitle },
  legendValue: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  legendPct: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, width: 32, textAlign: 'right' },
});
