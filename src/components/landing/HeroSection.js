import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const { width } = Dimensions.get('window');

export default function HeroSection({ onPressCTA }) {
  return (
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
      <TouchableOpacity style={styles.ctaButton} onPress={onPressCTA} accessibilityLabel="Começar desafio grátis" accessibilityRole="button">
        <Text style={styles.ctaButtonText}>Começar Desafio Grátis</Text>
        <Ionicons name="arrow-forward-outline" size={18} color={COLORS.background} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { padding: SPACING.xl, paddingTop: 100, paddingBottom: 60, alignItems: 'center', borderBottomWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: 'rgba(204, 255, 0, 0.08)', borderWidth: 1, borderColor: 'rgba(204, 255, 0, 0.3)', paddingVertical: SPACING.xs, paddingHorizontal: SPACING.lg, borderRadius: BORDER_RADIUS.full, marginBottom: SPACING.lg },
  badgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.primary, letterSpacing: 1.5 },
  heroTitle: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 64, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: -2, textShadowColor: 'rgba(204, 255, 0, 0.2)', textShadowOffset: { width: 0, height: 8 }, textShadowRadius: 20 },
  heroSubtitle: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 20, color: COLORS.textTitle, letterSpacing: 4, marginTop: -4 },
  heroDescription: { fontFamily: 'Inter_400Regular', fontSize: 15, color: COLORS.textDescription, textAlign: 'center', marginTop: SPACING.xl, lineHeight: 24, maxWidth: width - 40, opacity: 0.9 },
  ctaButton: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, paddingVertical: 18, paddingHorizontal: 32, marginTop: 36, flexDirection: 'row', alignItems: 'center', gap: SPACING.md, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
  ctaButtonText: { fontFamily: 'Montserrat_700Bold', fontSize: 15, color: COLORS.background, textTransform: 'uppercase', letterSpacing: 0.8 },
});
