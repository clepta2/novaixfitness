
// app/admin.tsx
// Painel Administrativo com animacoes de entrada - NOVAIX FITNESS


import { useMemo, useState, useEffect , useRef} from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, RefreshControl, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { SHADOWS } from '../src/constants/shadows';
import { StudentCard, FinanceStats, AdminDashboard, ErrorBoundary, Loading } from '../src/components';
import { supabase } from '../src/config/supabase';
import { is2FAEnabled } from '../src/services/totp';
import { useAuth } from '../src/context/AuthContext';
import { useResponsive } from '../src/hooks/useResponsive';
import { layout, typography } from '../src/styles';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'students', label: 'Alunos', icon: 'people' },
  { id: 'security', label: 'Seguranca', icon: 'shield-checkmark' },
  { id: 'moderation', label: 'Moderacao', icon: 'chatbubbles' },
  { id: 'finance', label: 'Financeiro', icon: 'cash' },
  { id: 'content', label: 'Conteudo', icon: 'document-text' },
];

const getAllowedTabs = (role: string) => {
  if (role === 'superadmin') return tabs;
  if (role === 'admin') return tabs.filter(t => t.id !== 'roles');
  return tabs.filter(t => ['dashboard', 'content'].includes(t.id));
};

export default function AdminScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isSmall } = useResponsive();
  const [adminRole, setAdminRole] = useState('user');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Animacoes
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
      ]).start();
    }
  }, [loading]);

  useEffect(() => {
    async function checkRole() {
      if (!user?.id) return;
      try {
        const { data: prof } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (prof) setAdminRole(prof.role);
      } catch {}
      setLoading(false);
    }
    checkRole();
  }, [user?.id]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('id, name, email, subscription_status').order('name');
      if (data && !error) setStudents(data);
    } catch {}
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
    setRefreshing(false);
  };

  const allowedTabs = getAllowedTabs(adminRole);

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Loading variant="pulse" />
      </View>
    );
  }

  return (
    <ErrorBoundary screenName="Admin">
      <View style={styles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={[typography.h2, { fontSize: isSmall ? 18 : 22 }]}>PAINEL ADMIN</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          <View style={styles.tabs}>
            {allowedTabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.tabActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Ionicons name={tab.icon as any} size={16} color={activeTab === tab.id ? COLORS.primary : COLORS.textMuted} />
                <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Conteudo */}
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {activeTab === 'dashboard' && <AdminDashboard onNavigate={(tab: string) => setActiveTab(tab)} />}
            {activeTab === 'students' && (
              <View>
                <Text style={styles.sectionTitle}>ALUNOS ({students.length})</Text>
                {students.length === 0 ? (
                  <View style={styles.empty}>
                    <Ionicons name="people-outline" size={40} color={COLORS.textMuted} />
                    <Text style={styles.emptyText}>Nenhum aluno encontrado</Text>
                  </View>
                ) : (
                  students.map((s, i) => (
                    <Animated.View key={s.id} style={{ opacity: Math.min(1, 0.5 + i * 0.05) }}>
                      <StudentCard student={s} onEdit={() => {}} />
                    </Animated.View>
                  ))
                )}
              </View>
            )}
            {activeTab === 'security' && (
              <View style={styles.placeholder}>
                <Ionicons name="shield-checkmark" size={48} color={COLORS.primary} />
                <Text style={styles.placeholderText}>Painel de Seguranca</Text>
              </View>
            )}
            {activeTab === 'moderation' && (
              <View style={styles.placeholder}>
                <Ionicons name="chatbubbles" size={48} color={COLORS.primary} />
                <Text style={styles.placeholderText}>Painel de Moderacao</Text>
              </View>
            )}
            {activeTab === 'finance' && <FinanceStats />}
            {activeTab === 'content' && (
              <View style={styles.placeholder}>
                <Ionicons name="document-text" size={48} color={COLORS.primary} />
                <Text style={styles.placeholderText}>Gerenciar Conteudo</Text>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  tabsScroll: { paddingHorizontal: SPACING.lg },
  tabs: { flexDirection: 'row', gap: SPACING.xs },
  tab: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textMuted },
  tabTextActive: { color: COLORS.background },
  content: { padding: SPACING.lg },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, marginBottom: SPACING.md },
  empty: { alignItems: 'center', paddingVertical: SPACING.xxxl },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.md },
  placeholder: { alignItems: 'center', paddingVertical: SPACING.xxxl, gap: SPACING.md },
  placeholderText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
});
