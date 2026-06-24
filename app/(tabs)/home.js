// app/(tabs)/home.js
// Tela Principal - Treinos do Dia - NOVAIX FITNESS

import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';

const todayWorkouts = [
  {
    id: '1',
    time: '06:00',
    name: 'Cardio HIIT 30\'',
    duration: '30 min',
    intensity: 'Alta',
    completed: true,
  },
  {
    id: '2',
    time: '08:00',
    name: 'Musculação Peito/Tríceps',
    duration: '45 min',
    intensity: 'Média',
    completed: true,
  },
  {
    id: '3',
    time: '10:00',
    name: 'Calistenia Iniciante',
    duration: '30 min',
    intensity: 'Baixa',
    completed: true,
  },
  {
    id: '4',
    time: '12:00',
    name: 'Mobilidade Quadril',
    duration: '20 min',
    intensity: 'Baixa',
    completed: true,
  },
  {
    id: '5',
    time: '14:00',
    name: 'Abdominal Remador',
    duration: '25 min',
    intensity: 'Média',
    completed: true,
  },
];

const nextWorkouts = [
  {
    id: '6',
    time: '16:00',
    name: 'Cardio LISS 40\'',
    duration: '40 min',
    intensity: 'Baixa',
    locked: true,
  },
  {
    id: '7',
    time: '18:00',
    name: 'Musculação Costas/Bíceps',
    duration: '45 min',
    intensity: 'Média',
    locked: true,
  },
  {
    id: '8',
    time: '20:00',
    name: 'Flexibilidade Pernas',
    duration: '30 min',
    intensity: 'Baixa',
    locked: true,
  },
];

const categories = [
  { id: 'inferiores', label: 'Inferiores', icon: 'walk', count: 6 },
  { id: 'superiores', label: 'Superiores', icon: 'barbell', count: 6 },
  { id: 'coracao', label: 'Coração', icon: 'heart', count: 4 },
];

export default function HomeScreen() {
  const router = useRouter();
  const completedCount = todayWorkouts.filter((w) => w.completed).length;
  const totalCount = todayWorkouts.length + nextWorkouts.length;

  const renderWorkoutItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.workoutCard,
        item.completed && styles.workoutCardCompleted,
        item.locked && styles.workoutCardLocked,
      ]}
      onPress={() => !item.locked && router.push('/player')}
    >
      <View style={styles.workoutTime}>
        <Text style={styles.workoutTimeText}>{item.time}</Text>
      </View>
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutName}>{item.name}</Text>
        <Text style={styles.workoutDetails}>
          {item.duration} | {item.intensity}
        </Text>
      </View>
      {item.completed && (
        <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
      )}
      {item.locked && (
        <Ionicons name="lock-closed" size={20} color={COLORS.textMuted} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>BEM-VINDO, JEFERSON!</Text>
            <Text style={styles.date}>TERÇA-FEIRA, 24 JUNHO 2026</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle" size={40} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Resumo Diário */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>RESUMO DIÁRIO: {totalCount} TREINOS</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(completedCount / totalCount) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.summaryText}>
            Concluídos: {completedCount} / Total: {totalCount}
          </Text>
        </View>

        {/* Treinos Concluídos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TREINOS CONCLUÍDOS ({completedCount})</Text>
          {todayWorkouts.map((workout) => (
            <View key={workout.id}>
              {renderWorkoutItem({ item: workout })}
            </View>
          ))}
        </View>

        {/* Próximos Treinos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRÓXIMOS TREINOS ({nextWorkouts.length})</Text>
          {nextWorkouts.map((workout) => (
            <View key={workout.id}>
              {renderWorkoutItem({ item: workout })}
            </View>
          ))}
        </View>

        {/* Treino Ativo */}
        <View style={styles.activeSection}>
          <Text style={styles.sectionTitle}>TREINO ATIVO (1)</Text>
          <TouchableOpacity
            style={styles.activeCard}
            onPress={() => router.push('/player')}
          >
            <View style={styles.activeTime}>
              <Text style={styles.activeTimeText}>22:00</Text>
            </View>
            <View style={styles.activeInfo}>
              <Text style={styles.activeName}>Treino Final: Estrelas</Text>
              <Text style={styles.activeDetails}>3 Ex | 20 Rep | Alta Int.</Text>
            </View>
            <Ionicons name="play-circle" size={32} color={COLORS.primary} />
          </TouchableOpacity>
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
      </ScrollView>

      {/* Bottom Tab Bar */}
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
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="help-circle" size={24} color={COLORS.textMuted} />
          <Text style={styles.tabLabel}>Ajuda</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 24,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.textTitle,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  summaryText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  workoutCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  workoutCardCompleted: {
    borderColor: COLORS.success,
  },
  workoutCardLocked: {
    opacity: 0.6,
  },
  workoutTime: {
    width: 60,
  },
  workoutTimeText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.textTitle,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.textTitle,
  },
  workoutDetails: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  activeSection: {
    marginBottom: 24,
  },
  activeCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTime: {
    width: 60,
  },
  activeTimeText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.background,
  },
  activeInfo: {
    flex: 1,
  },
  activeName: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.background,
  },
  activeDetails: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.background,
    opacity: 0.8,
    marginTop: 2,
  },
  categoriesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: COLORS.textTitle,
    marginTop: 8,
  },
  categoryCount: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 20,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
