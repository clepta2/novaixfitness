// src/components/common/StreakCalculator.tsx
// Componente reutilizável para calcular e exibir streaks

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { calculateStreakData, StreakResult } from '../../helpers/streaks'
import { useColors } from '../../context/ThemeContext';

interface StreakCalculatorProps {
  workouts: Array<{ completed?: boolean; completed_at?: string }>;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: object;
}

export function StreakCalculator({
  workouts, 
  showDetails = false, 
  size = 'md',
  style 
}: StreakCalculatorProps) {
  const colors = useColors();
  const styles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: COLORS.surface,
      borderRadius: BORDER_RADIUS.lg,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    main: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
    },
    streak: {
      fontFamily: 'Montserrat_700Bold',
      color: COLORS.textTitle,
    },
    label: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: COLORS.textDescription,
    },
    details: {
      marginTop: SPACING.sm,
    },
    detailText: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: COLORS.textMuted,
    },
    activeText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      color: COLORS.success,
      marginTop: SPACING.xs,
    },
  }), [colors]);
  const streakData: StreakResult = calculateStreakData(workouts as any);
  
  const sizeStyles = {
    sm: { iconSize: 20, fontSize: 14, padding: SPACING.sm },
    md: { iconSize: 24, fontSize: 18, padding: SPACING.md },
    lg: { iconSize: 32, fontSize: 24, padding: SPACING.lg },
  };
  
  const s = sizeStyles[size];
  
  return (
    <View style={[styles.container, { padding: s.padding }, style]}>
      <View style={styles.main}>
        <Ionicons 
          name="flame" 
          size={s.iconSize} 
          color={streakData.current > 0 ? colors.primary : colors.textMuted} 
        />
        <Text style={[styles.streak, { fontSize: s.fontSize }]}>
          {streakData.current}
        </Text>
        <Text style={styles.label}>dias</Text>
      </View>
      
      {showDetails && (
        <View style={styles.details}>
          <Text style={styles.detailText}>
            Recorde: {streakData.longest} dias
          </Text>
          {streakData.current > 0 && (
            <Text style={styles.activeText}>Ativo hoje!</Text>
          )}
        </View>
      )}
    </View>
  );
}
