// app/player-list.js
// Lista de Treinos Diarios - NOVAIX FITNESS

import { View, ScrollView, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../src/constants/colors';
import { WorkoutListView, ErrorBoundary } from '../src/components';
import usePlayerList from '../src/hooks/usePlayerList';
import { layout } from '../src/styles';

export default function PlayerListScreen() {
  const { workouts, active, loading, refreshing, onRefresh, startWorkout } = usePlayerList();

  if (loading) {
    return (
      <View style={[layout.screen, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ErrorBoundary screenName="PlayerList">
    <View style={layout.screen}>
      <ScrollView
        contentContainerStyle={layout.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <WorkoutListView
          dailyWorkouts={workouts}
          activeWorkout={active}
          startWorkout={startWorkout}
        />
      </ScrollView>
    </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
