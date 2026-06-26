// app/(tabs)/library.js
// Biblioteca de Treinos - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
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
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);

  const { data: dbWorkouts } = useSupabaseData('workouts', { 
    select: '*', 
    orderBy: { column: 'created_at', ascending: false }, 
    mockData: [] 
  });

  useEffect(() => {
    async function loadFavorites() {
      if (!user) return;
      try {
        const { data, error } = await supabase.from('favorites').select('*, workouts(*)').eq('user_id', user.id);
        if (data && !error) {
          setFavorites(data.map(f => ({
            id: f.workouts?.id,
            name: f.workouts?.title || f.workouts?.name,
            category: f.workouts?.category,
            duration: f.workouts?.duration_minutes || f.workouts?.duration || 30,
            level: f.workouts?.level || 'Intermediário'
          })));
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadFavorites();
  }, [user]);

  const toggleFavorite = async (workoutId) => {
    if (!user) return;
    try {
      if (favorites.some(f => f.id === workoutId)) {
        await supabase.from('favorites').delete().eq('user_id', user.id).eq('workout_id', workoutId);
        setFavorites(prev => prev.filter(f => f.id !== workoutId));
      } else {
        const { data: ins } = await supabase.from('favorites').insert({ user_id: user.id, workout_id: workoutId }).select('*, workouts(*)').single();
        if (ins) {
          setFavorites(prev => [...prev, {
            id: ins.workouts?.id,
            name: ins.workouts?.title || ins.workouts?.name,
            category: ins.workouts?.category,
            duration: ins.workouts?.duration_minutes || ins.workouts?.duration || 30,
            level: ins.workouts?.level || 'Intermediário'
          }]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredWorkouts = dbWorkouts.filter(w => {
    const matchesCat = !selectedCategory || w.category?.toLowerCase() === selectedCategory.label?.toLowerCase();
    const matchesQuery = !searchQuery || w.title?.toLowerCase().includes(searchQuery.toLowerCase()) || w.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const popularWorkouts = filteredWorkouts.slice(0, 3).map(w => ({ id: w.id, name: w.title || w.name, category: w.category || 'Treino', duration: w.duration_minutes || w.duration || 30, level: w.level || 'Intermediário' }));
  const recentWorkouts = filteredWorkouts.slice(1, 4).map(w => ({ id: w.id, name: w.title || w.name, category: w.category || 'Treino', duration: w.duration_minutes || w.duration || 30, level: w.level || 'Intermediário' }));

  return (
    <ScrollView style={layout.screen} contentContainerStyle={layout.scroll} showsVerticalScrollIndicator={false}>
      <View style={layout.header}>
        <View style={{ flex: 1 }}>
          <Text style={typography.h2}>Biblioteca</Text>
          <Text style={typography.bodyMuted}>Explore todos os treinos</Text>
        </View>
        <TouchableOpacity style={layout.headerBtn} onPress={() => { setShowSearch(!showSearch); if(showSearch) setSearchQuery(''); }}>
          <Ionicons name={showSearch ? "close-outline" : "search-outline"} size={22} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {showSearch && (
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={{ marginRight: SPACING.sm }} />
          <TextInput placeholder="Buscar treino..." placeholderTextColor={COLORS.textMuted} style={styles.searchInput} value={searchQuery} onChangeText={setSearchQuery} autoCapitalize="none" />
        </View>
      )}

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
          <TouchableOpacity onPress={() => { setSelectedCategory(null); setSearchQuery(''); setShowSearch(false); }}><Text style={typography.bodySmall}>Ver todos</Text></TouchableOpacity>
        </View>
        {popularWorkouts.map((w) => <WorkoutCard key={w.id} workout={w} onPress={() => router.push({ pathname: '/workout-detail', params: { id: w.id } })} />)}
      </View>

      <View style={layout.section}>
        <View style={layout.sectionHeader}>
          <Text style={typography.label}>USADOS RECENTEMENTE</Text>
          <TouchableOpacity onPress={() => { setSelectedCategory(null); setSearchQuery(''); setShowSearch(false); }}><Text style={typography.bodySmall}>Ver todos</Text></TouchableOpacity>
        </View>
        {recentWorkouts.map((w) => <WorkoutCard key={w.id} workout={w} onPress={() => router.push({ pathname: '/workout-detail', params: { id: w.id } })} />)}
      </View>

      <View style={layout.section}>
        <Text style={typography.label}>SUAS ESTATÍSTICAS</Text>
        <View style={styles.statsCard}>
          <View style={styles.statItem}><Text style={typography.price}>{dbWorkouts?.length || 0}</Text><Text style={typography.labelSmall}>Exercícios</Text></View>
          <View style={styles.statDivider} /><View style={styles.statItem}><Text style={typography.price}>{favorites.length}</Text><Text style={typography.labelSmall}>Favoritos</Text></View>
          <View style={styles.statDivider} /><View style={styles.statItem}><Text style={typography.price}>4</Text><Text style={typography.labelSmall}>Categorias</Text></View>
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
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 8, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  searchInput: { flex: 1, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14 },
});
