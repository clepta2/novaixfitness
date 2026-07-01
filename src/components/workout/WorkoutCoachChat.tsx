// src/components/workout/WorkoutCoachChat.js
// Chat IA de Treinos e Performance - NOVAIX FITNESS

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { askGeminiCoach } from '../../services/gemini';

const QUICK_QUESTIONS = [
  'Como fazer agachamento livre?',
  'Como aquecer antes de treinar?',
  'O que fazer para dor na lombar?',
  'Como progredir cargas?',
];

export default function WorkoutCoachChat({ userId }: any) {
  const [messages, setMessages] = useState<any[]>([
    { id: 'welcome', text: 'Olá! Sou o Nix Coach de Treino. Como posso ajudar na sua performance hoje?', isUser: false },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<any>(null);

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput('');
    const userMsg = { id: Date.now().toString(), text: msg, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const reply = await askGeminiCoach(msg, {
        userId,
        gymType: 'Treino',
        level: 'Geral',
      });

      const aiMsg = { id: (Date.now() + 1).toString(), text: reply, isUser: false };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = { id: (Date.now() + 1).toString(), text: 'Desculpe, não consegui calcular sua resposta. Tente novamente.', isUser: false };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Ionicons name="barbell-outline" size={18} color={COLORS.primary} />
        <Text style={styles.title}>COACH DE TREINO & PERFORMANCE</Text>
      </View>

      <FlatList
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.isUser ? styles.bubbleUser : styles.bubbleAI]}>
            {!item.isUser && (
              <View style={styles.aiAvatar}>
                <Ionicons name="fitness-outline" size={14} color={COLORS.primary} />
              </View>
            )}
            <View style={[styles.bubbleContent, item.isUser ? styles.bubbleContentUser : styles.bubbleContentAI]}>
              <Text style={[styles.bubbleText, item.isUser && styles.bubbleTextUser]}>{item.text}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {messages.length <= 1 && (
        <View style={styles.quickRow}>
          {QUICK_QUESTIONS.map((q, i) => (
            <TouchableOpacity key={i} style={styles.quickBtn} onPress={() => handleSend(q)}>
              <Text style={styles.quickText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Pergunte sobre treinos, postura..."
          placeholderTextColor={COLORS.textMuted}
        />
        <TouchableOpacity style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]} onPress={() => handleSend()} disabled={!input.trim() || loading}>
          {loading ? <ActivityIndicator size="small" color={COLORS.background} /> : <Ionicons name="send" size={18} color={COLORS.background} />}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  list: { padding: SPACING.md, gap: SPACING.sm, minHeight: 200 },
  bubble: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.md },
  bubbleUser: { justifyContent: 'flex-end' },
  bubbleAI: { justifyContent: 'flex-start' },
  aiAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center' },
  bubbleContent: { maxWidth: '80%', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.lg },
  bubbleContentUser: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  bubbleContentAI: { backgroundColor: COLORS.background, borderBottomLeftRadius: 4 },
  bubbleText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, lineHeight: 20 },
  bubbleTextUser: { color: COLORS.background },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
  quickBtn: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  quickText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  inputRow: { flexDirection: 'row', gap: SPACING.sm, padding: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  input: { flex: 1, height: 40, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { opacity: 0.5 },
});
