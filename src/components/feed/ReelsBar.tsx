// src/components/feed/ReelsBar.tsx - Barra horizontal de reels

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SOCIAL_FEED } from '../../data/socialTexts';

interface ReelData {
  id: string;
  thumbnail: string;
  views: string;
  title: string;
}

interface ReelsBarProps {
  reels: ReelData[];
  onPressReel: (index: number) => void;
}

export default function ReelsBar({ reels, onPressReel }: ReelsBarProps) {
  return (
    <View style={styles.reelsSection}>
      <Text style={styles.reelsSectionTitle}>{SOCIAL_FEED.reelsSectionTitle}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reelsScroll}>
        {reels.map((reel, index) => (
          <TouchableOpacity key={reel.id} style={styles.reelCard} onPress={() => onPressReel(index)}>
            <Image source={{ uri: reel.thumbnail }} style={styles.reelThumbnail} />
            <View style={styles.reelOverlay}>
              <Ionicons name="play" size={12} color="white" />
              <Text style={styles.reelViews}>{reel.views}</Text>
            </View>
            <Text style={styles.reelTitle} numberOfLines={1}>{reel.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  reelsSection: { marginBottom: SPACING.md },
  reelsSectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, marginBottom: SPACING.sm },
  reelsScroll: { gap: SPACING.sm, paddingRight: SPACING.lg },
  reelCard: { width: 100, height: 160, borderRadius: BORDER_RADIUS.md, overflow: 'hidden', backgroundColor: COLORS.surfaceElevated, position: 'relative' },
  reelThumbnail: { width: '100%', height: '100%' },
  reelOverlay: { position: 'absolute', bottom: SPACING.xs, left: SPACING.xs, flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 4, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  reelViews: { fontFamily: 'Inter_600SemiBold', fontSize: 9, color: 'white' },
  reelTitle: { position: 'absolute', top: SPACING.xs, left: SPACING.xs, right: SPACING.xs, fontFamily: 'Montserrat_700Bold', fontSize: 10, color: 'white', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 },
});
