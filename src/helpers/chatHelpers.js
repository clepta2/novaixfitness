import { MEAL_KEYWORDS, FOOD_KEYWORDS, QUANTITY_PATTERN } from '../data/nutritionKeywords';

export function detectMealLog(text) {
  const lower = text.toLowerCase();
  return MEAL_KEYWORDS.some(k => lower.includes(k)) || FOOD_KEYWORDS.some(k => lower.includes(k)) || QUANTITY_PATTERN.test(lower);
}

export function formatMealSummary(meal) {
  const items = meal.items?.length > 0 ? meal.items.join(', ') : 'Refeição';
  return `Refeição registrada!\n\n${meal.description || items}\n\nMacros:\n• ${meal.calories} kcal\n• ${meal.protein}g proteína\n• ${meal.carbs}g carboidratos\n• ${meal.fat}g gordura\n• ${meal.fiber}g fibra\n\nSalvo no seu diário de nutrição!`;
}
