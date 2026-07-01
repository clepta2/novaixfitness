// src/services/mealAnalyzerTypes.ts
// Tipos de analise de refeicoes

export interface MealAnalysisResult {
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  items: string[];
  mealType: string;
}

export interface MealProfileContext {
  weight?: number;
}

export type NutritionGoals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

export type MultiplierKey = 'emagrecer' | 'ganhar' | 'manter';
