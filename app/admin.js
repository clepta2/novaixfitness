import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../src/constants/colors';
import { SPACING } from '../src/constants/spacing';
import { StudentCard, FinanceStats, TwoFactorSetup, TwoFactorPrompt } from '../src/components';
import AdminDashboard from '../src/components/admin/AdminDashboard';
import WorkoutManager from '../src/components/admin/WorkoutManager';
import ExerciseManager from '../src/components/admin/ExerciseManager';
import StudentEditModal from '../src/components/admin/StudentEditModal';
import CampaignManager from '../src/components/admin/CampaignManager';
import StudentExporter from '../src/components/admin/StudentExporter';
import { supabase } from '../src/config/supabase';
import { is2FAEnabled } from '../src/services/totp';
import { useAuth } from '../src/context/AuthContext';
import { layout, typography } from '../src/styles';

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'students', label: 'Alunos' },
  { id: 'finance', label: 'Financeiro' },
  { id: 'content', label: 'Conteúdo' },
  { id: 'campaigns', label: 'Campanhas' },
];

export default function AdminScreen() {
  const { user } = useAuth();
  const [twoFAState, setTwoFAState] = useState('checking');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);

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

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, subscription_status, subscription_plan, current_step')
        .order('name', { ascending: true });
      if (data && !error) {
        setStudents(data.map((s) => ({
          id: s.id,
          name: s.name || 'Sem nome',
          email: s.email || '',
          status: s.subscription_status === 'premium' || s.subscription_status === 'active' ? 'active' : 'inactive',
          plan: s.subscription_plan === 'basic' ? 'Básico' : s.subscription_plan === 'premium' ? 'Premium' : s.subscription_plan === 'ultra' ? 'Ultra' : 'Intermediário',
          subscription_plan: s.subscription_plan || 'basic',
          subscription_status: s.subscription_status || 'inactive',
          current_step: s.current_step || 'onboarding',
        })));
      }
    } catch (err) {
      if (__DEV__) console.error('Erro ao buscar alunos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (twoFAState === 'verified') fetchStudents();
  }, [twoFAState]);

  if (twoFAState === 'checking') {
    return <View style={[layout.screen, styles.center]}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }
  if (twoFAState === 'setup') {
    return <View style={layout.screen}><TwoFactorSetup userId={user?.id} onComplete={() => setTwoFAState('prompt')} /></View>;
  }
  if (twoFAState === 'prompt') {
    return <View style={layout.screen}><TwoFactorPrompt userId={user?.id} onVerified={() => setTwoFAState('verified')} /></View>;
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
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={layout.section}>
        {activeTab === 'dashboard' && (
          <AdminDashboard onNavigate={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'students' && (
          <>
            <Text style={typography.h5}>CONTROLE DE ALUNOS ({students.length})</Text>
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: SPACING.md }} />
            ) : students.length > 0 ? (
              students.map((s) => <StudentCard key={s.id} student={s} onEdit={setEditingStudent} />)
            ) : (
              <Text style={typography.bodyMuted}>Nenhum aluno cadastrado</Text>
            )}
            <StudentExporter />
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
            <WorkoutManager />
            <View style={{ height: SPACING.xl }} />
            <ExerciseManager />
          </>
        )}
        {activeTab === 'campaigns' && <CampaignManager />}
      </View>

      <StudentEditModal visible={!!editingStudent} student={editingStudent} onClose={() => setEditingStudent(null)} onSave={fetchStudents} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
  tabs: { flexDirection: 'row', gap: 6, marginBottom: SPACING.xxl },
  tab: { flex: 1, paddingVertical: 10, backgroundColor: COLORS.surface, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted },
  tabTextActive: { color: COLORS.background },
});