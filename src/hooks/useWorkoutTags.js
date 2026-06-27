import { useState, useCallback, useMemo } from 'react';
import { MUSCLE_TO_BODY_PART, EQUIPMENT_TO_TAG, CATEGORY_TO_OBJECTIVE, DURATION_RANGES } from '../constants/tags';

function inferTagsFromWorkout(workout) {
  const tags = { objective: [], bodyPart: [], duration: [], equipment: [], location: [] };

  if (workout.category) {
    const objectives = CATEGORY_TO_OBJECTIVE[workout.category] || [];
    tags.objective.push(...objectives);
  }

  if (workout.exercises) {
    const muscles = new Set();
    workout.exercises.forEach(ex => {
      if (ex.muscle) muscles.add(ex.muscle);
    });
    muscles.forEach(muscle => {
      const bodyPart = MUSCLE_TO_BODY_PART[muscle];
      if (bodyPart && !tags.bodyPart.includes(bodyPart)) {
        tags.bodyPart.push(bodyPart);
      }
    });

    const equips = new Set();
    workout.exercises.forEach(ex => {
      if (ex.equipment) equips.add(ex.equipment);
    });
    equips.forEach(eq => {
      const equipTag = EQUIPMENT_TO_TAG[eq];
      if (equipTag && !tags.equipment.includes(equipTag)) {
        tags.equipment.push(equipTag);
      }
    });
  }

  const duration = workout.duration_minutes || workout.duration || 30;
  if (duration < 20) tags.duration.push('short');
  else if (duration < 40) tags.duration.push('medium');
  else if (duration < 60) tags.duration.push('long');
  else tags.duration.push('extra');

  if (!workout.equipment || workout.equipment.length === 0) {
    tags.equipment.push('none');
    tags.location.push('home');
  } else {
    tags.location.push('gym');
  }

  return tags;
}

function matchesTags(workoutTags, selectedTags) {
  for (const [category, selectedIds] of Object.entries(selectedTags)) {
    if (!selectedIds || selectedIds.length === 0) continue;
    const workoutTagList = workoutTags[category] || [];
    const hasMatch = selectedIds.some(id => workoutTagList.includes(id));
    if (!hasMatch) return false;
  }
  return true;
}

export function useWorkoutTags(workouts) {
  const [selectedTags, setSelectedTags] = useState({});

  const toggleTag = useCallback((category, tagId) => {
    setSelectedTags(prev => {
      const current = prev[category] || [];
      const updated = current.includes(tagId)
        ? current.filter(id => id !== tagId)
        : [...current, tagId];
      return { ...prev, [category]: updated };
    });
  }, []);

  const clearAllTags = useCallback(() => {
    setSelectedTags({});
  }, []);

  const activeTagCount = useMemo(() => {
    return Object.values(selectedTags).reduce((sum, arr) => sum + (arr?.length || 0), 0);
  }, [selectedTags]);

  const filteredWorkouts = useMemo(() => {
    if (activeTagCount === 0) return workouts;

    return workouts.filter(w => {
      const tags = inferTagsFromWorkout(w);
      return matchesTags(tags, selectedTags);
    });
  }, [workouts, selectedTags, activeTagCount]);

  return {
    selectedTags,
    toggleTag,
    clearAllTags,
    activeTagCount,
    filteredWorkouts,
  };
}
