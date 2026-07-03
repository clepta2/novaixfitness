// src/services/shoppingList.ts
// Lista de compras gerada por IA via proxy - NOVAIX FITNESS

import { generateWithAI } from './ai/aiProxy';
import { supabase } from '../config/supabase';
import { tryIf } from '../utils/tryIf';

// ─── Salvar/Buscar listas no banco ─────────────────────────
export async function saveShoppingList(userId: string, list: any) {
  if (!userId || !list) return;
  await tryIf(async () => {
    await supabase.from('shopping_lists').upsert({
      user_id: userId,
      list_data: list,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  }, { retries: 3, baseDelay: 1000 });
}

export async function getShoppingList(userId: string) {
  if (!userId) return null;
  const result = await tryIf(async () => {
    const { data } = await supabase
      .from('shopping_lists')
      .select('list_data')
      .eq('user_id', userId)
      .single();
    return data?.list_data || null;
  }, { retries: 1, baseDelay: 500 });
  return result.ok ? result.data! : null;
}

export async function generateShoppingList(mealPlan, profileContext: any = {}) {
  const systemPrompt = `Gere uma lista de compras semanal em JSON valido.

Refeicoes do usuario:
${JSON.stringify(mealPlan?.week?.slice(0, 3) || [])}

Usuario: ${profileContext.weight || 70}kg, objetivo: ${profileContext.goal || 'manter'}.
Restricoes: ${profileContext.dietaryRestrictions || 'nenhuma'}.

Retorne:
{
  "week": "Segunda a Domingo",
  "categories": [
    {
      "name": "Proteinas",
      "items": [
        {"name": "Frango", "amount": "1kg", "checked": false},
        {"name": "Ovos", "amount": "2 duzias", "checked": false}
      ]
    },
    {
      "name": "Legumes",
      "items": [
        {"name": "Brocolis", "amount": "2 macos", "checked": false}
      ]
    }
  ],
  "tips": ["Dica 1", "Dica 2"]
}

Use alimentos brasileiros. Inclua quantidades para 1 pessoa. Seja pratico.`;

  const result = await tryIf(async () => {
    const response = await generateWithAI({
      prompt: systemPrompt,
      type: 'shopping',
    });

    if (!response) return null;
    const jsonMatch = response.match(/\{[\s\S]*?\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return null;
  }, { retries: 2, baseDelay: 500 });

  if (!result.ok) {
    console.error('Erro ao gerar lista:', result.error);
    return generateFallbackShoppingList();
  }
  return result.data;
}

export function extractShoppingItems(mealPlan: any) {
  if (!mealPlan?.week) return [];
  const items: any[] = [];
  const seen = new Set();

  for (const day of mealPlan.week) {
    if (!day.meals) continue;
    for (const meal of day.meals) {
      if (!meal.items) continue;
      for (const item of meal.items) {
        const key = item.name?.toLowerCase();
        if (key && !seen.has(key)) {
          seen.add(key);
          items.push({ name: item.name, amount: item.amount || '', category: item.category || 'Outros', checked: false });
        }
      }
    }
  }
  return items;
}

function generateFallbackShoppingList() {
  return {
    week: 'Segunda a Domingo',
    categories: [
      {
        name: 'Proteinas',
        items: [
          { name: 'Peito de frango', amount: '1kg', checked: false },
          { name: 'Ovos', amount: '2 duzias', checked: false },
          { name: 'Peixe', amount: '500g', checked: false },
        ],
      },
      {
        name: 'Carboidratos',
        items: [
          { name: 'Arroz integral', amount: '1kg', checked: false },
          { name: 'Batata doce', amount: '1kg', checked: false },
          { name: 'Aveia', amount: '500g', checked: false },
        ],
      },
      {
        name: 'Legumes',
        items: [
          { name: 'Brocolis', amount: '2 macos', checked: false },
          { name: 'Cenoura', amount: '500g', checked: false },
          { name: 'Espinafre', amount: '1 maço', checked: false },
        ],
      },
    ],
    tips: ['Compre frutas da estacao', 'Prefira itens frescos'],
  };
}
