// src/components/social/WorkoutStories.tsx
// Workout Stories - Horizontal scrollable story bubbles with workout thumbnails

import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SPACING } from '../../constants/spacing';
import StoryBubble, { AddStoryBubble } from './StoryBubble';
import StoryViewer from './StoryViewer';

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

interface WorkoutStoriesProps {
  stories: WorkoutStory[];
  currentUserId: string;
  onViewStory: (story: WorkoutStory, index: number) => void;
  onAddStory: () => void;
}

export default function WorkoutStories({
  stories, currentUserId, onViewStory, onAddStory,
}: WorkoutStoriesProps) {
  const [selectedStory, setSelectedStory] = useState<WorkoutStory | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleStoryPress = (story: WorkoutStory, index: number) => {
    setSelectedStory(story);
    setCurrentIndex(index);
    setShowViewer(true);
    onViewStory(story, index);
  };

  if (stories.length === 0) return null;

  return (
    <>
      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <AddStoryBubble onPress={onAddStory} />
          {stories.map((story, index) => (
            <StoryBubble key={story.id} story={story} onPress={() => handleStoryPress(story, index)} />
          ))}
        </ScrollView>
      </View>
      {showViewer && selectedStory && (
        <StoryViewer
          stories={stories}
          selectedStory={selectedStory}
          currentIndex={currentIndex}
          onClose={() => setShowViewer(false)}
          onNavigate={(i) => setCurrentIndex(i)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
    backgroundColor: '#121820',
    borderBottomWidth: 1,
    borderBottomColor: '#2A3040',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
  },
});
