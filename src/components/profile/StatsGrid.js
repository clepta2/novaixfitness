// src/components/profile/StatsGrid.js
// Grid de estatísticas - NOVAIX FITNESS

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const icons = { streak: 'flame', workouts: 'barbell', time: 'time', favorites: 'heart' };
const labels = { streak: 'Streak', workouts: 'Treinos', time: 'Tempo', favorites: 'Favoritos' };

function StatsGrid({ stats }) {
  return (
    <View style={styles.grid}>
      {Object.entries(stats).map(([key, value]) => (
        <View key={key} style={styles.card}>
          <Ionicons name={icons[key]} size={24} color={COLORS.primary} />
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.label}>{labels[key]}</Text>
        </View>
      ))}
    </View>
  );
}

export default memo(StatsGrid);

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md, marginBottom: SPACING.xxl },
  card: { width: '48%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  value: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.primary, marginTop: SPACING.sm },
  label: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.xs },
});
