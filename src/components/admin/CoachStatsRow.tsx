import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';

export default function CoachStatsRow({ stats }) {
  return (
    <View style={styles.statsRow}>
      <View style={[styles.statCard, { borderLeftColor: COLORS.primary }]}>
        <Ionicons name="people" size={20} color={COLORS.primary} />
        <Text style={styles.statValue}>{stats?.subscriber_count || 0}</Text>
        <Text style={styles.statTitle}>Alunos</Text>
      </View>
      <View style={[styles.statCard, { borderLeftColor: COLORS.success }]}>
        <Ionicons name="cash" size={20} color={COLORS.success} />
        <Text style={styles.statValue}>R$ {stats?.total_earned?.toFixed(2) || '0.00'}</Text>
        <Text style={styles.statTitle}>Faturado</Text>
      </View>
      <View style={[styles.statCard, { borderLeftColor: COLORS.attention }]}>
        <Ionicons name="percent" size={20} color={COLORS.attention} />
        <Text style={styles.statValue}>{((stats?.commission_rate || 0.70) * 100).toFixed(0)}%</Text>
        <Text style={styles.statTitle}>Comissao</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  statCard: { flex: 1, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 3, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, alignItems: 'center', gap: 4, ...SHADOWS.sm },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  statTitle: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
});
