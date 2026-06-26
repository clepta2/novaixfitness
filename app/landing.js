// app/landing.js
// Landing Page - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../src/config/supabase';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { SHADOWS } from '../src/constants/shadows';

const { width } = Dimensions.get('window');

const plansPreview = [
  { name: 'Básico', price: 'R$ 49,90', desc: 'Para começar a treinar', popular: false },
  { name: 'Intermediário', price: 'R$ 79,90', desc: 'Melhor custo-benefício + IA', popular: true },
  { name: 'Premium', price: 'R$ 119,90', desc: 'VIP com suporte e nutrição', popular: false },
];

const testimonials = [
  { name: 'Ana Silva', text: 'Os treinos mudaram minha rotina. O timer integrado não me deixa dispersar durante a musculação!', rating: 5, role: 'Aluna há 3 meses' },
  { name: 'Carlos Mendes', text: 'Excelente sistema de categorias e níveis de experiência. Consigo treinar pesado tanto na academia quanto no parque.', rating: 5, role: 'Aluno há 6 meses' },
];

const faqs = [
  { q: 'Preciso pagar para começar?', a: 'Não! Você pode se cadastrar e experimentar o aplicativo completo gratuitamente por 7 dias.' },
  { q: 'Consigo usar na academia e em casa?', a: 'Sim! Nosso catálogo inteligente filtra treinos para academia (musculação/máquinas) e treinos para casa (calistenia/cardio).' },
  { q: 'Como funciona o cancelamento?', a: 'Sem fidelidade. Você pode cancelar sua assinatura com apenas um clique diretamente no painel do aplicativo.' },
];

const features = [
  { icon: 'videocam-outline', title: 'Vídeo Player Integrado', description: 'Assista às execuções corretas direto no aplicativo com players responsivos em alta definição.' },
  { icon: 'alarm-outline', title: 'Cronômetro Inteligente', description: 'Evite distrações e maximize os ganhos com timers regressivos e alertas sonoros por série.' },
  { icon: 'grid-outline', title: 'Catálogo de Treinos', description: 'Filtre e monte rotinas personalizadas por nível (Iniciante, Intermediário, Avançado) ou grupos musculares.' },
  { icon: 'chatbubbles-outline', title: 'Comunidade Ativa', description: 'Compartilhe suas conquistas no feed social, incentive outros atletas, comente e dê likes.' },
];

