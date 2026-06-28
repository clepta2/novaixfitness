// src/components/analytics/PeriodSelector.js
// Seletor de período animado - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const PERIODS = [
  { key: 'week', label: '7 dias', icon: 'calendar' },
  { key: 'month', label: '1 mês', icon: 'calendar-outline' },
  { key: 'quarter', label: '3 meses', icon: 'calendar-outline' },
  { key: 'year', label: '1 ano', icon: 'calendar-outline' },
];

export default function PeriodSelector({ selected, onSelect }) {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const index = PERIODS.findIndex(p => p.key === selected);
    Animated.spring(translateX, { toValue: index, tension: 30, friction: 8, useNativeDriver: true }).start();
  }, [selected]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {PERIODS.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[styles.periodBtn, selected === p.key && styles.periodActive]}
            onPress={() => onSelect(p.key)}
          >
            <Ionicons name={p.icon} size={14} color={selected === p.key ? COLORS.background : COLORS.textMuted} />
            <Text style={[styles.periodText, selected === p.key && styles.periodTextActive]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  row: { flexDirection: 'row', gap: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: 4, borderWidth: 1, borderColor: COLORS.border },
  periodBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.sm },
  periodActive: { backgroundColor: COLORS.primary },
  periodText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted },
  periodTextActive: { color: COLORS.background },
});
