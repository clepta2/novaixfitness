
// app/live-room.js
// Sala de live de treino

import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { ErrorBoundary, LiveWorkoutView } from '../src/components';
import { getLiveById, joinLive, endLive } from '../src/services/liveWorkouts';

export default function LiveRoomScreen() {
  const router = useRouter();
  const { id: rawId } = useLocalSearchParams();
  const id = rawId as string;
  const { user } = useAuth();
  const [live, setLive] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (id) loadLive(); }, [id]);

  const loadLive = async () => {
    const data = await getLiveById(id as string);
    setLive(data);
    if (data && data.status !== 'ended') {
      await joinLive(id as string, user?.id || '');
    }
    setLoading(false);
  };

  const handleEnd = async () => {
    Alert.alert('Encerrar Live', 'Tem certeza que deseja encerrar esta live?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Encerrar', style: 'destructive', onPress: async () => {
        await endLive(id as string);
        router.back();
      }},
    ]);
  };

  if (loading || !live) return <View style={styles.center} />;

  const isHost = live.host_id === user?.id;

  return (
    <ErrorBoundary screenName="LiveRoom">
      <LiveWorkoutView live={live} isHost={isHost} onEnd={isHost ? handleEnd : () => router.back()} />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: '#12161A' },
});
