// src/components/ui/FeatureGrid.tsx
// Grid de features com icones animados - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';

interface Feature {
  id: string;
  icon: string;
  title: string;
  description?: string;
  color?: string;
  onPress?: () => void;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: number;
  onFeaturePress?: (feature: Feature) => void;
}

export default function FeatureGrid({
  features,
  columns = 2,
  onFeaturePress,
}: FeatureGridProps) {
  return (
    <View style={styles.container}>
      {features.map((feature, index) => (
        <FeatureItem
          key={feature.id}
          feature={feature}
          index={index}
          onPress={() => { if (onFeaturePress) onFeaturePress(feature); else if (feature.onPress) feature.onPress(); }}
        />
      ))}
    </View>
  );
}

function FeatureItem({ feature, index, onPress }: { feature: Feature; index: number; onPress: () => void }) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, delay: index * 80, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, friction: 3, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.itemWrapper, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.item}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={[styles.iconContainer, { backgroundColor: (feature.color || COLORS.primary) + '15' }]}>
          <Ionicons name={feature.icon as any} size={24} color={feature.color || COLORS.primary} />
        </View>
        <Text style={styles.title} numberOfLines={2}>{feature.title}</Text>
        {feature.description && (
          <Text style={styles.description} numberOfLines={2}>{feature.description}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  itemWrapper: {
    width: '48%',
  },
  item: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.textTitle,
    marginBottom: SPACING.xs,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
});
