// src/services/ai/index.ts
// Exportações centralizadas de IA

export {
  askGeminiCoach,
  saveChatMessage,
  getChatHistory,
  limitHistory,
  clearChatHistory,
} from './gemini';

export { generateWithAI } from './aiProxy';

export {
  buildWorkoutPrompt,
  buildNutritionPrompt,
  buildAnalysisPrompt,
  parseWorkoutRecommendation,
  parseNutritionAdvice,
  parseProgressAnalysis,
  getFallbackRecommendation,
  getFallbackNutrition,
  getFallbackAnalysis,
  getFallbackMotivation,
} from './aiPrompts';

export {
  COACH_SYSTEM_INSTRUCTION,
  NUTRITION_SYSTEM_INSTRUCTION,
  ANALYSIS_SYSTEM_INSTRUCTION,
} from './aiSystemInstructions';

export {
  checkTokenLimit,
  incrementTokenUsage,
  estimateTokenCount,
  resetTokenUsage,
} from './aiRateLimit';

export {
  getCachedResponse,
  cacheResponse,
  clearAICache,
} from './semanticCache';

export { getMealLogs, saveMealLog, getDailySummary, calculateNutritionGoals, analyzeMealText } from './mealAnalyzer';
