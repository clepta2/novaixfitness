// app/(tabs)/library.js
// Biblioteca de Treinos - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import { SPACING } from '../../src/constants/spacing';
import { CategoryCard, WorkoutCard, FavoriteWorkoutCard } from '../../src/components';
import { categories } from '../../src/data/workouts';
import { useAuth } from '../../src/context/AuthContext';
import { useSupabaseData } from '../../src/hooks';
import { supabase } from '../../src/config/supabase';
import { layout, typography } from '../../src/styles';

export default function LibraryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Carregar todos os treinos do Supabase
  const { data: dbWorkouts, loading } = useSupabaseData('workouts', {
    select: '*',
    orderBy: { column: 'created_at', ascending: false },
    mockData: []
  });

  const [favorites, setFavorites] = useState([]);

  // Carregar favoritos do usuário
  useEffect(() => {
    async function loadFavorites() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('*, workouts(*)')
          .eq('user_id', user.id);

        if (data && !error) {
          const formatted = data.map(f => ({
            id: f.workouts?.id,
            name: f.workouts?.title || f.workouts?.name,
            category: f.workouts?.category,
            duration: f.workouts?.duration_minutes || f.workouts?.duration || 30,
            level: f.workouts?.level || 'Intermediário',
            favoritedAt: 'Favoritado'
          }));
          setFavorites(formatted);
        }
      } catch (err) {
        console.error('Erro ao carregar favoritos:', err);
      }
    }
    loadFavorites();
  }, [user]);

  const toggleFavorite = async (workoutId) => {
    if (!user) return;
    try {
      const isFav = favorites.some(f => f.id === workoutId);
      if (isFav) {
        // Remover dos favoritos no banco
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('workout_id', workoutId);
        
        setFavorites(prev => prev.filter(f => f.id !== workoutId));
      } else {
        // Adicionar aos favoritos no banco
        const { data: inserted } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, workout_id: workoutId })
          .select('*, workouts(*)')
          .single();

        if (inserted) {
          const newFav = {
            id: inserted.workouts?.id,
            name: inserted.workouts?.title || inserted.workouts?.name,
            category: inserted.workouts?.category,
            duration: inserted.workouts?.duration_minutes || inserted.workouts?.duration || 30,
            level: inserted.workouts?.level || 'Intermediário',
            favoritedAt: 'Agora'
          };
          setFavorites(prev => [...prev, newFav]);
        }
      }
    } catch (err) {
      console.error('Erro ao favoritar/desfavoritar:', err);
    }
  };

  // Filtrar treinos populares e recentes baseado no Supabase
  const filteredWorkouts = selectedCategory 
    ? dbWorkouts.filter(w => w.category?.toLowerCase() === selectedCategory.label?.toLowerCase())
    : dbWorkouts;

  const popularWorkouts = filteredWorkouts.slice(0, 3).map(w => ({
    id: w.id,
    name: w.title || w.name,
    category: w.category || 'Treino',
    duration: w.duration_minutes || w.duration || 30,
    level: w.level || 'Intermediário'
  }));

  const recentWorkouts = filteredWorkouts.slice(1, 4).map(w => ({
    id: w.id,
    name: w.title || w.name,
    category: w.category || 'Treino',
    duration: w.duration_minutes || w.duration || 30,
    level: w.level || 'Intermediário'
  }));

  return (
    <ScrollView style={layout.screen} contentContainerStyle={layout.scroll} showsVerticalScrollIndicator={false}>
      <View style={layout.header}>
        <View>
          <Text style={typography.h2}>Biblioteca</Text>
          <Text style={typography.bodyMuted}>Explore todos os treinos</Text>
        </View>
        <TouchableOpacity style={layout.headerBtn}><Ionicons name="search-outline" size={20} color={COLORS.textMuted} /></TouchableOpacity>
      </View>

      {favorites.length > 0 && (
        <View style={layout.section}>
          <View style={layout.sectionHeader}>
            <View style={styles.titleRow}><Ionicons name="heart" size={16} color={COLORS.error} /><Text style={typography.label}>MEUS FAVORITOS</Text></View>
            <Text style={typography.h5}>{favorites.length}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.favScroll}>
            {favorites.map((w) => <FavoriteWorkoutCard key={w.id} workout={w} onPress={() => router.push({ pathname: '/workout-detail', params: { id: w.id } })} onRemove={toggleFavorite} />)}
          </ScrollView>
        </View>
      )}

      <View style={layout.section}>
        <Text style={typography.label}>CATEGORIAS</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((cat) => <CategoryCard key={cat.id} category={cat} isActive={selectedCategory?.id === cat.id} onPress={setSelectedCategory} />)}
        </View>
      </View>

      <View style={layout.section}>
        <View style={layout.sectionHeader}>
          <Text style={typography.label}>MAIS POPULARES</Text>
          <TouchableOpacity><Text style={typography.bodySmall}>Ver todos</Text></TouchableOpacity>
        </View>
        {popularWorkouts.map((w) => <WorkoutCard key={w.id} workout={w} onPress={() => router.push({ pathname: '/workout-detail', params: { id: w.id } })} />)}
      </View>

      <View style={layout.section}>
        <View style={layout.sectionHeader}>
          <Text style={typography.label}>USADOS RECENTEMENTE</Text>
          <TouchableOpacity><Text style={typography.bodySmall}>Ver todos</Text></TouchableOpacity>
        </View>
        {recentWorkouts.map((w) => <WorkoutCard key={w.id} workout={w} onPress={() => router.push({ pathname: '/workout-detail', params: { id: w.id } })} />)}
      </View>

      <View style={layout.section}>
        <Text style={typography.label}>SUAS ESTATÍSTICAS</Text>
        <View style={styles.statsCard}>
          <View style={styles.statItem}><Text style={typography.price}>103</Text><Text style={typography.labelSmall}>Exercícios</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}><Text style={typography.price}>{favorites.length}</Text><Text style={typography.labelSmall}>Favoritos</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}><Text style={typography.price}>4</Text><Text style={typography.labelSmall}>Categorias</Text></View>
        </View>
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  favScroll: { marginLeft: -SPACING.xl, paddingLeft: SPACING.xl },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  statsCard: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.xl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 40, backgroundColor: COLORS.border },
});
