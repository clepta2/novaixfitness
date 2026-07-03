// app/language-select.tsx
// Seleção de idioma antes do cadastro

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../src/constants/colors';
import { useTheme } from '../src/context/ThemeContext';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { SHADOWS } from '../src/constants/shadows';
import { SUPPORTED_LANGUAGES } from '../src/ml/languages';
import { ErrorBoundary, LanguageOption } from '../src/components';
import { useFadeInUp } from '../src/utils/animations';

const LANGUAGE_KEY = '@novaix:selected_language';
const AVAILABLE = SUPPORTED_LANGUAGES.filter(l => l.available);

const makeStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: SPACING.xl },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  title: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24, color: colors.textTitle, textAlign: 'center', marginTop: SPACING.lg, letterSpacing: 1 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: SPACING.sm },
  options: { gap: SPACING.sm },
  info: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: SPACING.xl },
  bottomSection: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xxl },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: colors.primary, borderRadius: BORDER_RADIUS.md, paddingVertical: SPACING.lg, ...SHADOWS.md },
  ctaBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: colors.background, letterSpacing: 1 },
});

export default function LanguageSelectScreen() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const router = useRouter();
  const [selected, setSelected] = useState('pt');
  const { opacity: fadeAnim, translateY: slideAnim } = useFadeInUp();

  const handleContinue = async () => {
    await AsyncStorage.setItem(LANGUAGE_KEY, selected);
    router.replace('/');
  };

  return (
    <ErrorBoundary screenName="LanguageSelect">
      <View style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.header}>
            <Ionicons name="globe-outline" size={48} color={colors.primary} />
            <Text style={styles.title}>ESCOLHA SEU IDIOMA</Text>
            <Text style={styles.subtitle}>Selecione o idioma do app</Text>
          </View>

          <View style={styles.options}>
            {AVAILABLE.map((lang) => (
              <LanguageOption key={lang.code} lang={lang} isActive={selected === lang.code} onPress={() => setSelected(lang.code)} />
            ))}
          </View>

          <Text style={styles.info}>Voce pode alterar o idioma depois nas configuracoes.</Text>
        </Animated.View>

        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.ctaBtn} onPress={handleContinue} activeOpacity={0.8}>
            <Text style={styles.ctaBtnText}>CONTINUAR</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.background} />
          </TouchableOpacity>
        </View>
      </View>
    </ErrorBoundary>
  );
}
