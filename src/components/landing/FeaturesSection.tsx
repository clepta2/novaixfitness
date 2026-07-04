import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const features = [
  { icon: 'videocam-outline', title: 'Vídeo Player Integrado', description: 'Assista às execuções corretas direto no aplicativo com players responsivos em alta definição.' },
  { icon: 'alarm-outline', title: 'Cronômetro Inteligente', description: 'Evite distrações e maximize os ganhos com timers regressivos e alertas sonoros por série.' },
  { icon: 'grid-outline', title: 'Catálogo de Treinos', description: 'Filtre e monte rotinas personalizadas por nível (Iniciante, Intermediário, Avançado) ou grupos musculares.' },
  { icon: 'chatbubbles-outline', title: 'Comunidade Ativa', description: 'Compartilhe suas conquistas no feed social, incentive outros atletas, comente e dê likes.' },
];

export default function FeaturesSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTag}>DIFERENCIAIS</Text>
      <Text style={styles.sectionTitle}>TUDO QUE VOCÊ PRECISA</Text>
      <View style={styles.featuresList}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Ionicons name={feature.icon as any} size={26} color={COLORS.primary} />
            </View>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
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
  featuresList: { gap: SPACING.md },
  featureCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.lg, backgroundColor: COLORS.surface, padding: SPACING.xl, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.03)' },
  featureIconContainer: { width: 52, height: 52, borderRadius: 14, backgroundColor: 'rgba(204, 255, 0, 0.05)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(204, 255, 0, 0.15)' },
  featureInfo: { flex: 1 },
  featureTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  featureDescription: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, marginTop: 6, lineHeight: 20 },
});
