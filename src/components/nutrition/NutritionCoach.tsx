// src/components/nutrition/NutritionCoach.js
// Chat IA de nutrição - NOVAIX FITNESS

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import NutritionMessageBubble from './NutritionMessageBubble';

const QUICK_QUESTIONS = [
  'Quanta proteína devo comer por dia?',
  'O que comer antes do treino?',
  'Como calcular minhas calorias?',
  'Melhores alimentos para ganhar massa',
];

export default function NutritionCoach({ userId, userWeight = 70, userGoal = 'manter' }) {
  const [messages, setMessages] = useState([
    { id: 'welcome', text: 'Olá! Sou seu assistente de nutrição. Como posso ajudar?', isUser: false },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<any>(null);

  const handleSend = async (text = '') => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput('');
    const userMsg = { id: Date.now().toString(), text: msg, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
      let reply;

      if (apiKey) {
        const prompt = `Você é um nutricionista IA do NOVAIX Fitness. Responda em português, de forma direta e prática. Máximo 3 parágrafos. Contexto: usuário tem ${userWeight}kg, objetivo: ${userGoal}. Pergunta: ${msg}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] }),
        });

        const result = await response.json();
        reply = result.candidates?.[0]?.content?.parts?.[0]?.text;
      }

      if (!reply) {
        const lower = msg.toLowerCase();
        if (lower.includes('proteína') || lower.includes('protein')) {
          reply = `Com ${userWeight}kg, seu ideal é ${(userWeight * 1.8).toFixed(0)}-${(userWeight * 2.2).toFixed(0)}g de proteína por dia. Divida em 3-4 refeições. Boas fontes: frango, ovos, peixe, whey.`;
        } else if (lower.includes('treino') || lower.includes('pré')) {
          reply = 'Pré-treino: coma carboidratos complexos (banana, aveia) 1-2h antes. Pós-treino: proteína + carboidrato dentro de 2h para recuperação.';
        } else if (lower.includes('caloria') || lower.includes('calorias')) {
          reply = `TDEE estimado: ~${Math.round(userWeight * 33)} kcal/dia. Para ${userGoal === 'emagrecer' ? 'emagrecer, reduza 300-500 kcal' : userGoal === 'ganhar' ? 'ganhar massa, aumente 300-500 kcal' : 'manter, mantenha estável'}.`;
        } else {
          reply = `Baseado no seu perfil (${userWeight}kg, ${userGoal}): foque em proteína em cada refeição, beba 2.5L de água, e durma 7-9h. Qual sua dúvida específica?`;
        }
      }

      const aiMsg = { id: (Date.now() + 1).toString(), text: reply, isUser: false };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = { id: (Date.now() + 1).toString(), text: 'Desculpe, não consegui processar sua pergunta. Tente novamente.', isUser: false };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Ionicons name="nutrition" size={18} color={COLORS.primary} />
        <Text style={styles.title}>COACH DE NUTRIÇÃO</Text>
      </View>

      <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <NutritionMessageBubble message={item} />}
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
          placeholder="Pergunte sobre nutrição..."
          placeholderTextColor={COLORS.textMuted}
        />
        <TouchableOpacity style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]} onPress={() => handleSend()} disabled={!input.trim() || loading}>
          <Ionicons name={loading ? 'sync' : 'send'} size={18} color={COLORS.background} />
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
  bubble: { flexDirection: 'row', gap: SPACING.sm, maxWidth: '85%' },
  bubbleUser: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  bubbleAI: { alignSelf: 'flex-start' },
  aiAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center' },
  bubbleContent: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md },
  bubbleContentUser: { backgroundColor: COLORS.primary },
  bubbleContentAI: { backgroundColor: COLORS.background },
  bubbleText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textTitle, lineHeight: 18 },
  bubbleTextUser: { color: COLORS.background },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
  quickBtn: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  quickText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  inputRow: { flexDirection: 'row', gap: SPACING.sm, padding: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  input: { flex: 1, height: 40, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { opacity: 0.5 },
});
