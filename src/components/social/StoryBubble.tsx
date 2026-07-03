// src/components/social/StoryBubble.tsx
// Individual story bubble for horizontal scroll list

import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';
import { useColors } from '../../context/ThemeContext';

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

interface StoryBubbleProps {
  story: WorkoutStory;
  onPress: () => void;
}

export default function StoryBubble({ story, onPress }: StoryBubbleProps) {
  const colors = useColors();

  return (
    <TouchableOpacity style={styles.storyItem} onPress={onPress}>
      <View style={[styles.storyRing, story.seen && styles.storyRingSeen]}>
        <Image source={{ uri: story.userAvatar }} style={styles.avatar} />
        <View style={styles.workoutBadge}>
          <Ionicons name="barbell" size={10} color={colors.background} />
        </View>
      </View>
      <Text style={styles.userName} numberOfLines={1}>{story.userName}</Text>
      <Text style={styles.workoutName} numberOfLines={1}>{story.workoutName}</Text>
    </TouchableOpacity>
  );
}

interface AddStoryBubbleProps {
  onPress: () => void;
}

export function AddStoryBubble({ onPress }: AddStoryBubbleProps) {
  const colors = useColors();

  return (
    <TouchableOpacity style={styles.storyItem} onPress={onPress}>
      <View style={styles.addStoryContainer}>
        <Ionicons name="person" size={32} color={colors.textMuted} />
        <View style={styles.addBadge}>
          <Ionicons name="add" size={16} color={colors.background} />
        </View>
      </View>
      <Text style={styles.userName} numberOfLines={1}>Seu Story</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  storyItem: {
    alignItems: 'center',
    marginRight: SPACING.md,
    width: 72,
  },
  addStoryContainer: {
    width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', position: 'relative', backgroundColor: '#1A2030', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  storyRing: {
    width: 64, height: 64, borderRadius: 32, borderWidth: 3, borderColor: '#B8FF00', justifyContent: 'center', alignItems: 'center', padding: 2,
  },
  storyRingSeen: {
    borderColor: '#2A3040',
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#1A2030',
  },
  addBadge: {
    position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: 11, backgroundColor: '#B8FF00', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#0A0E14', ...SHADOWS.sm,
  },
  workoutBadge: {
    position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderRadius: 10, backgroundColor: '#00D4AA', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#121820',
  },
  userName: {
    fontFamily: 'Inter_500Medium', fontSize: 10, color: '#8892A0', marginTop: 6, textAlign: 'center',
  },
  workoutName: {
    fontFamily: 'Inter_400Regular', fontSize: 9, color: '#B8FF00', marginTop: 2, textAlign: 'center',
  },
});
