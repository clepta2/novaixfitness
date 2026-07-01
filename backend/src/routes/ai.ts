// backend/src/routes/ai.ts
// Rota de IA Segura - NOVAIX FITNESS

import express, { Request, Response, Router } from 'express';
import fetch from 'node-fetch';
import supabase from '../config/supabase';
import { authenticate } from '../middleware/auth';
import { logAudit } from '../middleware/audit';

const router: Router = express.Router();

const JAILBREAK_BLACKLIST = [
  'ignore as instruções', 'ignore as regras', 'esqueça as regras',
  'esqueça o prompt', 'ignore o prompt', 'esqueça as instruções',
  'reveal system prompt', 'revelar prompt', 'sudo ', 'system instruction'
];

function stripPII(text: string): string {
  if (!text) return '';
  let clean = text.replace(/\d{3}\.\d{3}\.\d{3}-\d{2}/g, '[CPF_MASCARADO]');
  clean = clean.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_MASCARADO]');
  clean = clean.replace(/(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})/g, '[TELEFONE_MASCARADO]');
  return clean;
}

// Auxiliar para processar cobrança de moedas
async function chargeRegenerationCoins(userId: string): Promise<number> {
  let { data: wallet, error: walletError } = await supabase
    .from('wallet')
    .select('balance, total_spent')
    .eq('user_id', userId)
    .maybeSingle();
  if (!wallet) {
    const { data: newW, error: createError } = await supabase
      .from('wallet')
      .insert({ user_id: userId, balance: 100 })
      .select().single();
    if (createError) throw createError;
    wallet = newW;
  }
  if (wallet.balance < 50) {
    throw new Error('BALANCE_INSUFFICIENT');
  }
  const { error: updError } = await supabase
    .from('wallet')
    .update({ balance: wallet.balance - 50, total_spent: (wallet.total_spent || 0) + 50, updated_at: new Date() })
    .eq('user_id', userId);
  if (updError) throw updError;
  await supabase.from('coin_transactions').insert({
    user_id: userId,
    type: 'spent',
    amount: 50,
    source: 'ai_regeneration',
    description: 'Regeneração forçada de recomendação de IA',
  });
  return wallet.balance - 50;
}

router.post('/coach', authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { message, weight = 70, goal = 'manter', gymType = 'Geral', level = 'Iniciante' } = req.body;
  if (!message || typeof message !== 'string') return res.status(400).json({ error: 'Mensagem inválida' });
  if (message.length > 500) return res.status(400).json({ error: 'A mensagem excede o limite máximo de 500 caracteres' });
  const lowerMsg = message.toLowerCase();
  if (JAILBREAK_BLACKLIST.some(word => lowerMsg.includes(word))) {
    await logAudit(userId, 'ai_jailbreak_attempt', { message: lowerMsg.substring(0, 100) });
    return res.status(400).json({ error: 'Comportamento de prompt inadequado detectado' });
  }
  const cleanMessage = stripPII(message);
  try {
    const { data: limitCheck } = await supabase.rpc('check_user_rate_limit', {
      p_user_id: userId, p_action_type: 'ai_chat', p_max_count: 15, p_window_minutes: 60
    });
    if (limitCheck && !(limitCheck as any).allowed) {
      return res.status(429).json({ error: 'Você atingiu o limite de perguntas nesta hora.' });
    }
  } catch (err: any) {
    console.error('Erro de limite:', err.message);
  }
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
  if (!apiKey) return res.status(500).json({ error: 'Serviço de IA indisponível' });
  const systemInstruction = `Você é o Coach/Nutri do NOVAIX FITNESS. Responda estritamente em português, de forma motivadora, direta e curta. Contexto: Peso: ${weight}kg, Objetivo: ${goal}, Local: ${gymType}, Nível: ${level}.`;
  try {
    const prompt = `${systemInstruction}\n\nPergunta: ${cleanMessage}`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
    });
    const result: any = await response.json();
    let reply = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) throw new Error('Retorno vazio do Gemini');
    reply = reply.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    await logAudit(userId, 'ai_chat', { tokens: message.length / 4 });
    await supabase.from('ai_chat_history').insert({
      user_id: userId, message: cleanMessage, response: reply, tokens_used: Math.ceil(message.length / 4)
    });
    return res.json({ response: reply });
  } catch (error: any) {
    console.error('Erro no coach:', error.message);
    return res.status(500).json({ error: 'Erro ao processar resposta' });
  }
});

router.post('/recommend', authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { prompt, forceRegenerate = false } = req.body;
  if (!prompt || typeof prompt !== 'string') return res.status(400).json({ error: 'Prompt inválido' });
  if (prompt.length > 3000) return res.status(400).json({ error: 'Prompt muito longo' });
  const isWorkout = prompt.toLowerCase().includes('workout') || prompt.toLowerCase().includes('treino');
  const isNutrition = prompt.toLowerCase().includes('nutrition') || prompt.toLowerCase().includes('dieta') || prompt.toLowerCase().includes('refeicao');
  const checkDate = new Date();
  checkDate.setDate(checkDate.getDate() - 28);
  // 1. Verificar Cache se não for regeneração forçada
  if (!forceRegenerate) {
    try {
      if (isWorkout) {
        const { data: cachedPlan } = await supabase
          .from('ai_workout_plans')
          .select('plan_data')
          .eq('user_id', userId)
          .eq('status', 'active')
          .gte('created_at', checkDate.toISOString())
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (cachedPlan?.plan_data) {
          const text = typeof cachedPlan.plan_data === 'string' ? cachedPlan.plan_data : JSON.stringify(cachedPlan.plan_data);
          return res.json({ response: text, cached: true });
        }
      } else if (isNutrition) {
        const { data: cachedAdvice } = await supabase
          .from('ai_chat_history')
          .select('response')
          .eq('user_id', userId)
          .gte('created_at', checkDate.toISOString())
          .ilike('message', '%dieta%')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (cachedAdvice?.response) {
          return res.json({ response: cachedAdvice.response, cached: true });
        }
      }
    } catch (err: any) {
      console.error('Erro de cache:', err.message);
    }
  }
  // 2. Processar cobrança se for regeneração forçada
  if (forceRegenerate) {
    try {
      await chargeRegenerationCoins(userId);
    } catch (err: any) {
      if (err.message === 'BALANCE_INSUFFICIENT') {
        return res.status(403).json({ error: 'COINS_INSUFFICIENT', cost: 50 });
      }
      return res.status(500).json({ error: 'Erro ao debitar moedas' });
    }
  }
  // 3. Chamar API do Gemini
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
  if (!apiKey) return res.status(500).json({ error: 'Chave de API não configurada' });
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const result: any = await response.json();
    let reply = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    reply = reply.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    await logAudit(userId, 'ai_recommendation', { length: prompt.length, forced: forceRegenerate });
    // Salvar no Banco
    if (isWorkout) {
      let parsed = { text: reply };
      try {
        const jsonMatch = reply.match(/\{[\s\S]*\}/);
        if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
      } catch {}
      await supabase.from('ai_workout_plans').insert({ user_id: userId, plan_data: parsed, status: 'active' });
    } else {
      await supabase.from('ai_chat_history').insert({ user_id: userId, message: prompt.substring(0, 100), response: reply });
    }
    return res.json({ response: reply, cached: false });
  } catch (error: any) {
    console.error('Erro recommend:', error.message);
    return res.status(500).json({ error: 'Erro ao processar recomendação' });
  }
});

export = router;