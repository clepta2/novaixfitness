// src/helpers/shoppingListHelper.ts
// Helpers para lista de compras - NOVAIX FITNESS

interface MealPlan {
  week?: DayPlan[];
}

interface DayPlan {
  meals?: MealItem[];
}

interface MealItem {
  items?: string[];
}

interface ShoppingItem {
  name: string;
  category: string;
  checked: boolean;
}

interface GroupedItems {
  [category: string]: ShoppingItem[];
}

export function extractShoppingItems(mealPlan: MealPlan): ShoppingItem[] {
  if (!mealPlan?.week) return [];

  const itemMap: Record<string, ShoppingItem> = {};
  const categories: Record<string, string[]> = {
    'Proteínas': ['frango', 'peixe', 'ovo', 'carne', 'sardinha', 'tilapia', 'presunto', 'whey'],
    'Carboidratos': ['arroz', 'feijão', 'pão', 'batata', 'macarrão', 'cereal', 'aveia', 'granola', 'mandioca'],
    'Laticínios': ['leite', 'iogurte', 'queijo', 'manteiga'],
    'Frutas': ['banana', 'maçã', 'laranja', 'fruta'],
    'Legumes': ['salada', 'cenoura', 'tomate', 'brócolis', 'legume'],
    'Outros': ['azeite', 'café', 'suco', 'mel'],
  };

  mealPlan.week!.forEach((day: DayPlan) => {
    day.meals?.forEach((meal: MealItem) => {
      meal.items?.forEach((item: string) => {
        const lower = item.toLowerCase();
        if (!itemMap[lower]) {
          let category = 'Outros';
          for (const [cat, keywords] of Object.entries(categories)) {
            if (keywords.some(k => lower.includes(k))) {
              category = cat;
              break;
            }
          }
          itemMap[lower] = { name: item, category, checked: false };
        }
      });
    });
  });

  return Object.values(itemMap);
}

export function generateShoppingHTML(items: ShoppingItem[], grouped: GroupedItems, checkedCount: number): string {
  return `
    <!DOCTYPE html>
    <html><head><meta charset="utf-8"><style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      h1 { color: #CCFF00; background: #12161A; padding: 15px; text-align: center; border-radius: 8px; }
      h3 { color: #12161A; border-bottom: 2px solid #CCFF00; padding-bottom: 5px; margin-top: 20px; }
      ul { list-style: none; padding: 0; }
      li { padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px; }
      li::before { content: "☐ "; color: #CCFF00; font-weight: bold; }
      .checked { text-decoration: line-through; color: #999; }
    </style></head><body>
      <h1>Lista de Compras NOVAIX</h1>
      <p style="color:#666">${items.length} itens • ${checkedCount} já tem</p>
      ${Object.entries(grouped).map(([cat, catItems]) => `
        <h3>${cat}</h3>
        <ul>${catItems.map((i: ShoppingItem) => `<li class="${i.checked ? 'checked' : ''}">${i.name}</li>`).join('')}</ul>
      `).join('')}
      <p style="text-align:center;color:#999;margin-top:30px;font-size:12px;">Gerado por NOVAIX Fitness • ${new Date().toLocaleDateString('pt-BR')}</p>
    </body></html>
  `;
}
