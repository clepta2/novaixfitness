// src/components/ui/BentoGrid.tsx
// Layout Bento Grid moderno - Tendencia 2025-2026

import React from 'react';
import { View, StyleSheet, ViewStyle, Dimensions } from 'react-native'
import { SPACING } from '../../constants/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BentoItem {
  id: string;
  component: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
}

interface BentoGridProps {
  items: BentoItem[];
  columns?: number;
  gap?: number;
  style?: ViewStyle;
}

export function BentoGrid({
  items,
  columns = 2,
  gap = SPACING.md,
  style,
}: BentoGridProps) {
  const itemWidth = (SCREEN_WIDTH - SPACING.xl * 2 - gap * (columns - 1)) / columns;

  const getItemStyle = (size: string): ViewStyle => {
    switch (size) {
      case 'small':
        return { width: itemWidth, height: itemWidth * 0.8 };
      case 'medium':
        return { width: itemWidth, height: itemWidth };
      case 'large':
        return { width: itemWidth * 2 + gap, height: itemWidth * 1.2 };
      case 'full':
        return { width: '100%', height: itemWidth * 0.8 };
      default:
        return { width: itemWidth, height: itemWidth };
    }
  };

  return (
    <View style={[styles.container, style]}>
      {items.map((item, index) => (
        <View
          key={item.id}
          style={[
            styles.item,
            getItemStyle(item.size || 'medium'),
            index === 0 && styles.firstItem,
          ]}
        >
          {item.component}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  item: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  firstItem: {
    width: '100%',
  },
});
