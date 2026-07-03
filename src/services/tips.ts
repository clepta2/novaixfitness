// src/services/tips.ts
// Dicas personalizadas por IA - nutrição, treino, suplementação

import { APP_CONFIG } from '../config/app';
import { TIPS_SYSTEM_INSTRUCTION } from './aiSystemInstructions';
import { sanitizeAIOutput } from '../utils/aiSanitize';

interface ProfileContext {
  goal?: string;
  level?: string;
  weight?: number;
  ageRange?: string;
  dietaryRestrictions?: string;
  injuries?: string[];
}

interface Tip {
  title: string;
  description: string;
  icon?: string;
}

interface TipsResult {
  nutrition: Tip[];
  training: Tip[];
  supplements: Tip[];
  lifestyle: Tip[];
}

export async function generatePersonalizedTips(profileContext: ProfileContext): Promise<TipsResult | null> {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || '';
  
  const systemPrompt = `${TIPS_SYSTEM_INSTRUCTION}

Gere 5 dicas personalizadas para o usuário em JSON válido.

Perfil:
- Objetivo: ${profileContext.goal || 'geral'}
- Nível: ${profileContext.level || 'intermediário'}
- Peso: ${profileContext.weight || 70}kg
- Idade: ${profileContext.ageRange || '25-34'}
- Restrições: ${profileContext.dietaryRestrictions || 'nenhuma'}
- Lesões: ${profileContext.injuries?.join(', ') || 'nenhuma'}

Retorne:
{
  "nutrition": [
    {"title": "Título da dica", "description": "Descrição curta", "icon": "nutrition"}
  ],
  "training": [
    {"title": "Título da dica", "description": "Descrição curta", "icon": "training"}
  ],
  "supplements": [
    {"title": "Título da dica", "description": "Descrição curta", "icon": "supplement"}
  ],
  "lifestyle": [
    {"title": "Título da dica", "description": "Descrição curta", "icon": "lifestyle"}
  ]
}

Foque em: nutrição, treino, whey/proteína, creatina, vitaminas, sono, hidratação.
Seja prático e específico para o perfil do usuário.`;

  if (!apiKey) return generateFallbackTips(profileContext);

  try {
    const url = `${APP_CONFIG.apis.geminiBaseUrl}?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: systemPrompt }] }] }),
    });
    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    const sanitized = sanitizeAIOutput(text);
    const jsonMatch = sanitized.match(/\{[\s\S]*?\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return null;
  } catch (error) {
    if (__DEV__) console.error('Erro ao gerar dicas:', error);
    return generateFallbackTips(profileContext);
  }
}

function generateFallbackTips(profile: ProfileContext): TipsResult {
  return {
    nutrition: [
      { title: 'Proteína em cada refeição', description: 'Inclua 20-30g de proteína em cada refeição para manter a massa muscular.' },
      { title: 'Carboidratos complexos', description: 'Prefira arroz integral, batata doce e aveia ao invés de refinedados.' },
      { title: 'Gorduras boas', description: 'Abacate, castanhas e azeite são aliados na saúde.' },
    ],
    training: [
      { title: 'Progressão de carga', description: 'Aumente a carga 2.5kg a cada 2 semanas quando conseguir 12 reps.' },
      { title: 'Descanso entre séries', description: '60-90s para hipertrofia, 30-45s para definição.' },
      { title: 'Aquecimento', description: '5-10 min antes de treinar para prevenir lesões.' },
    ],
    supplements: [
      { title: 'Whey Protein', description: '20-30g após o treino para recuperação muscular.' },
      { title: 'Creatina', description: '3-5g diários para força e resistência.' },
      { title: 'Vitamina D', description: 'Importante para ossos e imunidade, especialmente se não toma sol.' },
    ],
    lifestyle: [
      { title: 'Sono de qualidade', description: 'Durma 7-9h por noite para melhor recuperação.' },
      { title: 'Hidratação', description: 'Beba pelo menos 2L de água por dia, mais nos dias de treino.' },
      { title: 'Gestão de estresse', description: 'Pratique relaxamento 10 min por dia para melhorar resultados.' },
    ],
  };
}
