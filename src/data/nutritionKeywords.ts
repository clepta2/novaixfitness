// src/data/nutritionKeywords.ts
// Palavras-chave para deteccao de refeicoes - NOVAIX FITNESS

export const MEAL_KEYWORDS: string[] = [
  'comi', 'almocoi', 'jantei', 'cafei', 'lanchei', 'refeiçao', 'refeicao',
  'almoço', 'jantar', 'cafe da manha', 'cafe da manha', 'lanche',
  'tomando', 'comendo', 'cafezinho', 'almorcinho', 'jantinho',
];

export const FOOD_KEYWORDS: string[] = [
  'arroz', 'feijao', 'frango', 'ovo', 'banana', 'salada', 'peixe', 'pao',
  'leite', 'iogurte', 'macarra', 'batata', 'carne', 'queijo', 'presunto',
  'aveia', 'whey', 'suco', 'cafe', 'cha', 'sanduiche', 'pizza', 'hamburguer',
  'sushi', 'sorvete', 'chocolate', 'amendoim', 'castanha', 'atum', 'sardinha',
  'tilapia', 'porco', 'lombo', 'costela', 'linguica', 'bacon', 'tomate',
  'cenoura', 'brocolis', 'alface', 'couve', 'espinafre', 'abacate', 'laranja',
  'maca', 'manga', 'morango', 'uva', 'melancia', 'abacaxi', 'goiaba', 'mamao',
];

export const QUANTITY_PATTERN: RegExp = /\d+\s*(g|kg|ml|l|copo|fatia|colher|pedaco|porcao|xicara|xicara)/;
