// app/paywall.js
// Tela de Planos e Pagamento - NOVAIX FITNESS

import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/colors';

const plans = [
  {
    id: 'basic',
    name: 'Básico',
    price: 49.90,
    period: 'mês',
    features: [
      'Acesso a treinos básicos',
      'Cronômetro integrado',
      'Perfil e estatísticas',
      'Suporte via WhatsApp',
    ],
    limitations: [
      'Sem treinos personalizados',
      'Sem comunidade',
      'Sem podcast',
    ],
    color: COLORS.textMuted,
    popular: false,
  },
  {
    id: 'intermediate',
    name: 'Intermediário',
    price: 79.90,
    period: 'mês',
    features: [
      'Todos os treinos',
      'Cronômetro adaptativo',
      'Comunidade completa',
      'Podcast fitness',
      'Múltiplos modelos',
    ],
    limitations: [
      'Sem Coach IA',
      'Sem Apple Watch',
    ],
    color: COLORS.primary,
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 119.90,
    period: 'mês',
    features: [
      'Tudo do Intermediário',
      'Coach com IA',
      'Apple Watch support',
      'Download offline',
      'Suporte prioritário',
      'Treinos exclusivos',
    ],
    limitations: [],
    color: '#FFD600',
    popular: false,
  },
];

export default function PaywallScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('intermediate');

  const handleSubscribe = () => {
    const plan = plans.find((p) => p.id === selectedPlan);
    Alert.alert(
      'Assinar Plano',
      `Você selecionou o plano ${plan.name} por R$ ${plan.price}/${plan.period}. Redirecionando para pagamento...`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Continuar', onPress: () => {
          // Redirecionar para gateway de pagamento
          router.replace('/(tabs)/home');
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>LIBERE TODO O POTENCIAL</Text>
          <Text style={styles.subtitle}>Escolha o plano ideal para você</Text>
        </View>

        {/* Cards de Planos */}
        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
                plan.popular && styles.planCardPopular,
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>MAIS POPULAR</Text>
                </View>
              )}
              
              <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
              
              <View style={styles.priceContainer}>
                <Text style={styles.currency}>R$</Text>
                <Text style={styles.price}>{plan.price.toFixed(2).replace('.', ',')}</Text>
                <Text style={styles.period}>/{plan.period}</Text>
              </View>

              {/* Features */}
              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {/* Limitações */}
              {plan.limitations.length > 0 && (
                <View style={styles.limitationsContainer}>
                  {plan.limitations.map((limitation, index) => (
                    <View key={index} style={styles.limitationItem}>
                      <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
                      <Text style={styles.limitationText}>{limitation}</Text>
                    </View>
                  ))}
                </View>
              )}

              {selectedPlan === plan.id && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Garantia */}
        <View style={styles.guaranteeContainer}>
          <Ionicons name="shield-checkmark" size={24} color={COLORS.success} />
          <Text style={styles.guaranteeText}>
            7 dias de garantia. Cancele quando quiser.
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleSubscribe}>
          <Text style={styles.buttonPrimaryText}>ASSINAR AGORA</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.background} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.replace('/(tabs)/home')}>
          <Text style={styles.skipText}>Pular por agora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 24,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDescription,
    textAlign: 'center',
    marginTop: 8,
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: 20,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: COLORS.primary,
  },
  planCardPopular: {
    borderColor: COLORS.primary,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  popularText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 10,
    color: COLORS.background,
    textTransform: 'uppercase',
  },
  planName: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  currency: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: COLORS.textDescription,
    marginRight: 4,
  },
  price: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 36,
    color: COLORS.textTitle,
  },
  period: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDescription,
    marginLeft: 4,
  },
  featuresContainer: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textTitle,
  },
  limitationsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  limitationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  limitationText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
  },
  checkmark: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  guaranteeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
  },
  guaranteeText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDescription,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  buttonPrimary: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  buttonPrimaryText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.background,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  skipText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDescription,
    textAlign: 'center',
  },
});
