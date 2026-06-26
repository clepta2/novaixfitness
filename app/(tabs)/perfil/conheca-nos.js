// app/(tabs)/perfil/conheca-nos.js
// Tela Conheça-nos - NOVAIX FITNESS

import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../../src/constants/spacing';
import Header from '../../../src/components/ui/Header';

const values = [
  { icon: 'heart', title: 'Paixão', description: 'Acreditamos que fitness muda vidas' },
  { icon: 'people', title: 'Comunidade', description: 'Juntos somos mais fortes' },
  { icon: 'trophy', title: 'Excelência', description: 'Sempre buscando o melhor' },
  { icon: 'leaf', title: 'Acessibilidade', description: 'Fitness para todos' },
];

export default function ConhecaNosScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Header showBack title="CONHEÇA-NOS" />

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.logoMark}>
          <Text style={styles.logoN}>N</Text>
          <Text style={styles.logoIx}>ix</Text>
        </View>
        <Text style={styles.brandName}>NOVAIX FITNESS</Text>
        <Text style={styles.tagline}>Sua Nova Evolução no Treino</Text>
      </View>

      {/* Story */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>NOSSA HISTÓRIA</Text>
        <Text style={styles.storyText}>
          O NOVAIX nasceu da paixão por fitness e tecnologia. Fundado em 2026, nosso objetivo é
          tornar o treino personalizado acessível para todos, usando inteligência artificial e
          uma comunidade engajada.
        </Text>
        <Text style={styles.storyText}>
          Acreditamos que cada pessoa merece um plano de treino adaptado ao seu nível, objetivo
          e rotina. Não somos apenas um app — somos seu parceiro de evolução.
        </Text>
      </View>

      {/* Mission */}
      <View style={styles.missionCard}>
        <Ionicons name="rocket-outline" size={32} color={COLORS.primary} />
        <Text style={styles.missionTitle}>NOSSA MISSÃO</Text>
        <Text style={styles.missionText}>
          Democratizar o fitness personalizado, tornando disponível para qualquer pessoa,
          em qualquer lugar, a qualquer momento.
        </Text>
      </View>

      {/* Values */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>NOSSOS VALORES</Text>
        {values.map((value, index) => (
          <View key={index} style={styles.valueItem}>
            <View style={styles.valueIcon}>
              <Ionicons name={value.icon} size={24} color={COLORS.primary} />
            </View>
            <View style={styles.valueInfo}>
              <Text style={styles.valueTitle}>{value.title}</Text>
              <Text style={styles.valueDescription}>{value.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Numbers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>EM NÚMEROS</Text>
        <View style={styles.numbersRow}>
          <View style={styles.numberItem}>
            <Text style={styles.numberValue}>10K+</Text>
            <Text style={styles.numberLabel}>Usuários</Text>
          </View>
          <View style={styles.numberItem}>
            <Text style={styles.numberValue}>500+</Text>
            <Text style={styles.numberLabel}>Treinos</Text>
          </View>
          <View style={styles.numberItem}>
            <Text style={styles.numberValue}>50+</Text>
            <Text style={styles.numberLabel}>Exercícios</Text>
          </View>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 40 },
  hero: { alignItems: 'center', paddingVertical: SPACING.xxxl },
  logoMark: { flexDirection: 'row', alignItems: 'center' },
  logoN: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 48, color: COLORS.primary },
  logoIx: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 36, color: COLORS.textTitle, marginTop: 12 },
  brandName: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24, color: COLORS.primary, letterSpacing: 2, marginTop: SPACING.md },
  tagline: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textDescription, marginTop: SPACING.sm },
  section: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.xxl },
  sectionTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.lg },
  storyText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, lineHeight: 22, marginBottom: SPACING.md },
  missionCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, marginHorizontal: SPACING.xl, marginBottom: SPACING.xxl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary + '30' },
  missionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.primary, marginTop: SPACING.md, marginBottom: SPACING.sm },
  missionText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, textAlign: 'center', lineHeight: 20 },
  valueItem: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg },
  valueIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', marginRight: SPACING.lg },
  valueInfo: { flex: 1 },
  valueTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 16, color: COLORS.textTitle },
  valueDescription: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: 2 },
  numbersRow: { flexDirection: 'row', justifyContent: 'space-between' },
  numberItem: { flex: 1, alignItems: 'center' },
  numberValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.primary },
  numberLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.xs },
});
