// app/goals/index.js
// Metas e conquistas - DATA DRIVEN

import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { supabase } from '../../src/config/supabase';
import { ErrorBoundary } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { ACHIEVEMENT_CATEGORIES, ACHIEVEMENTS, GOAL_TYPES, getUnlockedAchievements } from '../../src/data/achievements';

export default function GoalsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [unlocked, setUnlocked] = useState([]);
  const [stats, setStats] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoalType, setNewGoalType] = useState(null);
  const [newGoalTarget, setNewGoalTarget] = useState('');

  useEffect(() => { loadData(); }, [user?.id]);

  const loadData = async () => {
    if (!user?.id) return;
    const { data: goalsData } = await supabase.from('short_term_goals').select('*').eq('user_id', user.id).eq('completed', false).order('created_at', { ascending: false });
    setGoals(goalsData || []);

    const { data: unlockedData } = await supabase.from('user_achievements').select('achievement_id').eq('user_id', user.id);
    setUnlocked(unlockedData?.map(a => a.achievement_id) || []);

    const { data: workouts } = await supabase.from('user_workouts').select('id, completed_at').eq('user_id', user.id).eq('completed', true);
    const { data: profile } = await supabase.from('profiles').select('total_xp').eq('id', user.id).single();
    setStats({ totalWorkouts: workouts?.length || 0, streak: 0, totalMeals: 0, waterStreak: 0, totalXp: profile?.total_xp || 0 });
  };

  const addGoal = async () => {
    if (!newGoalType || !newGoalTarget) return;
    const goalType = GOAL_TYPES.find(g => g.id === newGoalType);
    await supabase.from('short_term_goals').insert({ user_id: user.id, goal_type: newGoalType, target_value: parseFloat(newGoalTarget), target_unit: goalType?.unit, target_days: 30 });
    setNewGoalType(null);
    setNewGoalTarget('');
    setShowAddModal(false);
    loadData();
  };

  const unlockedNow = getUnlockedAchievements(stats);
  const newAchievements = unlockedNow.filter(a => !unlocked.includes(a.id));

  const renderAchievement = ({ item }) => {
    const isUnlocked = unlocked.includes(item.id);
    const progress = Math.min(100, ((stats[item.metric] || 0) / item.target) * 100);
    return (
      <View style={[styles.achCard, isUnlocked && styles.achUnlocked]}>
        <Ionicons name={item.icon} size={24} color={isUnlocked ? COLORS.primary : COLORS.textMuted} />
        <Text style={[styles.achName, isUnlocked && { color: COLORS.primary }]}>{item.name}</Text>
        <Text style={styles.achDesc}>{item.description}</Text>
        <View style={styles.achProgress}><View style={[styles.achFill, { width: `${progress}%` }]} /></View>
        <Text style={styles.achXp}>+{item.xp} XP</Text>
      </View>
    );
  };

  const renderGoal = ({ item }) => {
    const gt = GOAL_TYPES.find(g => g.id === item.goal_type);
    const progress = Math.min(100, ((item.current_value || 0) / item.target_value) * 100);
    return (
      <View style={styles.goalCard}>
        <View style={styles.goalRow}>
          <Ionicons name={gt?.icon || 'flag'} size={18} color={COLORS.primary} />
          <Text style={styles.goalTitle}>{gt?.label || item.goal_type}</Text>
          <Text style={styles.goalPct}>{Math.round(progress)}%</Text>
        </View>
        <View style={styles.goalBar}><View style={[styles.goalFill, { width: `${progress}%` }]} /></View>
        <Text style={styles.goalTarget}>{item.current_value || 0} / {item.target_value} {item.target_unit}</Text>
      </View>
    );
  };

  return (
    <ErrorBoundary screenName="Goals">
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={COLORS.textMuted} /></TouchableOpacity>
        <Text style={styles.headerTitle}>METAS E CONQUISTAS</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)}><Ionicons name="add-circle" size={24} color={COLORS.primary} /></TouchableOpacity>
      </View>

      {newAchievements.length > 0 && (
        <View style={styles.newBadge}>
          <Ionicons name="trophy" size={18} color={COLORS.primary} />
          <Text style={styles.newText}>{newAchievements.length} nova(s) conquista(s)!</Text>
        </View>
      )}

      <Text style={styles.sectionLabel}>CONQUISTAS ({unlocked.length}/{ACHIEVEMENTS.length})</Text>
      <FlatList data={ACHIEVEMENTS} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achList} renderItem={renderAchievement} />

      <Text style={styles.sectionLabel}>METAS ATIVAS</Text>
      <FlatList data={goals} contentContainerStyle={styles.goalList} renderItem={renderGoal} ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma meta. Toque + para criar.</Text>} />

      <Modal visible={showAddModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setShowAddModal(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modal}>
            <Text style={styles.modalTitle}>NOVA META</Text>
            <View style={styles.gtGrid}>
              {GOAL_TYPES.map((gt) => (
                <TouchableOpacity key={gt.id} style={[styles.gtCard, newGoalType === gt.id && styles.gtActive]} onPress={() => setNewGoalType(gt.id)}>
                  <Ionicons name={gt.icon} size={18} color={newGoalType === gt.id ? COLORS.primary : COLORS.textMuted} />
                  <Text style={[styles.gtLabel, newGoalType === gt.id && { color: COLORS.primary }]}>{gt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={styles.input} placeholder="Meta (ex: 10)" placeholderTextColor={COLORS.textMuted} keyboardType="numeric" value={newGoalTarget} onChangeText={setNewGoalTarget} />
            <TouchableOpacity style={styles.addBtn} onPress={addGoal}>
              <Text style={styles.addBtnText}>CRIAR</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  newBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginHorizontal: SPACING.lg, marginBottom: SPACING.sm, padding: SPACING.md, backgroundColor: COLORS.primary + '15', borderRadius: BORDER_RADIUS.md },
  newText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.primary },
  sectionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, paddingHorizontal: SPACING.lg, marginTop: SPACING.lg, marginBottom: SPACING.md },
  achList: { paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  achCard: { width: 130, padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  achUnlocked: { borderWidth: 1, borderColor: COLORS.primary },
  achName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, marginTop: SPACING.sm, textAlign: 'center' },
  achDesc: { fontFamily: 'Inter_400Regular', fontSize: 9, color: COLORS.textMuted, textAlign: 'center', marginTop: 2 },
  achProgress: { width: '100%', height: 4, backgroundColor: COLORS.surfaceOverlay, borderRadius: 2, marginTop: SPACING.sm },
  achFill: { height: 4, backgroundColor: COLORS.primary, borderRadius: 2 },
  achXp: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.primary, marginTop: SPACING.xs },
  goalList: { padding: SPACING.lg },
  goalCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  goalTitle: { flex: 1, fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle, textTransform: 'capitalize' },
  goalPct: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.primary },
  goalBar: { height: 6, backgroundColor: COLORS.surfaceOverlay, borderRadius: 3, marginTop: SPACING.md },
  goalFill: { height: 6, backgroundColor: COLORS.primary, borderRadius: 3 },
  goalTarget: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: SPACING.sm },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xxl },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, width: '85%' },
  modalTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginBottom: SPACING.lg },
  gtGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  gtCard: { width: '30%', padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  gtActive: { borderWidth: 1, borderColor: COLORS.primary },
  gtLabel: { fontFamily: 'Inter_500Medium', fontSize: 10, color: COLORS.textMuted, marginTop: SPACING.xs },
  input: { height: 48, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.lg, color: COLORS.textTitle, fontFamily: 'Inter_500Medium', marginBottom: SPACING.lg },
  addBtn: { backgroundColor: COLORS.primary, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  addBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
});
