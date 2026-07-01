// src/components/body-measures/BmiCard.tsx
// Card de IMC com barra colorida

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';

function getBmiColor(bmi: string) {
  const val = parseFloat(bmi);
  if (val < 18.5) return COLORS.info;
  if (val < 25) return COLORS.success;
  if (val < 30) return COLORS.attention;
  return COLORS.error;
}

interface Props {
  bmi: string;
}

export default function BmiCard({ bmi }: Props) {
  const color = getBmiColor(bmi);
  return (
    <View style={styles.bmiCard}>
      <View style={styles.bmiHeader}>
        <Text style={styles.bmiTitle}>IMC</Text>
        <Text style={[styles.bmiValue, { color }]}>{bmi}</Text>
      </View>
      <View style={styles.bmiBar}>
        <View style={[styles.bmiFill, { width: `${Math.min(100, (parseFloat(bmi) / 40) * 100)}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bmiCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  bmiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  bmiTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  bmiValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24 },
  bmiBar: { height: 8, backgroundColor: COLORS.surfaceElevated, borderRadius: 4, overflow: 'hidden' },
  bmiFill: { height: '100%', borderRadius: 4 },
});
