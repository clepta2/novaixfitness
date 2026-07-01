import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function SubtypeStep({ plan, selectedSubtype, onSelect }) {
  return (
    <>
      <Text style={styles.title}>QUAL ESTILO DE {plan.label.toUpperCase()}?</Text>
      <Text style={styles.subtitle}>Escolha o foco do seu treino</Text>
      <View style={styles.grid}>
        {plan.subcategories.map((sub) => {
          const active = selectedSubtype === sub.id;
          return (
            <TouchableOpacity
              key={sub.id}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => onSelect(sub.id)}
            >
              <Text style={[styles.label, active && styles.labelActive]}>{sub.label}</Text>
              <Text style={styles.description}>{sub.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.equipmentBox}>
        <Text style={styles.equipmentTitle}>EQUIPAMENTOS:</Text>
        <Text style={styles.equipmentList}>{plan.equipment.join(', ')}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  grid: { gap: SPACING.md },
  card: { padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  cardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 16, color: COLORS.textTitle },
  labelActive: { color: COLORS.primary },
  description: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.xs },
  equipmentBox: { marginTop: SPACING.xl, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md },
  equipmentTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2 },
  equipmentList: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, marginTop: SPACING.sm },
});
