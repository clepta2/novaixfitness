// src/components/social/ReactionPicker.tsx
// Picker de reações com long-press

import { useRef, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { REACTION_TYPES } from '../../constants/reactions';

interface ReactionPickerProps {
  visible: boolean;
  onSelect: (id: string) => void;
  onClose: () => void;
  position?: 'top' | 'bottom';
}

export default function ReactionPicker({ visible, onSelect, onClose, position = 'top' }: ReactionPickerProps) {
  const containerScale = useRef(new Animated.Value(0)).current;
  const emojiAnims = useMemo(() => REACTION_TYPES.map(() => new Animated.Value(0)), []);

  useEffect(() => {
    if (visible) {
      // Animate container scale
      Animated.spring(containerScale, { toValue: 1, friction: 6, useNativeDriver: true }).start();

      // Animate emojis sequentially
      emojiAnims.forEach((anim, i) => {
        anim.setValue(0);
        Animated.spring(anim, {
          toValue: 1,
          friction: 4,
          tension: 80,
          delay: i * 50,
          useNativeDriver: true,
        }).start();
      });
    } else {
      containerScale.setValue(0);
      emojiAnims.forEach(anim => anim.setValue(0));
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Animated.View style={[styles.container, { transform: [{ scale: containerScale }] }]}>
        {REACTION_TYPES.map((reaction, index) => (
          <Animated.View
            key={reaction.id}
            style={{
              transform: [
                { scale: emojiAnims[index] },
                {
                  translateY: emojiAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [15, 0],
                  }),
                },
              ],
            }}
          >
            <TouchableOpacity
              style={styles.reactionBtn}
              onPress={() => { onSelect(reaction.id); onClose(); }}
            >
              <Text style={styles.emoji}>{reaction.emoji}</Text>
              <Text style={styles.label}>{reaction.label}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFill, zIndex: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  container: {
    flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.sm, gap: SPACING.xs, borderWidth: 1, borderColor: COLORS.border,
    shadowColor: COLORS.textTitle, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  reactionBtn: { alignItems: 'center', padding: SPACING.sm, minWidth: 48 },
  emoji: { fontSize: 28 },
  label: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
});
