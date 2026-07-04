// src/services/planFallback.ts
// Gerador de planos fallback para Gemini - NOVAIX FITNESS

import { getAvailableExercises, DifficultyLevel, GymType } from '../data/exerciseCatalog';

export function generateFallbackMealPlan(ctx: Record<string, unknown>): Record<string, unknown> {
  const days = ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo'];
  const meals = [
    { type: 'cafe', name: 'Cafe da Manha', items: ['Ovos mexidos', 'Pao integral', 'Banana'], calories: 400, protein: 25, carbs: 50, fat: 12 },
    { type: 'almoco', name: 'Almoco', items: ['Arroz', 'Feijao', 'Frango', 'Salada'], calories: 600, protein: 40, carbs: 65, fat: 15 },
    { type: 'lanche', name: 'Lanche', items: ['Iogurte grego', 'Granola'], calories: 250, protein: 15, carbs: 35, fat: 6 },
    { type: 'jantar', name: 'Jantar', items: ['Peixe', 'Batata doce', 'Brocolis'], calories: 450, protein: 35, carbs: 45, fat: 12 },
  ];
  return { week: days.map(day => ({ day, meals, totalCalories: 1700 })), summary: { avgCalories: 1700, avgProtein: 115, avgCarbs: 195, avgFat: 36, tips: ['Beba 2.5L de agua'] } };
}

export function generateFallbackWorkoutPlan(ctx: Record<string, unknown>): Record<string, unknown> {
  const level = (ctx?.level as string) || 'intermediate';
  const levelStr = (ctx?.level as string) || 'intermediate';
  const mappedLevel = (levelStr === 'iniciante' ? 'beginner' : levelStr === 'avancado' ? 'advanced' : 'intermediate') as DifficultyLevel;
  const rawInjuries = (ctx?.injuries as any[]) || [];
  const mappedInjuries = rawInjuries.map(i => typeof i === 'string' ? i : i.bodyPart || '');
  const exercises = getAvailableExercises({ level: mappedLevel, injuries: mappedInjuries, gymType: ((ctx?.gymType as string) || 'gym') as GymType });

  const muscleGroups = ['chest', 'back', 'legs', 'shoulders', 'arms'];
  const daySplits = [
    { day: 'Segunda', name: 'Peito e Triceps', focus: 'MUSCULAÇÃO', muscles: ['chest'] },
    { day: 'Terca', name: 'Costas e Biceps', focus: 'MUSCULAÇÃO', muscles: ['back'] },
    { day: 'Quarta', name: 'Cardio', focus: 'CARDIO', muscles: [] },
    { day: 'Quinta', name: 'Pernas', focus: 'MUSCULAÇÃO', muscles: ['legs'] },
    { day: 'Sexta', name: 'Ombros e Braços', focus: 'MUSCULAÇÃO', muscles: ['shoulders', 'arms'] },
  ];

  const cardioExercises = [
    { name: 'Burpee', sets: 4, reps: '10', rest: 30, muscle: 'full_body' },
    { name: 'Mountain Climber', sets: 4, reps: '20', rest: 30, muscle: 'core' },
    { name: 'Agachamento com Salto', sets: 4, reps: '15', rest: 30, muscle: 'legs' },
    { name: 'Prancha', sets: 3, reps: '45s', rest: 30, muscle: 'core' },
  ];

  const week = daySplits.map(split => {
    if (split.muscles.length === 0) {
      return { day: split.day, name: split.name, focus: split.focus, exercises: cardioExercises, duration: 35 };
    }

    const dayExercises = exercises
      .filter(ex => split.muscles.some(m => ex.muscles?.includes(m) || ex.muscleGroup === m))
      .slice(0, 5)
      .map(ex => ({
        name: ex.name,
        sets: level === 'advanced' ? 4 : 3,
        reps: level === 'beginner' ? '12-15' : '10-12',
        rest: 60,
        muscle: ex.muscleGroup || split.muscles[0],
      }));

    return {
      day: split.day,
      name: split.name,
      focus: split.focus,
      exercises: dayExercises.length > 0 ? dayExercises : [{ name: 'Exercicio base', sets: 3, reps: '10-12', rest: 60, muscle: split.muscles[0] }],
      duration: 50,
    };
  });

  return {
    week,
    summary: {
      totalWorkouts: 5,
      musclesWorked: muscleGroups,
      tips: ['Descanse 48h entre grupos musculares', 'Beba 2.5L de agua diariamente', 'Aqueca 5-10 min antes de treinar'],
    },
  };
}
