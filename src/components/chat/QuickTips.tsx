import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

const QUICK_TIPS = [
  { text: 'Plano alimentar semanal', icon: 'restaurant', color: COLORS.success },
  { text: 'Rotina de treino semanal', icon: 'barbell', color: COLORS.primary },
  { text: 'Dicas de dieta', icon: 'nutrition', color: COLORS.attention },
  { text: 'Exercícios em casa', icon: 'home', color: COLORS.info },
];

export default function QuickTips({ onSendTip }) {
  return (
    <View style={styles.container}>
      <Text style={[typography.caption, { marginBottom: SPACING.sm }]}>Sugestões:</Text>
      <View style={styles.tipsRow}>
        {QUICK_TIPS.map((tip, i) => (
          <TouchableOpacity key={i} style={[styles.tipChip, { borderColor: tip.color + '40' }]} onPress={() => onSendTip(tip.text)} accessibilityLabel={`Enviar sugestão: ${tip.text}`} accessibilityRole="button">
            <Ionicons name={tip.icon as any} size={14} color={tip.color} />
            <Text style={[typography.bodySmall, { color: tip.color }]}>{tip.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
  tipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  tipChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1 },
});
