
// app/ai/index.js
// Aba de IA - Hub central

import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { useAuth } from '../../src/context/AuthContext';
import { ErrorBoundary } from '../../src/components';
import { AI_TABS } from '../../src/data/settingsOptions';

export default function AiHubScreen() {
  const router = useRouter();
  const { profile, onboarding } = useAuth();
  const [activeTab, setActiveTab] = useState('dados');

  return (
    <ErrorBoundary screenName="AiHub">
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>MEU COACH IA</Text>
      <Text style={styles.subtitle}>Tudo que a IA sabe sobre você</Text>

      <View style={styles.tabBar}>
        {AI_TABS.map((tab) => (
          <TouchableOpacity key={tab.id} style={[styles.tab, activeTab === tab.id && styles.tabActive]} onPress={() => setActiveTab(tab.id)} accessibilityLabel={`Aba ${tab.label}`} accessibilityRole="button">
            <Ionicons name={tab.icon as any} size={18} color={activeTab === tab.id ? COLORS.primary : COLORS.textMuted} />
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'dados' && (
        <View style={styles.content}>
          <View style={styles.dataCard}>
            <Text style={styles.dataTitle}>PERFIL</Text>
            <DataRow label="Nome" value={profile?.name} />
            <DataRow label="E-mail" value={profile?.email} />
            <DataRow label="Telefone" value={profile?.phone} />
            <DataRow label="Objetivo" value={onboarding?.goal} />
            <DataRow label="Nível" value={onboarding?.level} />
            <DataRow label="Tipo de treino" value={(onboarding as any)?.workoutType} />
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataTitle}>SAÚDE</Text>
            <DataRow label="Lesões" value={(onboarding as any)?.injuries?.map((i: any) => i.bodyPart).join(', ') || 'Nenhuma'} />
            <DataRow label="Estresse/Sono" value={onboarding?.stressSleep} />
            <DataRow label="Horário" value={onboarding?.preferredTime} />
          </View>
        </View>
      )}

      {activeTab === 'insights' && (
        <View style={styles.content}>
          <View style={styles.insightCard}>
            <Ionicons name="analytics" size={20} color={COLORS.primary} />
            <Text style={styles.insightText}>Seu nível é {onboarding?.level || 'intermediário'}. A IA ajusta exercícios conforme sua evolução.</Text>
          </View>
          <View style={styles.insightCard}>
            <Ionicons name="fitness" size={20} color={COLORS.primary} />
            <Text style={styles.insightText}>Tipo de treino: {(onboarding as any)?.workoutType || 'não definido'}. A IA seleciona exercícios adequados.</Text>
          </View>
        </View>
      )}

      {activeTab === 'progresso' && (
        <View style={styles.content}>
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>EVOLUÇÃO</Text>
            <Text style={styles.progressText}>Dados de progresso aparecerão aqui após completar treinos.</Text>
          </View>
        </View>
      )}
    </ScrollView>
    </ErrorBoundary>
  );
}

function DataRow({ label, value }) {
  return (
    <View style={styles.dataRow}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue}>{value || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 22, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  tabBar: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.xs, marginBottom: SPACING.xl },
  tab: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.xs, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.sm },
  tabActive: { backgroundColor: COLORS.primary + '15' },
  tabText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primary },
  content: { gap: SPACING.md },
  dataCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg },
  dataTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.md },
  dataRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  dataLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted },
  dataValue: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textTitle },
  insightCard: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md },
  insightText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, lineHeight: 18 },
  progressCard: { padding: SPACING.xl, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  progressTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.md },
  progressText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, textAlign: 'center' },
});
