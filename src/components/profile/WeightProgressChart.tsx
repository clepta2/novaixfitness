// src/components/profile/WeightProgressChart.tsx
// Gráfico de evolução de peso corporal interativo - NOVAIX FITNESS

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface Log {
  weight: number;
  dateStr: string;
}

const DEFAULT_LOGS: Log[] = [
  { weight: 79.5, dateStr: '01/Mai' },
  { weight: 78.1, dateStr: '15/Mai' },
  { weight: 77.4, dateStr: '01/Jun' },
  { weight: 76.2, dateStr: '15/Jun' },
  { weight: 75.0, dateStr: '30/Jun' },
];

export default function WeightProgressChart() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(4);
  const targetWeight = 72.0;

  // Calculando valores mínimos e máximos para escala dos gráficos
  const minWeight = Math.min(...DEFAULT_LOGS.map(l => l.weight), targetWeight) - 2;
  const maxWeight = Math.max(...DEFAULT_LOGS.map(l => l.weight), targetWeight) + 2;
  const range = maxWeight - minWeight;

  const getBarHeightPct = (weight: number) => {
    return ((weight - minWeight) / range) * 100;
  };

  const getTargetPositionPct = () => {
    return ((targetWeight - minWeight) / range) * 100;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>EVOLUÇÃO DE PESO</Text>
        <Text style={styles.subtitle}>Sua trajetória de emagrecimento / ganho</Text>
      </View>

      {/* Gráfico de Barras */}
      <View style={styles.chartContainer}>
        {/* Linha de Meta (Target Line) */}
        <View style={[styles.targetLine, { bottom: `${getTargetPositionPct()}%` }]}>
          <View style={styles.targetDashes} />
          <Text style={styles.targetLabel}>Meta: {targetWeight.toFixed(1)}kg</Text>
        </View>

        {/* Eixo Y da escala */}
        <View style={styles.yAxis}>
          <Text style={styles.yAxisText}>{maxWeight.toFixed(0)}</Text>
          <Text style={styles.yAxisText}>{((maxWeight + minWeight) / 2).toFixed(0)}</Text>
          <Text style={styles.yAxisText}>{minWeight.toFixed(0)}</Text>
        </View>

        {/* Barras do Histórico */}
        <View style={styles.barsContainer}>
          {DEFAULT_LOGS.map((log, index) => {
            const isSelected = selectedIdx === index;
            const barHeight = getBarHeightPct(log.weight);
            return (
              <TouchableOpacity
                key={index}
                style={styles.barColumn}
                activeOpacity={0.8}
                onPress={() => setSelectedIdx(index)}
              >
                {/* Destaque do valor no topo da barra selecionada */}
                <View style={styles.valueWrapper}>
                  {isSelected && (
                    <Text style={styles.barValue}>{log.weight.toFixed(1)}kg</Text>
                  )}
                </View>

                {/* Corpo da barra */}
                <View style={styles.barTrack}>
                  <View 
                    style={[
                      styles.barFill, 
                      { height: `${barHeight}%` },
                      isSelected && styles.barFillActive
                    ]} 
                  />
                </View>

                {/* Data no Eixo X */}
                <Text style={[styles.xAxisText, isSelected && styles.xAxisTextActive]}>
                  {log.dateStr}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Perdido</Text>
          <Text style={[styles.summaryValue, { color: COLORS.success }]}>
            -{(DEFAULT_LOGS[0].weight - DEFAULT_LOGS[DEFAULT_LOGS.length - 1].weight).toFixed(1)} kg
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Restante p/ Meta</Text>
          <Text style={[styles.summaryValue, { color: COLORS.primary }]}>
            {(DEFAULT_LOGS[DEFAULT_LOGS.length - 1].weight - targetWeight).toFixed(1)} kg
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'rgba(30, 35, 42, 0.85)', borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  header: { marginBottom: SPACING.lg },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textTitle, letterSpacing: 0.5 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  chartContainer: { height: 160, position: 'relative', flexDirection: 'row', alignItems: 'stretch', paddingLeft: SPACING.lg, paddingRight: SPACING.xs },
  
  // Eixo Y
  yAxis: { position: 'absolute', left: 0, top: 20, bottom: 25, justifyContent: 'space-between', alignItems: 'flex-start', width: 25 },
  yAxisText: { fontFamily: 'Inter_500Medium', fontSize: 9, color: COLORS.textMuted },

  // Eixo X & Barras
  barsContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', marginLeft: 15 },
  barColumn: { alignItems: 'center', width: 45, height: '100%', justifyContent: 'flex-end' },
  valueWrapper: { height: 20, justifyContent: 'center', marginBottom: 4 },
  barValue: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.primary },
  barTrack: { width: 14, height: 100, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 7, overflow: 'hidden', justifyContent: 'flex-end' },
  barFill: { width: '100%', backgroundColor: COLORS.textMuted + '50', borderRadius: 7 },
  barFillActive: { backgroundColor: COLORS.primary, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 4 },
  xAxisText: { fontFamily: 'Inter_500Medium', fontSize: 9, color: COLORS.textMuted, marginTop: SPACING.sm },
  xAxisTextActive: { color: COLORS.primary, fontFamily: 'Inter_700Bold' },

  // Meta Dotted Line
  targetLine: { position: 'absolute', left: 25, right: 0, height: 1, zIndex: 5, justifyContent: 'center' },
  targetDashes: { width: '100%', height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: 'rgba(255, 45, 85, 0.4)' },
  targetLabel: { position: 'absolute', right: 4, top: -14, fontFamily: 'Montserrat_700Bold', fontSize: 8, color: '#FF2D55', backgroundColor: '#1E232A', paddingHorizontal: 4, borderRadius: 2 },

  // Sumário
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: SPACING.lg, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.05)' },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  summaryValue: { fontFamily: 'Montserrat_700Bold', fontSize: 15, marginTop: 2 },
  summaryDivider: { width: 1, height: 24, backgroundColor: COLORS.border },
});
