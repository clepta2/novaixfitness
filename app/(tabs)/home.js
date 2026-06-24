// app/(tabs)/home.js
// Tela Principal - NOVAIX FITNESS (ATUALIZADA)

import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';

const todayWorkouts = [
  { id: '1', time: '06:00', name: 'Cardio HIIT 30\'', duration: '30 min', intensity: 'Alta', completed: true, favorited: false },
  { id: '2', time: '08:00', name: 'Musculação Peito/Tríceps', duration: '45 min', intensity: 'Média', completed: true, favorited: true },
  { id: '3', time: '10:00', name: 'Calistenia Iniciante', duration: '30 min', intensity: 'Baixa', completed: true, favorited: false },
];

const categories = [
  { id: 'inferiores', label: 'Inferiores', icon: 'walk', count: 6 },
  { id: 'superiores', label: 'Superiores', icon: 'barbell', count: 6 },
  { id: 'coracao', label: 'Coração', icon: 'heart', count: 4 },
];

export default function HomeScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState(['2']);

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>BEM-VINDO!</Text>
            <Text style={styles.date}>HOJE</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>Nv.3</Text>
            <Text style={styles.statLabel}>Nível</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="star" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>2.450</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
        </View>

        {/* Treinos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TREINOS HOJE</Text>
          {todayWorkouts.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              style={styles.workoutCard}
              onPress={() => router.push('/player')}
            >
              <View style={styles.workoutTime}>
                <Text style={styles.workoutTimeText}>{workout.time}</Text>
              </View>
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutDetails}>{workout.duration} | {workout.intensity}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleFavorite(workout.id)}>
                <Ionicons 
                  name={favorites.includes(workout.id) ? "heart" : "heart-outline"} 
                  size={24} 
                  color={favorites.includes(workout.id) ? COLORS.error : COLORS.textMuted} 
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Categorias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CATEGORIAS</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
                <Ionicons name={category.icon} size={32} color={COLORS.primary} />
                <Text style={styles.categoryLabel}>{category.label}</Text>
                <Text style={styles.categoryCount}>{category.count} treinos</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Compartilhar */}
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-social" size={20} color={COLORS.primary} />
          <Text style={styles.shareButtonText}>COMPARTILHAR MEU PROGRESSO</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="barbell" size={24} color={COLORS.primary} />
          <Text style={styles.tabLabel}>Treinos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="people" size={24} color={COLORS.textMuted} />
          <Text style={styles.tabLabel}>Comunidade</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="person" size={24} color={COLORS.textMuted} />
          <Text style={styles.tabLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, padding: 20, paddingTop: 60, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24, color: COLORS.textTitle },
  date: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, alignItems: 'center' },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.primary, marginTop: 8 },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 4 },
  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, textTransform: 'uppercase', marginBottom: 12 },
  workoutCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  workoutTime: { width: 50 },
  workoutTimeText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textTitle },
  workoutInfo: { flex: 1 },
  workoutName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  workoutDetails: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  categoriesGrid: { flexDirection: 'row', gap: 12 },
  categoryCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, alignItems: 'center' },
  categoryLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle, marginTop: 8 },
  categoryCount: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  shareButton: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 },
  shareButtonText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.primary },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: COLORS.surface, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.border, paddingBottom: 20 },
  tabItem: { alignItems: 'center' },
  tabLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 4 },
});
