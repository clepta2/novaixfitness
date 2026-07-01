// src/components/workout/RatingModal.tsx
// Modal de avaliação de treino - NOVAIX FITNESS

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, Animated } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { RATING } from '../../data/workoutTexts';
import { RATING_CONFIG, QUICK_TAGS } from '../../data/ratingModal';

interface StarRatingProps {
  rating: number;
  onSelect: (star: number) => void;
}

function StarRating({ rating, onSelect }: StarRatingProps): React.ReactElement {
  return (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map(star => (
        <TouchableOpacity key={star} onPress={() => { onSelect(star); try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {} }} style={styles.starBtn} accessibilityLabel={`Avaliar ${star} estrela${star > 1 ? 's' : ''}`} accessibilityRole="button">
          <Ionicons name={star <= rating ? 'star' : 'star-outline'} size={44} color={star <= rating ? COLORS.attention : COLORS.surfaceOverlay} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; comment: string }) => void;
}

export default function RatingModal({ visible, onClose, onSubmit }: RatingModalProps): React.ReactElement {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, tension: 30, friction: 8, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const toggleTag = (tag: string): void => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = (): void => {
    const fullComment = selectedTags.length > 0
      ? `[${selectedTags.join(', ')}] ${comment}`.trim()
      : comment;
    onSubmit({ rating, comment: fullComment });
    setRating(0);
    setComment('');
    setSelectedTags([]);
    onClose();
  };

  const config = (RATING_CONFIG as Array<{ stars: number; color: string; icon: string; label: string }>).find(r => r.stars === rating);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>{RATING.title}</Text>
            <Text style={styles.subtitle}>{RATING.subtitle}</Text>
          </View>

          <StarRating rating={rating} onSelect={setRating} />

          {rating > 0 && config && (
            <View style={[styles.feedbackBadge, { backgroundColor: config.color + '15' }]}>
              <Ionicons name={config.icon as any} size={16} color={config.color} />
              <Text style={[styles.feedbackText, { color: config.color }]}>{config.label}</Text>
            </View>
          )}

          <View style={styles.tagsSection}>
            <Text style={styles.tagsLabel}>{RATING.howWas}</Text>
            <View style={styles.tagsRow}>
              {QUICK_TAGS.map(tag => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tag, selectedTags.includes(tag) && styles.tagActive]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[styles.tagText, selectedTags.includes(tag) && styles.tagTextActive]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder={RATING.optionalComment}
            placeholderTextColor={COLORS.textMuted}
            value={comment}
            onChangeText={setComment}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={rating === 0}
          >
            <Ionicons name="send" size={18} color={COLORS.background} />
            <Text style={styles.submitText}>{RATING.submit}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>{RATING.skipForNow}</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' } as ViewStyle,
  content: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.xl, paddingBottom: 40 } as ViewStyle,
  handle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.xl } as ViewStyle,
  header: { alignItems: 'center', marginBottom: SPACING.md } as ViewStyle,
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, textAlign: 'center' } as TextStyle,
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xs } as TextStyle,
  starsContainer: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm, marginVertical: SPACING.xl } as ViewStyle,
  starBtn: { padding: SPACING.xs } as ViewStyle,
  feedbackBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.sm, marginBottom: SPACING.lg } as ViewStyle,
  feedbackText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14 } as TextStyle,
  tagsSection: { marginBottom: SPACING.md } as ViewStyle,
  tagsLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.sm } as TextStyle,
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs } as ViewStyle,
  tag: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border } as ViewStyle,
  tagActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary } as ViewStyle,
  tagText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted } as TextStyle,
  tagTextActive: { color: COLORS.background } as TextStyle,
  input: { height: 80, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border } as TextStyle,
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md } as ViewStyle,
  submitBtnDisabled: { opacity: 0.5 } as ViewStyle,
  submitText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background, letterSpacing: 0.5 } as TextStyle,
  cancelBtn: { alignItems: 'center', paddingVertical: SPACING.md } as ViewStyle,
  cancelText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted } as TextStyle,
});
