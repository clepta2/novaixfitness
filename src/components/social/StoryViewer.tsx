// src/components/social/StoryViewer.tsx
// Full-screen story viewer overlay with progress bars and navigation

import { useEffect, useRef, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STORY_DURATION = 5000;

interface WorkoutStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  workoutName: string;
  workoutThumbnail: string;
  duration: number;
  exercises: number;
  seen: boolean;
}

interface StoryViewerProps {
  stories: WorkoutStory[];
  selectedStory: WorkoutStory;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function StoryViewer({
  stories, selectedStory, currentIndex, onClose, onNavigate,
}: StoryViewerProps) {
  const colors = useColors();
  const [progressAnim] = useState(() => new Animated.Value(0));
  const autoAdvanceTimer = useRef<any>(null);

  const goToNextStory = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onClose();
    }
  }, [currentIndex, stories, onClose, onNavigate]);

  const goToPreviousStory = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  }, [currentIndex, onNavigate]);

  const startAutoAdvance = useCallback(() => {
    progressAnim.setValue(0);
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    }).start();
    autoAdvanceTimer.current = setTimeout(goToNextStory, STORY_DURATION);
  }, [progressAnim, goToNextStory]);

  useEffect(() => {
    startAutoAdvance();
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, [currentIndex, startAutoAdvance]);

  return (
    <View style={styles.viewerOverlay}>
      <View style={styles.viewerContainer}>
        <View style={styles.progressContainer}>
          {stories.map((_, index) => (
            <View key={index} style={styles.progressBarBackground}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: index === currentIndex
                      ? progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        })
                      : index < currentIndex ? '100%' : '0%',
                  },
                ]}
              />
            </View>
          ))}
        </View>
        <View style={styles.viewerHeader}>
          <View style={styles.userInfo}>
            <Image source={{ uri: selectedStory.userAvatar }} style={styles.viewerAvatar} />
            <View>
              <Text style={styles.viewerUserName}>{selectedStory.userName}</Text>
              <Text style={styles.viewerTime}>Agora</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color={colors.textTitle} />
          </TouchableOpacity>
        </View>
        <View style={styles.viewerContent}>
          <Image source={{ uri: selectedStory.workoutThumbnail }} style={styles.workoutImage} />
          <View style={styles.workoutOverlay}>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutTitle}>{selectedStory.workoutName}</Text>
              <View style={styles.workoutStats}>
                <View style={styles.statItem}>
                  <Ionicons name="time" size={14} color={colors.primary} />
                  <Text style={styles.statText}>{selectedStory.duration} min</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="fitness" size={14} color={colors.primary} />
                  <Text style={styles.statText}>{selectedStory.exercises} exercícios</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.navLeft} onPress={goToPreviousStory} activeOpacity={1} />
        <TouchableOpacity style={styles.navRight} onPress={goToNextStory} activeOpacity={1} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewerOverlay: {
    ...(StyleSheet as any).absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.95)', zIndex: 1000,
  },
  viewerContainer: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row', paddingHorizontal: SPACING.md, paddingTop: SPACING.xl, gap: 4,
  },
  progressBarBackground: {
    flex: 1, height: 3, backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: 2, overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%', backgroundColor: '#B8FF00', borderRadius: 2,
  },
  viewerHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
  },
  userInfo: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
  },
  viewerAvatar: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#B8FF00',
  },
  viewerUserName: {
    fontFamily: 'Montserrat_700Bold', fontSize: 14, color: '#FFFFFF',
  },
  viewerTime: {
    fontFamily: 'Inter_400Regular', fontSize: 12, color: '#8892A0',
  },
  viewerContent: {
    flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SPACING.lg,
  },
  workoutImage: {
    width: SCREEN_WIDTH - SPACING.xl * 2, height: SCREEN_WIDTH - SPACING.xl * 2, borderRadius: BORDER_RADIUS.lg, backgroundColor: '#121820',
  },
  workoutOverlay: {
    position: 'absolute', bottom: 0, left: SPACING.lg, right: SPACING.lg, backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: BORDER_RADIUS.md, padding: SPACING.lg,
  },
  workoutInfo: {
    alignItems: 'center',
  },
  workoutTitle: {
    fontFamily: 'Montserrat_700Bold', fontSize: 18, color: '#FFFFFF', marginBottom: SPACING.sm,
  },
  workoutStats: {
    flexDirection: 'row', gap: SPACING.lg,
  },
  statItem: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
  },
  statText: {
    fontFamily: 'Inter_500Medium', fontSize: 13, color: '#FFFFFF',
  },
  navLeft: {
    position: 'absolute', left: 0, top: 100, bottom: 100, width: '30%',
  },
  navRight: {
    position: 'absolute', right: 0, top: 100, bottom: 100, width: '30%',
  },
});
