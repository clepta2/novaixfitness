// src/components/paywall/PlanCard.js
// Card de plano - NOVAIX FITNESS

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function PlanCard({ plan, isSelected, onSelect }) {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.active, plan.popular && styles.popular]}
      onPress={() => onSelect?.(plan.id)}
      activeOpacity={0.8}
    >
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MAIS POPULAR</Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.name}>{plan.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{plan.price}</Text>
          <Text style={styles.period}>{plan.period}</Text>
        </View>
      </View>

      <View style={styles.features}>
        {plan.features.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <Ionicons name={f.included ? 'checkmark-circle' : 'close-circle'} size={16} color={f.included ? COLORS.success : COLORS.textMuted} />
            <Text style={[styles.featureText, !f.included && styles.featureDisabled]}>{f.text}</Text>
          </View>
        ))}
      </View>

      {isSelected && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, borderWidth: 2, borderColor: COLORS.border, position: 'relative' },
  active: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },
  popular: { borderColor: COLORS.primary },
  popularBadge: { position: 'absolute', top: -10, right: SPACING.lg, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full },
  popularText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.background, letterSpacing: 1 },
  header: { marginBottom: SPACING.lg },
  name: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, marginBottom: SPACING.xs },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  price: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 32, color: COLORS.primary },
  period: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginLeft: SPACING.xs },
  features: { gap: SPACING.sm },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  featureText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, flex: 1 },
  featureDisabled: { color: COLORS.textMuted, textDecorationLine: 'line-through' },
  checkmark: { position: 'absolute', top: SPACING.xl, right: SPACING.xl },
});
