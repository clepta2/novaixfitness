// src/services/pdfReport.js
// Relatório mensal em PDF

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { supabase } from '../config/supabase';

export async function generateMonthlyReport(userId, month, year) {
  if (!userId) return null;

  const startDate = new Date(year, month - 1, 1).toISOString();
  const endDate = new Date(year, month, 0).toISOString();

  const [workouts, meals, water, goals] = await Promise.all([
    supabase.from('user_workouts').select('*').eq('user_id', userId).eq('completed', true).gte('completed_at', startDate).lte('completed_at', endDate),
    supabase.from('user_meal_plans').select('*').eq('user_id', userId).single(),
    supabase.from('water_logs').select('amount_ml').eq('user_id', userId).gte('logged_at', startDate).lte('logged_at', endDate),
    supabase.from('short_term_goals').select('*').eq('user_id', userId),
  ]);

  const totalWorkouts = workouts.data?.length || 0;
  const totalMinutes = workouts.data?.reduce((s, w) => s + (w.duration || 0), 0) || 0;
  const totalWater = water.data?.reduce((s, w) => s + w.amount_ml, 0) || 0;
  const goalsCompleted = goals.data?.filter(g => g.completed)?.length || 0;

  const html = generateReportHTML({ month, year, totalWorkouts, totalMinutes, totalWater, goalsCompleted, workouts: workouts.data || [] });

  try {
    const { uri } = await Print.printToFileAsync({ html, base64: false });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Relatório NOVAIX' });
    }
    return uri;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    return null;
  }
}

function generateReportHTML(data) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
    h1 { color: #CCFF00; font-size: 24px; margin-bottom: 5px; }
    h2 { color: #1E232A; font-size: 18px; margin-top: 20px; border-bottom: 2px solid #CCFF00; padding-bottom: 5px; }
    .stat { display: inline-block; width: 30%; text-align: center; margin: 10px 0; }
    .stat-value { font-size: 28px; font-weight: bold; color: #CCFF00; }
    .stat-label { font-size: 12px; color: #666; }
    .workout-item { padding: 8px 0; border-bottom: 1px solid #eee; }
    .workout-name { font-weight: bold; }
    .workout-meta { font-size: 12px; color: #666; }
    .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #999; }
  </style>
</head>
<body>
  <h1>NOVAIX FITNESS</h1>
  <p>Relatório Mensal - ${data.month}/${data.year}</p>
  
  <h2>Resumo</h2>
  <div class="stat"><div class="stat-value">${data.totalWorkouts}</div><div class="stat-label">Treinos</div></div>
  <div class="stat"><div class="stat-value">${data.totalMinutes}</div><div class="stat-label">Minutos</div></div>
  <div class="stat"><div class="stat-value">${Math.round(data.totalWater / 1000)}L</div><div class="stat-label">Água</div></div>
  
  <h2>Treinos Realizados</h2>
  ${data.workouts.map(w => `<div class="workout-item"><div class="workout-name">${w.title || 'Treino'}</div><div class="workout-meta">${new Date(w.completed_at).toLocaleDateString('pt-BR')} - ${w.duration || 0}min</div></div>`).join('')}
  
  <h2>Metas</h2>
  <p>${data.goalsCompleted} meta(s) concluída(s)</p>
  
  <div class="footer">Gerado por NOVAIX Fitness - Seu Coach Pessoal</div>
</body>
</html>`;
}
