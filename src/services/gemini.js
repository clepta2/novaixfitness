// src/services/gemini.js
// Integracao com Gemini API + Historico - NOVAIX FITNESS

import { supabase } from '../config/supabase';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

export async function askGeminiCoach(message, profileContext = {}, conversationHistory = []) {
  const systemInstruction = `Voce e o Coach e Nutricionista de IA da NOVAIX FITNESS.
Diga sempre a verdade de forma motivadora, direta e profissional.
O usuario tem os seguintes dados fisicos:
- Peso: ${profileContext.weight || 'Nao informado'} kg
- Altura: ${profileContext.height || 'Nao informado'} cm
- Idade: ${profileContext.age || 'Nao informada'} anos
- Objetivo principal: ${profileContext.goal || 'Ficar em forma'}
- Equipamento disponivel: ${profileContext.gymType || 'Geral'}
- Nivel de experiencia: ${profileContext.level || 'Nao informado'}

Responda em formato de chat curto, amigavel e com orientacoes praticas.
Maximo 3 paragrafos. Seja objetivo.`;

  if (!API_KEY) {
    return generateFallbackResponse(message, profileContext);
  }

  try {
    const contents = [];

    if (conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10);
      for (const msg of recentHistory) {
        contents.push({
          role: msg.isUser ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: `${systemInstruction}\n\nPergunta do usuario: ${message}` }],
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    const result = await response.json();
    const reply = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (reply) return reply;

    return generateFallbackResponse(message, profileContext);
  } catch (error) {
    console.error('Erro Gemini API:', error);
    return generateFallbackResponse(message, profileContext);
  }
}

export async function saveChatMessage(userId, message, isUser) {
  if (!userId) return;

  try {
    await supabase.from('coach_chat_messages').insert({
      user_id: userId,
      message,
      is_user: isUser,
    });
  } catch (err) {
    console.error('Erro ao salvar mensagem:', err);
  }
}

export async function getChatHistory(userId, limit = 50) {
  if (!userId) return [];

  try {
    const { data } = await supabase
      .from('coach_chat_messages')
      .select('id, message, is_user, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(limit);

    return (data || []).map(m => ({
      id: m.id,
      text: m.message,
      isUser: m.is_user,
    }));
  } catch (err) {
    console.error('Erro ao buscar historico:', err);
    return [];
  }
}

export async function clearChatHistory(userId) {
  if (!userId) return;

  try {
    await supabase
      .from('coach_chat_messages')
      .delete()
      .eq('user_id', userId);
  } catch (err) {
    console.error('Erro ao limpar historico:', err);
  }
}

function generateFallbackResponse(message, context) {
  const msgLower = message.toLowerCase();
  const goal = context.goal?.toLowerCase() || '';

  if (msgLower.includes('treino') || msgLower.includes('exercicio')) {
    if (goal.includes('hipertrofia') || goal.includes('massa')) {
      return `Foco em hipertrofia! Recomendo 3-4x por semana com progressao de carga. Comece pelo "Treino A: Peito & Triceps" no app. Registre suas cargas para acompanhar a evolucao!`;
    }
    if (goal.includes('emagrec') || goal.includes('perder peso')) {
      return `Para emagrecimento, combine musculacao com HIIT. O "HIIT Cardio 30 minutos" e otimo para queima calórica. Meta: 4-5 treinos/semana.`;
    }
    return `Consistencia e a chave! Minimo 3 treinos semanais misturando forca e cardio. Que tal comecar o "HIIT Cardio" hoje?`;
  }

  if (msgLower.includes('dieta') || msgLower.includes('comer') || msgLower.includes('nutricao') || msgLower.includes('proteina')) {
    const weight = context.weight || 70;
    const protein = Math.round(weight * 1.8);
    const calories = Math.round(weight * 33);
    return `Com ${weight}kg, seu consumo ideal de proteina e ~${protein}g/dia. Calorias alvo: ~${calories} kcal. Foco em frango, ovos, peixe e legumes. Bata 2.5L de agua diarios!`;
  }

  if (msgLower.includes('descanso') || msgLower.includes('dormir') || msgLower.includes('sono')) {
    return `Sono e recuperacao sao essenciais! Durma 7-9h por noite. Evite telas 1h antes de dormir. Entre os treinos, respeite seus dias de descanso.`;
  }

  if (msgLower.includes('alongamento') || msgLower.includes('flexibilidade')) {
    return `Alongue 10-15 min pos-treino. Foco em quadricips, isquiotibiais e lombar. Mobilidade melhora performance e previne lesões.`;
  }

  return `Fala campeao! Analisando seu perfil focado em "${context.goal || 'evoluir no fisico'}", o segredo e constancia. Qual sua duvida sobre treino ou nutricao?`;
}
