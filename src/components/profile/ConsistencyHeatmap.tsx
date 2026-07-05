// src/components/profile/ConsistencyHeatmap.tsx
// Gráfico de consistência de treinos anual estilo GitHub - NOVAIX FITNESS

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

// Níveis de verde Nix para consistência
const LEVEL_COLORS = [
  'rgba(255, 255, 255, 0.05)',  // 0 - Inativo
  'rgba(204, 255, 0, 0.2)',      // 1 - Pouco ativo
  'rgba(204, 255, 0, 0.5)',      // 2 - Ativo
  'rgba(204, 255, 0, 0.9)',      // 3 - Super ativo
];

export default function ConsistencyHeatmap() {
  const [selectedCell, setSelectedCell] = useState<{ day: string; count: number } | null>(null);

  // Gerar grid mock de 14 semanas (98 dias)
  const generateMockGrid = () => {
    const weeks = [];
    const today = new Date();
    for (let w = 13; w >= 0; w--) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        // Gera valores fictícios baseados em probabilidade
        const val = Math.random() > 0.65 ? Math.floor(Math.random() * 3) + 1 : 0;
        const cellDate = new Date(today);
        cellDate.setDate(today.getDate() - (w * 7 + (6 - d)));
        days.push({
          level: val,
          dateStr: cellDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
        });
      }
      weeks.push({ weekIndex: w, days });
    }
    return weeks;
  };

  const [gridData] = useState<any[]>(generateMockGrid());

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>CONSISTÊNCIA DE TREINOS</Text>
        <Text style={styles.subtitle}>Sua frequência nos últimos 3 meses</Text>
      </View>

      {/* Grid de Calor */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heatmapRow}>
          {/* Labels de dia da semana */}
          <View style={styles.dayLabels}>
            {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
              <Text key={i} style={styles.dayLabel}>{d}</Text>
            ))}
          </View>

          {/* Grid propriamente dito */}
          <View style={styles.gridContainer}>
            {gridData.map((week, wIdx) => (
              <View key={wIdx} style={styles.weekColumn}>
                {week.days.map((day, dIdx) => (
                  <TouchableOpacity
                    key={dIdx}
                    style={[styles.cell, { backgroundColor: LEVEL_COLORS[day.level] }]}
                    activeOpacity={0.7}
                    onPress={() => setSelectedCell({ day: day.dateStr, count: day.level })}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Legend & Tooltip info */}
      <View style={styles.footer}>
        <View style={styles.tooltipContainer}>
          {selectedCell ? (
            <Text style={styles.tooltipText}>
              {selectedCell.count === 0 ? 'Nenhum treino' : `${selectedCell.count} série(s)`} em {selectedCell.day}
            </Text>
          ) : (
            <Text style={styles.tooltipHint}>Toque em um quadrado para ver detalhes</Text>
          )}
        </View>

        <View style={styles.legend}>
          <Text style={styles.legendText}>Menos</Text>
          {LEVEL_COLORS.map((color, i) => (
            <View key={i} style={[styles.legendCell, { backgroundColor: color }]} />
          ))}
          <Text style={styles.legendText}>Mais</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'rgba(30, 35, 42, 0.85)', borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  header: { marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textTitle, letterSpacing: 0.5 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  scrollContent: { paddingVertical: SPACING.xs },
  heatmapRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  dayLabels: { gap: 6, justifyContent: 'space-around', height: 115 },
  dayLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 9, color: COLORS.textMuted },
  gridContainer: { flexDirection: 'row', gap: 6 },
  weekColumn: { gap: 6 },
  cell: { width: 11, height: 11, borderRadius: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.md, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: SPACING.sm },
  tooltipContainer: { flex: 1 },
  tooltipText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.primary },
  tooltipHint: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendText: { fontFamily: 'Inter_400Regular', fontSize: 9, color: COLORS.textMuted },
  legendCell: { width: 10, height: 10, borderRadius: 2 },
});
