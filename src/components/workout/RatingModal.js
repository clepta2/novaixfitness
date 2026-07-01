// src/components/workout/RatingModal.js
// Modal de avaliação de treino - NOVAIX FITNESS

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { RATING } from '../../data/workoutTexts';
import { RATING_CONFIG, QUICK_TAGS } from '../../data/ratingModal';

function StarRating({ rating, onSelect }) {
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

export default function RatingModal({ visible, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
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

  const toggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = () => {
    const fullComment = selectedTags.length > 0
      ? `[${selectedTags.join(', ')}] ${comment}`.trim()
      : comment;
    onSubmit({ rating, comment: fullComment });
    setRating(0);
    setComment('');
    setSelectedTags([]);
    onClose();
  };

  const config = RATING_CONFIG.find(r => r.stars === rating);

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
              <Ionicons name={config.icon} size={16} color={config.color} />
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
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  content: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.xl, paddingBottom: 40 },
  handle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.xl },
  header: { alignItems: 'center', marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, textAlign: 'center' },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xs },
  starsContainer: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm, marginVertical: SPACING.xl },
  starBtn: { padding: SPACING.xs },
  feedbackBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.sm, marginBottom: SPACING.lg },
  feedbackText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
  tagsSection: { marginBottom: SPACING.md },
  tagsLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.sm },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  tag: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  tagActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tagText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted },
  tagTextActive: { color: COLORS.background },
  input: { height: 80, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md },
  submitBtnDisabled: { opacity: 0.5 },
  submitText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background, letterSpacing: 0.5 },
  cancelBtn: { alignItems: 'center', paddingVertical: SPACING.md },
  cancelText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
});
