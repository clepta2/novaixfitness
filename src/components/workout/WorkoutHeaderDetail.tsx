// src/components/workout/WorkoutHeaderDetail.tsx
// Cabeçalho do detalhe do treino - NOVAIX FITNESS

import React, { useRef, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { CATEGORY_COLORS } from '../../constants/categoryColors';
import Badge from '../ui/Badge';

interface Workout {
  title?: string;
  name?: string;
  description?: string;
  category?: string;
  level?: string;
  rating?: number;
}

interface WorkoutHeaderDetailProps {
  workout: Workout;
  isFavorite: boolean;
  isOffline: boolean;
  onBack: () => void;
  onFavorite: () => void;
  onOptions: () => void;
}

export default memo(function WorkoutHeaderDetail({ workout, isFavorite, isOffline, onBack, onFavorite, onOptions }: WorkoutHeaderDetailProps): React.ReactElement {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 30, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const categoryColor = CATEGORY_COLORS[workout?.category || ''] || COLORS.primary;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
        </TouchableOpacity>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={onFavorite}>
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={22} color={isFavorite ? COLORS.error : COLORS.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onOptions}>
            <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.titleSection}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>{workout?.title || workout?.name}</Text>
          {isOffline && <Badge value="Offline" variant="success" size="sm" />}
        </View>
        <Text style={styles.description}>{workout?.description || 'Treino completo para evoluir seu físico.'}</Text>
        <View style={styles.tagRow}>
          <View style={[styles.tag, { backgroundColor: categoryColor + '15' }]}>
            <Text style={[styles.tagText, { color: categoryColor }]}>{workout?.category || 'Geral'}</Text>
          </View>
          <View style={styles.tag}>
            <Ionicons name="level" size={12} color={COLORS.textMuted} />
            <Text style={styles.tagText}>{workout?.level || 'Intermediário'}</Text>
          </View>
          {workout?.rating != null && workout.rating > 0 && (
            <View style={styles.tag}>
              <Ionicons name="star" size={12} color={COLORS.attention} />
              <Text style={styles.tagText}>{workout.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, marginBottom: SPACING.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  actions: { flexDirection: 'row', gap: SPACING.xs },
  actionBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  titleSection: {},
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm, marginBottom: SPACING.xs },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 22, color: COLORS.textTitle, flex: 1, lineHeight: 28 },
  description: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, lineHeight: 20, marginBottom: SPACING.md },
  tagRow: { flexDirection: 'row', gap: SPACING.xs },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border },
  tagText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted },
});
