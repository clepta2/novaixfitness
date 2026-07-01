// src/components/nutrition/MealPrepGuide.js
// Guia de meal prep via IA - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { getNutritionContent, refreshNutritionContent } from '../../services/nutritionContent';

const FALLBACK = [
  { day: 'Domingo', title: 'Planejamento', icon: 'clipboard', color: COLORS.info, tasks: ['Definir cardápio', 'Fazer lista de compras', 'Separar recipientes'] },
  { day: 'Domingo', title: 'Compras', icon: 'cart', color: COLORS.success, tasks: ['Proteínas (frango, peixe, ovos)', 'Carboidratos (arroz, batata)', 'Legumes e verduras'] },
  { day: 'Domingo', title: 'Preparo Base', icon: 'restaurant', color: COLORS.primary, tasks: ['Cozinhar arroz integral', 'Cozinhar feijão', 'Lavar e cortar legumes'] },
  { day: 'Domingo', title: 'Proteínas', icon: 'flash', color: COLORS.secondary, tasks: ['Grelhar peito de frango', 'Cozinhar ovos', 'Preparar peixe'] },
  { day: 'Domingo', title: 'Porcionamento', icon: 'cube', color: COLORS.attention, tasks: ['Separar em 21 porções', 'Etiquetar com dia', 'Refrigerar ou congelar'] },
  { day: 'Quarta', title: 'Reabastecimento', icon: 'refresh', color: COLORS.info, tasks: ['Retirar porções congeladas', 'Preparar saladas frescas'] },
];

function StepCard({ step, index }) {
  const [expanded, setExpanded] = useState(false);
  const icon = step.icon || 'checkmark-circle';
  const color = step.color || COLORS.primary;

  return (
    <TouchableOpacity style={styles.stepCard} onPress={() => setExpanded(!expanded)}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepNumber, { backgroundColor: color + '20' }]}>
          <Text style={[styles.stepNumberText, { color }]}>{index + 1}</Text>
        </View>
        <View style={[styles.stepIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <View style={styles.stepInfo}>
          <Text style={styles.stepDay}>{step.day}</Text>
          <Text style={styles.stepTitle}>{step.title}</Text>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textMuted} />
      </View>

      {expanded && (
        <View style={styles.stepContent}>
          {step.tasks.map((task, i) => (
            <View key={i} style={styles.taskRow}>
              <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.textMuted} />
              <Text style={styles.taskText}>{task}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function MealPrepGuide() {
  const [steps, setSteps] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadSteps(); }, []);

  const loadSteps = async () => {
    setLoading(true);
    try {
      const data = await getNutritionContent('recipes');
      if (data?.prep && data.prep.length > 0) setSteps(data.prep);
    } catch { }
    finally { setLoading(false); }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await refreshNutritionContent('recipes');
      if (data?.prep && data.prep.length > 0) setSteps(data.prep);
    } catch { }
    finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="calendar" size={18} color={COLORS.primary} />
        <Text style={styles.title}>GUIA DE MEAL PREP</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshBtn}>
          <Ionicons name={loading ? 'sync' : 'refresh'} size={14} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tipCard}>
        <Ionicons name="bulb" size={16} color={COLORS.attention} />
        <Text style={styles.tipText}>Prepare tudo no domingo e quarta para manter a frescura</Text>
      </View>

      <ScrollView style={styles.scroll}>
        {steps.map((step, index) => (
          <StepCard key={index} step={step} index={index} />
        ))}
      </ScrollView>

      <View style={styles.timeCard}>
        <Ionicons name="time" size={16} color={COLORS.success} />
        <Text style={styles.timeText}>Tempo estimado: 2-3h domingo + 30min quarta</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, flex: 1 },
  refreshBtn: { padding: SPACING.xs },
  tipCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.attention + '10', padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm, marginBottom: SPACING.md },
  tipText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textDescription, flex: 1 },
  scroll: { maxHeight: 350, marginBottom: SPACING.md },
  stepCard: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  stepNumber: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  stepNumberText: { fontFamily: 'Montserrat_700Bold', fontSize: 11 },
  stepIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  stepInfo: { flex: 1 },
  stepDay: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  stepTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  stepContent: { marginTop: SPACING.md, gap: SPACING.xs },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  taskText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription, flex: 1 },
  timeCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.success + '10', padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm },
  timeText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textDescription, flex: 1 },
});
