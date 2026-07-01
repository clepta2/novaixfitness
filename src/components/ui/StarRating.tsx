// src/components/ui/StarRating.tsx
// Rating com estrelas animado - NOVAIX FITNESS

import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  showValue?: boolean;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 28,
  onRate,
  readonly = false,
  showValue = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const scaleAnims = useRef(
    Array.from({ length: maxRating }, () => new Animated.Value(1))
  ).current;

  const handlePress = (index: number) => {
    if (readonly || !onRate) return;

    // Animacao de pulso
    Animated.sequence([
      Animated.spring(scaleAnims[index], { toValue: 1.3, friction: 3, useNativeDriver: true }),
      Animated.spring(scaleAnims[index], { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();

    onRate(index + 1);
  };

  const handleLongPress = (index: number) => {
    if (readonly || !onRate) return;
    setHoverRating(index + 1);
  };

  const handlePressOut = () => {
    if (!readonly) setHoverRating(0);
  };

  const displayRating = hoverRating || rating;

  return (
    <View style={styles.container}>
      <View style={styles.stars}>
        {Array.from({ length: maxRating }).map((_, index) => {
          const isFilled = index < displayRating;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handlePress(index)}
              onLongPress={() => handleLongPress(index)}
              onPressOut={handlePressOut}
              disabled={readonly}
              activeOpacity={0.7}
              style={styles.starTouchable}
            >
              <Animated.View style={{ transform: [{ scale: scaleAnims[index] }] }}>
                <Ionicons
                  name={isFilled ? 'star' : 'star-outline'}
                  size={size}
                  color={isFilled ? COLORS.primary : COLORS.border}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
      {showValue && (
        <View style={styles.valueContainer}>
          <Animated.Text style={styles.valueText}>
            {rating.toFixed(1)}
          </Animated.Text>
        </View>
      )}
    </View>
  );
}

// Componente de rating compacto para cards
export function CompactRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View style={styles.compactContainer}>
      <Ionicons name="star" size={size} color={COLORS.primary} />
      <Animated.Text style={[styles.compactText, { fontSize: size - 2 }]}>
        {rating.toFixed(1)}
      </Animated.Text>
    </View>
  );
}

// Componente de rating com contagem
export function RatingWithCount({ rating, count, size = 16 }: { rating: number; count: number; size?: number }) {
  return (
    <View style={styles.countContainer}>
      <View style={styles.countStars}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Ionicons
            key={i}
            name={i < Math.round(rating) ? 'star' : 'star-outline'}
            size={size}
            color={COLORS.primary}
          />
        ))}
      </View>
      <Animated.Text style={styles.countText}>
        {rating.toFixed(1)} ({count})
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starTouchable: {
    padding: 2,
  },
  valueContainer: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  valueText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.primary,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactText: {
    fontFamily: 'Inter_500Medium',
    color: COLORS.textTitle,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  countStars: {
    flexDirection: 'row',
    gap: 2,
  },
  countText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
