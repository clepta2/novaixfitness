// src/hooks/useLibraryData.ts
// Hook de lógica para a Biblioteca de Treinos - NOVAIX FITNESS

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useSupabaseData } from './useSupabaseData';
import { supabase } from '../config/supabase';
import { isWorkoutCached } from '../services/offline';
import { DURATION_FILTERS, ACCESS_FILTERS, EQUIPMENT_FILTERS_SPECIFIC } from '../data/filters';
import { MUSCLE_TO_BODY_PART, EQUIPMENT_TO_TAG } from '../constants/tags';
import { userLevelMap, CATEGORIES_MAP, MUSCLE_MAP, filterLibraryWorkouts } from '../services/library-helpers';

interface WorkoutItem {
  id: string;
  name: string;
  category: string;
  duration: number;
  level: string;
  is_premium?: boolean;
  locked?: boolean;
  [key: string]: unknown;
}

interface FilterPill {
  category: string;
  label: string | undefined;
}

export function useLibraryData() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<WorkoutItem[]>([]);
  const [profile, setProfile] = useState<{ subscription_status?: string; onboarding?: { level?: string } } | null>(null);
  const [filterByMyLevel, setFilterByMyLevel] = useState(true);
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const [durationFilter, setDurationFilter] = useState<string | null>(null);
  const [accessFilter, setAccessFilter] = useState<string | null>(null);
  const [equipmentFilter, setEquipmentFilter] = useState<string | null>(null);
  const [muscleFilter, setMuscleFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [cachedIds, setCachedIds] = useState(() => new Set<string>());

  const { data: dbWorkouts } = useSupabaseData('workouts', {
    select: '*', orderBy: { column: 'created_at', ascending: false }, mockData: []
  }) as { data: WorkoutItem[] };

  useEffect(() => {
    if (!dbWorkouts?.length) return;
    Promise.all(dbWorkouts.map(w => isWorkoutCached(w.id).then(cached => [w.id, cached])))
      .then(results => setCachedIds(new Set(results.filter(([, c]) => c).map(([id]) => id as string))));
  }, [dbWorkouts]);

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;
      try {
        const { data } = await supabase.from('profiles').select('subscription_status, onboarding').eq('id', user.id).single();
        if (data) setProfile(data);
      } catch (err) { if (__DEV__) console.error('Erro ao carregar perfil:', err); }
    }
    loadProfile();
  }, [user?.id]);

  useEffect(() => {
    async function loadFavorites() {
      if (!user) return;
      try {
        const { data, error } = await supabase.from('favorites').select('*, workouts(*)').eq('user_id', user.id);
        if (data && !error) {
          setFavorites(data.map(f => ({
            id: f.workouts?.id, name: f.workouts?.title || f.workouts?.name,
            category: f.workouts?.category, duration: f.workouts?.duration_minutes || f.workouts?.duration || 30,
            level: f.workouts?.level || 'Intermediário'
          })));
        }
      } catch (err) { if (__DEV__) console.error(err); }
    }
    loadFavorites();
  }, [user]);

  const toggleFavorite = async (workoutId: string) => {
    if (!user) return;
    try {
      if (favorites.some(f => f.id === workoutId)) {
        await supabase.from('favorites').delete().eq('user_id', user.id).eq('workout_id', workoutId);
        setFavorites(prev => prev.filter(f => f.id !== workoutId));
      } else {
        const { data: ins } = await supabase.from('favorites').insert({ user_id: user.id, workout_id: workoutId }).select('*, workouts(*)').single();
        if (ins) setFavorites(prev => [...prev, {
          id: ins.workouts?.id, name: ins.workouts?.title || ins.workouts?.name,
          category: ins.workouts?.category, duration: ins.workouts?.duration_minutes || ins.workouts?.duration || 30,
          level: ins.workouts?.level || 'Intermediário'
        }]);
      }
    } catch (err) { if (__DEV__) console.error(err); }
  };

  const userPhysicalLevel = userLevelMap[profile?.onboarding?.level as string];
  const isSubscribed = profile?.subscription_status === 'premium' || profile?.subscription_status === 'active';

  const filteredWorkouts = useMemo(() => {
    return filterLibraryWorkouts({
      workouts: dbWorkouts,
      selectedCategory,
      searchQuery,
      filterByMyLevel,
      userPhysicalLevel,
      levelFilter,
      durationFilter,
      accessFilter,
      equipmentFilter,
      muscleFilter,
      EQUIPMENT_TO_TAG,
      MUSCLE_TO_BODY_PART
    });
  }, [dbWorkouts, selectedCategory, searchQuery, filterByMyLevel, userPhysicalLevel, levelFilter, durationFilter, accessFilter, equipmentFilter, muscleFilter]);

  const mapWorkout = useCallback((w: WorkoutItem): WorkoutItem => ({
    id: w.id, name: w.title || w.name, category: w.category || 'Treino',
    duration: w.duration_minutes || w.duration || 30, level: w.level || 'Intermediário',
    is_premium: w.is_premium || false, locked: (w.is_premium || false) && !isSubscribed
  }), [isSubscribed]);

  const clearAll = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setFilterByMyLevel(false);
    setLevelFilter(null);
    setDurationFilter(null);
    setAccessFilter(null);
    setEquipmentFilter(null);
    setMuscleFilter(null);
  };

  const popularWorkouts = filteredWorkouts.slice(0, 3).map(mapWorkout);
  const recentWorkouts = filteredWorkouts.slice(1, 4).map(mapWorkout);

  const activeFiltersCount = [
    selectedCategory && selectedCategory !== 'all',
    levelFilter && levelFilter !== 'all',
    durationFilter && durationFilter !== 'all',
    accessFilter && accessFilter !== 'all',
    equipmentFilter && equipmentFilter !== 'all',
    muscleFilter && muscleFilter !== 'all'
  ].filter(Boolean).length;

  const activePills = useMemo(() => {
    const pills: FilterPill[] = [];
    if (selectedCategory && selectedCategory !== 'all') pills.push({ category: 'category', label: CATEGORIES_MAP[selectedCategory] || selectedCategory });
    if (levelFilter && levelFilter !== 'all') pills.push({ category: 'level', label: levelFilter });
    if (durationFilter && durationFilter !== 'all') {
      const label = DURATION_FILTERS.find(f => f.key === durationFilter)?.label;
      pills.push({ category: 'duration', label });
    }
    if (accessFilter && accessFilter !== 'all') {
      const label = ACCESS_FILTERS.find(f => f.key === accessFilter)?.label;
      pills.push({ category: 'access', label });
    }
    if (equipmentFilter && equipmentFilter !== 'all') {
      const label = EQUIPMENT_FILTERS_SPECIFIC.find(f => f.key === equipmentFilter)?.label;
      pills.push({ category: 'equipment', label });
    }
    if (muscleFilter && muscleFilter !== 'all') {
      const label = MUSCLE_MAP[muscleFilter] || muscleFilter;
      pills.push({ category: 'muscle', label });
    }
    return pills;
  }, [levelFilter, durationFilter, accessFilter, equipmentFilter, selectedCategory, muscleFilter]);

  const removePill = (category: string) => {
    if (category === 'level') setLevelFilter(null);
    else if (category === 'duration') setDurationFilter(null);
    else if (category === 'access') setAccessFilter(null);
    else if (category === 'equipment') setEquipmentFilter(null);
    else if (category === 'category') setSelectedCategory(null);
    else if (category === 'muscle') setMuscleFilter(null);
  };

  return {
    router, user, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery,
    favorites, toggleFavorite, profile, filterByMyLevel, setFilterByMyLevel,
    levelFilter, setLevelFilter, durationFilter, setDurationFilter,
    accessFilter, setAccessFilter, equipmentFilter, setEquipmentFilter,
    muscleFilter, setMuscleFilter, showFilters, setShowFilters, cachedIds,
    filteredWorkouts, popularWorkouts, recentWorkouts, activeFiltersCount,
    activePills, removePill, clearAll, userPhysicalLevel, isSubscribed, dbWorkouts
  };
}
