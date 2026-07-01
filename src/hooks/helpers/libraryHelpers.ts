// src/hooks/helpers/libraryHelpers.ts
// Pure helpers for library data transformations

import { DURATION_FILTERS, ACCESS_FILTERS, EQUIPMENT_FILTERS_SPECIFIC } from '../../data/filters';
import { CATEGORIES_MAP, MUSCLE_MAP } from '../../services/library-helpers';

interface DbWorkout {
  id: string;
  title?: string;
  name?: string;
  category?: string;
  duration_minutes?: number;
  duration?: number;
  level?: string;
  is_premium?: boolean;
}

interface WorkoutCard {
  id: string;
  name: string;
  category: string;
  duration: number;
  level: string;
  is_premium: boolean;
  locked: boolean;
}

interface FavoriteRow {
  workouts?: { id?: string; title?: string; name?: string; category?: string; duration_minutes?: number; duration?: number; level?: string };
}

interface LibraryFilters {
  selectedCategory: string;
  levelFilter: string;
  durationFilter: string;
  accessFilter: string;
  equipmentFilter: string;
  muscleFilter: string;
}

interface ActivePill {
  category: string;
  label: string | undefined;
}

export function mapWorkoutToCard(w: DbWorkout, isSubscribed: boolean): WorkoutCard {
  return {
    id: w.id, name: w.title || w.name || '', category: w.category || 'Treino',
    duration: w.duration_minutes || w.duration || 30, level: w.level || 'Intermediário',
    is_premium: w.is_premium || false, locked: (w.is_premium || false) && !isSubscribed,
  };
}

export function mapFavoriteRow(f: FavoriteRow): WorkoutCard | null {
  if (!f.workouts?.id) return null;
  return {
    id: f.workouts.id, name: f.workouts.title || f.workouts.name || '',
    category: f.workouts.category || 'Treino', duration: f.workouts.duration_minutes || f.workouts.duration || 30,
    level: f.workouts.level || 'Intermediário',
    is_premium: false,
    locked: false,
  };
}

export function computeActivePills(filters: LibraryFilters): ActivePill[] {
  const { selectedCategory, levelFilter, durationFilter, accessFilter, equipmentFilter, muscleFilter } = filters;
  const pills: ActivePill[] = [];
  if (selectedCategory && selectedCategory !== 'all') {
    pills.push({ category: 'category', label: CATEGORIES_MAP[selectedCategory] || selectedCategory });
  }
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
}

export function countActiveFilters(filters: LibraryFilters): number {
  const { selectedCategory, levelFilter, durationFilter, accessFilter, equipmentFilter, muscleFilter } = filters;
  return [
    selectedCategory && selectedCategory !== 'all',
    levelFilter && levelFilter !== 'all',
    durationFilter && durationFilter !== 'all',
    accessFilter && accessFilter !== 'all',
    equipmentFilter && equipmentFilter !== 'all',
    muscleFilter && muscleFilter !== 'all',
  ].filter(Boolean).length;
}
