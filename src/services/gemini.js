// src/services/gemini.js
// Integracao com Gemini API + Historico - NOVAIX FITNESS

import { supabase } from '../config/supabase';
import { APP_CONFIG } from '../config/app';

export async function askGeminiCoach(message, profileContext = {}, conversationHistory = []) {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || '';
  const plan = profileContext.subscriptionPlan || 'free';
  const limit = APP_CONFIG.plans[plan]?.maxMessages ?? 0;

  if (profileContext.userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from('coach_chat_messages')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', profileContext.userId)
      .eq('is_user', true)
      .gte('created_at', today.toISOString());

    if (error) {
      console.error('Erro ao verificar limite:', error);
    } else if (count && count > limit) {
      throw new Error('LIMIT_EXCEEDED');
    }
  }

  const systemInstruction = `Coach/Nutri IA NOVAIX: direto, motivador. Usuario: Peso ${profileContext.weight || '?'}kg, Altura ${profileContext.height || '?'}cm, Idade ${profileContext.age || '?'}a, Obj: ${profileContext.goal || 'Geral'}, Equip: ${profileContext.gymType || 'Geral'}, Nivel: ${profileContext.level || 'Geral'}. Responda em chat curto, max 3 paragrafos, objetivo.`;

  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  try {
    const contents = [];

    if (conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-5);
      for (const msg of recentHistory) {
        contents.push({
          role: msg.isUser ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: `${systemInstruction}\n\nPergunta: ${message}` }],
    });

    const url = `${APP_CONFIG.apis.geminiBaseUrl}?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ contents }),
    });

    const result = await response.json();
    const reply = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (reply) return reply;

    return 'Desculpe, não consegui processar sua mensagem. Tente novamente.';
  } catch (error) {
    console.error('Erro Gemini API:', error);
    return 'Erro ao conectar com o assistente. Verifique sua conexão e tente novamente.';
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

export async function analyzeMealText(mealText) {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || '';
  if (!apiKey) {
    const calories = mealText.includes('ovo') ? 140 : mealText.includes('pão') ? 150 : 250;
    return { calories, protein: Math.round(calories * 0.06), carbs: Math.round(calories * 0.08), fat: Math.round(calories * 0.03) };
  }
  try {
    const prompt = `Analise a refeicao: "${mealText}". Retorne APENAS um objeto JSON valido com as chaves: calories, protein, carbs, fat. Sem markdown ou explicacoes. Exemplo: {"calories": 300, "protein": 20, "carbs": 30, "fat": 10}`;
    const url = `${APP_CONFIG.apis.geminiBaseUrl}?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] }),
    });
    const result = await response.json();
    const txt = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const clean = txt.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error('Erro Gemini meal tracker:', err);
    return { calories: 200, protein: 12, carbs: 25, fat: 6 };
  }
}

