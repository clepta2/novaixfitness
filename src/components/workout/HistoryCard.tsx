// src/components/workout/HistoryCard.tsx
// Card de histórico de treino - NOVAIX FITNESS

import React, { useRef, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { CATEGORY_COLORS } from '../../constants/categoryColors';
import { isToday, getDaysBetween, formatTimeBR } from '../../helpers/dates';

interface HistoryItem {
  completed?: boolean;
  workouts?: {
    title?: string;
    category?: string;
    duration_minutes?: number;
  };
  duration?: number;
  rating?: number;
  notes?: string;
  completed_at?: string;
  created_at?: string;
}

interface HistoryCardProps {
  item: HistoryItem;
  onPress: () => void;
  index?: number;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isToday(dateStr)) return `Hoje, ${formatTimeBR(dateStr)}`;
  if (getDaysBetween(dateStr, new Date()) === 1) return `Ontem, ${formatTimeBR(dateStr)}`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function parseNotes(notes?: string): string | null {
  if (!notes) return null;
  try {
    const p = JSON.parse(notes);
    return p.exerciseCount ? `${p.exerciseCount} exercícios` : null;
  } catch { return notes; }
}

export default memo(function HistoryCard({ item, onPress, index = 0 }: HistoryCardProps): React.ReactElement {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 40, friction: 8, delay: index * 50, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, delay: index * 50, useNativeDriver: true }),
    ]).start();
  }, []);

  const isCompleted = item.completed;
  const categoryColor = CATEGORY_COLORS[item.workouts?.category || ''] || COLORS.primary;
  const duration = item.duration || item.workouts?.duration_minutes || 0;
  const exerciseCount = parseNotes(item.notes);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
        <View style={styles.cardHeader}>
          <View style={[styles.statusDot, { backgroundColor: isCompleted ? COLORS.success : COLORS.attention }]} />
          <View style={styles.headerInfo}>
            <Text style={styles.title} numberOfLines={1}>{item.workouts?.title || 'Treino'}</Text>
            <Text style={styles.date}>{formatDate(item.completed_at || item.created_at)}</Text>
          </View>
          {item.workouts?.category && (
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '15' }]}>
              <Text style={[styles.categoryText, { color: categoryColor }]}>{item.workouts.category}</Text>
            </View>
          )}
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: COLORS.primary + '15' }]}>
              <Ionicons name="time" size={14} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.statValue}>{duration}</Text>
              <Text style={styles.statLabel}>min</Text>
            </View>
          </View>

          {item.rating && item.rating > 0 && (
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: COLORS.attention + '15' }]}>
                <Ionicons name="star" size={14} color={COLORS.attention} />
              </View>
              <View>
                <Text style={styles.statValue}>{item.rating}</Text>
                <Text style={styles.statLabel}>/5</Text>
              </View>
            </View>
          )}

          {exerciseCount && (
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: COLORS.success + '15' }]}>
                <Ionicons name="barbell" size={14} color={COLORS.success} />
              </View>
              <View>
                <Text style={styles.statValue}>{exerciseCount}</Text>
              </View>
            </View>
          )}

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: isCompleted ? COLORS.success + '15' : COLORS.attention + '15' }]}>
              <Ionicons name={isCompleted ? 'checkmark-circle' : 'play-circle'} size={14} color={isCompleted ? COLORS.success : COLORS.attention} />
            </View>
            <View>
              <Text style={[styles.statValue, { color: isCompleted ? COLORS.success : COLORS.attention }]}>
                {isCompleted ? 'Feito' : 'Andamento'}
              </Text>
            </View>
          </View>
        </View>

        {isCompleted && item.rating && item.rating >= 4 && (
          <View style={styles.excellentBadge}>
            <Ionicons name="trophy" size={12} color={COLORS.primary} />
            <Text style={styles.excellentText}>Treino Excelente!</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.sm },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: SPACING.sm },
  headerInfo: { flex: 1 },
  title: { fontFamily: 'Montserrat_600SemiBold', fontSize: 15, color: COLORS.textTitle },
  date: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  categoryBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: BORDER_RADIUS.sm },
  categoryText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, letterSpacing: 0.5 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  statIcon: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.textTitle },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  excellentBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, marginTop: SPACING.md, backgroundColor: COLORS.primary + '10', paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.sm },
  excellentText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary },
});
