import { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, GestureResponderEvent } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS } from '../../constants/spacing';

interface VideoPostProps {
  videoUrl: string;
  onLike?: () => void;
}

export default function VideoPost({ videoUrl, onLike }: VideoPostProps) {
  const videoRef = useRef<Video>(null);
  const [showHeart, setShowHeart] = useState(false);
  const lastTap = useRef<number>(0);

  const handleDoubleTap = useCallback(
    (e: GestureResponderEvent) => {
      const now = Date.now();
      if (now - lastTap.current < 300) {
        setShowHeart(true);
        onLike?.();
        setTimeout(() => setShowHeart(false), 800);
      }
      lastTap.current = now;
    },
    [onLike],
  );

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay={false}
        isLooping
        useNativeControls
        onTouchStart={handleDoubleTap}
      />

      {showHeart && (
        <View style={styles.heartOverlay}>
          <Ionicons name="heart" size={80} color={COLORS.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    marginBottom: 12,
  },
  video: {
    width: '100%',
    height: 240,
    backgroundColor: COLORS.background,
  },
  heartOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
});
