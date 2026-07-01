// app/(tabs)/perfil/termos.js
// Tela de Termos de Uso e Política de Privacidade - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../../src/constants/colors';
import { SPACING } from '../../../src/constants/spacing';
import { Header, ErrorBoundary } from '../../../src/components';
import { legalTabs, termsContent, privacyContent, medicalContent } from '../../../src/data/legalContent';

const contentMap = {
  'Termos de Uso': termsContent,
  'Privacidade': privacyContent,
  'Aviso Médico': medicalContent,
};

export default function TermsScreen() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ErrorBoundary screenName="Termos">
      <View style={styles.screen}>
        <Header title="Termos e Privacidade" />

        <View style={styles.tabRow}>
          {legalTabs.map((tab, i) => (
            <TouchableOpacity key={tab} style={[styles.tab, activeTab === i && styles.tabActive]} onPress={() => setActiveTab(i)} accessibilityLabel={tab} accessibilityRole="tab" accessibilityState={{ selected: activeTab === i }}>
              <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.content}>{contentMap[legalTabs[activeTab]]}</Text>
        </ScrollView>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  tabRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  tab: { flex: 1, paddingVertical: SPACING.md, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primary },
  scroll: { padding: SPACING.xl },
  content: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, lineHeight: 22 },
});