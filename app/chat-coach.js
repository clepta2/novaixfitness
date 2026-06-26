// app/chat-coach.js
// Chat do Coach de IA - NOVAIX FITNESS

import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';
import { askGeminiCoach, saveChatMessage, getChatHistory, clearChatHistory } from '../src/services/gemini';
import { layout, typography } from '../src/styles';

const QUICK_TIPS = [
  'Montar treino de peito',
  'Dicas de dieta',
  'Como ganhar massa',
  'Exercicios em casa',
];

export default function ChatCoachScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    async function init() {
      if (!user?.id) return;
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) setProfile(data);

        const history = await getChatHistory(user.id);

        if (history.length > 0) {
          setMessages(history);
        } else {
          const userName = data?.name || 'Atleta';
          const welcomeMsg = {
            id: 'welcome',
            text: `Ola, ${userName}! Sou seu Coach e Nutricionista de IA. Posso te ajudar com treinos, dieta, recuperacao e mais. Como posso ajudar?`,
            isUser: false,
          };
          setMessages([welcomeMsg]);
          await saveChatMessage(user.id, welcomeMsg.text, false);
        }
      } catch (err) {
        console.error('Erro ao carregar chat:', err);
      } finally {
        setHistoryLoaded(true);
      }
    }
    init();
  }, [user?.id]);

  const handleSend = async (text) => {
    const msg = (text || inputText).trim();
    if (!msg || loading) return;

    setInputText('');
    const userMsg = { id: Date.now().toString(), text: msg, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    await saveChatMessage(user.id, msg, true);

    try {
      const context = {
        weight: profile?.physical_data?.weight || profile?.onboarding?.weight,
        height: profile?.physical_data?.height || profile?.onboarding?.height,
        age: profile?.physical_data?.age || profile?.onboarding?.age,
        goal: profile?.onboarding?.goal,
        gymType: profile?.onboarding?.gymType,
        level: profile?.onboarding?.level,
      };

      const reply = await askGeminiCoach(msg, context, messages);
      const coachMsg = { id: (Date.now() + 1).toString(), text: reply, isUser: false };
      setMessages(prev => [...prev, coachMsg]);
      await saveChatMessage(user.id, reply, false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    Alert.alert('Limpar historico', 'Apagar todas as mensagens?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpar',
        style: 'destructive',
        onPress: async () => {
          await clearChatHistory(user.id);
          const welcomeMsg = {
            id: 'welcome',
            text: 'Historico limpo! Em como posso ajudar?',
            isUser: false,
          };
          setMessages([welcomeMsg]);
          await saveChatMessage(user.id, welcomeMsg.text, false);
        },
      },
    ]);
  };

  if (!historyLoaded) {
    return (
      <View style={[layout.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={layout.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.coachAvatar}>
            <Ionicons name="fitness" size={18} color={COLORS.background} />
          </View>
          <View>
            <Text style={typography.h5}>Coach Nix IA</Text>
            <Text style={[typography.caption, { color: COLORS.primary }]}>Treino & Nutricao</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleClearChat} style={styles.clearBtn}>
          <Ionicons name="trash-outline" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.isUser ? styles.bubbleUser : styles.bubbleCoach]}>
            {!item.isUser && (
              <View style={styles.coachBubbleAvatar}>
                <Ionicons name="fitness" size={12} color={COLORS.primary} />
              </View>
            )}
            <Text style={[styles.bubbleText, item.isUser ? styles.textUser : styles.textCoach]}>
              {item.text}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {messages.length <= 1 && (
        <View style={styles.tipsContainer}>
          <Text style={[typography.caption, { marginBottom: SPACING.sm }]}>Sugestoes:</Text>
          <View style={styles.tipsRow}>
            {QUICK_TIPS.map((tip, i) => (
              <TouchableOpacity key={i} style={styles.tipChip} onPress={() => handleSend(tip)}>
                <Text style={typography.bodySmall}>{tip}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.inputArea}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Pergunte sobre treino ou dieta..."
          placeholderTextColor={COLORS.textMuted}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={() => handleSend()}
          disabled={loading || !inputText.trim()}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <Ionicons name="send" size={18} color={COLORS.background} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { padding: SPACING.sm },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  coachAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  clearBtn: { padding: SPACING.sm },
  listContent: { padding: SPACING.md, gap: SPACING.md, paddingBottom: 10 },
  bubble: { maxWidth: '82%', padding: SPACING.lg, borderRadius: BORDER_RADIUS.lg },
  bubbleUser: { alignSelf: 'flex-end', backgroundColor: COLORS.primary, borderBottomRightRadius: 2 },
  bubbleCoach: { alignSelf: 'flex-start', backgroundColor: COLORS.surface, borderBottomLeftRadius: 2, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', gap: SPACING.sm },
  coachBubbleAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  bubbleText: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, flex: 1 },
  textUser: { color: COLORS.background },
  textCoach: { color: COLORS.textTitle },
  tipsContainer: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
  tipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  tipChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: 999, borderWidth: 1, borderColor: COLORS.border },
  inputArea: { flexDirection: 'row', padding: SPACING.md, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border, gap: SPACING.sm, alignItems: 'flex-end' },
  textInput: { flex: 1, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14, maxHeight: 100 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { opacity: 0.5 },
});
