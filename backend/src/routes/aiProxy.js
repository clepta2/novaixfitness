// backend/src/routes/aiProxy.ts
// Proxy genérico para chamadas de IA - NOVAIX FITNESS
// Mantém a chave da API segura no backend

import express, { Request, Response, Router } from 'express';
import fetch from 'node-fetch';
import { authenticate } from '../middleware/auth';
import { logAudit } from '../middleware/audit';

const router: Router = express.Router();

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Limite de caracteres por tipo de uso
const MAX_LENGTHS: Record<string, number> = {
  coach: 500,
  meal: 300,
  recipe: 1000,
  tips: 500,
  plan: 3000,
  shopping: 1000,
  nutrition: 1000,
  default: 1000,
};

// POST /api/ai/generate - Proxy genérico para Gemini
router.post('/generate', authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { prompt, type = 'default', systemInstruction } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt inválido' });
  }

  const maxLength = MAX_LENGTHS[type] || MAX_LENGTHS.default;
  if (prompt.length > maxLength) {
    return res.status(400).json({ error: `Prompt excede limite de ${maxLength} caracteres` });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
  if (!apiKey) {
    return res.status(500).json({ error: 'Serviço de IA indisponível' });
  }

  try {
    // Rate limit check
    const { data: limitCheck } = await (await import('../config/supabase')).default
      .rpc('check_user_rate_limit', {
        p_user_id: userId,
        p_action_type: `ai_${type}`,
        p_max_count: type === 'coach' ? 15 : 10,
        p_window_minutes: 60,
      });

    if (limitCheck && !(limitCheck as any).allowed) {
      return res.status(429).json({ error: 'Limite de requisições atingido' });
    }

    // Montar prompt com system instruction se fornecida
    const fullPrompt = systemInstruction
      ? `${systemInstruction}\n\n${prompt}`
      : prompt;

    const url = `${GEMINI_BASE_URL}?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      }),
    });

    const result: any = await response.json();
    let reply = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      throw new Error('Retorno vazio do Gemini');
    }

    // Sanitizar output
    reply = reply.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Log de auditoria
    await logAudit(userId, `ai_${type}`, {
      promptLength: prompt.length,
      responseLength: reply.length,
    });

    return res.json({ response: reply });
  } catch (error: any) {
    console.error(`Erro no proxy AI (${type}):`, error.message);
    return res.status(500).json({ error: 'Erro ao processar resposta' });
  }
});

export = router;
