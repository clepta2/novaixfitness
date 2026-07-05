// src/components/nutrition/NutritionTips.js
// Conteúdo educativo sobre nutrição - NOVAIX FITNESS

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const TIPS = [
  {
    id: 1,
    icon: 'water',
    color: COLORS.info,
    title: 'Hidratação',
    content: 'Beba pelo menos 2.5L de água por dia. Durante o treino, consuma 200-300ml a cada 15 minutos. A desidratação reduz a performance em até 20%.',
  },
  {
    id: 2,
    icon: 'flash',
    color: COLORS.success,
    title: 'Proteína Pós-Treino',
    content: 'Consuma 20-40g de proteína dentro de 2 horas após o treino para maximizar a síntese proteica muscular. Whey, frango ou ovos são ótimas opções.',
  },
  {
    id: 3,
    icon: 'moon',
    color: COLORS.primary,
    title: 'Sono e Recuperação',
    content: 'Durma 7-9 horas por noite. O hormônio do crescimento é liberado durante o sono profundo, essencial para recuperação muscular.',
  },
  {
    id: 4,
    icon: 'leaf',
    color: COLORS.success,
    title: 'Carboidratos Complexos',
    content: 'Prefira carboidratos de baixo índice glicêmico: arroz integral, batata-doce, aveia. Eles fornecem energia sustentada sem picos de insulina.',
  },
  {
    id: 5,
    icon: 'fitness',
    color: COLORS.secondary,
    title: 'Timing Nutricional',
    content: 'Distribua a proteína ao longo do dia (0.8-1g por kg). Coma carboidratos antes do treino para energia e depois para reposição de glicogênio.',
  },
  {
    id: 6,
    icon: 'restaurant',
    color: COLORS.attention,
    title: 'Gorduras Saudáveis',
    content: 'Gorduras boas são essenciais: azeite, abacate, castanhas, peixes gordos. Elas ajudam na absorção de vitaminas e produção de hormônios.',
  },
  {
    id: 7,
    icon: 'trending-up',
    color: COLORS.primary,
    title: 'Progressão de Carga',
    content: 'Aumente a carga gradualmente (2-5% por semana) para estimular hipertrofia. Registre seus treinos para acompanhar a evolução.',
  },
  {
    id: 8,
    icon: 'time',
    color: COLORS.info,
    title: 'Descanso Entre Séries',
    content: 'Para hipertrofia: 60-90s de descanso. Para força: 2-3min. Para resistência: 30-45s. O tempo de descanso afeta o objetivo do treino.',
  },
];

function TipCard({ tip, isExpanded, onToggle }: any) {
  return (
    <TouchableOpacity style={[styles.tipCard, isExpanded && styles.tipCardExpanded]} onPress={onToggle}>
      <View style={styles.tipHeader}>
        <View style={[styles.tipIcon, { backgroundColor: tip.color + '20' }]}>
          <Ionicons name={tip.icon} size={20} color={tip.color} />
        </View>
        <Text style={styles.tipTitle}>{tip.title}</Text>
        <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textMuted} />
      </View>
      {isExpanded && (
        <Text style={styles.tipContent}>{tip.content}</Text>
      )}
    </TouchableOpacity>
  );
}

export default function NutritionTips() {
  const [expandedId, setExpandedId] = useState<any>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="bulb" size={18} color={COLORS.primary} />
        <Text style={styles.title}>DICA DE NUTRIÇÃO</Text>
      </View>

      <ScrollView style={styles.scroll}>
        {TIPS.map(tip => (
          <TipCard
            key={tip.id}
            tip={tip}
            isExpanded={expandedId === tip.id}
            onToggle={() => setExpandedId(expandedId === tip.id ? null : tip.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  scroll: { maxHeight: 400 },
  tipCard: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  tipCardExpanded: { borderColor: COLORS.primary + '40' },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  tipIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  tipTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle, flex: 1 },
  tipContent: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, marginTop: SPACING.sm, lineHeight: 20 },
});
