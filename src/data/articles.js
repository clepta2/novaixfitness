// src/data/articles.js
// Dados mock de artigos - NOVAIX FITNESS

export const ARTICLE_CATEGORIES = [
  { id: 'todos', label: 'TODOS', icon: 'newspaper' },
  { id: 'nutricao', label: 'NUTRIÇÃO', icon: 'nutrition' },
  { id: 'treino', label: 'TREINO', icon: 'barbell' },
  { id: 'saude', label: 'SAÚDE', icon: 'heart' },
  { id: 'mindset', label: 'MINDSET', icon: 'brain' },
];

export const ARTICLES = [
  {
    id: '1',
    title: '5 Dicas de Nutrição para Hipertrofia',
    category: 'nutricao',
    readTime: '5 min',
    author: 'Dr. Rafael Mendes',
    date: '2025-06-20',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    excerpt: 'Descubra as melhores estratégias nutricionais para maximizar seus ganhos de massa muscular.',
    content: `Para alcançar a hipertrofia muscular de forma eficiente, a nutrição desempenha um papel fundamental. Aqui estão 5 dicas essenciais:\n\n1. **Consuma proteína suficiente** — O recomendado é entre 1.6g e 2.2g de proteína por quilo de peso corporal. Fontes como frango, ovos, whey protein e legumes são excelentes opções.\n\n2. **Não negligencie os carboidratos** — Carboidratos são a principal fonte de energia para treinos intensos. Opte por fontes complexas como arroz, batata-doce e aveia.\n\n3. **Hidrate-se adequadamente** — A desidratação pode reduzir em até 20% o desempenho durante o treino. Beba pelo menos 2-3 litros de água por dia.\n\n4. **Distribua as refeições** — Comer a cada 3-4 horas mantém o metabolismo ativo e fornece aminoácidos constantes para os músculos.\n\n5. **Durma bem** — O sono é quando o corpo produce a maior parte do hormônio do crescimento. Busque 7-9 horas por noite.`,
    tags: ['nutrição', 'hipertrofia', 'proteína'],
  },
  {
    id: '2',
    title: 'Guia Completo de Treino Push/Pull/Legs',
    category: 'treino',
    readTime: '8 min',
    author: 'Coach Lucas Almeida',
    date: '2025-06-18',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    excerpt: 'Monte sua rotina de treinos com o método PPL e maximize seus resultados na academia.',
    content: `O método Push/Pull/Legs (PPL) é uma das divisões de treino mais eficazes para hipertrofia. Veja como montar sua rotina:\n\n**DIA PUSH (Empurrar):**\n- Supino reto: 4x8-10\n- Desenvolvimento: 3x10-12\n- Elevação lateral: 3x12-15\n- Tríceps pulley: 3x10-12\n- Tríceps testa: 3x12\n\n**DIA PULL (Puxar):\n- Puxada frontal: 4x8-10\n- Remada curvada: 4x8-10\n- Remada unilateral: 3x10-12\n- Rosca direta: 3x10-12\n- Rosca martelo: 3x12\n\n**DIA LEGS (Pernas):**\n- Agachamento: 4x8-10\n- Leg press: 3x10-12\n- Cadeira extensora: 3x12-15\n- Mesa flexora: 3x10-12\n- Panturrilha: 4x15-20\n\nFrequência recomendada: 2-3x por semana cada grupo muscular.`,
    tags: ['treino', 'PPL', 'hipertrofia'],
  },
  {
    id: '3',
    title: 'Como Reduzir o Estresse com Exercícios',
    category: 'saude',
    readTime: '4 min',
    author: 'Dra. Camila Santos',
    date: '2025-06-15',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    excerpt: 'A atividade física é uma das melhores ferramentas para combater o estresse do dia a dia.',
    content: `O estresse crônico afeta milhões de pessoas e o exercício físico é uma das formas mais eficazes de combatê-lo. Entenda como:\n\n**Mecanismo de ação:**\nO exercício libera endorfinas, serotonina e dopamina — neurotransmissores responsáveis pela sensação de bem-estar. Além disso, reduz os níveis de cortisol, o hormônio do estresse.\n\n**Melhores exercícios para reduzir estresse:**\n1. Caminhada ao ar livre (30 min)\n2. Yoga ou Pilates\n3. Natação\n4. Musculação moderada\n5. Corrida leve\n\n**Dicas práticas:**\n- Pratique pelo menos 150 minutos de atividade física por semana\n- Escolha atividades que você genuinamente gosta\n- Não treine intensamente todos os dias — o descanso é importante\n- Considere treinar ao ar livre quando possível\n- Use o treino como momento de desconexão do celular`,
    tags: ['saúde', 'estresse', 'bem-estar'],
  },
  {
    id: '4',
    title: 'Mentalidade de Atleta: Como Se Motivar',
    category: 'mindset',
    readTime: '6 min',
    author: 'Prof. André Rodrigues',
    date: '2025-06-12',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
    excerpt: 'Desenvolva a mentalidade certa para alcançar seus objetivos fitness de forma consistente.',
    content: `A consistência é a chave do sucesso no fitness. Mas como manter a motivação a longo prazo?\n\n**1. Defina metas claras e específicas**\nEm vez de "quero ficar forte", defina "quero aumentar minha carga no supino em 10kg em 3 meses".\n\n**2. Celebre pequenas vitórias**\nCada progresso merece reconhecimento. Anote seus recordes e compare periodicamente.\n\n**3. Encontre um parceiro de treino**\nTer alguém para treinar aumenta em até 95% a chance de manter a rotina.\n\n**4. Visualize seus resultados**\nAtletas de elite usam visualização para melhorar o desempenho. Imagine-se alcançando seus objetivos.\n\n**5. Aprenda com os fracassos**\nDias ruins fazem parte do processo. O importante é não parar.\n\n**6. Invista em conhecimento**\nQuanto mais você entende sobre treino e nutrição, mais confiança terá no processo.`,
    tags: ['mindset', 'motivação', 'disciplina'],
  },
  {
    id: '5',
    title: 'Suplementos: O Que Realmente Funciona',
    category: 'nutricao',
    readTime: '7 min',
    author: 'Dr. Rafael Mendes',
    date: '2025-06-10',
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc28e80?w=800',
    excerpt: 'Entenda quais suplementos realmente têm evidências científicas e quais são mitos.',
    content: `O mercado de suplementos é gigante, mas nem tudo funciona. Veja o que a ciência diz:\n\n**SUPLEMENTOS COM EVIDÊNCIA:**\n\n✅ **Creatina** — O suplemento mais estudado. Aumenta força, potência e massa muscular. Dose: 3-5g/dia.\n\n✅ **Whey Protein** — Prático para atingir a meta de proteína. Dose: conforme necessidade.\n\n✅ **Cafeína** — Melhora desempenho e foco. Dose: 3-6mg/kg, 30min antes do treino.\n\n✅ **Vitamina D** — Fundamental para saúde óssea e função muscular. Dose: 1000-4000 UI/dia.\n\n**SUPLEMENTOS COM EVIDÊNCIA FRACA:**\n\n⚠️ BCAA — Se você consome proteína suficiente, BCAs são desnecessários.\n⚠️ Glutamina — Efeitos mínimos para atletas saudáveis.\n⚠️ Fat burners — A maioria não tem efeito significativo.\n\n**Regra de ouro:** Invista primeiro em uma boa alimentação antes de gastar com suplementos.`,
    tags: ['nutrição', 'suplementos', 'creatina'],
  },
  {
    id: '6',
    title: 'Sono e Recuperação: A Chave dos Ganhos',
    category: 'saude',
    readTime: '5 min',
    author: 'Dra. Camila Santos',
    date: '2025-06-08',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800',
    excerpt: 'Descubra por que dormir bem é tão importante quanto treinar bem para seus resultados.',
    content: `Muitos atletas focam apenas no treino e na alimentação, esquecendo que o sono é quando o corpo realmente se recupera.\n\n**Por que o sono é fundamental:**\n- 95% do hormônio do crescimento é liberado durante o sono profundo\n- A recuperação muscular ocorre principalmente à noite\n- A falta de sono aumenta o cortisol e reduz a testosterona\n\n**Como melhorar a qualidade do sono:**\n\n1. **Mantenha horários regulares** — Durma e acorde nos mesmos horários\n2. **Evite telas 1h antes de dormir** — A luz azul atrapalha a melatonina\n3. **Mantenha o quarto fresco** — Temperatura ideal: 18-22°C\n4. **Evite cafeína após as 14h** — A meia-vida da cafeína é de 5-6 horas\n5. **Crie uma rotina noturna** — Leitura, meditação ou alongamento leve\n\n**Duração ideal:** 7-9 horas para adultos. Atletas podem precisar de mais.`,
    tags: ['saúde', 'sono', 'recuperação'],
  },
];

export const getArticlesByCategory = (category) => {
  if (category === 'todos' || !category) return ARTICLES;
  return ARTICLES.filter((a) => a.category === category);
};

export const getArticleById = (id) => ARTICLES.find((a) => a.id === id);
