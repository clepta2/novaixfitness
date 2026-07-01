import React, { memo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { STORY_HIGHLIGHT_LIMIT } from '../../config/socialConfig';

export interface StoryHighlight {
  id: string;
  title: string;
  cover_url: string | null;
  story_count: number;
}

interface StoryHighlightsProps {
  userId: string;
  highlights: StoryHighlight[];
  onPress: (highlight: StoryHighlight) => void;
}

function StoryHighlights({ userId, highlights, onPress }: StoryHighlightsProps) {
  const visible = highlights.slice(0, STORY_HIGHLIGHT_LIMIT);

  if (visible.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Destaques</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {visible.map((highlight) => (
          <TouchableOpacity key={highlight.id} style={styles.item} onPress={() => onPress(highlight)} activeOpacity={0.7}>
            <View style={styles.coverContainer}>
              {highlight.cover_url ? (
                <Image source={{ uri: highlight.cover_url }} style={styles.cover} />
              ) : (
                <View style={styles.placeholder}>
                  <Ionicons name="images-outline" size={20} color={COLORS.textMuted} />
                </View>
              )}
            </View>
            <Text style={styles.title} numberOfLines={1}>{highlight.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default memo(StoryHighlights);

const COVER_SIZE = 68;

const styles = StyleSheet.create({
  container: { paddingVertical: SPACING.md },
  sectionTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle, marginBottom: SPACING.sm, paddingHorizontal: SPACING.lg },
  scrollContent: { paddingHorizontal: SPACING.lg, gap: SPACING.md },
  item: { alignItems: 'center', width: COVER_SIZE + SPACING.sm },
  coverContainer: {
    width: COVER_SIZE, height: COVER_SIZE, borderRadius: COVER_SIZE / 2,
    borderWidth: 2, borderColor: COLORS.primary + '40', overflow: 'hidden',
  },
  cover: { width: '100%', height: '100%' },
  placeholder: {
    width: '100%', height: '100%', backgroundColor: COLORS.surface,
    justifyContent: 'center', alignItems: 'center',
  },
  title: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textDescription, marginTop: 4, textAlign: 'center' },
});
