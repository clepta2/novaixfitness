// src/components/body-measures/LatestMeasurements.tsx
// Grid de ultimas medidas corporais

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';

interface MeasurementData {
  weight?: number | null;
  chest?: number | null;
  waist?: number | null;
  body_fat?: number | null;
  [key: string]: unknown;
}

interface Props {
  data: MeasurementData;
}

export default function LatestMeasurements({ data }: Props) {
  const items = [
    data.weight && { icon: 'scale', color: COLORS.primary, value: `${data.weight} kg`, label: 'Peso' },
    data.chest && { icon: 'body', color: COLORS.success, value: `${data.chest} cm`, label: 'Peito' },
    data.waist && { icon: 'resize', color: COLORS.attention, value: `${data.waist} cm`, label: 'Cintura' },
    data.body_fat && { icon: 'water', color: COLORS.info, value: `${data.body_fat}%`, label: 'Gordura' },
  ].filter(Boolean) as { icon: string; color: string; value: string; label: string }[];

  return (
    <View style={styles.latestCard}>
      <Text style={styles.latestTitle}>Ultima Medicao</Text>
      <View style={styles.latestGrid}>
        {items.map((item) => (
          <View key={item.label} style={styles.latestItem}>
            <Ionicons name={item.icon as any} size={20} color={item.color} />
            <Text style={styles.latestValue}>{item.value}</Text>
            <Text style={styles.latestLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  latestCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  latestTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, marginBottom: SPACING.md },
  latestGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  latestItem: { width: '47%', flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.md, padding: SPACING.md },
  latestValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  latestLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
});
