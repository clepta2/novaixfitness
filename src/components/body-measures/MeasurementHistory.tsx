// src/components/body-measures/MeasurementHistory.tsx
// Lista de historico de medidas

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface HistoryItem {
  id?: string;
  recorded_at: string;
  weight?: number | null;
  chest?: number | null;
  [key: string]: unknown;
}

interface Props {
  items: HistoryItem[];
}

export default function MeasurementHistory({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <View style={styles.historySection}>
      <Text style={styles.historyTitle}>Historico</Text>
      {items.slice(0, 5).map((item, i) => (
        <View key={item.id || i} style={[styles.historyItem, { opacity: Math.min(1, 0.5 + i * 0.1) }]}>
          <View style={styles.historyDate}>
            <Ionicons name="calendar" size={16} color={COLORS.textMuted} />
            <Text style={styles.historyDateText}>{new Date(item.recorded_at).toLocaleDateString('pt-BR')}</Text>
          </View>
          <View style={styles.historyValues}>
            {item.weight && <Text style={styles.historyValue}>{item.weight} kg</Text>}
            {item.chest && <Text style={styles.historyValue}>{item.chest} cm</Text>}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  historySection: { marginTop: SPACING.md },
  historyTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, marginBottom: SPACING.md },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  historyDate: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  historyDateText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  historyValues: { flexDirection: 'row', gap: SPACING.md },
  historyValue: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
});
