import { useState, useEffect, useRef } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/colors';
import { SPACING } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';
import { askGeminiCoach, saveChatMessage, getChatHistory, clearChatHistory } from '../src/services/gemini';
import { analyzeMealText, saveMealLog } from '../src/services/mealAnalyzer';
import ChatHeader from '../src/components/chat/ChatHeader';
import MessageBubble from '../src/components/chat/MessageBubble';
import ChatInput from '../src/components/chat/ChatInput';
import QuickTips from '../src/components/chat/QuickTips';
import { layout } from '../src/styles';
import { MEAL_KEYWORDS, FOOD_KEYWORDS, QUANTITY_PATTERN } from '../src/data/nutritionKeywords';

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
        if (data) {
          setProfile(data);
          
          const isAllowedPlan = ['intermediate', 'premium', 'ultra'].includes(data.subscription_plan);
          const hasActiveSub = data.subscription_status === 'active';
          
          if (!isAllowedPlan || !hasActiveSub) {
            Alert.alert(
              'Acesso Restrito 🔒',
              'O Coach IA está disponível apenas para assinantes dos planos Intermediário, Premium e Ultra Premium com assinatura ativa.',
              [
                { text: 'Voltar', onPress: () => router.back() },
                { text: 'Ver Planos', onPress: () => {
                  router.back();
                  router.push('/paywall');
                }}
              ],
              { cancelable: false }
            );
            return;
          }
        }

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
        if (__DEV__) console.error('Erro ao carregar chat:', err);
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

    const isMealLog = detectMealLog(msg);

    try {
      const pd = profile?.physical_data || {};
      const ob = profile?.onboarding || {};
      const context = { userId: user.id, subscriptionPlan: profile?.subscription_plan, weight: pd.weight || ob.weight, height: pd.height || ob.height, age: pd.age || ob.age, goal: ob.goal, gymType: ob.gymType, level: ob.level };

      if (isMealLog) {
        const mealData = await analyzeMealText(msg, context);
        if (mealData) {
          await saveMealLog(user.id, mealData);
          const summary = formatMealSummary(mealData);
          const coachMsg = { id: (Date.now() + 1).toString(), text: summary, isUser: false, isMealCard: true, mealData };
          setMessages(prev => [...prev, coachMsg]);
          await saveChatMessage(user.id, summary, false);
          setLoading(false);
          return;
        }
      }

      const reply = await askGeminiCoach(msg, context, messages);
      const coachMsg = { id: (Date.now() + 1).toString(), text: reply, isUser: false };
      setMessages(prev => [...prev, coachMsg]);
      await saveChatMessage(user.id, reply, false);
    } catch (err) {
      if (err.message === 'LIMIT_EXCEEDED') {
        setMessages(prev => prev.filter(m => m.id !== userMsg.id));
        try {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          await supabase
            .from('coach_chat_messages')
            .delete()
            .eq('user_id', user.id)
            .eq('message', msg)
            .eq('is_user', true)
            .gte('created_at', today.toISOString());
        } catch (dbErr) {
          if (__DEV__) console.error('Erro ao deletar mensagem excedente:', dbErr);
        }

        Alert.alert(
          'Limite Excedido 🔒',
          'Você atingiu seu limite diário de mensagens do Coach IA. Faça um upgrade para enviar mais mensagens!',
          [
            { text: 'OK' },
            { text: 'Ver Planos', onPress: () => { router.push('/paywall'); } },
          ]
        );
      } else {
        if (__DEV__) console.error('Erro ao enviar mensagem:', err);
      }
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

function detectMealLog(text) {
  const lower = text.toLowerCase();
  return MEAL_KEYWORDS.some(k => lower.includes(k)) || FOOD_KEYWORDS.some(k => lower.includes(k)) || QUANTITY_PATTERN.test(lower);
}

function formatMealSummary(meal) {
  const items = meal.items?.length > 0 ? meal.items.join(', ') : 'Refeição';
  return `🍽️ **Refeição registrada!**\n\n${meal.description || items}\n\n📊 **Macros:**\n• ${meal.calories} kcal\n• ${meal.protein}g proteína\n• ${meal.carbs}g carboidratos\n• ${meal.fat}g gordura\n• ${meal.fiber}g fibra\n\n✅ Salvo no seu diário de nutrição!`;
}
