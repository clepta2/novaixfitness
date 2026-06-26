import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Button } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { PLANS } from '../../services/payment';
import { trackPaywallClick, trackPaywallSkip } from '../../services/abtest';
import { layout, typography } from '../../styles';

export default function VariantBView({ selected, onSelect, onSubscribe, loading }) {
  const router = useRouter();
  const { user } = useAuth();

  const handleSelect = (planId) => {
    onSelect(planId);
    if (user?.id) trackPaywallClick(user.id, planId);
  };

  const handleSkip = () => {
    if (user?.id) trackPaywallSkip(user.id);
    router.replace('/(tabs)/home');
  };

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Ionicons name="flash" size={48} color={COLORS.primary} />
          <Text style={typography.h2}>EVOLUA RAPIDO</Text>
          <Text style={typography.bodyMuted}>Acesso ilimitado a todos os treinos e Coach IA</Text>
        </View>

        <View style={styles.urgentBadge}>
          <Ionicons name="time" size={16} color={COLORS.background} />
          <Text style={typography.button}>OFERTA POR TEMPO LIMITADO</Text>
        </View>

        <View style={styles.plans}>
          {Object.values(PLANS).map((plan) => (
            <TouchableOpacity key={plan.id} style={[styles.planCard, selected === plan.id && styles.planActive]} onPress={() => handleSelect(plan.id)}>
              {plan.popular && <View style={styles.popularTag}><Text style={styles.popularText}>RECOMENDADO</Text></View>}
              <Text style={typography.h4}>{plan.name}</Text>
              <Text style={styles.price}>{plan.priceText}<Text style={typography.bodySmall}>/mes</Text></Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.benefits}>
          {['Treinos ilimitados', 'Coach IA personalizado', 'Cronometro inteligente', 'Comunidade ativa', 'Suporte prioritario'].map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={typography.body}>{b}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={layout.footer}>
        <Button title="COMEÇAR AGORA - 7 DIAS GRATIS" onPress={onSubscribe} loading={loading} icon="rocket" />
        <TouchableOpacity onPress={handleSkip} style={styles.skip}>
          <Text style={typography.bodyMuted}>Continuar no plano gratuito</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: 60 },
  hero: { alignItems: 'center', paddingVertical: SPACING.xxl, gap: SPACING.md },
  urgentBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.error, padding: SPACING.md, borderRadius: 8, marginBottom: SPACING.xl },
  plans: { gap: SPACING.md, marginBottom: SPACING.xl },
  planCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, borderWidth: 2, borderColor: COLORS.border },
  planActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },
  popularTag: { position: 'absolute', top: -10, right: SPACING.lg, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: 4, borderRadius: 999 },
  popularText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.background, letterSpacing: 1 },
  price: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.primary, marginTop: SPACING.sm },
  benefits: { gap: SPACING.md },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  skip: { alignItems: 'center', paddingVertical: SPACING.md },
});
