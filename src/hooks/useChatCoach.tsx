// Hook para lógica do Coach IA

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../config/supabase';
import { askGeminiCoach, saveChatMessage, getChatHistory, clearChatHistory } from '../services/gemini';
import { analyzeMealText, saveMealLog } from '../services/mealAnalyzer';
import { detectMealLog, formatMealSummary } from '../helpers/chatHelpers';
import { buildChatContext, createWelcomeMessage, createCoachMessage, createUserMessage, cleanupLimitExceededMessage } from './helpers/chatHelpers';
import { Profile } from '../types';

interface ChatMsg {
  id: string;
  text: string;
  isUser: boolean;
  timestamp?: string;
  [key: string]: unknown;
}

interface Router {
  back: () => void;
  push: (url: string) => void;
  [key: string]: unknown;
}

interface SupabaseUser {
  id: string;
  [key: string]: unknown;
}

interface UseChatCoachReturn {
  messages: any[];
  inputText: string;
  setInputText: (val: string) => void;
  loading: boolean;
  historyLoaded: boolean;
  flatListRef: React.RefObject<unknown>;
  handleSend: (text?: string) => Promise<void>;
  handleClearChat: () => void;
}

export function useChatCoach(user: SupabaseUser | null, router: Router): UseChatCoachReturn {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [historyLoaded, setHistoryLoaded] = useState<boolean>(false);
  const flatListRef = useRef<unknown>(null);

  useEffect(() => {
    async function init(): Promise<void> {
      if (!user?.id) return;
      try {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          setProfile(data as Profile);
          const isAllowedPlan = ['intermediate', 'premium', 'ultra'].includes(data.subscription_plan);
          const hasActiveSub = data.subscription_status === 'active';
          if (!isAllowedPlan || !hasActiveSub) {
            Alert.alert(
              'Acesso Restrito',
              'O Coach IA esta disponivel apenas para assinantes dos planos Intermediario, Premium e Ultra Premium com assinatura ativa.',
              [
                { text: 'Voltar', onPress: () => router.back() },
                { text: 'Ver Planos', onPress: () => router.push('/paywall') },
              ],
              { cancelable: false },
            );
            return;
          }
        }
        const history = await getChatHistory(user.id);
        if (history && history.length > 0) {
          setMessages(history as any[]);
        } else {
          const welcome = createWelcomeMessage(data?.name || 'Atleta');
          setMessages([welcome]);
          await saveChatMessage(user.id, welcome.text, false);
        }
      } catch (err) {
        if (__DEV__) console.error('Erro ao carregar chat:', err);
      } finally {
        setHistoryLoaded(true);
      }
    }
    init();
  }, [user?.id]);

  const handleSend = useCallback(async (text?: string): Promise<void> => {
    if (!user?.id) return;
    const msg = (text || inputText).trim();
    if (!msg || loading) return;
    setInputText('');
    const userMsg = createUserMessage(msg);
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    await saveChatMessage(user.id, msg, true);

    if (detectMealLog(msg)) {
      try {
        const context = buildChatContext(profile as any);
        (context as any).userId = user.id;
        const mealData = await analyzeMealText(msg, context);
        if (mealData) {
          await saveMealLog(user.id, mealData);
          const summary = formatMealSummary(mealData);
          const coachMsg = createCoachMessage(summary, { isMealCard: true, mealData });
          setMessages(prev => [...prev, coachMsg]);
          await saveChatMessage(user.id, summary, false);
          setLoading(false);
          return;
        }
      } catch (e) { if (__DEV__) console.warn('useChatCoach mealLog:', e); }
    }

    try {
      const context = buildChatContext(profile as any);
      (context as any).userId = user.id;
      const reply: any = await askGeminiCoach(msg, context, ([...messages, userMsg] as any));
      setMessages((prev: any[]) => [...prev, createCoachMessage(reply as any)] as any[]);
      await saveChatMessage(user.id, reply as any, false);
    } catch (err) {
      if ((err as Error).message === 'LIMIT_EXCEEDED') {
        setMessages(prev => prev.filter(m => m.id !== userMsg.id));
        await cleanupLimitExceededMessage(user as any, msg, supabase);
        Alert.alert('Limite Excedido', 'Voce atingiu seu limite diario de mensagens do Coach IA. Faca um upgrade para enviar mais mensagens!', [
          { text: 'OK' },
          { text: 'Ver Planos', onPress: () => router.push('/paywall') },
        ]);
      } else if ((err as Error).message === 'API_KEY_MISSING') {
        setMessages(prev => [...prev, createCoachMessage('Configure a chave de API do Google para usar o Coach IA.')]);
      } else {
        setMessages(prev => [...prev, createCoachMessage('Erro ao conectar com o assistente. Verifique sua conexao e tente novamente.')]);
        if (__DEV__) console.error('Erro ao enviar mensagem:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id, inputText, loading, profile, messages, router]);

  const handleClearChat = useCallback((): void => {
    if (!user?.id) return;
    Alert.alert('Limpar historico', 'Apagar todas as mensagens?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpar', style: 'destructive',
        onPress: async () => {
          await clearChatHistory(user.id);
          const welcome = createWelcomeMessage('Historico limpo!');
          welcome.text = 'Historico limpo! Em como posso ajudar?';
          setMessages([welcome]);
          await saveChatMessage(user.id, welcome.text, false);
        },
      },
    ]);
  }, [user?.id]);

  return { messages, inputText, setInputText, loading, historyLoaded, flatListRef, handleSend, handleClearChat };
}
