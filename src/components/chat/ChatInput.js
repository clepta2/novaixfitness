// src/components/chat/ChatInput.js
// Campo de entrada do chat - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function ChatInput({ value, onChange, onSend, loading }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (value.trim()) {
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }).start();
    }
  }, [value]);

  const handleSend = () => {
    if (!value.trim() || loading) return;
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
    onSend?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChange}
          placeholder="Pergunte sobre treino ou dieta..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={1}
        />

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[styles.sendBtn, (!value.trim() || loading) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={loading || !value.trim()}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.background} />
            ) : (
              <Ionicons name="send" size={18} color={COLORS.background} />
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.hints}>
        <Text style={styles.hintText}>💡 Dica: descreva sua refeição para registrar automaticamente</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border },
  inputRow: { flexDirection: 'row', padding: SPACING.md, gap: SPACING.sm, alignItems: 'flex-end' },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    color: COLORS.textTitle,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: { opacity: 0.5 },
  hints: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
  hintText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
});
