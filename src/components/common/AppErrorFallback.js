import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function AppErrorFallback({ error, retry }) {
  return (
    <View style={styles.container} accessibilityLabel="Erro fatal no aplicativo" accessibilityRole="alert">
      <View style={styles.logoContainer}>
        <Ionicons name="fitness" size={48} color={COLORS.primary} />
        <Text style={styles.brand}>NOVAIX FITNESS</Text>
      </View>
      <Ionicons name="warning-outline" size={56} color={COLORS.error} />
      <Text style={styles.title}>Erro Inesperado</Text>
      <Text style={styles.message}>
        {error?.message || 'O aplicativo encontrou um problema.'}
      </Text>
      <TouchableOpacity style={styles.retryBtn} onPress={retry} accessibilityLabel="Reiniciar aplicativo" accessibilityRole="button">
        <Ionicons name="refresh" size={18} color={COLORS.background} />
        <Text style={styles.retryText}>REINICIAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xxxl },
  brand: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 18, color: COLORS.primary, letterSpacing: 2 },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 22, color: COLORS.textTitle, marginTop: SPACING.lg, textAlign: 'center' },
  message: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, marginTop: SPACING.sm, textAlign: 'center', paddingHorizontal: SPACING.xxl },
  retryBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.xxl, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md },
  retryText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
});
