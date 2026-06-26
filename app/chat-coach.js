import { useState, useEffect, useRef } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/colors';
import { SPACING } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';
import { askGeminiCoach, saveChatMessage, getChatHistory, clearChatHistory } from '../src/services/gemini';
import ChatHeader from '../src/components/chat/ChatHeader';
import MessageBubble from '../src/components/chat/MessageBubble';
import ChatInput from '../src/components/chat/ChatInput';
import QuickTips from '../src/components/chat/QuickTips';
import { layout } from '../src/styles';

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
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) setProfile(data);

        const history = await getChatHistory(user.id);
        if (history.length > 0) {
          setMessages(history);
        } else {
          const userName = data?.name || 'Atleta';
          const welcomeMsg = { id: 'welcome', text: `Ola, ${userName}! Sou seu Coach e Nutricionista de IA. Posso te ajudar com treinos, dieta, recuperacao e mais. Como posso ajudar?`, isUser: false };
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
          const welcomeMsg = { id: 'welcome', text: 'Historico limpo! Em como posso ajudar?', isUser: false };
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
      <ChatHeader onBack={() => router.back()} onClear={handleClearChat} />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {messages.length <= 1 && <QuickTips onSendTip={handleSend} />}

      <ChatInput value={inputText} onChange={setInputText} onSend={() => handleSend()} loading={loading} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  listContent: { padding: SPACING.md, gap: SPACING.md, paddingBottom: 10 },
});