function generateFallbackResponse(message, context) {
  const msgLower = message.toLowerCase();
  const goal = context.goal?.toLowerCase() || '';
  const weight = context.weight || 70;
  const height = context.height || 170;
  const age = context.age || 25;

  // Treino
  if (msgLower.includes('treino') || msgLower.includes('exercicio') || msgLower.includes('treinar')) {
    if (goal.includes('hipertrofia') || goal.includes('massa')) {
      return `Para hipertrofia com ${context.level || 'nivel intermediario'}:\n\nFrequencia: 4-5x/semana\nDivisao recomendada: A (Peito/Triceps), B (Costas/Biceps), C (Pernas), D (Ombros/Abdomen)\n\nProgressao: aumente carga quando conseguir 12 reps com boa forma. Registre tudo no app!`;
    }
    if (goal.includes('emagrec') || goal.includes('perder peso')) {
      const calCardio = Math.round(weight * 0.8 * 30);
      return `Para emagrecimento:\n\nMusculacao 3-4x/semana + HIIT 2-3x/semana\nHIIT queima ~${calCardio} kcal em 30min\n\nDica: foque em exercicios compostos (agachamento, supino, remada) para maxima queima calorica.`;
    }
    if (goal.includes('forca') || goal.includes('condicionamento')) {
      return `Para forca e condicionamento:\n\nCombinacao ideal: musculacao pesada (3-5x repeticoes) + cardio intervalado\nExercicios: agachamento, levantamento terra, supino, barra\nProgressao: aumente carga ou reduza descanso entre series.`;
    }
    return `Para seu nivel (${context.level || 'intermediario'}) e objetivo (${goal || 'evoluir'}):\n\nTreine 3-4x/semana misturando forca e cardio. Registre suas cargas no app para acompanhar a evolucao. Consistencia e a chave!`;
  }

  // Dieta/Nutricao
  if (msgLower.includes('dieta') || msgLower.includes('comer') || msgLower.includes('nutricao') || msgLower.includes('proteina') || msgLower.includes('caloria')) {
    const bmr = gender === 'M' ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age) : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    const calories = Math.round(bmr * 1.55);
    const protein = Math.round(weight * 1.8);
    return `Seu plano nutricional personalizado:\n\nCalorias alvo: ~${calories} kcal/dia\nProteina: ~${protein}g/dia (${Math.round(protein/4)}g por refeicao em 4 refeicoes)\nCarboidratos: ~${Math.round(calories * 0.45 / 4)}g/dia\nGorduras: ~${Math.round(calories * 0.25 / 9)}g/dia\n\nDica: distribua as proteinas ao longo do dia para melhor absorcao.`;
  }

  // Suplementacao
  if (msgLower.includes('suplemento') || msgLower.includes('whey') || msgLower.includes('creatina') || msgLower.includes('pre-treino')) {
    return `Suplementacao recomendada:\n\n1. Whey Protein: 30g pos-treino (25g proteina)\n2. Creatina: 5g/dia, todos os dias\n3. Omega-3: 2g/dia para recuperacao\n4. Cafeina: 200mg 30min antes do treino (opcional)\n\nLembre: suplementos complementam, nao substituem alimentacao.`;
  }

  // Agachamento/Especificos
  if (msgLower.includes('agachamento') || msgLower.includes('agachar')) {
    return `Agachamento correto:\n\n1. Pes na largura dos ombros, pontas levemente pra fora\n2. Descenda como se fosse sentar, ate coxas paralelas ao chao\n3. Mantenha peito aberto e coluna reta\n4. Empurre o chao com os pes ao subir\n\nErros comuns: joelhos pra dentro, corpo inclinado, heels levantados.`;
  }

  if (msgLower.includes('supino')) {
    return `Supino correto:\n\n1. Deitado no banco, pes firmes no chao\n2. Pegada na largura dos ombros (ou um pouco mais)\n3. Desça o haltere ate o peito, cotovelos a 45 graus\n4. Suba controlado, contraindo o peito\n\nDica: nao trave os cotovelos no topo.`;
  }

  // Lesao/Dor
  if (msgLower.includes('lesao') || msgLower.includes('dor') || msgLower.includes('machucado')) {
    return `IMPORTANTE: Em caso de dor persistente, consulte um profissional.\n\nEnquanto isso:\n- Pare o exercicio que causa dor\n- Aplique gelo por 15min a cada 2h\n- Alongue suavemente a area afetada\n- Retorne gradualmente aos treinos\n\nNao ignore dores agudas. Prevencao > Tratamento.`;
  }

  // Cardio
  if (msgLower.includes('cardio') || msgLower.includes('correr') || msgLower.includes('corrida')) {
    const calRun = Math.round(weight * 1.0 * 30);
    return `Cardio recomendado:\n\nPara iniciantes: caminhada rapida 30min\nIntermediario: corrida intervalada 25min (~${calRun} kcal)\nAvancado: HIIT 20min ou corrida 40min\n\nMeta: 150min/semana de atividade aerobica moderada.`;
  }

  // Sono/Recuperacao
  if (msgLower.includes('descanso') || msgLower.includes('dormir') || msgLower.includes('sono') || msgLower.includes('recuperacao')) {
    return `Sono e recuperacao otima:\n\n1. Durma 7-9h por noite (horario fixo)\n2. Evite telas 1h antes de dormir\n3. Quart escuro e fresco (18-20C)\n4. Cafeina apenas ate 14h\n5. Treine pelo menos 3h antes de dormir\n\nDias de descanso: respeite! Musculos crescem durante o repouso.`;
  }

  // Alongamento/Mobilidade
  if (msgLower.includes('alongamento') || msgLower.includes('flexibilidade') || msgLower.includes('mobilidade')) {
    return `Rotina de mobilidade (10-15min):\n\n1. Rotacao de ombros: 10x cada lado\n2. Quadriceps no chao: 30s cada lado\n3. Estocada com rotacao: 10x cada lado\n4. Prancha: 3x 30s\n5. Cobra: 3x 15s\n\nFaca pos-treino ou em dias de descanso.`;
  }

  // Greeting
  if (msgLower.includes('ola') || msgLower.includes('bom dia') || msgLower.includes('boa noite') || msgLower.includes('oi')) {
    const hour = new Date().getHours();
    let greeting = 'Olá';
    if (hour >= 6 && hour < 12) greeting = 'Bom dia';
    else if (hour >= 12 && hour < 18) greeting = 'Boa tarde';
    else greeting = 'Boa noite';

    return `${greeting}! 😊\n\nSou seu Coach IA do NOVAIX. Vejo que voce esta com objetivo de "${goal || 'evoluir no fisico'}" e nivel "${context.level || 'intermediario'}".\n\nComo posso ajudar hoje? Posso falar sobre treino, nutricao, suplementacao ou recuperacao.`;
  }

  // Thanks
  if (msgLower.includes('obrigad') || msgLower.includes('valeu') || msgLower.includes('thanks')) {
    return `Por nada! 😊 Estou aqui sempre que precisar. Bora treinar! 💪`;
  }

  // Default - personalized
  const responses = [
    `Entendi! Baseado no seu perfil (${context.level || 'intermediario'}, ${goal || 'evoluir'}), posso ajudar com:\n\n- Treinos especificos\n- Plano nutricional\n- Suplementacao\n- Recuperacao\n\nSobre o que quer saber?`,
    `Boa pergunta! Analisando seus dados (${weight}kg, ${context.height || 170}cm):\n\nMe diga mais detalhes para eu te dar uma dica mais personalizada. Treino, dieta ou recuperacao?`,
    `Vou te ajudar com isso! Para uma resposta mais precisa, me conte:\n- Qual seu objetivo atual?\n- Ha quanto tempo treina?\n- Tem alguma restricao alimentar?`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
