// src/services/recipeGenerator.js
// Gerador de receitas por IA - NOVAIX FITNESS

import { APP_CONFIG } from '../config/app';

export async function generateRecipe(ingredients = [], goal = 'manter') {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || '';

  const ingredientsText = ingredients.length > 0 ? ingredients.join(', ') : 'ingredientes disponíveis';

  const systemPrompt = `Gere uma receita saudável e prática em JSON valido (sem markdown) com:
{
  "name": "Nome da Receita",
  "description": "Descrição curta",
  "ingredients": [{"item": "ingrediente", "amount": "quantidade"}],
  "steps": ["passo1", "passo2"],
  "prepTime": 15,
  "cookTime": 30,
  "servings": 2,
  "calories": 400,
  "protein": 30,
  "carbs": 45,
  "fat": 12,
  "difficulty": "fácil|médio|difícil",
  "tips": ["dica1"]
}
Ingredientes disponíveis: ${ingredientsText}.
Objetivo: ${goal}. Use técnicas de culinária saudável. Inclua tempo de preparo.`;

  if (!apiKey) {
    return generateFallbackRecipe(ingredients);
  }

  try {
    const url = `${APP_CONFIG.apis.geminiBaseUrl}?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
      }),
    });

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.name) return parsed;
    }
    return null;
  } catch (error) {
    console.error('Erro ao gerar receita:', error);
    return generateFallbackRecipe(ingredients);
  }
}

function generateFallbackRecipe(ingredients) {
  const hasProtein = ingredients.some(i => ['frango', 'ovo', 'peixe', 'carne'].some(p => i.toLowerCase().includes(p)));
  const hasCarb = ingredients.some(i => ['arroz', 'batata', 'macarrão', 'pão'].some(c => i.toLowerCase().includes(c)));

  if (hasProtein && hasCarb) {
    return {
      name: 'Frango Grelhado com Arroz Integral',
      description: 'Refeição balanceada e rica em proteína',
      ingredients: [
        { item: 'Peito de frango', amount: '200g' },
        { item: 'Arroz integral', amount: '1 xícara' },
        { item: 'Brócolis', amount: '1 xícara' },
        { item: 'Azeite', amount: '1 colher' },
        { item: 'Sal e pimenta', amount: 'a gosto' },
      ],
      steps: [
        'Tempere o frango com sal, pimenta e alho',
        'Grelhe o frango em fogo médio por 5 minutos de cada lado',
        'Cozinhe o arroz integral conforme instruções da embalagem',
        'Cozinhe o brócolis no vapor por 3 minutos',
        'Sirva o frango fatiado sobre o arroz com brócolis ao lado',
      ],
      prepTime: 10,
      cookTime: 20,
      servings: 1,
      calories: 420,
      protein: 38,
      carbs: 45,
      fat: 10,
      difficulty: 'fácil',
      tips: ['Use frango sem pele para menos gordura', 'Varie os temperos'],
    };
  }

  return {
    name: 'Omelete Proteica',
    description: 'Café da manhã rápido e nutritivo',
    ingredients: [
      { item: 'Ovos', amount: '3 unidades' },
      { item: 'Espinafre', amount: '1 xícara' },
      { item: 'Tomate', amount: '1/2 unidade' },
      { item: 'Queijo cottage', amount: '50g' },
    ],
    steps: [
      'Bata os ovos em uma tigela',
      'Adicione o espinafre picado e o tomate fatiado',
      'Despeje em uma frigideira antiaderente',
      'Cozinhe em fogo baixo até firmar',
      'Adicione o cottage por cima e sirva',
    ],
    prepTime: 5,
    cookTime: 8,
    servings: 1,
    calories: 280,
      protein: 24,
      carbs: 8,
      fat: 18,
      difficulty: 'fácil',
      tips: ['Adicione ervas para mais sabor'],
  };
}
