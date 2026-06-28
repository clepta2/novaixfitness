// app/settings/accessibility.js
// Configurações de acessibilidade

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/config/supabase';

const OPTIONS = [
  { id: 'large_text', label: 'Fonte Grande', description: 'Aumenta o tamanho do texto', icon: 'text' },
  { id: 'high_contrast', label: 'Alto Contraste', description: 'Cores mais fortes e visíveis', icon: 'contrast' },
  { id: 'reduce_motion', label: 'Reduzir Movimento', description: 'Remove animações desnecessárias', icon: 'pause' },
  { id: 'bold_text', label: 'Texto em Negrito', description: 'Torna todo o texto mais grosso', icon: 'bold' },
];

export default function AccessibilityScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [settings, setSettings] = useState({ large_text: false, high_contrast: false, reduce_motion: false, bold_text: false });

  useEffect(() => { loadSettings(); }, [user?.id]);

  const loadSettings = async () => {
    if (!user?.id) return;
    const { data } = await supabase.from('accessibility_settings').select('*').eq('user_id', user.id).single();
    if (data) setSettings({ large_text: data.large_text, high_contrast: data.high_contrast, reduce_motion: data.reduce_motion, bold_text: data.bold_text });
  };

  const toggleSetting = async (key) => {
    const newValue = !settings[key];
    setSettings({ ...settings, [key]: newValue });
    if (user?.id) {
      await supabase.from('accessibility_settings').upsert({ user_id: user.id, [key]: newValue }, { onConflict: 'user_id' });
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>ACESSIBILIDADE</Text>
      <Text style={styles.subtitle}>Personalize a aparência do app</Text>

      {OPTIONS.map((option) => (
        <View key={option.id} style={styles.optionRow}>
          <View style={styles.optionInfo}>
            <Text style={styles.optionLabel}>{option.label}</Text>
            <Text style={styles.optionDescription}>{option.description}</Text>
          </View>
          <Switch value={settings[option.id]} onValueChange={() => toggleSetting(option.id)} trackColor={{ false: COLORS.surface, true: COLORS.primary + '50' }} thumbColor={settings[option.id] ? COLORS.primary : COLORS.textMuted} />
        </View>
      ))}

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Essas configurações afetam todo o app. Você pode alterar a qualquer momento.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 22, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  optionInfo: { flex: 1, marginRight: SPACING.lg },
  optionLabel: { fontFamily: 'Inter_500Medium', fontSize: 15, color: COLORS.textTitle },
  optionDescription: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.xs },
  infoBox: { marginTop: SPACING.xl, padding: SPACING.md, backgroundColor: COLORS.primary + '10', borderRadius: BORDER_RADIUS.md },
  infoText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.primary },
});
