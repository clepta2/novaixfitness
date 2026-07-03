// src/data/exerciseCatalog.ts
// Catálogo completo de exercícios - NOVAIX FITNESS

interface CatalogExercise {
  name: string;
  equipment: string;
  muscles: string[];
  injuries_avoid: string[];
}

interface MuscleGroupExercises {
  beginner: CatalogExercise[];
  intermediate: CatalogExercise[];
  advanced: CatalogExercise[];
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type GymType = 'home' | 'park' | 'gym';

export const EXERCISE_CATALOG: Record<string, MuscleGroupExercises> = {
  chest: {
    beginner: [
      { name: 'Flexão de Joelhos', equipment: 'none', muscles: ['chest', 'triceps'], injuries_avoid: [] },
      { name: 'Flexão Inclinada', equipment: 'bench', muscles: ['chest', 'triceps'], injuries_avoid: [] },
      { name: 'Chest Press Máquina', equipment: 'machine', muscles: ['chest'], injuries_avoid: ['shoulder'] },
      { name: 'Supino Halteres', equipment: 'dumbbells', muscles: ['chest', 'triceps'], injuries_avoid: [] },
    ],
    intermediate: [
      { name: 'Supino Reto Barra', equipment: 'barbell', muscles: ['chest', 'triceps'], injuries_avoid: ['shoulder'] },
      { name: 'Supino Inclinado Halteres', equipment: 'dumbbells', muscles: ['chest_upper'], injuries_avoid: ['shoulder'] },
      { name: 'Crossover Polia', equipment: 'cable', muscles: ['chest'], injuries_avoid: ['shoulder'] },
      { name: 'Crucifixo Máquina', equipment: 'machine', muscles: ['chest'], injuries_avoid: [] },
    ],
    advanced: [
      { name: 'Supino Reto Barra', equipment: 'barbell', muscles: ['chest', 'triceps'], injuries_avoid: ['shoulder'] },
      { name: 'Supino Inclinado Barra', equipment: 'barbell', muscles: ['chest_upper'], injuries_avoid: ['shoulder'] },
      { name: 'Crossover Polia', equipment: 'cable', muscles: ['chest'], injuries_avoid: ['shoulder'] },
      { name: 'Flexão com Palma', equipment: 'none', muscles: ['chest', 'triceps'], injuries_avoid: [] },
    ],
  },
  back: {
    beginner: [
      { name: 'Puxada Frontal', equipment: 'machine', muscles: ['back', 'biceps'], injuries_avoid: ['back'] },
      { name: 'Remada Máquina', equipment: 'machine', muscles: ['back'], injuries_avoid: ['back'] },
      { name: 'Remada Unilateral', equipment: 'dumbbells', muscles: ['back'], injuries_avoid: ['back'] },
    ],
    intermediate: [
      { name: 'Puxada Frontal', equipment: 'machine', muscles: ['back', 'biceps'], injuries_avoid: ['back'] },
      { name: 'Remada Curvada', equipment: 'barbell', muscles: ['back', 'biceps'], injuries_avoid: ['back'] },
      { name: 'Remada Unilateral', equipment: 'dumbbells', muscles: ['back'], injuries_avoid: ['back'] },
    ],
    advanced: [
      { name: 'Barra Fixa', equipment: 'none', muscles: ['back', 'biceps'], injuries_avoid: ['back'] },
      { name: 'Remada Curvada', equipment: 'barbell', muscles: ['back', 'biceps'], injuries_avoid: ['back'] },
      { name: 'Remada Cavalinho', equipment: 'dumbbells', muscles: ['back'], injuries_avoid: ['back'] },
    ],
  },
  legs: {
    beginner: [
      { name: 'Leg Press Parcial', equipment: 'machine', muscles: ['quadriceps', 'glutes'], injuries_avoid: ['knee', 'hip'] },
      { name: 'Cadeira Extensora', equipment: 'machine', muscles: ['quadriceps'], injuries_avoid: ['knee'] },
      { name: 'Cadeira Flexora', equipment: 'machine', muscles: ['hamstrings'], injuries_avoid: [] },
      { name: 'Panturrilha em Pé', equipment: 'machine', muscles: ['calves'], injuries_avoid: ['ankle'] },
    ],
    intermediate: [
      { name: 'Agachamento Livre', equipment: 'barbell', muscles: ['quadriceps', 'glutes'], injuries_avoid: ['knee', 'back'] },
      { name: 'Leg Press 45°', equipment: 'machine', muscles: ['quadriceps', 'glutes'], injuries_avoid: ['knee'] },
      { name: 'Cadeira Extensora', equipment: 'machine', muscles: ['quadriceps'], injuries_avoid: ['knee'] },
      { name: 'Cadeira Flexora', equipment: 'machine', muscles: ['hamstrings'], injuries_avoid: [] },
      { name: 'Stiff', equipment: 'barbell', muscles: ['hamstrings', 'glutes'], injuries_avoid: ['back'] },
    ],
    advanced: [
      { name: 'Agachamento Livre', equipment: 'barbell', muscles: ['quadriceps', 'glutes'], injuries_avoid: ['knee', 'back'] },
      { name: 'Leg Press 45°', equipment: 'machine', muscles: ['quadriceps', 'glutes'], injuries_avoid: ['knee'] },
      { name: 'Agachamento Búlgaro', equipment: 'dumbbells', muscles: ['quadriceps', 'glutes'], injuries_avoid: ['knee'] },
      { name: 'Stiff Romano', equipment: 'barbell', muscles: ['hamstrings', 'glutes'], injuries_avoid: ['back'] },
    ],
  },
  shoulders: {
    beginner: [
      { name: 'Desenvolvimento Máquina', equipment: 'machine', muscles: ['shoulders'], injuries_avoid: ['shoulder'] },
      { name: 'Elevação Lateral Leve', equipment: 'dumbbells', muscles: ['shoulders'], injuries_avoid: ['shoulder'] },
      { name: 'Face Pull', equipment: 'cable', muscles: ['shoulders', 'traps'], injuries_avoid: ['shoulder'] },
    ],
    intermediate: [
      { name: 'Desenvolvimento Barra', equipment: 'barbell', muscles: ['shoulders'], injuries_avoid: ['shoulder'] },
      { name: 'Elevação Lateral', equipment: 'dumbbells', muscles: ['shoulders'], injuries_avoid: ['shoulder'] },
      { name: 'Face Pull', equipment: 'cable', muscles: ['shoulders', 'traps'], injuries_avoid: ['shoulder'] },
    ],
    advanced: [
      { name: 'Desenvolvimento Barra', equipment: 'barbell', muscles: ['shoulders'], injuries_avoid: ['shoulder'] },
      { name: 'Elevação Lateral', equipment: 'dumbbells', muscles: ['shoulders'], injuries_avoid: ['shoulder'] },
      { name: 'Push Press', equipment: 'barbell', muscles: ['shoulders', 'triceps'], injuries_avoid: ['shoulder'] },
    ],
  },
  arms: {
    beginner: [
      { name: 'Rosca Martelo', equipment: 'dumbbells', muscles: ['biceps', 'forearms'], injuries_avoid: ['wrist'] },
      { name: 'Rosca Alternada', equipment: 'dumbbells', muscles: ['biceps'], injuries_avoid: ['wrist'] },
      { name: 'Tríceps Corda', equipment: 'cable', muscles: ['triceps'], injuries_avoid: [] },
    ],
    intermediate: [
      { name: 'Rosca Direta Barra', equipment: 'barbell', muscles: ['biceps'], injuries_avoid: ['wrist'] },
      { name: 'Rosca Martelo', equipment: 'dumbbells', muscles: ['biceps', 'forearms'], injuries_avoid: ['wrist'] },
      { name: 'Tríceps Pulley', equipment: 'cable', muscles: ['triceps'], injuries_avoid: [] },
    ],
    advanced: [
      { name: 'Rosca Scott Barra', equipment: 'barbell', muscles: ['biceps'], injuries_avoid: ['wrist'] },
      { name: 'Rosca Martelo', equipment: 'dumbbells', muscles: ['biceps', 'forearms'], injuries_avoid: ['wrist'] },
      { name: 'Tríceps Pulley', equipment: 'cable', muscles: ['triceps'], injuries_avoid: [] },
    ],
  },
  abs: {
    beginner: [
      { name: 'Abdominal Crunch', equipment: 'none', muscles: ['abs'], injuries_avoid: ['back'] },
      { name: 'Prancha', equipment: 'none', muscles: ['abs', 'core'], injuries_avoid: ['back'] },
      { name: 'Elevação de Pernas', equipment: 'none', muscles: ['abs_lower'], injuries_avoid: ['back'] },
    ],
    intermediate: [
      { name: 'Abdominal Crunch', equipment: 'none', muscles: ['abs'], injuries_avoid: ['back'] },
      { name: 'Prancha', equipment: 'none', muscles: ['abs', 'core'], injuries_avoid: ['back'] },
      { name: 'Russian Twist', equipment: 'none', muscles: ['abs', 'obliques'], injuries_avoid: ['back'] },
    ],
    advanced: [
      { name: 'Abdominal Crunch', equipment: 'none', muscles: ['abs'], injuries_avoid: ['back'] },
      { name: 'Prancha', equipment: 'none', muscles: ['abs', 'core'], injuries_avoid: ['back'] },
      { name: 'Hanging Leg Raise', equipment: 'none', muscles: ['abs_lower'], injuries_avoid: ['back'] },
    ],
  },
  cardio: {
    beginner: [
      { name: 'Caminhada Rápida', equipment: 'none', muscles: ['cardio'], injuries_avoid: ['knee', 'ankle'] },
      { name: 'Bike', equipment: 'machine', muscles: ['cardio', 'legs'], injuries_avoid: [] },
      { name: 'Elíptico', equipment: 'machine', muscles: ['cardio'], injuries_avoid: ['knee'] },
    ],
    intermediate: [
      { name: 'Corrida', equipment: 'none', muscles: ['cardio'], injuries_avoid: ['knee', 'ankle'] },
      { name: 'Bike', equipment: 'machine', muscles: ['cardio', 'legs'], injuries_avoid: [] },
      { name: 'Remo Ergométrico', equipment: 'machine', muscles: ['cardio', 'back'], injuries_avoid: ['back'] },
    ],
    advanced: [
      { name: 'HIIT Esteira', equipment: 'machine', muscles: ['cardio'], injuries_avoid: ['knee', 'ankle'] },
      { name: 'Burpee', equipment: 'none', muscles: ['cardio', 'full_body'], injuries_avoid: ['knee', 'back'] },
      { name: 'Mountain Climber', equipment: 'none', muscles: ['cardio', 'core'], injuries_avoid: ['wrist'] },
    ],
  },
};

export function filterByInjuries(exercises: CatalogExercise[], injuries: string[]): CatalogExercise[] {
  if (!injuries || injuries.length === 0) return exercises;
  return exercises.filter(ex =>
    !ex.injuries_avoid.some(injury => injuries.includes(injury))
  );
}

export function filterByEquipment(exercises: CatalogExercise[], availableEquipment: string[]): CatalogExercise[] {
  if (!availableEquipment || availableEquipment.length === 0) return exercises;
  return exercises.filter(ex =>
    ex.equipment === 'none' || availableEquipment.includes(ex.equipment)
  );
}

export function getExercisesByMuscle(muscle: string, level: DifficultyLevel): CatalogExercise[] {
  return EXERCISE_CATALOG[muscle]?.[level] || [];
}

export function getAvailableExercises({ level = 'intermediate', injuries = [], gymType = 'gym' }: { level?: DifficultyLevel; injuries?: string[]; gymType?: GymType }) {
  const equipment = gymType === 'home' ? ['none', 'dumbbells'] :
    gymType === 'park' ? ['none'] :
    ['barbell', 'dumbbells', 'machine', 'cable', 'bench', 'none'];

  const allExercises: (CatalogExercise & { muscleGroup: string })[] = [];
  const muscles = Object.keys(EXERCISE_CATALOG);

  for (const muscle of muscles) {
    const levelExercises = EXERCISE_CATALOG[muscle][level] || [];
    const filtered = filterByInjuries(levelExercises, injuries);
    const withEquipment = filterByEquipment(filtered, equipment);
    allExercises.push(...withEquipment.map(ex => ({ ...ex, muscleGroup: muscle })));
  }

  return allExercises;
}
