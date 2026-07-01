// src/components/workout/LoopToggle.tsx
// Simple loop toggle button - NOVAIX FITNESS

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, ICON_SIZES } from '../../constants/spacing';

interface LoopToggleProps {
  isLooping: boolean;
  onToggle: () => void;
}

export default function LoopToggle({ isLooping, onToggle }: LoopToggleProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, isLooping && styles.activeContainer]}
      onPress={onToggle}
    >
      <Ionicons 
        name={isLooping ? "repeat" : "repeat-outline"} 
        size={ICON_SIZES.md} 
        color={isLooping ? COLORS.primary : COLORS.textMuted} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.sm,
    backgroundColor: COLORS.surfaceOverlay,
    borderRadius: BORDER_RADIUS.full,
  },
  activeContainer: {
    backgroundColor: COLORS.primary + '20',
  },
});