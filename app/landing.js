// app/landing.js
// Landing Page - NOVAIX FITNESS

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/colors';

const features = [
  { icon: 'barbell', title: 'Treinos Personalizados', description: 'Adaptados ao seu nível e objetivo' },
  { icon: 'timer', title: 'Cronômetro Integrado', description: 'Timer automático com descanso' },
  { icon: 'people', title: 'Comunidade', description: 'Conecte-se com outros alunos' },
  { icon: 'trophy', title: 'Gamificação', description: 'Medalhas e conquistas' },
];

const testimonials = [
  { name: 'Ana S.', text: 'Perdi 10kg em 3 meses!', rating: 5 },
  { name: 'Carlos M.', text: 'Melhor app de treino que já usei.', rating: 5 },
  { name: 'Maria P.', text: 'A comunidade é incrível!', rating: 5 },
];

export default function LandingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>NOVAIX FITNESS</Text>
          <Text style={styles.heroSubtitle}>Sua Nova Evolução no Treino</Text>
          <Text style={styles.heroDescription}>
            O app que transforma seu treino com cronômetro inteligente, 
            comunidade e gamificação.
          </Text>
          <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/register')}>
            <Text style={styles.ctaButtonText}>COMEÇAR AGORA</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>POR QUE NOVAIX?</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Ionicons name={feature.icon} size={32} color={COLORS.primary} />
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Testimonials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O QUE DIZEM NOSSOS ALUNOS</Text>
          {testimonials.map((testimonial, index) => (
            <View key={index} style={styles.testimonialCard}>
              <View style={styles.testimonialHeader}>
                <Text style={styles.testimonialName}>{testimonial.name}</Text>
                <View style={styles.stars}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Ionicons key={i} name="star" size={16} color={COLORS.primary} />
                  ))}
                </View>
              </View>
              <Text style={styles.testimonialText}>{testimonial.text}</Text>
            </View>
          ))}
        </View>

        {/* CTA Final */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>PRONTO PARA COMEÇAR?</Text>
          <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/register')}>
            <Text style={styles.ctaButtonText}>BAIXAR GRÁTIS</Text>
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
    padding: 40,
    paddingTop: 80,
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 36,
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  heroSubtitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: COLORS.textTitle,
    marginTop: 8,
  },
  heroDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDescription,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 24,
  },
  ctaButtonText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.background,
    textTransform: 'uppercase',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 20,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 24,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
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
    fontSize: 14,
    color: COLORS.textDescription,
    marginTop: 4,
  },
  testimonialCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  testimonialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  testimonialName: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.textTitle,
  },
  stars: {
    flexDirection: 'row',
  },
  testimonialText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDescription,
    fontStyle: 'italic',
  },
  ctaSection: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  ctaTitle: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 20,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
});
