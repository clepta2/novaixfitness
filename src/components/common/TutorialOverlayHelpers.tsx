// src/components/common/TutorialOverlayHelpers.tsx
// Constantes de spotlight e funções de renderização do overlay

import React from 'react';
import { View, Dimensions, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Spotlight {
  left: number;
  top: number;
  width: number;
  height: number;
  cardPosition: 'top' | 'bottom';
}

export const SPOTLIGHTS: Record<string, Spotlight> = {
  contextualCard: { left: 16, top: 130, width: SCREEN_WIDTH - 32, height: 180, cardPosition: 'bottom' },
  categories: { left: 16, top: 380, width: SCREEN_WIDTH - 32, height: 120, cardPosition: 'top' },
  header: { left: SCREEN_WIDTH - 120, top: 50, width: 110, height: 44, cardPosition: 'bottom' },
  searchBar: { left: 16, top: 100, width: SCREEN_WIDTH - 100, height: 44, cardPosition: 'bottom' },
  filterBtn: { left: SCREEN_WIDTH - 90, top: 100, width: 80, height: 44, cardPosition: 'bottom' },
  favorites: { left: 16, top: 200, width: SCREEN_WIDTH - 32, height: 100, cardPosition: 'bottom' },
  stats: { left: 16, top: 300, width: SCREEN_WIDTH - 32, height: 80, cardPosition: 'bottom' },
  gamification: { left: 16, top: 180, width: SCREEN_WIDTH - 32, height: 60, cardPosition: 'bottom' },
  achievements: { left: 16, top: 400, width: SCREEN_WIDTH - 32, height: 100, cardPosition: 'bottom' },
  fab: { left: SCREEN_WIDTH - 72, top: SCREEN_HEIGHT - 160, width: 56, height: 56, cardPosition: 'top' },
  posts: { left: 16, top: 200, width: SCREEN_WIDTH - 32, height: 300, cardPosition: 'top' },
  progressBar: { left: 16, top: 100, width: SCREEN_WIDTH - 32, height: 20, cardPosition: 'bottom' },
  timer: { left: 16, top: 250, width: SCREEN_WIDTH - 32, height: 200, cardPosition: 'top' },
  badge: { left: SCREEN_WIDTH / 2 - 30, top: 50, width: 60, height: 30, cardPosition: 'bottom' },
  markAllBtn: { left: SCREEN_WIDTH - 80, top: 50, width: 40, height: 40, cardPosition: 'bottom' },
  list: { left: 16, top: 120, width: SCREEN_WIDTH - 32, height: 400, cardPosition: 'top' },
};

export function renderMask(spotlight: Spotlight | null) {
  if (!spotlight) return <View style={h.darkBackdrop} />;
  const { left, top, width, height } = spotlight;
  return (<>
    <View style={[h.maskPanel, { left: 0, top: 0, width: SCREEN_WIDTH, height: top }]} />
    <View style={[h.maskPanel, { left: 0, top, width: left, height }]} />
    <View style={[h.maskPanel, { left: left + width, top, width: SCREEN_WIDTH - (left + width), height }]} />
    <View style={[h.maskPanel, { left: 0, top: top + height, width: SCREEN_WIDTH, height: SCREEN_HEIGHT - (top + height) }]} />
    <View style={[h.glowBorder, { left, top, width, height }]} />
  </>);
}

export function renderPointer(spotlight: Spotlight | null, bounceAnim: Animated.Value) {
  if (!spotlight) return null;
  const { left, top, width, height, cardPosition } = spotlight;
  const isTop = cardPosition === 'top';
  return (
    <Animated.View style={[h.pointer, { top: isTop ? top - 32 : top + height + 8, left: left + width / 2 - 12, transform: [{ translateY: bounceAnim }] }]}>
      <Ionicons name={isTop ? 'chevron-down' : 'chevron-up'} size={24} color={COLORS.primary} />
    </Animated.View>
  );
}

const h = StyleSheet.create({
  darkBackdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(18, 22, 26, 0.65)' },
  maskPanel: { position: 'absolute', backgroundColor: 'rgba(18, 22, 26, 0.65)' },
  glowBorder: {
    position: 'absolute', borderWidth: 2, borderColor: COLORS.primary, borderRadius: 12,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 8, elevation: 4,
  },
  pointer: { position: 'absolute', zIndex: 10, alignItems: 'center', width: 24 },
});
