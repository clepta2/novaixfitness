interface FoodItem {
  name: string;
  portion: string;
  cal: number;
  pro: number;
  carb: number;
  fat: number;
  cat: string;
}

export const FALLBACK_FOODS: FoodItem[] = [
  { name: 'Arroz branco', portion: '100g', cal: 130, pro: 3, carb: 28, fat: 0.5, cat: 'Carboidratos' },
  { name: 'Feijão carioca', portion: '100g', cal: 90, pro: 6, carb: 16, fat: 0.5, cat: 'Carboidratos' },
  { name: 'Batata doce', portion: '100g', cal: 86, pro: 2, carb: 20, fat: 0.1, cat: 'Carboidratos' },
  { name: 'Pão integral', portion: '1 un', cal: 75, pro: 3, carb: 14, fat: 1, cat: 'Carboidratos' },
  { name: 'Banana', portion: '1 un', cal: 89, pro: 1, carb: 23, fat: 0.3, cat: 'Frutas' },
  { name: 'Peito de frango', portion: '100g', cal: 165, pro: 31, carb: 0, fat: 4, cat: 'Proteínas' },
  { name: 'Ovo', portion: '1 un', cal: 78, pro: 6, carb: 1, fat: 5, cat: 'Proteínas' },
  { name: 'Sardinha', portion: '100g', cal: 120, pro: 22, carb: 0, fat: 3, cat: 'Proteínas' },
  { name: 'Iogurte grego', portion: '100g', cal: 59, pro: 10, carb: 3, fat: 0.7, cat: 'Laticínios' },
  { name: 'Azeite', portion: '1 col', cal: 120, pro: 0, carb: 0, fat: 14, cat: 'Gorduras' },
  { name: 'Brócolis', portion: '100g', cal: 34, pro: 3, carb: 7, fat: 0.4, cat: 'Legumes' },
  { name: 'Whey protein', portion: '30g', cal: 120, pro: 24, carb: 3, fat: 2, cat: 'Proteínas' },
];

export const FOOD_CATEGORIES: string[] = ['Todos', 'Carboidratos', 'Proteínas', 'Frutas', 'Laticínios', 'Gorduras', 'Legumes'];
