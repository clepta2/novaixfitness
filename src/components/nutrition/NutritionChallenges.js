// src/components/nutrition/NutritionChallenges.js
// Desafios semanais via IA - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { getNutritionContent, refreshNutritionContent } from '../../services/nutritionContent';

const ICON_MAP = { Hidratação: 'water', Proteína: 'flash', Geral: 'fitness', Carboidratos: 'leaf', Sono: 'moon' };
const COLOR_MAP = { Hidratação: COLORS.info, Proteína: COLORS.success, Geral: COLORS.primary, Carboidratos: COLORS.attention, Sono: COLORS.info };
const DIFF_COLOR = { 'Fácil': COLORS.success, 'Médio': COLORS.attention, 'Difícil': COLORS.error };

const FALLBACK = [
  { title: 'Hidratação Total', desc: 'Beba 2.5L de água por 7 dias', duration: '7 dias', reward: 50, difficulty: 'Fácil', category: 'Hidratação' },
  { title: 'Proteína No Alvo', desc: 'Atinja meta de proteína por 5 dias', duration: '5 dias', reward: 75, difficulty: 'Médio', category: 'Proteína' },
  { title: 'Sem Açúcar', desc: 'Elimine açúcar refinado por 3 dias', duration: '3 dias', reward: 100, difficulty: 'Difícil', category: 'Geral' },
  { title: 'Meal Prep Master', desc: 'Prepare todas as refeições no domingo', duration: '1 dia', reward: 80, difficulty: 'Médio', category: 'Geral' },
  { title: 'Verde é Vida', desc: '3 porções de legumes por dia por 5 dias', duration: '5 dias', reward: 60, difficulty: 'Fácil', category: 'Carboidratos' },
  { title: 'Jantar Leve', desc: 'Jante antes das 19h por 7 dias', duration: '7 dias', reward: 70, difficulty: 'Médio', category: 'Geral' },
];

function ChallengeCard({ item, index, joined, onJoin }) {
  const icon = ICON_MAP[item.category] || 'fitness';
  const color = COLOR_MAP[item.category] || COLORS.primary;
  const diffColor = DIFF_COLOR[item.difficulty] || COLORS.attention;

  return (
    <View style={[styles.card, joined && styles.cardJoined]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDesc}>{item.desc}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={[styles.diffBadge, { backgroundColor: diffColor + '20' }]}>
          <Text style={[styles.diffText, { color: diffColor }]}>{item.difficulty}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time" size={12} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{item.duration}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="trophy" size={12} color={COLORS.primary} />
          <Text style={[styles.metaText, { color: COLORS.primary }]}>{item.reward} XP</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.joinBtn, joined && styles.joinBtnActive]} onPress={() => onJoin(index)}>
        <Ionicons name={joined ? 'checkmark-circle' : 'add-circle'} size={18} color={joined ? COLORS.background : COLORS.primary} />
        <Text style={[styles.joinText, joined && styles.joinTextActive]}>{joined ? 'Participando' : 'Participar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function NutritionChallenges() {
  const [challenges, setChallenges] = useState(FALLBACK);
  const [joined, setJoined] = useState(() => new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadChallenges(); }, []);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const data = await getNutritionContent('challenges');
      if (data?.challenges && data.challenges.length > 0) setChallenges(data.challenges);
    } catch { }
    finally { setLoading(false); }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await refreshNutritionContent('challenges');
      if (data?.challenges && data.challenges.length > 0) setChallenges(data.challenges);
    } catch { }
    finally { setLoading(false); }
  };

  const handleJoin = (index) => {
    setJoined(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index); else next.add(index);
      return next;
    });
  };

  const totalXP = challenges.filter((_, i) => joined.has(i)).reduce((sum, c) => sum + (c.reward || 0), 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="trophy" size={18} color={COLORS.primary} />
        <Text style={styles.title}>DESAFIOS DE NUTRIÇÃO</Text>
        <Text style={styles.xp}>{totalXP} XP</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshBtn}>
          <Ionicons name={loading ? 'sync' : 'refresh'} size={14} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{joined.size}</Text>
          <Text style={styles.statLabel}>Ativos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{challenges.length}</Text>
          <Text style={styles.statLabel}>Disponíveis</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: COLORS.primary }]}>{totalXP}</Text>
          <Text style={styles.statLabel}>XP Total</Text>
        </View>
      </View>

      <FlatList
        data={challenges}
        renderItem={({ item, index }) => (
          <ChallengeCard item={item} index={index} joined={joined.has(index)} onJoin={handleJoin} />
        )}
        keyExtractor={(_, i) => String(i)}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, flex: 1 },
  xp: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 14, color: COLORS.primary },
  refreshBtn: { padding: SPACING.xs },
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 18, color: COLORS.textTitle },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  scroll: { maxHeight: 400 },
  card: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  cardJoined: { borderColor: COLORS.primary + '40', backgroundColor: COLORS.primary + '08' },
  cardHeader: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.sm },
  iconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1 },
  cardTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle, marginBottom: 2 },
  cardDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  diffBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  diffText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  joinBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.primary },
  joinBtnActive: { backgroundColor: COLORS.primary, borderWidth: 0 },
  joinText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.primary },
  joinTextActive: { color: COLORS.background },
});
