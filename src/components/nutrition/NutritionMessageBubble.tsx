import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function NutritionMessageBubble({ message }) {
  const isUser = message.isUser;
  return (
    <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
      {!isUser && (
        <View style={styles.aiAvatar}>
          <Ionicons name="nutrition" size={14} color={COLORS.primary} />
        </View>
      )}
      <View style={[styles.bubbleContent, isUser ? styles.bubbleContentUser : styles.bubbleContentAI]}>
        <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>{message.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.md },
  bubbleUser: { justifyContent: 'flex-end' },
  bubbleAI: { justifyContent: 'flex-start' },
  aiAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center' },
  bubbleContent: { maxWidth: '80%', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.lg },
  bubbleContentUser: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  bubbleContentAI: { backgroundColor: COLORS.surface, borderBottomLeftRadius: 4 },
  bubbleText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, lineHeight: 20 },
  bubbleTextUser: { color: COLORS.background },
});