export default function LandingScreen() {
  const router = useRouter();
  const [activeFaq, setActiveFaq] = useState(null);
  const [dbStats, setDbStats] = useState({
    users: 0,
    workouts: 0,
    rating: 4.9,
    loading: true,
  });

  useEffect(() => {
    async function loadRealStats() {
      try {
        // 1. Buscar quantidade de alunos ativos (profiles)
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // 2. Buscar quantidade de treinos cadastrados (workouts)
        const { count: workoutsCount } = await supabase
          .from('workouts')
          .select('*', { count: 'exact', head: true });

        // 3. Buscar média de avaliações dos treinos
        const { data: ratingData } = await supabase
          .from('user_workouts')
          .select('rating');

        let avgRating = 4.9;
        if (ratingData && ratingData.length > 0) {
          const rated = ratingData.filter(r => r.rating != null);
          if (rated.length > 0) {
            const sum = rated.reduce((acc, curr) => acc + curr.rating, 0);
            avgRating = parseFloat((sum / rated.length).toFixed(1));
          }
        }

        setDbStats({
          users: usersCount || 0,
          workouts: workoutsCount || 0,
          rating: avgRating,
          loading: false,
        });
      } catch (err) {
        console.error('Erro ao buscar estatísticas do Supabase:', err);
        setDbStats(prev => ({ ...prev, loading: false }));
      }
    }

    loadRealStats();
  }, []);

  const stats = [
    { value: dbStats.loading ? '...' : `+${dbStats.users}`, label: 'Alunos Ativos' },
    { value: dbStats.loading ? '...' : `+${dbStats.workouts}`, label: 'Vídeo Treinos' },
    { value: dbStats.loading ? '...' : `${dbStats.rating}★`, label: 'Avaliação' },
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HERO SECTION */}
        <View style={styles.hero}>
          <View style={styles.badge}>
            <Ionicons name="flash-outline" size={14} color={COLORS.primary} />
            <Text style={styles.badgeText}>SUA NOVA EVOLUÇÃO NO TREINO</Text>
          </View>
          <Text style={styles.heroTitle}>
            Nix<Text style={{ color: COLORS.textTitle }}>.FIT</Text>
          </Text>
          <Text style={styles.heroSubtitle}>NOVAIX FITNESS</Text>
          <Text style={styles.heroDescription}>
            Treine de forma inteligente. Vídeos integrados com cronômetro regressivo, 
            sistema de gamificação por níveis e feed social em uma única experiência premium.
          </Text>
          
          <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/register')}>
            <Text style={styles.ctaButtonText}>Começar Desafio Grátis</Text>
            <Ionicons name="arrow-forward-outline" size={18} color={COLORS.background} />
          </TouchableOpacity>
        </View>

        {/* STATS ROW */}
        <View style={styles.statsRow}>
          {stats.map((stat, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* FEATURES SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTag}>DIFERENCIAIS</Text>
          <Text style={styles.sectionTitle}>TUDO QUE VOCÊ PRECISA</Text>
          
          <View style={styles.featuresList}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name={feature.icon} size={26} color={COLORS.primary} />
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* PLANS PREVIEW */}
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
                
                {/* Benefícios visíveis nos planos para melhorar conversão */}
                <View style={{ marginTop: 16, gap: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="checkmark-circle-outline" size={16} color={plan.popular ? COLORS.background : COLORS.primary} />
                    <Text style={{ fontSize: 13, color: plan.popular ? COLORS.background : COLORS.textTitle }}>Acesso a todos os treinos</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="checkmark-circle-outline" size={16} color={plan.popular ? COLORS.background : COLORS.primary} />
                    <Text style={{ fontSize: 13, color: plan.popular ? COLORS.background : COLORS.textTitle }}>Histórico no Supabase</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* TESTIMONIALS */}
        <View style={[styles.section, { backgroundColor: COLORS.surface }]}>
          <Text style={styles.sectionTag}>DEPOIMENTOS</Text>
          <Text style={styles.sectionTitle}>QUEM TREINA COMPROVA</Text>
          
          {testimonials.map((test, index) => (
            <View key={index} style={styles.testimonialCard}>
              <View style={styles.testimonialHeader}>
                <View>
                  <Text style={styles.testimonialName}>{test.name}</Text>
                  <Text style={styles.testimonialRole}>{test.role}</Text>
                </View>
                <View style={styles.stars}>
                  {[...Array(test.rating)].map((_, i) => (
                    <Ionicons key={i} name="star" size={14} color={COLORS.primary} />
                  ))}
                </View>
              </View>
              <Text style={styles.testimonialText}>"{test.text}"</Text>
            </View>
          ))}
        </View>

        {/* FAQ SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTag}>DÚVIDAS FREQUENTES</Text>
          <Text style={styles.sectionTitle}>FAQ</Text>
          
          <View style={styles.faqList}>
            {faqs.map((faq, index) => (
              <TouchableOpacity key={index} style={styles.faqItem} onPress={() => toggleFaq(index)} activeOpacity={0.8}>
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.q}</Text>
                  <Ionicons 
                    name={activeFaq === index ? "chevron-up-outline" : "chevron-down-outline"} 
                    size={20} 
                    color={COLORS.textTitle} 
                  />
                </View>
                {activeFaq === index && (
                  <Text style={styles.faqAnswer}>{faq.a}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FINAL CTA SECTION */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>FAÇA PARTE DA EVOLUÇÃO</Text>
          <Text style={styles.ctaSubtitle}>Libere seus treinos personalizados agora mesmo.</Text>
          <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/register')}>
            <Text style={styles.ctaButtonText}>Começar Agora</Text>
            <Ionicons name="arrow-forward-outline" size={18} color={COLORS.background} />
          </TouchableOpacity>
        </View>

      </ScrollView>
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
  },
  hero: {
    padding: SPACING.xl,
    paddingTop: 100,
    paddingBottom: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: 'rgba(204, 255, 0, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.3)',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.lg,
  },
  badgeText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 10,
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 64,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: -2,
    textShadowColor: 'rgba(204, 255, 0, 0.2)',
    textShadowOffset: { width: 0, height: 8 },
    textShadowRadius: 20,
  },
  heroSubtitle: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 20,
    color: COLORS.textTitle,
    letterSpacing: 4,
    marginTop: -4,
  },
  heroDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: COLORS.textDescription,
    textAlign: 'center',
    marginTop: SPACING.xl,
    lineHeight: 24,
    maxWidth: width - 40,
    opacity: 0.9,
  },
  ctaButton: {
    backgroundColor: '#CCFF00',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 18,
    paddingHorizontal: 32,
    marginTop: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    shadowColor: '#CCFF00',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaButtonText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    color: COLORS.background,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: SPACING.xxl,
    backgroundColor: COLORS.surface,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 32,
    color: COLORS.primary,
    textShadowColor: 'rgba(204, 255, 0, 0.1)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textDescription,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  section: {
    padding: SPACING.xl,
    paddingVertical: 64,
  },
  sectionTag: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12,
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 26,
    color: COLORS.textTitle,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 44,
  },
  featuresList: {
    gap: SPACING.md,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  featureIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(204, 255, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.15)',
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.textTitle,
  },
  featureDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textDescription,
    marginTop: 6,
    lineHeight: 20,
  },
  plansContainer: {
    gap: SPACING.lg,
  },
  planCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  planCardPopular: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...SHADOWS.glow,
  },
  popularBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
  },
  popularBadgeText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 10,
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  planName: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
    color: COLORS.textTitle,
  },
  planPrice: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 36,
    color: COLORS.textTitle,
    marginVertical: SPACING.md,
  },
  planPeriod: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  planDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDescription,
    lineHeight: 20,
  },
  planTextDark: {
    color: COLORS.background,
  },
  planTextDarkOpacity: {
    color: COLORS.background,
    opacity: 0.8,
  },
  testimonialCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  testimonialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  testimonialName: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    color: COLORS.textTitle,
  },
  testimonialRole: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDescription,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  faqList: {
    gap: SPACING.md,
  },
  faqItem: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    color: COLORS.textTitle,
    flex: 1,
    paddingRight: SPACING.md,
  },
  faqAnswer: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDescription,
    lineHeight: 20,
    marginTop: SPACING.md,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: SPACING.md,
  },
  ctaSection: {
    padding: SPACING.xxl,
    paddingVertical: 80,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  ctaTitle: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 26,
    color: COLORS.textTitle,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  ctaSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: COLORS.textDescription,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
});
