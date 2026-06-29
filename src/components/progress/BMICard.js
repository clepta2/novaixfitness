// src/components/progress/BMICard.js
// Card de IMC animado - NOVAIX FITNESS

import React, { useRef, useEffect, memo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const BMI_CATEGORIES = [
  { min: 0, max: 18.5, label: 'Abaixo do peso', color: COLORS.info, icon: 'trending-down' },
  { min: 18.5, max: 25, label: 'Peso normal', color: COLORS.success, icon: 'checkmark-circle' },
  { min: 25, max: 30, label: 'Sobrepeso', color: COLORS.attention, icon: 'warning' },
  { min: 30, max: 100, label: 'Obesidade', color: COLORS.error, icon: 'alert-circle' },
];

function getBMICategory(bmi) {
  return BMI_CATEGORIES.find(c => bmi >= c.min && bmi < c.max) || BMI_CATEGORIES[3];
}

export default memo(function BMICard({ bmi, height, weight }) {
  const bmiValue = parseFloat(bmi) || 0;
  const category = getBMICategory(bmiValue);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 30, friction: 8, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.leftSection}>
        <View style={[styles.bmiCircle, { borderColor: category.color }]}>
          <Text style={[styles.bmiValue, { color: category.color }]}>{bmiValue.toFixed(1)}</Text>
          <Text style={styles.bmiLabel}>IMC</Text>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: category.color + '15' }]}>
          <Ionicons name={category.icon} size={14} color={category.color} />
          <Text style={[styles.categoryText, { color: category.color }]}>{category.label}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        {height && (
          <View style={styles.dataRow}>
            <Ionicons name="resize" size={14} color={COLORS.textMuted} />
            <Text style={styles.dataLabel}>Altura</Text>
            <Text style={styles.dataValue}>{height}cm</Text>
          </View>
        )}
        {weight && (
          <View style={styles.dataRow}>
            <Ionicons name="scale" size={14} color={COLORS.textMuted} />
            <Text style={styles.dataLabel}>Peso</Text>
            <Text style={styles.dataValue}>{weight}kg</Text>
          </View>
        )}
        <View style={styles.dataRow}>
          <Ionicons name="calculator" size={14} color={COLORS.textMuted} />
          <Text style={styles.dataLabel}>IMC</Text>
          <Text style={[styles.dataValue, { color: category.color }]}>{bmiValue.toFixed(1)}</Text>
        </View>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  leftSection: { alignItems: 'center', paddingRight: SPACING.xl, borderRightWidth: 1, borderRightColor: COLORS.border },
  bmiCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
  bmiValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24 },
  bmiLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: BORDER_RADIUS.full },
  categoryText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10 },
  rightSection: { flex: 1, paddingLeft: SPACING.xl, justifyContent: 'center', gap: SPACING.sm },
  dataRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  dataLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, flex: 1 },
  dataValue: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
});
