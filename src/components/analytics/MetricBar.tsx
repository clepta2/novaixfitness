// src/components/analytics/MetricBar.tsx
// Barra de comparação de métrica (usuário vs média)

import { useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { COLORS } from '../../constants/colors';
import { useColors } from '../../context/ThemeContext';

interface MetricBarProps {
  label: string;
  userValue: number;
  peerValue: number;
  unit: string;
  higherIsBetter?: boolean;
}

export default function MetricBar({ label, userValue, peerValue, unit, higherIsBetter = true }: MetricBarProps) {
  const colors = useColors();
  const [animatedValue] = useState(() => new Animated.Value(0));

  const isAbove = higherIsBetter ? userValue > peerValue : userValue < peerValue;
  const isBelow = higherIsBetter ? userValue < peerValue : userValue > peerValue;
  const diff = peerValue === 0 ? 0 : Math.round(((userValue - peerValue) / peerValue) * 100);

  const maxVal = Math.max(userValue, peerValue) * 1.2 || 1;
  const userWidth = (userValue / maxVal) * 100;
  const peerWidth = (peerValue / maxVal) * 100;

  const statusColor = isAbove ? (colors.success || '#4CAF50') : isBelow ? (colors.attention || '#FFC107') : (colors.textMuted || '#8892A0');

  return (
    <View style={styles.metricContainer}>
      <View style={styles.metricHeader}>
        <Text style={[styles.metricLabel, { color: colors.textDescription || '#B0B8C4' }]}>{label}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Ionicons name={isAbove ? 'trending-up' : isBelow ? 'trending-down' : 'remove'} size={10} color={statusColor} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {isAbove ? `+${diff}%` : isBelow ? `${diff}%` : 'Média'}
          </Text>
        </View>
      </View>
      <View style={styles.barsContainer}>
        <View style={styles.barRow}>
          <Text style={[styles.barLabel, { color: colors.textMuted }]}>Você</Text>
          <View style={[styles.barTrack, { backgroundColor: colors.background }]}>
            <View style={[styles.barFill, styles.barUser, { width: `${userWidth}%` }]} />
          </View>
          <Text style={[styles.barValue, { color: colors.textDescription || '#B0B8C4' }]}>{userValue}{unit}</Text>
        </View>
        <View style={styles.barRow}>
          <Text style={[styles.barLabel, { color: colors.textMuted }]}>Média</Text>
          <View style={[styles.barTrack, { backgroundColor: colors.background }]}>
            <View style={[styles.barFill, styles.barPeer, { width: `${peerWidth}%` }]} />
          </View>
          <Text style={[styles.barValue, { color: colors.textDescription || '#B0B8C4' }]}>{peerValue}{unit}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  metricContainer: { gap: SPACING.xs },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metricLabel: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm,
  },
  statusText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10 },
  barsContainer: { gap: 4 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  barLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, width: 36 },
  barTrack: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  barUser: { backgroundColor: COLORS.primary },
  barPeer: { backgroundColor: (COLORS.textMuted || '#8892A0') + '40' },
  barValue: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, width: 48, textAlign: 'right' },
});
