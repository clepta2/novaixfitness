// src/types/nutrition.ts - Tipos de nutricao e planos alimentares

export type MealLog = {
  id: string; user_id: string; description: string;
  calories: number; protein: number; carbs: number; fat: number;
  fiber?: number; logged_at: string;
};

export type WaterLog = {
  id: string; user_id: string; amount_ml: number; logged_at: string;
};

export type Meal = {
  type: string; name: string; items: string[];
  calories: number; protein: number; carbs: number; fat: number;
};

export type DayPlan = {
  day: string; meals: Meal[]; totalCalories: number;
};

export type MealPlanSummary = {
  avgCalories: number; avgProtein: number; avgCarbs: number;
  avgFat: number; tips: string[];
};

export type MealPlan = {
  week: DayPlan[]; summary?: MealPlanSummary;
};
