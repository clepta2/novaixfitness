// src/components/nutrition/NutritionMyths.js
// Mitos e verdades via IA - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { getNutritionContent, refreshNutritionContent } from '../../services/nutritionContent';

const FALLBACK_MYTHS = [
  { myth: 'Carboidratos engordam', truth: 'Excesso de calorias engorda. Carboidratos são energia para treinos.', icon: 'leaf', color: COLORS.success, category: 'Macros' },
  { myth: 'Comer à noite engorda', truth: 'O que importa é o total diário de calorias.', icon: 'moon', color: COLORS.info, category: 'Timing' },
  { myth: 'Suplementos substituem refeições', truth: 'Suplementos complementam, não substituem alimentos inteiros.', icon: 'flask', color: COLORS.primary, category: 'Suplementos' },
  { myth: 'Gordura faz mal', truth: 'Gorduras boas são essenciais para hormônios e vitaminas.', icon: 'water', color: COLORS.secondary, category: 'Macros' },
  { myth: 'Precisa comer a cada 3 horas', truth: 'Frequência é preferência. O que importa são as metas diárias.', icon: 'time', color: COLORS.attention, category: 'Timing' },
  { myth: 'Proteína danifica rins', truth: 'Em pessoas saudáveis, alto consumo não causa problemas renais.', icon: 'flash', color: COLORS.success, category: 'Macros' },
  { myth: 'Detox elimina toxinas', truth: 'Fígado e rins já fazem detox natural.', icon: 'leaf', color: COLORS.info, category: 'Geral' },
  { myth: 'Exercício compensa má alimentação', truth: 'Nutrição é 70% do resultado. Exercício complementa.', icon: 'fitness', color: COLORS.primary, category: 'Geral' },
];

const ICON_MAP = { Macros: 'flash', Timing: 'time', Suplementos: 'flask', Geral: 'help-circle' };
const COLOR_MAP = { Macros: COLORS.success, Timing: COLORS.info, Suplementos: COLORS.primary, Geral: COLORS.attention };

function MythCard({ item }) {
  const [revealed, setRevealed] = useState(false);
  const icon = item.icon || ICON_MAP[item.category] || 'help-circle';
  const color = item.color || COLOR_MAP[item.category] || COLORS.primary;

  return (
    <TouchableOpacity style={styles.card} onPress={() => setRevealed(!revealed)}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <View style={styles.headerInfo}>
          <View style={[styles.categoryBadge, { backgroundColor: color + '20' }]}>
            <Text style={[styles.categoryText, { color }]}>{item.category}</Text>
          </View>
          <Ionicons name={revealed ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textMuted} />
        </View>
      </View>

      <View style={styles.mythRow}>
        <Ionicons name="close-circle" size={16} color={COLORS.error} />
        <Text style={styles.mythText}>{item.myth}</Text>
      </View>

      {revealed && (
        <View style={styles.truthRow}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
          <Text style={styles.truthText}>{item.truth}</Text>
        </View>
      )}

      {!revealed && <Text style={styles.tapHint}>Toque para ver a verdade</Text>}
    </TouchableOpacity>
  );
}

export default function NutritionMyths() {
  const [myths, setMyths] = useState(FALLBACK_MYTHS);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMyths(); }, []);

  const loadMyths = async () => {
    setLoading(true);
    try {
      const data = await getNutritionContent('myths');
      if (data?.myths && data.myths.length > 0) {
        setMyths(data.myths.map(m => ({ ...m, icon: ICON_MAP[m.category], color: COLOR_MAP[m.category] })));
      }
    } catch { }
    finally { setLoading(false); }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await refreshNutritionContent('myths');
      if (data?.myths && data.myths.length > 0) {
        setMyths(data.myths.map(m => ({ ...m, icon: ICON_MAP[m.category], color: COLOR_MAP[m.category] })));
      }
    } catch { }
    finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="help-circle" size={18} color={COLORS.primary} />
        <Text style={styles.title}>MITOS E VERDADES</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshBtn}>
          <Ionicons name={loading ? 'sync' : 'refresh'} size={14} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        {myths.map((item, i) => (
          <MythCard key={i} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, flex: 1 },
  refreshBtn: { padding: SPACING.xs },
  scroll: { maxHeight: 400 },
  card: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  iconContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  headerInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  categoryText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10 },
  mythRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xs },
  mythText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.error, flex: 1 },
  truthRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.success + '10', padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm },
  truthText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription, flex: 1 },
  tapHint: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xs },
});
