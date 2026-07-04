
// app/settings/appearance.tsx
// Configuracao de aparencia com animacoes - NOVAIX FITNESS


import { useMemo, useEffect , useRef} from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { SHADOWS } from '../../src/constants/shadows';
import { useTheme } from '../../src/context/ThemeContext';
import { useResponsive } from '../../src/hooks/useResponsive';
import { ErrorBoundary } from '../../src/components';
import { APPEARANCE } from '../../src/data/settingsTexts';

export default function AppearanceScreen() {
  const { isDark, toggleTheme } = useTheme();
  const { isSmall } = useResponsive();

  // Animacoes
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const lightScale = useRef(new Animated.Value(1)).current;
  const darkScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.spring(isDark ? darkScale : lightScale, { toValue: 1.05, friction: 3, useNativeDriver: true }),
      Animated.spring(isDark ? darkScale : lightScale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }, [isDark]);

  return (
    <ErrorBoundary screenName="Appearance">
      <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={[styles.title, { fontSize: isSmall ? 20 : 22 }]}>{APPEARANCE.title}</Text>
          <Text style={styles.subtitle}>{APPEARANCE.subtitle}</Text>

          <Text style={styles.sectionTitle}>{APPEARANCE.themeSection}</Text>
          <View style={styles.themeRow}>
            {/* Tema Claro */}
            <Animated.View style={{ flex: 1, transform: [{ scale: lightScale }] }}>
              <TouchableOpacity
                style={[styles.themeCard, !isDark && styles.themeActive]}
                onPress={() => isDark && toggleTheme()}
              >
                <View style={[styles.themePreview, { backgroundColor: '#FFFFFF' }]}>
                  <View style={{ width: 20, height: 4, backgroundColor: '#F1F5F9', borderRadius: 2, marginBottom: 4 }} />
                  <View style={{ width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2 }} />
                </View>
                <View style={styles.themeLabelRow}>
                  <Text style={styles.themeLabel}>{APPEARANCE.light}</Text>
                  {!isDark && <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />}
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Tema Escuro */}
            <Animated.View style={{ flex: 1, transform: [{ scale: darkScale }] }}>
              <TouchableOpacity
                style={[styles.themeCard, isDark && styles.themeActive]}
                onPress={() => !isDark && toggleTheme()}
              >
                <View style={[styles.themePreview, { backgroundColor: '#12161A' }]}>
                  <View style={{ width: 20, height: 4, backgroundColor: '#1E232A', borderRadius: 2, marginBottom: 4 }} />
                  <View style={{ width: 40, height: 4, backgroundColor: '#252B34', borderRadius: 2 }} />
                </View>
                <View style={styles.themeLabelRow}>
                  <Text style={styles.themeLabel}>{APPEARANCE.dark}</Text>
                  {isDark && <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />}
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={16} color={COLORS.primary} />
            <Text style={styles.infoText}>{APPEARANCE.info}</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 22, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  sectionTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
  themeRow: { flexDirection: 'row', gap: SPACING.md },
  themeCard: { padding: SPACING.lg, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, borderColor: COLORS.border, alignItems: 'center' },
  themeActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10', ...SHADOWS.sm },
  themePreview: { width: 80, height: 60, borderRadius: BORDER_RADIUS.sm, padding: SPACING.sm, marginBottom: SPACING.sm },
  themeLabelRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  themeLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  infoBox: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.xl, padding: SPACING.md, backgroundColor: COLORS.primary + '10', borderRadius: BORDER_RADIUS.md },
  infoText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.primary },
});
