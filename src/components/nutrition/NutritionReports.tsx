// src/components/nutrition/NutritionReports.js
// Relatórios de nutrição - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { getMealLogs, getDailySummary } from '../../services/mealAnalyzer';

const REPORT_TYPES = [
  { id: 'daily', title: 'Relatório Diário', icon: 'calendar', color: COLORS.primary, desc: 'Resumo de hoje' },
  { id: 'weekly', title: 'Relatório Semanal', icon: 'bar-chart', color: COLORS.success, desc: 'Últimos 7 dias' },
  { id: 'monthly', title: 'Relatório Mensal', icon: 'trending-up', color: COLORS.info, desc: 'Últimos 30 dias' },
];

function formatDate(date: any) {
  return new Date(date).toLocaleDateString('pt-BR');
}

function generateReportHTML(type, data: any) {
  const title = type === 'daily' ? 'Diário' : type === 'weekly' ? 'Semanal' : 'Mensal';

  const mealsHTML = data.meals.map(m => `
    <tr>
      <td>${formatDate(m.logged_at)}</td>
      <td>${m.description || 'Refeição'}</td>
      <td>${m.calories || 0} kcal</td>
      <td>${m.protein || 0}g</td>
      <td>${m.carbs || 0}g</td>
      <td>${m.fat || 0}g</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html><head><meta charset="utf-8"><style>
      body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
      h1 { color: #CCFF00; background: #12161A; padding: 15px; text-align: center; border-radius: 8px; }
      h2 { color: #12161A; margin-top: 20px; }
      .summary { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
      .stat { display: inline-block; text-align: center; padding: 10px 20px; margin: 5px; background: white; border-radius: 8px; border: 1px solid #eee; }
      .statValue { font-size: 24px; font-weight: bold; color: #CCFF00; }
      .statLabel { font-size: 11px; color: #666; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th { background: #12161A; color: white; padding: 8px; text-align: left; font-size: 12px; }
      td { padding: 8px; border-bottom: 1px solid #eee; font-size: 12px; }
      .footer { text-align: center; color: #999; margin-top: 30px; font-size: 11px; }
    </style></head><body>
      <h1>📊 RELATÓRIO DE NUTRIÇÃO ${title.toUpperCase()}</h1>
      <div class="summary">
        <div class="stat"><div class="statValue">${data.totalMeals}</div><div class="statLabel">Refeições</div></div>
        <div class="stat"><div class="statValue">${Math.round(data.totalCalories)}</div><div class="statLabel">kcal Totais</div></div>
        <div class="stat"><div class="statValue">${Math.round(data.avgCalories)}</div><div class="statLabel">kcal Média/Dia</div></div>
        <div class="stat"><div class="statValue">${Math.round(data.avgProtein)}g</div><div class="statLabel">Proteína Média</div></div>
      </div>
      <h2>Detalhes das Refeições</h2>
      <table>
        <tr><th>Data</th><th>Refeição</th><th>Calorias</th><th>Proteína</th><th>Carbos</th><th>Gordura</th></tr>
        ${mealsHTML}
      </table>
      <p class="footer">Gerado por NOVAIX Fitness • ${formatDate(new Date())}</p>
    </body></html>
  `;
}

export default function NutritionReports({ userId }) {
  const [loading, setLoading] = useState(false);

  const generateReport = async (type) => {
    setLoading(true);
    try {
      const now = new Date();
      let startDate;

      if (type === 'daily') {
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
      } else if (type === 'weekly') {
        startDate = new Date(now.getTime() - 7 * 86400000);
      } else {
        startDate = new Date(now.getTime() - 30 * 86400000);
      }

      const allLogs = await getMealLogs(userId);
      const filtered = allLogs.filter(l => new Date(l.logged_at) >= startDate);

      const data = {
        meals: filtered,
        totalMeals: filtered.length,
        totalCalories: filtered.reduce((s, m) => s + (m.calories || 0), 0),
        avgCalories: filtered.length > 0 ? filtered.reduce((s, m) => s + (m.calories || 0), 0) / (type === 'daily' ? 1 : type === 'weekly' ? 7 : 30) : 0,
        avgProtein: filtered.length > 0 ? filtered.reduce((s, m) => s + (m.protein || 0), 0) / (type === 'daily' ? 1 : type === 'weekly' ? 7 : 30) : 0,
      };

      const html = generateReportHTML(type, data);
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: `Relatório ${type}` });
    } catch (err) {
      if (__DEV__) console.error('Erro ao gerar relatório:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="document-text" size={18} color={COLORS.primary} />
        <Text style={styles.title}>RELATÓRIOS</Text>
      </View>

      <View style={styles.list}>
        {REPORT_TYPES.map(report => (
          <TouchableOpacity key={report.id} style={styles.reportCard} onPress={() => generateReport(report.id)} disabled={loading}>
            <View style={[styles.reportIcon, { backgroundColor: report.color + '20' }]}>
              <Ionicons name={report.icon} size={20} color={report.color} />
            </View>
            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportDesc}>{report.desc}</Text>
            </View>
            <Ionicons name="download-outline" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  list: { gap: SPACING.sm },
  reportCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.md, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm },
  reportIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  reportInfo: { flex: 1 },
  reportTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  reportDesc: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
});
