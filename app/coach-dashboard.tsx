
// app/coach-dashboard.tsx
// Painel do Coach com animacoes de entrada - NOVAIX FITNESS

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Animated, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { SHADOWS } from '../src/constants/shadows';
import { Header, ErrorBoundary, CoachCommissionsPanel, Loading, EmptyState, GradientButton, Input } from '../src/components';
import { supabase } from '../src/config/supabase';
import { useAuth } from '../src/context/AuthContext';
import { useResponsive } from '../src/hooks/useResponsive';

export default function CoachDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isSmall } = useResponsive();
  const [stats, setStats] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Musculacao');
  const [level, setLevel] = useState('Iniciante');
  const [duration, setDuration] = useState('30');
  const [saving, setSaving] = useState(false);

  // Animacoes
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(20), []);

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
      ]).start();
    }
  }, [loading]);

  useEffect(() => {
    if (user?.id) fetchCoachData();
  }, [user?.id]);

  const fetchCoachData = async () => {
    try {
      const [profileRes, workoutsRes] = await Promise.all([
        supabase.from('creator_profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('workouts').select('*').eq('creator_id', user.id).order('created_at', { ascending: false })
      ]);
      if (profileRes.error) throw profileRes.error;
      setStats(profileRes.data);
      setWorkouts(workoutsRes.data || []);
    } catch (err) {
      console.warn('Erro ao carregar dados do painel do coach:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkout = async () => {
    if (!title || !duration) return Alert.alert('Erro', 'Preencha o titulo e a duracao.');
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('workouts')
        .insert({
          title, name: title, category, level,
          duration: parseInt(duration) || 30,
          creator_id: user.id, equipment: '[]', exercises: '[]', tags: '[]'
        })
        .select()
        .single();
      if (error) throw error;
      Alert.alert('Sucesso', 'Treino criado com sucesso!');
      setWorkouts(prev => [data, ...prev]);
      setModalVisible(false);
      setTitle('');
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWorkout = (id: string) => {
    Alert.alert('Excluir Treino', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        const { error } = await supabase.from('workouts').delete().eq('id', id);
        if (error) Alert.alert('Erro', error.message);
        else setWorkouts(prev => prev.filter(w => w.id !== id));
      }}
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Loading variant="pulse" />
      </View>
    );
  }

  return (
    <ErrorBoundary screenName="CoachDashboard">
      <View style={styles.screen}>
        <Header title="PAINEL DO COACH" showBack onBack={() => router.back()} />
        <ScrollView contentContainerStyle={styles.scroll}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={[styles.statCard, { borderLeftColor: COLORS.primary }]}>
                <Ionicons name="people" size={20} color={COLORS.primary} />
                <Text style={styles.statValue}>{stats?.subscriber_count || 0}</Text>
                <Text style={styles.statTitle}>Alunos</Text>
              </View>
              <View style={[styles.statCard, { borderLeftColor: COLORS.success }]}>
                <Ionicons name="cash" size={20} color={COLORS.success} />
                <Text style={styles.statValue}>R$ {stats?.total_earned?.toFixed(2) || '0.00'}</Text>
                <Text style={styles.statTitle}>Faturado</Text>
              </View>
              <View style={[styles.statCard, { borderLeftColor: COLORS.attention }]}>
                <Ionicons name="percent" size={20} color={COLORS.attention} />
                <Text style={styles.statValue}>{((stats?.commission_rate || 0.70) * 100).toFixed(0)}%</Text>
                <Text style={styles.statTitle}>Comissao</Text>
              </View>
            </View>

            {/* Botao criar */}
            <GradientButton
              title="PUBLICAR NOVO TREINO"
              icon="add-circle"
              onPress={() => setModalVisible(true)}
              size={isSmall ? 'md' : 'lg'}
            />

            {/* Lista de treinos */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>MEUS TREINOS ({workouts.length})</Text>
              {workouts.length === 0 ? (
                <EmptyState icon="barbell-outline" title="Nenhum treino" message="Publique seu primeiro treino publico." />
              ) : (
                workouts.map((w, i) => (
                  <Animated.View key={w.id} style={[styles.workoutCard, { opacity: Math.min(1, 0.5 + i * 0.1) }]}>
                    <View style={styles.workoutInfo}>
                      <Text style={styles.workoutTitle}>{w.title}</Text>
                      <Text style={styles.workoutMeta}>{w.category} · {w.duration}min · {w.level}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteWorkout(w.id)} style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                    </TouchableOpacity>
                  </Animated.View>
                ))
              )}
            </View>

            {/* Comissoes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>COMISSOES</Text>
              <CoachCommissionsPanel />
            </View>
          </Animated.View>
        </ScrollView>

        {/* Modal de criacao */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalHeader}>NOVO TREINO PUBLICO</Text>
              
              <Text style={styles.label}>TITULO</Text>
              <TextInput style={styles.input} placeholder="Ex: Queima de Gordura HIIT" placeholderTextColor={COLORS.textMuted} value={title} onChangeText={setTitle} />
              
              <Text style={styles.label}>DURACAO (min)</Text>
              <TextInput style={styles.input} placeholder="30" placeholderTextColor={COLORS.textMuted} value={duration} onChangeText={setDuration} keyboardType="numeric" />
              
              <Text style={styles.label}>NIVEL</Text>
              <View style={styles.row}>
                {['Iniciante', 'Intermediario', 'Avancado'].map(lvl => (
                  <TouchableOpacity key={lvl} style={[styles.optionBtn, level === lvl && styles.optionBtnActive]} onPress={() => setLevel(lvl)}>
                    <Text style={[styles.optionBtnText, level === lvl && styles.optionBtnTextActive]}>{lvl}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelText}>CANCELAR</Text>
                </TouchableOpacity>
                <GradientButton title="PUBLICAR" onPress={handleCreateWorkout} loading={saving} size="sm" />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.massive },

  // Stats
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  statCard: { flex: 1, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 3, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, alignItems: 'center', gap: 4, ...SHADOWS.sm },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  statTitle: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },

  // Section
  section: { marginBottom: SPACING.xl },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md, letterSpacing: 0.5 },

  // Workout list
  workoutCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, padding: SPACING.lg, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  workoutInfo: { flex: 1 },
  workoutTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  workoutMeta: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  deleteBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.error + '15', justifyContent: 'center', alignItems: 'center' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: SPACING.xl },
  modalContent: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.lg },
  modalHandle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.lg },
  modalHeader: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginBottom: SPACING.lg, textAlign: 'center' },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, marginTop: SPACING.md, marginBottom: SPACING.xs, letterSpacing: 0.5 },
  input: { backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, color: COLORS.textTitle, padding: SPACING.md, fontFamily: 'Inter_400Regular', fontSize: 13 },
  row: { flexDirection: 'row', gap: SPACING.xs, marginVertical: SPACING.xs },
  optionBtn: { flex: 1, paddingVertical: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  optionBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  optionBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted },
  optionBtnTextActive: { color: COLORS.background },
  modalActions: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.xl },
  cancelBtn: { flex: 1, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.error },
  cancelText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.error },
});
