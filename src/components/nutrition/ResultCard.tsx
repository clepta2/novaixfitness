import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface ResultCardProps {
  icon: string;
  label: string;
  value: number | string;
  unit: string;
  color: string;
  subtitle?: string;
}

export default function ResultCard({ icon, label, value, unit, color, subtitle }: ResultCardProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Ionicons name={icon as any} size={20} color={color} />
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value}<Text style={styles.unit}>{unit}</Text></Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, gap: SPACING.xs },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted },
  value: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 20 },
  unit: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
});
