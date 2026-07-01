
// app/live.js
// Página principal de lives de treino

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { useSecurity } from '../src/hooks/useSecurity';
import { Header, ErrorBoundary, LiveWorkoutCard, CreateLiveModal } from '../src/components';
import { getActiveLives, createLive, startLive } from '../src/services/liveWorkouts';

export default function LiveScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [lives, setLives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { checkAndPerform, log, ACTIONS } = useSecurity();

  useEffect(() => { loadLives(); }, []);

  const loadLives = async () => {
    const data = await getActiveLives();
    setLives(data);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLives();
    setRefreshing(false);
  };

  const handleCreateLive = async ({ title, description, workoutType, isPublic }) => {
    await checkAndPerform(ACTIONS.LIVE_CREATED, 'live', async () => {
      const live = await createLive(user.id, { title, description, workoutType, isPublic });
      await startLive(live.id);
      router.push({ pathname: '/live-room', params: { id: live.id } });
    }, 'Erro ao criar live');
  };

  const handleLivePress = (live) => {
    router.push({ pathname: '/live-room', params: { id: live.id } });
  };

  return (
    <ErrorBoundary screenName="Lives">
      <View style={styles.screen}>
        <Header title="LIVES DE TREINO" showBack onBack={() => router.back()} />

        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        >
          {lives.filter(l => l.status === 'live').length > 0 && (
            <>
              <Text style={styles.sectionTitle}>AO VIVO AGORA</Text>
              {lives.filter(l => l.status === 'live').map(live => (
                <LiveWorkoutCard key={live.id} live={live} onPress={handleLivePress} />
              ))}
            </>
          )}

          {lives.filter(l => l.status === 'scheduled').length > 0 && (
            <>
              <Text style={styles.sectionTitle}>AGENDADAS</Text>
              {lives.filter(l => l.status === 'scheduled').map(live => (
                <LiveWorkoutCard key={live.id} live={live} onPress={handleLivePress} />
              ))}
            </>
          )}

          {lives.length === 0 && !loading && (
            <View style={styles.empty}>
              <Ionicons name="videocam-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>Nenhuma live agora</Text>
              <Text style={styles.emptyDesc}>Seja o primeiro a iniciar uma live de treino!</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.fabContainer}>
          <TouchableOpacity style={styles.fab} onPress={() => setShowCreateModal(true)}>
            <Ionicons name="videocam" size={24} color="#12161A" />
            <Text style={styles.fabText}>CRIAR LIVE</Text>
          </TouchableOpacity>
        </View>

        <CreateLiveModal visible={showCreateModal} onClose={() => setShowCreateModal(false)} onCreate={handleCreateLive} />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: 100 },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md, letterSpacing: 1 },
  empty: { alignItems: 'center', paddingVertical: SPACING.massive },
  emptyTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginTop: SPACING.md },
  emptyDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.xs },
  fabContainer: { position: 'absolute', bottom: 100, left: SPACING.lg, right: SPACING.lg },
  fab: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.full },
  fabText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
});
