// src/components/social/ReelItem.tsx
// Visualizador de Reel individual com curtida por duplo clique e animação premium - NOVAIX FITNESS


            ;
import { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Animated } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { Avatar } from '../ui/Avatar';
import * as Haptics from 'expo-haptics';

interface ReelItemProps {
  item: {
    id: string;
    title: string;
    videoUrl: string;
    likes: number;
    userName: string;
    userAvatar: string;
  };
  isPlaying: boolean;
  onClose: () => void;
  screenHeight: number;
}

export default function ReelItem({ item, isPlaying, onClose, screenHeight }: ReelItemProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes);
  const [lastTap, setLastTap] = useState(0);

  const heartScale = useMemo(() => new Animated.Value(0), []);
  const heartOpacity = useMemo(() => new Animated.Value(0), []);
  const likeScale = useMemo(() => new Animated.Value(1), []);

  const toggleLike = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);

    // Bounce button scale
    Animated.sequence([
      Animated.timing(likeScale, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.spring(likeScale, { toValue: 1, friction: 4, useNativeDriver: true })
    ]).start();
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      if (!liked) {
        toggleLike();
      }
      
      // Pulse center heart animation
      heartScale.setValue(0);
      heartOpacity.setValue(1);
      
      Animated.parallel([
        Animated.spring(heartScale, { toValue: 1.8, friction: 3, tension: 40, useNativeDriver: true }),
        Animated.timing(heartOpacity, { toValue: 0, duration: 800, delay: 200, useNativeDriver: true })
      ]).start();
      setLastTap(now);
    }
  };

  return (
    <Pressable onPress={handleDoubleTap} style={{ width: '100%', height: screenHeight, position: 'relative', backgroundColor: COLORS.background }}>
      <Video
        source={{ uri: item.videoUrl }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode={ResizeMode.COVER}
        shouldPlay={isPlaying}
        isLooping
        style={StyleSheet.absoluteFill}
        useNativeControls={false}
      />

      {/* Pulsing center heart for double tap */}
      <Animated.View style={[
        styles.centerHeart,
        {
          transform: [{ scale: heartScale }],
          opacity: heartOpacity
        }
      ]} pointerEvents="none">
        <Ionicons name="heart" size={80} color={COLORS.primary} />
      </Animated.View>

      {/* Top Close Button */}
      <TouchableOpacity style={styles.reelsCloseBtn} onPress={onClose}>
        <Ionicons name="close" size={26} color="white" />
      </TouchableOpacity>

      {/* Right side interaction buttons */}
      <View style={styles.reelsSideActions}>
        <Animated.View style={{ transform: [{ scale: likeScale }] }}>
          <TouchableOpacity style={styles.reelsSideBtn} onPress={toggleLike}>
            <Ionicons name="heart" size={32} color={liked ? COLORS.primary : 'white'} />
            <Text style={[styles.reelsSideLabel, liked && { color: COLORS.primary }]}>{likesCount}</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.reelsSideBtn} onPress={() => {}}>
          <Ionicons name="chatbubble" size={28} color="white" />
          <Text style={styles.reelsSideLabel}>Comentar</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom info section */}
      <View style={styles.reelsBottomInfo}>
        <View style={styles.reelsUserRow}>
          <Avatar name={item.userName} uri={item.userAvatar} size="sm" />
          <Text style={styles.reelsUserName}>{item.userName}</Text>
        </View>
        <Text style={styles.reelsVideoTitle}>{item.title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  centerHeart: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -40,
    marginTop: -40,
    zIndex: 15,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  reelsCloseBtn: {
    position: 'absolute', top: 50, left: SPACING.lg, zIndex: 20,
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center'
  },
  reelsSideActions: {
    position: 'absolute', right: SPACING.md, bottom: 120, gap: SPACING.lg, alignItems: 'center', zIndex: 10
  },
  reelsSideBtn: { alignItems: 'center', gap: 4 },
  reelsSideLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, color: 'white', textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
  reelsBottomInfo: {
    position: 'absolute', left: SPACING.lg, bottom: 40, right: 80, gap: SPACING.sm, zIndex: 10
  },
  reelsUserRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  reelsUserName: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: 'white', textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
  reelsVideoTitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'white', textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
});
