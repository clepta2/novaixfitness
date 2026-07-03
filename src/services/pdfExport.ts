// src/services/pdfExport.ts
// Exportação de planos em PDF - NOVAIX FITNESS

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { COLORS } from '../constants/colors';

interface MealPlan {
  week?: DayPlan[];
  summary?: { tips?: string[] };
}

interface DayPlan {
  day: string;
  totalCalories: number;
  meals: MealItem[];
}

interface MealItem {
  name: string;
  items: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface WorkoutPlan {
  week?: WorkoutDay[];
  summary?: { tips?: string[]; totalWorkouts?: number; totalDuration?: number; musclesWorked?: string[] };
}

interface WorkoutDay {
  day: string;
  name: string;
  focus: string;
  duration: number;
  exercises: Exercise[];
}

interface Exercise {
  name: string;
  muscle: string;
  sets: number;
  reps: string;
  rest: number;
}

export async function exportMealPlanToPDF(mealPlan: MealPlan): Promise<boolean> {
  if (!mealPlan?.week) return false;

  const html = generateMealPlanHTML(mealPlan);

  try {
    const { uri } = await Print.printToFileAsync({ html, base64: false });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Plano Alimentar NOVAIX' });
    }
    return true;
  } catch (error) {
    if (__DEV__) console.error('Erro ao gerar PDF:', error);
    return false;
  }
}

export async function exportWorkoutPlanToPDF(workoutPlan: WorkoutPlan): Promise<boolean> {
  if (!workoutPlan?.week) return false;

  const html = generateWorkoutPlanHTML(workoutPlan);

  try {
    const { uri } = await Print.printToFileAsync({ html, base64: false });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Rotina de Treino NOVAIX' });
    }
    return true;
  } catch (error) {
    if (__DEV__) console.error('Erro ao gerar PDF:', error);
    return false;
  }
}

function generateMealPlanHTML(plan: MealPlan): string {
  const daysHTML = plan.week!.map((day: DayPlan) => `
    <div class="day-card">
      <h3>${day.day}</h3>
      <p class="total">Total: ${day.totalCalories} kcal</p>
      ${day.meals.map((meal: MealItem) => `
        <div class="meal">
          <strong>${meal.name}</strong>
          <p>${meal.items.join(' • ')}</p>
          <div class="macros">
            <span>${meal.calories} kcal</span>
            <span>${meal.protein}g P</span>
            <span>${meal.carbs}g C</span>
            <span>${meal.fat}g G</span>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');

  const tipsHTML = plan.summary?.tips?.map((t: string) => `<li>${t}</li>`).join('') || '';

  return `
    <!DOCTYPE html>
    <html><head><meta charset="utf-8"><style>
      body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
      h1 { color: #CCFF00; background: #12161A; padding: 15px; text-align: center; border-radius: 8px; }
      h2 { color: #12161A; border-bottom: 2px solid #CCFF00; padding-bottom: 5px; }
      .day-card { background: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #CCFF00; }
      .day-card h3 { margin: 0 0 10px 0; color: #12161A; }
      .total { font-weight: bold; color: #666; margin-bottom: 10px; }
      .meal { background: white; padding: 10px; border-radius: 6px; margin-bottom: 8px; }
      .meal strong { color: #12161A; }
      .meal p { margin: 5px 0; color: #666; font-size: 14px; }
      .macros { display: flex; gap: 15px; font-size: 12px; color: #888; }
      .tips { background: #e8f5e9; padding: 15px; border-radius: 8px; margin-top: 20px; }
      .tips li { margin-bottom: 5px; }
    </style></head><body>
      <h1>🍽️ PLANO ALIMENTAR NOVAIX</h1>
      <div class="tips"><h3>Dicas</h3><ul>${tipsHTML}</ul></div>
      ${daysHTML}
      <p style="text-align:center;color:#999;margin-top:30px;font-size:12px;">Gerado por NOVAIX Fitness • ${new Date().toLocaleDateString('pt-BR')}</p>
    </body></html>
  `;
}

function generateWorkoutPlanHTML(plan: WorkoutPlan): string {
  const daysHTML = plan.week!.map((day: WorkoutDay) => `
    <div class="day-card">
      <h3>${day.day} - ${day.name}</h3>
      <p class="focus">${day.focus} • ${day.duration}min</p>
      <table>
        <tr><th>Exercício</th><th>Séries</th><th>Reps</th><th>Descanso</th></tr>
        ${day.exercises.map((ex: Exercise) => `
          <tr>
            <td>${ex.name} <small>(${ex.muscle})</small></td>
            <td>${ex.sets}</td>
            <td>${ex.reps}</td>
            <td>${ex.rest}s</td>
          </tr>
        `).join('')}
      </table>
    </div>
  `).join('');

  const tipsHTML = plan.summary?.tips?.map((t: string) => `<li>${t}</li>`).join('') || '';
  const musclesHTML = plan.summary?.musclesWorked?.join(', ') || '';

  return `
    <!DOCTYPE html>
    <html><head><meta charset="utf-8"><style>
      body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
      h1 { color: #CCFF00; background: #12161A; padding: 15px; text-align: center; border-radius: 8px; }
      h2 { color: #12161A; border-bottom: 2px solid #CCFF00; padding-bottom: 5px; }
      .day-card { background: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #CCFF00; }
      .day-card h3 { margin: 0 0 5px 0; color: #12161A; }
      .focus { color: #666; margin-bottom: 10px; }
      table { width: 100%; border-collapse: collapse; font-size: 13px; }
      th { background: #12161A; color: white; padding: 8px; text-align: left; }
      td { padding: 8px; border-bottom: 1px solid #ddd; }
      small { color: #888; }
      .summary { background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
      .tips { background: #e8f5e9; padding: 15px; border-radius: 8px; margin-top: 20px; }
      .tips li { margin-bottom: 5px; }
    </style></head><body>
      <h1>💪 ROTINA DE TREINO NOVAIX</h1>
      <div class="summary">
        <strong>Total:</strong> ${plan.summary?.totalWorkouts || 0} treinos • ${plan.summary?.totalDuration || 0} min/semana<br>
        <strong>Músculos:</strong> ${musclesHTML}
      </div>
      <div class="tips"><h3>Dicas</h3><ul>${tipsHTML}</ul></div>
      ${daysHTML}
      <p style="text-align:center;color:#999;margin-top:30px;font-size:12px;">Gerado por NOVAIX Fitness • ${new Date().toLocaleDateString('pt-BR')}</p>
    </body></html>
  `;
}
