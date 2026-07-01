import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function CtaSection({ onPressCTA }) {
  return (
    <View style={styles.ctaSection}>
      <Text style={styles.ctaTitle}>FAÇA PARTE DA EVOLUÇÃO</Text>
      <Text style={styles.ctaSubtitle}>Libere seus treinos personalizados agora mesmo.</Text>
      <TouchableOpacity style={styles.ctaButton} onPress={onPressCTA} accessibilityLabel="Começar agora" accessibilityRole="button">
        <Text style={styles.ctaButtonText}>Começar Agora</Text>
        <Ionicons name="arrow-forward-outline" size={18} color={COLORS.background} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  ctaSection: { padding: SPACING.xxl, paddingVertical: 80, alignItems: 'center', backgroundColor: COLORS.surface, borderTopWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  ctaTitle: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 26, color: COLORS.textTitle, textAlign: 'center', marginBottom: SPACING.sm },
  ctaSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 15, color: COLORS.textDescription, textAlign: 'center', marginBottom: SPACING.xl, lineHeight: 22 },
  ctaButton: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, paddingVertical: 18, paddingHorizontal: 32, flexDirection: 'row', alignItems: 'center', gap: SPACING.md, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
  ctaButtonText: { fontFamily: 'Montserrat_700Bold', fontSize: 15, color: COLORS.background, textTransform: 'uppercase', letterSpacing: 0.8 },
});
