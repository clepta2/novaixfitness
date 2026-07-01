import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function PlanTypeStep({ plans, selectedPlan, onSelect }) {
  return (
    <>
      <Text style={styles.title}>QUE TIPO DE TREINO VOCÊ QUER?</Text>
      <Text style={styles.subtitle}>Escolha o que mais te agrada</Text>
      <View style={styles.grid}>
        {plans.map((plan) => {
          const active = selectedPlan === plan.id;
          return (
            <TouchableOpacity
              key={plan.id}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => onSelect(plan.id)}
            >
              <Ionicons name={plan.icon} size={32} color={active ? COLORS.primary : COLORS.textMuted} />
              <Text style={[styles.label, active && styles.labelActive]}>{plan.label}</Text>
              <Text style={styles.description}>{plan.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  grid: { gap: SPACING.md },
  card: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  cardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  label: { flex: 1, fontFamily: 'Montserrat_600SemiBold', fontSize: 16, color: COLORS.textTitle },
  labelActive: { color: COLORS.primary },
  description: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
});
