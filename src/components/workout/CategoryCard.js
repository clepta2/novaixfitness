// src/components/workout/CategoryCard.js
// Card de categoria animado - NOVAIX FITNESS

import React, { memo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const { width } = Dimensions.get('window');

function CategoryCard({ category, isActive, onPress, index = 0 }) {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 30, friction: 8, delay: index * 80, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.card, isActive && styles.active]}
        onPress={() => onPress?.(category)}
        activeOpacity={0.8}
      >
        <View style={[styles.icon, { backgroundColor: category.color + '20' }]}>
          <Ionicons name={category.icon} size={28} color={category.color} />
        </View>
        <Text style={styles.label}>{category.label}</Text>
        <Text style={styles.description} numberOfLines={2}>{category.description}</Text>
        <View style={styles.countRow}>
          <Ionicons name="barbell" size={12} color={COLORS.primary} />
          <Text style={styles.count}>{category.count} treinos</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default memo(CategoryCard);

const styles = StyleSheet.create({
  card: { width: (width - 60) / 2, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 2, borderColor: COLORS.border },
  active: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },
  icon: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  label: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, letterSpacing: 0.5 },
  description: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.xs },
  countRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.sm },
  count: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary },
});
