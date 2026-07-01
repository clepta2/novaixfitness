// src/components/workout/PlaybackSpeed.tsx
// Speed selector overlay for video player - NOVAIX FITNESS

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface PlaybackSpeedProps {
  currentSpeed: number;
  onSelect: (speed: number) => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function PlaybackSpeed({ currentSpeed, onSelect }: PlaybackSpeedProps) {
  return (
    <View style={styles.container}>
      <View style={styles.pillsContainer}>
        {SPEED_OPTIONS.map((speed) => (
          <TouchableOpacity
            key={speed}
            style={[
              styles.pill,
              currentSpeed === speed && styles.activePill
            ]}
            onPress={() => onSelect(speed)}
          >
            <Text style={[
              styles.pillText,
              currentSpeed === speed && styles.activePillText
            ]}>
              {speed}x
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: SPACING.xxxl,
    right: SPACING.lg,
    backgroundColor: COLORS.surfaceOverlay,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    zIndex: 100,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    maxWidth: 200,
  },
  pill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
  },
  activePill: {
    backgroundColor: COLORS.primary,
  },
  pillText: {
    color: COLORS.textTitle,
    fontWeight: '600',
    fontSize: 12,
  },
  activePillText: {
    color: COLORS.background,
  },
});