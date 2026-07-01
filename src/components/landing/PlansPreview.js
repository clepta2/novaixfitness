import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';

const plansPreview = [
  { name: 'Básico', price: 'R$ 49,90', desc: 'Para começar a treinar', popular: false },
  { name: 'Intermediário', price: 'R$ 79,90', desc: 'Melhor custo-benefício + IA', popular: true },
  { name: 'Premium', price: 'R$ 119,90', desc: 'VIP com suporte e nutrição', popular: false },
];

export default function PlansPreview() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTag}>INVESTIMENTO</Text>
      <Text style={styles.sectionTitle}>NOSSOS PLANOS</Text>
      <View style={styles.plansContainer}>
        {plansPreview.map((plan, index) => (
          <View key={index} style={[styles.planCard, plan.popular && styles.planCardPopular]}>
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>MAIS POPULAR</Text>
              </View>
            )}
            <Text style={[styles.planName, plan.popular && styles.planTextDark]}>{plan.name}</Text>
            <Text style={[styles.planPrice, plan.popular && styles.planTextDark]}>{plan.price}<Text style={styles.planPeriod}>/mês</Text></Text>
            <Text style={[styles.planDesc, plan.popular && styles.planTextDarkOpacity]}>{plan.desc}</Text>
            <View style={styles.benefits}>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle-outline" size={16} color={plan.popular ? COLORS.background : COLORS.primary} />
                <Text style={[styles.benefitText, plan.popular && styles.planTextDark]}>Acesso a todos os treinos</Text>
              </View>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle-outline" size={16} color={plan.popular ? COLORS.background : COLORS.primary} />
                <Text style={[styles.benefitText, plan.popular && styles.planTextDark]}>Histórico no Supabase</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { padding: SPACING.xl, paddingVertical: 64 },
  sectionTag: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.primary, textAlign: 'center', letterSpacing: 3, marginBottom: 8, textTransform: 'uppercase' },
  sectionTitle: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 26, color: COLORS.textTitle, textAlign: 'center', letterSpacing: 0.5, marginBottom: 44 },
  plansContainer: { gap: SPACING.lg },
  planCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl, padding: SPACING.xl, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  planCardPopular: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, ...SHADOWS.glow },
  popularBadge: { alignSelf: 'flex-start', backgroundColor: COLORS.background, paddingHorizontal: SPACING.lg, paddingVertical: 6, borderRadius: BORDER_RADIUS.full, marginBottom: SPACING.md },
  popularBadgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.primary, letterSpacing: 0.5 },
  planName: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle },
  planPrice: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 36, color: COLORS.textTitle, marginVertical: SPACING.md },
  planPeriod: { fontSize: 16, fontFamily: 'Inter_400Regular' },
  planDesc: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, lineHeight: 20 },
  planTextDark: { color: COLORS.background },
  planTextDarkOpacity: { color: COLORS.background, opacity: 0.8 },
  benefits: { marginTop: 16, gap: 8 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  benefitText: { fontSize: 13, color: COLORS.textTitle },
});
