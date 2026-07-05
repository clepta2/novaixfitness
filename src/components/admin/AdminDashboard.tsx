import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { typography } from '../../styles';

export default function AdminDashboard({ onNavigate }) {
  const [stats, setStats] = useState({ total: 0, active: 0, newMonth: 0, workouts: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    try {
      const [profilesRes, workoutsRes, recentRes] = await Promise.all([
        supabase.from('profiles').select('id, subscription_status, created_at'),
        supabase.from('workouts').select('id'),
        supabase.from('profiles').select('id, name, email, subscription_status, created_at').order('created_at', { ascending: false }).limit(5),
      ]);

      const profiles = profilesRes.data || [];
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      setStats({
        total: profiles.length,
        active: profiles.filter(p => p.subscription_status === 'premium' || p.subscription_status === 'active').length,
        newMonth: profiles.filter(p => p.created_at >= monthStart).length,
        workouts: (workoutsRes.data || []).length,
      });

      setRecentActivity((recentRes.data || []).map(p => ({
        id: p.id,
        name: p.name || 'Sem nome',
        email: p.email,
        status: p.subscription_status,
        date: new Date(p.created_at).toLocaleDateString('pt-BR'),
      })));
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar dashboard:', err);
    }
  }

  const summaryCards = [
    { key: 'total', label: 'TOTAL ALUNOS', value: stats.total, icon: 'people', color: COLORS.primary },
    { key: 'active', label: 'ATIVOS', value: stats.active, icon: 'checkmark-circle', color: COLORS.success },
    { key: 'newMonth', label: 'NOVOS/MÊS', value: stats.newMonth, icon: 'person-add', color: COLORS.info },
    { key: 'workouts', label: 'TREINOS', value: stats.workouts, icon: 'barbell', color: COLORS.secondary },
  ];

  const quickActions = [
    { key: 'students', label: 'Alunos', icon: 'people', color: COLORS.primary },
    { key: 'finance', label: 'Financeiro', icon: 'cash', color: COLORS.success },
    { key: 'content', label: 'Conteúdo', icon: 'document-text', color: COLORS.info },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.statsGrid}>
        {summaryCards.map((card) => (
          <View key={card.key} style={[styles.statCard, { borderLeftColor: card.color }]}>
            <View style={styles.statHeader}>
              <Ionicons name={card.icon as any} size={18} color={card.color} />
              <Text style={styles.statLabel}>{card.label}</Text>
            </View>
            <Text style={[styles.statValue, { color: card.color }]}>{card.value}</Text>
          </View>
        ))}
      </View>

      <Text style={[typography.label, styles.sectionTitle]}>AÇÕES RÁPIDAS</Text>
      <View style={styles.actionsRow}>
        {quickActions.map((action) => (
          <TouchableOpacity key={action.key} style={styles.actionCard} onPress={() => onNavigate?.(action.key)} accessibilityLabel={action.label} accessibilityRole="button" accessibilityHint={`Navega para a seção de ${action.label.toLowerCase()}`}>
            <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
              <Ionicons name={action.icon as any} size={22} color={action.color} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[typography.label, styles.sectionTitle]}>ATIVIDADE RECENTE</Text>
      {recentActivity.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma atividade recente</Text>
      ) : (
        recentActivity.map((item) => (
          <View key={item.id} style={styles.activityCard}>
            <View style={styles.activityInfo}>
              <Text style={styles.activityName}>{item.name}</Text>
              <Text style={styles.activityEmail}>{item.email}</Text>
            </View>
            <View style={styles.activityMeta}>
              <Text style={[styles.activityStatus, item.status === 'premium' ? styles.statusActive : styles.statusInactive]}>
                {item.status === 'premium' ? 'Premium' : 'Free'}
              </Text>
              <Text style={styles.activityDate}>{item.date}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: SPACING.xxl },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  statCard: { width: '48%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderLeftWidth: 3 },
  statHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, letterSpacing: 0.5 },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 28, marginTop: SPACING.sm },
  sectionTitle: { marginBottom: SPACING.md, marginTop: SPACING.sm },
  actionsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  actionCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  actionIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
  actionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  activityCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  activityInfo: { flex: 1 },
  activityName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  activityEmail: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  activityMeta: { alignItems: 'flex-end' },
  activityStatus: { fontFamily: 'Inter_500Medium', fontSize: 10, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  statusActive: { backgroundColor: COLORS.success + '20', color: COLORS.success },
  statusInactive: { backgroundColor: COLORS.textMuted + '20', color: COLORS.textMuted },
  activityDate: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 4 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, textAlign: 'center', paddingVertical: SPACING.xl },
});