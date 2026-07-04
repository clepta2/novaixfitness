// src/components/social/FeedStoryViewer.tsx
// Visualizador de stories em tela cheia (para feed)

import { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STORY_DURATION = 5000;

interface StoryGroup {
  name: string;
  avatar?: string;
  stories: Array<{ image_url: string; caption?: string }>;
}

interface FeedStoryViewerProps {
  visible: boolean;
  stories: StoryGroup[];
  initialIndex?: number;
  onClose: () => void;
}

export default function FeedStoryViewer({ visible, stories, initialIndex = 0, onClose }: FeedStoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [currentStory, setCurrentStory] = useState(0);
  const progressAnim = useRef(Animated.Value(0)).current;
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (visible) startProgress();
    return () => clearTimeout(timerRef.current);
  }, [visible, currentIndex, currentStory]);

  const startProgress = () => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, { toValue: 1, duration: STORY_DURATION, useNativeDriver: false }).start();
    timerRef.current = setTimeout(() => goNext(), STORY_DURATION);
  };

  const goNext = () => {
    const storyGroup = stories[currentIndex];
    if (currentStory < storyGroup.stories.length - 1) {
      setCurrentStory(prev => prev + 1);
    } else if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentStory(0);
      onClose();
    }
  };

  const goPrev = () => {
    if (currentStory > 0) {
      setCurrentStory(prev => prev - 1);
    } else if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setCurrentStory(0);
    }
  };

  const storyGroup = stories[currentIndex];
  if (!storyGroup) return null;
  const story = storyGroup.stories[currentStory];
  if (!story) return null;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1], outputRange: ['0%', '100%'],
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          {storyGroup.stories.map((_, i) => (
            <View key={i} style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: i < currentStory ? '100%' : i === currentStory ? progressWidth : '0%' }]} />
            </View>
          ))}
        </View>

        <View style={styles.header}>
          <Image source={{ uri: storyGroup.avatar || undefined }} style={styles.avatar} />
          <Text style={styles.name}>{storyGroup.name}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.touchLeft} onPress={goPrev} />
        <TouchableOpacity style={styles.touchRight} onPress={goNext} />

        <Image source={{ uri: story.image_url }} style={styles.image} resizeMode="contain" />

        {story.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.caption}>{story.caption}</Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  progressContainer: { flexDirection: 'row', gap: 4, paddingHorizontal: SPACING.md, paddingTop: SPACING.xl + 20 },
  progressTrack: { flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 1 },
  progressFill: { height: 2, backgroundColor: COLORS.textTitle, borderRadius: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, gap: SPACING.sm },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surfaceElevated },
  name: { flex: 1, fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  touchLeft: { position: 'absolute', left: 0, top: 100, bottom: 100, width: '40%' },
  touchRight: { position: 'absolute', right: 0, top: 100, bottom: 100, width: '40%' },
  image: { flex: 1, width: SCREEN_WIDTH },
  captionContainer: { position: 'absolute', bottom: 40, left: SPACING.lg, right: SPACING.lg },
  caption: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm },
});
