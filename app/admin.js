// app/admin.js
// Painel Administrativo com 2FA - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { StudentCard, FinanceStats, TwoFactorSetup, TwoFactorPrompt } from '../src/components';
import { supabase } from '../src/config/supabase';
import { is2FAEnabled } from '../src/services/totp';
import { useAuth } from '../src/context/AuthContext';
import { layout, typography } from '../src/styles';

const tabs = [{ id: 'students', label: 'Alunos' }, { id: 'finance', label: 'Financeiro' }, { id: 'content', label: 'Conteúdo' }];

export default function AdminScreen() {
  const { user } = useAuth();
  const [twoFAState, setTwoFAState] = useState('checking');
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check2FA() {
      if (!user?.id) { setTwoFAState('setup'); return; }
      try {
        const enabled = await is2FAEnabled(user.id);
        setTwoFAState(enabled ? 'prompt' : 'setup');
      } catch {
        setTwoFAState('setup');
      }
    }
    check2FA();
  }, [user?.id]);

  useEffect(() => {
    if (twoFAState !== 'verified') return;
    async function fetchStudents() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email, subscription_status, subscription_plan')
          .order('name', { ascending: true });

        if (data && !error) {
          setStudents(data.map((s) => ({
            id: s.id,
            name: s.name || 'Sem nome',
            email: s.email || '',
            status: s.subscription_status === 'premium' ? 'active' : 'inactive',
            plan: s.subscription_plan === 'basic' ? 'Básico' : s.subscription_plan === 'premium' ? 'Premium' : 'Intermediário',
          })));
        }
      } catch (err) {
        console.error('Erro ao buscar alunos:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, [twoFAState]);

  if (twoFAState === 'checking') {
    return (
      <View style={[layout.screen, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (twoFAState === 'setup') {
    return (
      <View style={layout.screen}>
        <TwoFactorSetup userId={user?.id} onComplete={() => setTwoFAState('prompt')} />
      </View>
    );
  }

  if (twoFAState === 'prompt') {
    return (
      <View style={layout.screen}>
        <TwoFactorPrompt userId={user?.id} onVerified={() => setTwoFAState('verified')} />
      </View>
    );
  }

  return (
    <ScrollView style={layout.screen} contentContainerStyle={layout.scroll}>
      <View style={layout.header}>
        <Text style={typography.h3}>PAINEL ADMIN</Text>
        <Text style={typography.bodySmall}>PAINEL DE CONTROLE</Text>
      </View>

      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.id} style={[styles.tab, activeTab === tab.id && styles.tabActive]} onPress={() => setActiveTab(tab.id)}>
            <Text style={[typography.label, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={layout.section}>
        {activeTab === 'students' && (
          <>
            <Text style={typography.h5}>CONTROLE DE ALUNOS</Text>
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: SPACING.md }} />
            ) : students.length > 0 ? (
              students.map((s) => <StudentCard key={s.id} student={s} />)
            ) : (
              <Text style={typography.bodyMuted}>Nenhum aluno cadastrado</Text>
            )}
          </>
        )}
        {activeTab === 'finance' && (
          <>
            <Text style={typography.h5}>PAINEL FINANCEIRO</Text>
            <FinanceStats />
          </>
        )}
        {activeTab === 'content' && (
          <>
            <Text style={typography.h5}>GERENCIAR CONTEÚDO</Text>
            {['Adicionar Treino', 'Adicionar Exercício'].map((label, i) => (
              <TouchableOpacity key={i} style={styles.addButton}>
                <Ionicons name="add-circle" size={20} color={COLORS.primary} />
                <Text style={typography.h5}>{label}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: SPACING.xxl },
  tab: { flex: 1, paddingVertical: 12, backgroundColor: COLORS.surface, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.primary },
  tabTextActive: { color: COLORS.background },
  addButton: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.sm },
});
