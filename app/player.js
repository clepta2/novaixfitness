// app/player.js
// Tela de Treinos Diários - NOVAIX FITNESS

import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { YoutubeIframe } from 'react-native-youtube-iframe';
import * as KeepAwake from 'expo-keep-awake';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { SetsTracker } from '../src/components';
import { recordWorkoutCompletion } from '../src/services/gamification';
import { sendWorkoutCompletedNotification, sendAchievementNotification, sendStreakNotification } from '../src/services/notifications';
import { dailyWorkouts, activeWorkout } from '../src/data/dailyWorkouts';
import { layout, typography } from '../src/styles';

import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';

const { width } = Dimensions.get('window');

export default function PlayerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    KeepAwake.activateKeepAwakeAsync();
    return () => KeepAwake.deactivateKeepAwakeAsync();
  }, []);

  // Buscar treino dinâmico se ID for passado via parâmetros de rota
  useEffect(() => {
    if (!params.id) return;
    supabase.from('workouts').select('*').eq('id', params.id).single()
      .then(({ data }) => {
        if (data) startWorkout({
          id: data.id,
          name: data.title || data.name,
          duration: data.duration_minutes || data.duration || 30,
          videoId: data.video_id || 'dQw4w9WgXcQ'
        });
      })
      .catch((err) => console.error(err));
  }, [params.id]);

  useEffect(() => {
    if (!isRunning || timer <= 0) return;
    timerRef.current = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [isRunning, timer]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const startWorkout = (workout) => {
    setSelectedWorkout(workout);
    setTimer((workout.duration_minutes || workout.duration || 30) * 60);
    setIsPlaying(true);
    setIsRunning(true);
  };

  const handleFinish = async () => {
    let gamResult = { xpGained: 0, newAchievements: [] };
    try {
      if (user) {
        const payload = {
          completed: true,
          completed_at: new Date().toISOString(),
          duration: selectedWorkout?.duration || 0,
          notes: `Treino finalizado: ${selectedWorkout?.name || ''}`,
        };
        const { error } = params.user_workout_id
          ? await supabase.from('user_workouts').update(payload).eq('id', params.user_workout_id)
          : await supabase.from('user_workouts').insert({ ...payload, user_id: user.id, workout_id: selectedWorkout?.id?.length === 36 ? selectedWorkout.id : null });

        if (!error) {
          const { data: profile } = await supabase.from('profiles').select('total_workouts, total_minutes').eq('id', user.id).single();
          if (profile) {
            await supabase.from('profiles').update({
              total_workouts: (profile.total_workouts || 0) + 1,
              total_minutes: (profile.total_minutes || 0) + (selectedWorkout?.duration || 0),
            }).eq('id', user.id);
          }

          gamResult = await recordWorkoutCompletion(user.id, selectedWorkout);
        }
      }
    } catch (err) {
      console.error('Erro no fluxo de conclusão:', err);
    }

    if (gamResult.xpGained > 0) {
      sendWorkoutCompletedNotification(selectedWorkout?.name || 'Treino', gamResult.xpGained);
    }
    if (gamResult.newAchievements?.length > 0) {
      sendAchievementNotification(gamResult.newAchievements[0].name);
    }
    if (gamResult.streak > 0 && gamResult.streak % 7 === 0) {
      sendStreakNotification(gamResult.streak);
    }

    let msg = 'Parabéns!';
    if (gamResult.xpGained > 0) msg += ` +${gamResult.xpGained} XP`;
    if (gamResult.newAchievements?.length > 0) msg += `\n\nConquista desbloqueada: ${gamResult.newAchievements[0].name}`;

    Alert.alert('Treino Concluído!', msg, [
      {
        text: 'Pular',
          onPress: () => {
            setIsPlaying(false);
            setSelectedWorkout(null);
            setTimer(0);
          },
          style: 'cancel',
        },
        {
          text: 'Compartilhar',
          onPress: async () => {
            try {
              if (user) {
                await supabase.from('posts').insert({
                  user_id: user.id,
                  content: `Acabei de finalizar o treino "${selectedWorkout?.name || 'Treino'}" de ${selectedWorkout?.duration || 30} min! Rumo à evolução! 🚀💪`,
                });
              }
            } catch (err) {
              console.error('Erro ao postar no feed:', err);
            } finally {
              setIsPlaying(false);
              setSelectedWorkout(null);
              setTimer(0);
            }
          },
        },
      ]
    );
  };

  // Player view
  if (isPlaying && selectedWorkout) {
    return (
      <View style={layout.screen}>
        <ScrollView contentContainerStyle={layout.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.videoContainer}>
            <YoutubeIframe height={220} width={width - 40} videoId={selectedWorkout.videoId} play={isRunning} onChangeState={() => {}} allowsInlineMediaPlayback modestbranding rel={false} controls={1} />
          </View>

          <View style={styles.timerCard}>
            <Text style={typography.label}>TEMPO RESTANTE</Text>
            <Text style={typography.timer}>{formatTime(timer)}</Text>
            <Text style={typography.bodyMuted}>{selectedWorkout.name}</Text>
          </View>

          <View style={styles.playerControls}>
            <TouchableOpacity style={styles.playerBtn} onPress={() => setIsRunning(!isRunning)}>
              <Ionicons name={isRunning ? 'pause' : 'play'} size={28} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.playerBtn, styles.playerBtnDanger]} onPress={handleFinish}>
              <Ionicons name="stop" size={28} color={COLORS.error} />
            </TouchableOpacity>
          </View>

          <SetsTracker userWorkoutId={params.user_workout_id} workout={selectedWorkout} />
        </ScrollView>
      </View>
    );
  }

  // List view
  return (
    <WorkoutListView
      dailyWorkouts={dailyWorkouts}
      activeWorkout={activeWorkout}
      startWorkout={startWorkout}
    />
  );
}

const styles = StyleSheet.create({
  videoContainer: { borderRadius: BORDER_RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.xl, backgroundColor: '#000' },
  timerCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.xl, borderWidth: 2, borderColor: COLORS.primary },
  playerControls: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.xl },
  playerBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.primary },
  playerBtnDanger: { borderColor: COLORS.error },
});
