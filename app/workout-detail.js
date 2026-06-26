// app/workout-detail.js
// Detalhe do Treino - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { Badge, ProgressBar, ExerciseAccordion, WorkoutInfo, VideoPreview, MoreOptionsModal, RatingModal } from '../src/components';
import { supabase } from '../src/config/supabase';
import { useAuth } from '../src/context/AuthContext';
import { shareWorkout } from '../src/services/share';
import { layout, typography } from '../src/styles';

const fallbackWorkout = {
  id: '1', name: 'Peito e Tríceps', category: 'MUSCULAÇÃO', level: 'Intermediário', duration: 50,
  description: 'Treino focado em hipertrofia para peito e tríceps.',
  video_id: 'dQw4w9WgXcQ', equipment: ['Barra', 'Halteres', 'Polia'],
  exercises: [
    { id: '1', name: 'Supino Reto Barra', sets: 4, reps: 10, rest: 60, muscle: 'Peito' },
    { id: '2', name: 'Supino Inclinado Halteres', sets: 4, reps: 12, rest: 45, muscle: 'Peito Superior' },
    { id: '3', name: 'Crossover Polia', sets: 3, reps: 15, rest: 30, muscle: 'Peito' },
  ],
};

export default function WorkoutDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const { data, error } = await supabase
          .from('workouts')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          setWorkout({ ...fallbackWorkout, id });
        } else {
          setWorkout(data);
        }
      } catch {
        setWorkout({ ...fallbackWorkout, id });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchWorkout();
  }, [id]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user?.id || !id) return;
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('workout_id', id)
        .single();
      setIsFavorite(!!data);
    };
    checkFavorite();
  }, [user?.id, id]);

  const toggleFavorite = useCallback(async () => {
    if (!user?.id || !id) return;
    try {
      if (isFavorite) {
        await supabase.from('favorites').delete().eq('user_id', user.id).eq('workout_id', id);
      } else {
        await supabase.from('favorites').insert({ user_id: user.id, workout_id: id });
      }
      setIsFavorite(!isFavorite);
    } catch {
      Alert.alert('Erro', 'Falha ao atualizar favorito');
    }
  }, [user?.id, id, isFavorite]);

  const handleOption = useCallback((opt) => {
    setShowOptions(false);
    if (opt === 'share') return shareWorkout(workout);
    if (opt === 'rate') return setShowRating(true);
    Alert.alert('Sucesso', opt === 'add' ? 'Adicionado à rotina' : opt === 'save' ? 'Salvo offline' : 'Reportado');
  }, [workout]);

  const handleStart = useCallback(async () => {
    if (!user?.id || !id) return;
    try {
      const { data, error } = await supabase
        .from('user_workouts')
        .insert({
          user_id: user.id,
          workout_id: id,
          completed: false,
          duration: workout?.duration_minutes || workout?.duration || 0,
        })
        .select('id')
        .single();

      const userWorkoutId = data?.id || null;
      router.push({ pathname: '/player', params: { id, user_workout_id: userWorkoutId } });
    } catch {
      router.push({ pathname: '/player', params: { id } });
    }
  }, [user?.id, id, router, workout]);

  const handleRating = useCallback(async ({ rating, comment }) => {
    if (!user?.id || !id) return;
    try {
      await supabase.from('user_workouts').upsert({
        user_id: user.id, workout_id: id, rating, notes: comment,
      }, { onConflict: 'user_id,workout_id' });
      Alert.alert('Obrigado!', 'Sua avaliação foi registrada.');
    } catch {
      Alert.alert('Erro', 'Falha ao salvar avaliação.');
    }
  }, [user?.id, id]);

  if (loading) {
    return (
      <View style={[layout.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const exercises = workout?.exercises || [];
  const totalSets = exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0);
  const calories = Math.round((workout?.duration_minutes || workout?.duration || 45) * 8);

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={layout.scroll} showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <TouchableOpacity onPress={() => router.back()} style={layout.headerBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h4}>Detalhe do Treino</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={layout.headerBtn} onPress={toggleFavorite}>
              <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={22} color={isFavorite ? COLORS.error : COLORS.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={layout.headerBtn} onPress={() => setShowOptions(true)}>
              <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <VideoPreview videoId={workout?.video_id} showVideo={showVideo} onToggle={() => setShowVideo(!showVideo)} />

        <View style={layout.section}>
          <View style={styles.titleRow}>
            <Text style={typography.h3}>{workout?.title || workout?.name}</Text>
            <Badge value={workout?.level} variant="primary" size="sm" />
          </View>
          <Text style={typography.bodyMuted}>{workout?.description}</Text>
        </View>

        <WorkoutInfo 
          workout={{
            ...workout,
            duration: workout?.duration_minutes || workout?.duration || 45
          }} 
          totalSets={totalSets} 
          calories={calories} 
        />

        <View style={layout.section}>
          <Text style={typography.label}>EXERCÍCIOS ({exercises.length})</Text>
          <ProgressBar value={0} max={100} label="PROGRESSO" />
        </View>

        {exercises.map((ex) => (
          <ExerciseAccordion key={ex.id || ex.name} exercise={ex} isOpen={expanded === (ex.id || ex.name)} onToggle={() => setExpanded(expanded === (ex.id || ex.name) ? null : (ex.id || ex.name))} />
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={layout.footer}>
        <TouchableOpacity style={styles.startBtn} activeOpacity={0.8} onPress={handleStart}>
          <Ionicons name="play" size={20} color={COLORS.background} />
          <Text style={typography.h4}>INICIAR TREINO</Text>
        </TouchableOpacity>
      </View>

      <MoreOptionsModal visible={showOptions} onSelect={handleOption} onClose={() => setShowOptions(false)} />
      <RatingModal visible={showRating} onClose={() => setShowRating(false)} onSubmit={handleRating} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRight: { flexDirection: 'row', gap: SPACING.sm },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.md },
});
