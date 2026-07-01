
// app/coach-dashboard.tsx
// Painel do Coach com animacoes de entrada - NOVAIX FITNESS

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { Header, ErrorBoundary, CoachCommissionsPanel, Loading, EmptyState, GradientButton } from '../src/components';
import CoachStatsRow from '../src/components/admin/CoachStatsRow';
import CreateWorkoutModal from '../src/components/admin/CreateWorkoutModal';
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
        .insert({ title, name: title, category, level, duration: parseInt(duration) || 30, creator_id: user.id, equipment: '[]', exercises: '[]', tags: '[]' })
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
            <CoachStatsRow stats={stats} />

            <GradientButton
              title="PUBLICAR NOVO TREINO"
              icon="add-circle"
              onPress={() => setModalVisible(true)}
              size={isSmall ? 'md' : 'lg'}
            />

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
                    <Ionicons name="trash-outline" size={18} color={COLORS.error} onPress={() => handleDeleteWorkout(w.id)} />
                  </Animated.View>
                ))
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>COMISSOES</Text>
              <CoachCommissionsPanel />
            </View>
          </Animated.View>
        </ScrollView>

        <CreateWorkoutModal
          visible={modalVisible}
          title={title}
          duration={duration}
          level={level}
          saving={saving}
          onClose={() => setModalVisible(false)}
          onPublish={handleCreateWorkout}
          onSetTitle={setTitle}
          onSetDuration={setDuration}
          onSetLevel={setLevel}
        />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.massive },
  section: { marginBottom: SPACING.xl },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md, letterSpacing: 0.5 },
  workoutCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, padding: SPACING.lg, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  workoutInfo: { flex: 1 },
  workoutTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  workoutMeta: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
});
