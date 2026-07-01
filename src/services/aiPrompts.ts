import { COACH_SYSTEM_INSTRUCTION, NUTRITION_SYSTEM_INSTRUCTION, ANALYSIS_SYSTEM_INSTRUCTION } from './aiSystemInstructions';

export function buildWorkoutPrompt(profile: any, recentWorkouts: any[], stats: any, preferences: Record<string, unknown>) {
  const obv2 = profile?.onboarding_v2 || {};
  const completedNames = recentWorkouts.map(w => w.workouts?.name).filter(Boolean);

  return `${COACH_SYSTEM_INSTRUCTION}

User profile:
- Goal: ${obv2.goal || 'general fitness'}
- Level: ${obv2.level || 'intermediate'}
- Days per week: ${obv2.days_per_week || 4}
- Available equipment: ${obv2.gym_type || 'full gym'}
- Injuries: ${obv2.injuries?.join(', ') || 'none'}
- Recent workouts: ${completedNames.join(', ') || 'none'}
- Total workouts: ${stats.total_workouts || 0}

Recommend a workout for today. Return JSON with: name, duration, exercises (array of {name, sets, reps, rest, muscle}). Keep exercises to 6-8.`;
}

export function buildNutritionPrompt(profile: any, mealHistory: any[], goal: string, restrictions: string[]) {
  const obv2 = profile?.onboarding_v2 || {};

  return `${NUTRITION_SYSTEM_INSTRUCTION}

User profile:
- Weight: ${obv2.weight || 70}kg
- Height: ${obv2.height || 170}cm
- Age: ${obv2.age_range || '25-34'}
- Goal: ${goal}
- Restrictions: ${restrictions.join(', ') || 'none'}
- Recent meals: ${mealHistory.length} logged

Provide a meal plan for today. Return JSON with: meals (array of {name, items, calories, protein, carbs, fat}).`;
}

export function buildAnalysisPrompt(stats: any, weightHistory: any[], workouts: any[]) {
  return `${ANALYSIS_SYSTEM_INSTRUCTION}

Fitness progress data:
- Total workouts: ${stats.total_workouts || 0}
- Current streak: ${stats.current_streak || 0}
- Total minutes: ${stats.total_minutes || 0}
- Weight trend: ${weightHistory.map(w => w.weight).join(' → ') || 'no data'}
- Recent workout categories: ${[...new Set(workouts.map(w => w.workouts?.category))].join(', ')}`;
}

export function parseWorkoutRecommendation(text: string): Record<string, unknown> {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) { if (__DEV__) console.warn('parseWorkoutRecommendation:', e); }
  return { name: 'Treino Personalizado', exercises: [], duration: 45 };
}

export function parseNutritionAdvice(text: string): Record<string, unknown> {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) { if (__DEV__) console.warn('parseNutritionAdvice:', e); }
  return { meals: [] };
}

export function parseProgressAnalysis(text: string) {
  return { analysis: text, insights: [], recommendations: [] };
}

export function getFallbackRecommendation(profile: any, recentWorkouts: any[]) {
  const obv2 = profile?.onboarding_v2 || {};
  const categories = recentWorkouts.map(w => w.workouts?.category);
  const lastCategory = categories[0];
  const nextCategory = lastCategory === 'Peito' ? 'Costas' :
    lastCategory === 'Costas' ? 'Pernas' :
    lastCategory === 'Pernas' ? 'Ombros' : 'Peito';

  return {
    name: `Treino de ${nextCategory}`,
    duration: obv2.level === 'beginner' ? 30 : 45,
    exercises: [
      { name: 'Exercicio 1', sets: 4, reps: 12, rest: 60, muscle: nextCategory },
      { name: 'Exercicio 2', sets: 3, reps: 15, rest: 45, muscle: nextCategory },
    ],
  };
}

export function getFallbackNutrition(profile: any, goal: string) {
  const obv2 = profile?.onboarding_v2 || {};
  const weight = obv2.weight || 70;
  const calories = goal === 'lose' ? weight * 28 : weight * 33;

  return {
    meals: [
      { name: 'Cafe da manha', items: ['Ovos', 'Fruta', 'Cafe'], calories: Math.round(calories * 0.25), protein: 20, carbs: 30, fat: 10 },
      { name: 'Almoco', items: ['Arroz', 'Frango', 'Salada'], calories: Math.round(calories * 0.35), protein: 35, carbs: 40, fat: 12 },
      { name: 'Lanche', items: ['Iogurte', 'Granola'], calories: Math.round(calories * 0.15), protein: 15, carbs: 20, fat: 5 },
      { name: 'Jantar', items: ['Peixe', 'Legumes', 'Batata'], calories: Math.round(calories * 0.25), protein: 25, carbs: 25, fat: 8 },
    ],
  };
}

export function getFallbackAnalysis(stats: any) {
  const streak = stats.current_streak || 0;
  const workouts = stats.total_workouts || 0;
  let message = 'Continue assim!';
  if (streak >= 7) message = 'Excelente consistencia!';
  else if (workouts >= 50) message = 'Voce ja completou muitos treinos!';
  else if (workouts < 10) message = 'Estude no bom caminho!';
  return { analysis: message, insights: [], recommendations: [] };
}

export function getFallbackMotivation(stats: any) {
  const messages = [
    'Cada treino te leva mais perto do seu objetivo!',
    'A consistencia e mais importante que a intensidade.',
    'Voce esta mais forte do que pensa!',
    'O unico treino ruim e o que nao aconteceu.',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
