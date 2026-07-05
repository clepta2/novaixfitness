// app/settings/language.js
// Configuração de idioma

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/config/supabase';
import { ErrorBoundary } from '../../src/components';
import { LANGUAGES } from '../../src/data/settingsOptions';

export default function LanguageScreen() {
  const { user } = useAuth();
  const [selected, setSelected] = useState('pt');

  useEffect(() => {
    if (user?.id) loadLanguage();
  }, [user?.id]);

  const loadLanguage = async () => {
    const { data } = await supabase.from('profiles').select('language').eq('id', user!.id).single();
    if (data?.language) setSelected(data.language);
  };

  const handleSelect = async (langId) => {
    setSelected(langId);
    await supabase.from('profiles').update({ language: langId }).eq('id', user!.id);
    Alert.alert('Idioma', 'Idioma alterado. Reinicie o app para aplicar.');
  };

  return (
    <ErrorBoundary screenName="Language">
      <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>IDIOMA</Text>
        <Text style={styles.subtitle}>Selecione o idioma do app</Text>

        {LANGUAGES.map((lang: any) => (
          <TouchableOpacity
            key={lang.id ?? lang.key}
            style={[styles.option, selected === (lang.id ?? lang.key) && styles.optionActive]}
            onPress={() => handleSelect(lang.id ?? lang.key)}
          >
            <Text style={styles.flag}>{lang.flag}</Text>
            <View style={styles.optionInfo}>
              <Text style={styles.optionLabel}>{lang.label}</Text>
              {lang.native && <Text style={styles.optionNative}>{lang.native}</Text>}
            </View>
            {selected === (lang.id ?? lang.key) && <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 22, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  option: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  optionActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  flag: { fontSize: 28 },
  optionInfo: { flex: 1 },
  optionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 15, color: COLORS.textTitle },
  optionNative: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
});
