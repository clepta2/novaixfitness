// src/services/shoppingList.js
// Lista de compras gerada por IA

import { APP_CONFIG } from '../config/app';
import { supabase } from '../config/supabase';

export async function generateShoppingList(mealPlan, profileContext = {}) {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || '';
  
  const systemPrompt = `Gere uma lista de compras semanal em JSON válido.

Refeições do usuário:
${JSON.stringify(mealPlan?.week?.slice(0, 3) || [])}

Usuário: ${profileContext.weight || 70}kg, objetivo: ${profileContext.goal || 'manter'}.
Restrições: ${profileContext.dietaryRestrictions || 'nenhuma'}.

Retorne:
{
  "week": "Segunda a Domingo",
  "categories": [
    {
      "name": "Proteínas",
      "items": [
        {"name": "Frango", "amount": "1kg", "checked": false},
        {"name": "Ovos", "amount": "2 dúzias", "checked": false}
      ]
    },
    {
      "name": "Legumes",
      "items": [
        {"name": "Brócolis", "amount": "2 maços", "checked": false}
      ]
    }
  ],
  "tips": ["Dica 1", "Dica 2"]
}

Use alimentos brasileiros. Inclua quantidades para 1 pessoa. Seja prático.`;

  if (!apiKey) return generateFallbackShoppingList();

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
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return null;
  } catch (error) {
    console.error('Erro ao gerar lista:', error);
    return generateFallbackShoppingList();
  }
}

function generateFallbackShoppingList() {
  return {
    week: 'Segunda a Domingo',
    categories: [
      { name: 'Proteínas', items: [{ name: 'Frango', amount: '1kg', checked: false }, { name: 'Ovos', amount: '2 dúzias', checked: false }, { name: 'Peixe', amount: '500g', checked: false }] },
      { name: 'Carboidratos', items: [{ name: 'Arroz', amount: '1kg', checked: false }, { name: 'Batata doce', amount: '1kg', checked: false }, { name: 'Aveia', amount: '500g', checked: false }] },
      { name: 'Legumes', items: [{ name: 'Brócolis', amount: '2 maços', checked: false }, { name: 'Tomate', amount: '1kg', checked: false }, { name: 'Cenoura', amount: '1kg', checked: false }] },
      { name: 'Laticínios', items: [{ name: 'Iogurte grego', amount: '4x', checked: false }, { name: 'Queijo cottage', amount: '200g', checked: false }] },
    ],
    tips: ['Compre frutas da estação', 'Prefira alimentos in natura', 'Evite ultraprocessados'],
  };
}

export async function saveShoppingList(userId, list) {
  if (!userId || !list) return;
  await supabase.from('shopping_lists').upsert({ user_id: userId, items: list, is_active: true, week_start: new Date().toISOString() }, { onConflict: 'user_id,is_active' });
}

export async function getShoppingList(userId) {
  if (!userId) return null;
  const { data } = await supabase.from('shopping_lists').select('*').eq('user_id', userId).eq('is_active', true).single();
  return data?.items || null;
}
