// src/components/chat/MessageBubble.js
// Bolha de mensagem do chat - NOVAIX FITNESS

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function TypingIndicator() {
  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingDot} />
      <View style={[styles.typingDot, { animationDelay: '0.2s' }]} />
      <View style={[styles.typingDot, { animationDelay: '0.4s' }]} />
    </View>
  );
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message, showTimestamp = true }) {
  const isUser = message.isUser;
  const isTyping = message.isTyping;

  if (isTyping) {
    return (
      <View style={[styles.bubble, styles.bubbleCoach]}>
        <View style={styles.coachAvatar}>
          <Ionicons name="fitness" size={12} color={COLORS.primary} />
        </View>
        <TypingIndicator />
      </View>
    );
  }

  return (
    <View style={[styles.container, isUser ? styles.containerUser : styles.containerCoach]}>
      {!isUser && (
        <View style={styles.coachAvatar}>
          <Ionicons name="fitness" size={12} color={COLORS.primary} />
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleCoach]}>
        <Text style={[styles.bubbleText, isUser ? styles.textUser : styles.textCoach]}>
          {message.text}
        </Text>
        {showTimestamp && message.timestamp && (
          <Text style={[styles.timestamp, isUser && styles.timestampUser]}>
            {formatTime(message.timestamp)}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xs },
  containerUser: { justifyContent: 'flex-end' },
  containerCoach: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', padding: SPACING.md, borderRadius: BORDER_RADIUS.lg },
  bubbleUser: { backgroundColor: COLORS.primary, borderBottomRightRadius: 2 },
  bubbleCoach: { backgroundColor: COLORS.surface, borderBottomLeftRadius: 2, borderWidth: 1, borderColor: COLORS.border },
  coachAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  bubbleText: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
  textUser: { color: COLORS.background },
  textCoach: { color: COLORS.textTitle },
  timestamp: { fontFamily: 'Inter_400Regular', fontSize: 9, color: COLORS.textMuted, marginTop: SPACING.xs, alignSelf: 'flex-end' },
  timestampUser: { color: COLORS.background + '80' },
  typingContainer: { flexDirection: 'row', gap: 4, padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.textMuted },
});
