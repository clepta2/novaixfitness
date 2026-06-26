// src/components/admin/FinanceStats.js
// Stats financeiros do admin - NOVAIX FITNESS

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const stats = [
  { label: 'MRR', value: 'R$ 4.500' },
  { label: 'Alunos Ativos', value: '45' },
  { label: 'Churn', value: '5.2%' },
  { label: 'Novos/Mês', value: '12' },
];

function FinanceStats() {
  return (
    <View style={styles.grid}>
      {stats.map((stat, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.label}>{stat.label}</Text>
          <Text style={styles.value}>{stat.value}</Text>
        </View>
      ))}
    </View>
  );
}

export default memo(FinanceStats);

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  card: { width: '47%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, alignItems: 'center' },
  label: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  value: { fontFamily: 'Montserrat_700Bold', fontSize: 24, color: COLORS.primary, marginTop: SPACING.sm },
});
