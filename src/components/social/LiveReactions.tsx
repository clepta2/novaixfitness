// src/components/social/LiveReactions.tsx
// Live Reactions - Floating emoji bar during live workouts

import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Reaction {
  id: string;
  emoji: string;
  type: string;
  count: number;
}

interface FloatingReaction {
  id: string;
  emoji: string;
  x: number;
  animY: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
}

interface LiveReactionsProps {
  liveId: string;
  currentUserId: string;
  onSendReaction: (type: string) => void;
  reactions?: Reaction[];
}

const REACTION_TYPES = [
  { emoji: '🔥', type: 'fire', label: 'Fogo' },
  { emoji: '💪', type: 'muscle', label: 'Músculo' },
  { emoji: '❤️', type: 'heart', label: 'Coração' },
  { emoji: '⚡', type: 'lightning', label: 'Relâmpago' },
  { emoji: '🎯', type: 'target', label: 'Alvo' },
  { emoji: '🏆', type: 'trophy', label: 'Troféu' },
];

export default function LiveReactions({
  liveId, currentUserId, onSendReaction, reactions = []
}: LiveReactionsProps) {
  const colors = useColors();
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const animationIdRef = useRef(0);

  useEffect(() => {
    const counts: Record<string, number> = {};
    reactions.forEach(r => {
      counts[r.type] = r.count;
    });
    setReactionCounts(counts);
  }, [reactions]);

  const createFloatingReaction = useCallback((emoji: string) => {
    const id = `reaction-${animationIdRef.current++}`;
    const x = Math.random() * (SCREEN_WIDTH - 100) + 50;
    const animY = new Animated.Value(SCREEN_HEIGHT);
    const opacity = new Animated.Value(1);
    const scale = new Animated.Value(0.5);

    const newReaction: FloatingReaction = { id, emoji, x, animY, opacity, scale };
    setFloatingReactions(prev => [...prev, newReaction]);

    Animated.parallel([
      Animated.timing(animY, { toValue: SCREEN_HEIGHT * 0.3, duration: 2000, useNativeDriver: true }),
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.2, tension: 50, friction: 3, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.delay(1500),
        Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== id));
    });
  }, []);

  const handleReaction = useCallback((type: string, emoji: string) => {
    onSendReaction(type);
    createFloatingReaction(emoji);
  }, [onSendReaction, createFloatingReaction]);

  const getTotalReactions = () => {
    return Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.floatingContainer} pointerEvents="none">
        {floatingReactions.map(reaction => (
          <Animated.Text
            key={reaction.id}
            style={[styles.floatingEmoji, {
              left: reaction.x,
              transform: [{ translateY: reaction.animY }, { scale: reaction.scale }],
              opacity: reaction.opacity,
            }]}
          >
            {reaction.emoji}
          </Animated.Text>
        ))}
      </View>
      <View style={styles.reactionBar}>
        <View style={styles.totalCount}>
          <Ionicons name="heart" size={14} color={colors.error} />
          <Text style={styles.totalText}>{getTotalReactions()}</Text>
        </View>
        <View style={styles.reactionButtons}>
          {REACTION_TYPES.map(reaction => {
            const count = reactionCounts[reaction.type] || 0;
            return (
              <TouchableOpacity
                key={reaction.type}
                style={styles.reactionBtn}
                onPress={() => handleReaction(reaction.type, reaction.emoji)}
                activeOpacity={0.7}
              >
                <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
                {count > 0 && (
                  <View style={styles.reactionBadge}>
                    <Text style={styles.reactionBadgeText}>{count > 99 ? '99+' : count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100,
  },
  floatingContainer: {
    ...(StyleSheet as any).absoluteFillObject, overflow: 'hidden',
  },
  floatingEmoji: {
    position: 'absolute', fontSize: 40,
  },
  reactionBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, marginHorizontal: SPACING.md, marginBottom: SPACING.lg, borderRadius: BORDER_RADIUS.full, elevation: 5,
  },
  totalCount: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingRight: SPACING.md, borderRightWidth: 1, borderRightColor: 'rgba(255, 255, 255, 0.2)', marginRight: SPACING.md,
  },
  totalText: {
    fontFamily: 'Montserrat_700Bold', fontSize: 14, color: '#FFFFFF',
  },
  reactionButtons: {
    flexDirection: 'row', flex: 1, justifyContent: 'space-around',
  },
  reactionBtn: {
    position: 'relative', padding: SPACING.sm,
  },
  reactionEmoji: {
    fontSize: 28,
  },
  reactionBadge: {
    position: 'absolute', top: 0, right: -4, backgroundColor: '#B8FF00', borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4,
  },
  reactionBadgeText: {
    fontFamily: 'Montserrat_700Bold', fontSize: 10, color: '#0A0E14',
  },
});
