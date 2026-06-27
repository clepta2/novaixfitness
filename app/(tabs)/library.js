// app/(tabs)/library.js
// Tela de Biblioteca de Treinos - NOVAIX FITNESS

import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import { WorkoutCard, FavoriteWorkoutCard, FilterModal } from '../../src/components';
import { useLibraryData } from '../../src/hooks';
import { layout, typography } from '../../src/styles';
import { styles } from '../../src/styles/libraryStyles';

export default function LibraryScreen() {
  const {
    router, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery,
    favorites, toggleFavorite, filterByMyLevel, setFilterByMyLevel,
    levelFilter, setLevelFilter, durationFilter, setDurationFilter,
    accessFilter, setAccessFilter, equipmentFilter, setEquipmentFilter,
    muscleFilter, setMuscleFilter, showFilters, setShowFilters, cachedIds,
    filteredWorkouts, popularWorkouts, recentWorkouts, activeFiltersCount,
    activePills, removePill, clearAll, userPhysicalLevel, dbWorkouts
  } = useLibraryData();

  const handleWorkoutPress = (w) => {
    if (w.locked) {
      Alert.alert('Conteúdo Premium 🔒', 'Exclusivo para assinantes Premium.', [
        { text: 'Mais tarde', style: 'cancel' },
        { text: 'Ver Planos', onPress: () => router.push('/paywall') }
      ]);
    } else {
      router.push({ pathname: '/workout-detail', params: { id: w.id } });
    }
  };

  return (
    <ScrollView style={layout.screen} contentContainerStyle={layout.scroll} showsVerticalScrollIndicator={false}>
      <View style={layout.header}>
        <View style={{ flex: 1 }}>
          <Text style={typography.h2}>Biblioteca</Text>
          <Text style={typography.bodyMuted}>{userPhysicalLevel ? `Foco: ${userPhysicalLevel}` : 'Explore todos os treinos'}</Text>
        </View>
        {userPhysicalLevel && (
          <TouchableOpacity style={layout.headerBtn} onPress={() => setFilterByMyLevel(!filterByMyLevel)}>
            <Ionicons name={filterByMyLevel ? "filter" : "filter-outline"} size={22} color={filterByMyLevel ? COLORS.primary : COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={{ marginRight: 8 }} />
          <TextInput placeholder="Buscar treino, exercício ou grupo..." placeholderTextColor={COLORS.textMuted} style={styles.searchInput} value={searchQuery} onChangeText={setSearchQuery} autoCapitalize="none" />
        </View>
        <TouchableOpacity style={[styles.filterBtn, activeFiltersCount > 0 && styles.filterBtnActive]} onPress={() => setShowFilters(true)}>
          <Ionicons name="options" size={16} color={activeFiltersCount > 0 ? COLORS.background : COLORS.primary} />
          <Text style={[styles.filterBtnText, activeFiltersCount > 0 && styles.filterBtnTextActive]}>
            Filtros{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {activePills.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll} contentContainerStyle={styles.pillsContainer}>
          {activePills.map((pill, i) => (
            <TouchableOpacity key={i} style={styles.pill} onPress={() => removePill(pill.category)} activeOpacity={0.7}>
              <Text style={styles.pillText}>{pill.label}</Text>
              <Ionicons name="close-circle" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={clearAll} style={styles.clearAllBtn}><Text style={styles.clearAllText}>Limpar Tudo</Text></TouchableOpacity>
        </ScrollView>
      )}

      <FilterModal
        visible={showFilters} onClose={() => setShowFilters(false)}
        category={selectedCategory} setCategory={setSelectedCategory}
        level={levelFilter} setLevel={setLevelFilter}
        duration={durationFilter} setDuration={setDurationFilter}
        access={accessFilter} setAccess={setAccessFilter}
        equipment={equipmentFilter} setEquipment={setEquipmentFilter}
        muscle={muscleFilter} setMuscle={setMuscleFilter}
        resultsCount={filteredWorkouts.length} onClearAll={clearAll}
      />

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
        <View style={layout.sectionHeader}>
          <Text style={typography.label}>MAIS POPULARES</Text>
          <TouchableOpacity onPress={clearAll}><Text style={typography.bodySmall}>Ver todos</Text></TouchableOpacity>
        </View>
        {popularWorkouts.length > 0 ? popularWorkouts.map((w) => <WorkoutCard key={w.id} workout={w} locked={w.locked} onPress={handleWorkoutPress} isOfflineCached={cachedIds.has(w.id)} />) : (
          <View style={styles.empty}><Ionicons name="search" size={32} color={COLORS.textMuted} /><Text style={typography.bodyMuted}>Nenhum treino encontrado</Text></View>
        )}
      </View>

      <View style={layout.section}>
        <View style={layout.sectionHeader}>
          <Text style={typography.label}>USADOS RECENTEMENTE</Text>
          <TouchableOpacity onPress={clearAll}><Text style={typography.bodySmall}>Ver todos</Text></TouchableOpacity>
        </View>
        {recentWorkouts.length > 0 ? recentWorkouts.map((w) => <WorkoutCard key={w.id} workout={w} locked={w.locked} onPress={handleWorkoutPress} isOfflineCached={cachedIds.has(w.id)} />) : (
          <View style={styles.empty}><Ionicons name="search" size={32} color={COLORS.textMuted} /><Text style={typography.bodyMuted}>Nenhum treino encontrado</Text></View>
        )}
      </View>

      <View style={layout.section}>
        <Text style={typography.label}>SUAS ESTATÍSTICAS</Text>
        <View style={styles.statsCard}>
          <View style={styles.statItem}><Text style={typography.price}>{dbWorkouts?.length || 0}</Text><Text style={typography.labelSmall}>Exercícios</Text></View>
          <View style={styles.statDivider} /><View style={styles.statItem}><Text style={typography.price}>{favorites.length}</Text><Text style={typography.labelSmall}>Favoritos</Text></View>
          <View style={styles.statDivider} /><View style={styles.statItem}><Text style={typography.price}>{new Set(dbWorkouts?.map(w => w.category).filter(Boolean)).size || 0}</Text><Text style={typography.labelSmall}>Categorias</Text></View>
        </View>
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}
