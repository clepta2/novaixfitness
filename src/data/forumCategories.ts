// src/data/forumCategories.ts
// Categorias do forum - NOVAIX FITNESS

interface ForumCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

interface MockPost {
  id: string;
  category: string;
  author: string;
  authorAvatar: string | null;
  title: string;
  content: string;
  replies: number;
  likes: number;
  createdAt: string;
}

export const FORUM_CATEGORIES: ForumCategory[] = [
  { id: 'treino', label: 'Treinos', icon: 'barbell', color: '#CCFF00', description: 'Dicas e rotinas de treino' },
  { id: 'nutricao', label: 'Nutricao', icon: 'nutrition', color: '#00E676', description: 'Alimentacao e dietas' },
  { id: 'duvidas', label: 'Duvidas', icon: 'help-circle', color: '#3B82F6', description: 'Tire suas duvidas' },
  { id: 'motivacao', label: 'Motivacao', icon: 'flame', color: '#FF6B35', description: 'Historias e motivacao' },
];

export const MOCK_POSTS: MockPost[] = [
  {
    id: 'p1',
    category: 'treino',
    author: 'Carlos S.',
    authorAvatar: null,
    title: 'Melhor rotina para inferiores?',
    content: 'Pessoal, estou treino 4x por semana. Qual a melhor divisao para pernas?',
    replies: 8,
    likes: 15,
    createdAt: '2026-06-25T10:00:00Z',
  },
  {
    id: 'p2',
    category: 'nutricao',
    author: 'Ana M.',
    authorAvatar: null,
    title: 'Quantas proteinas por dia?',
    content: 'Tenho 70kg. Quantas gramas de proteina devo consumir?',
    replies: 12,
    likes: 23,
    createdAt: '2026-06-24T14:30:00Z',
  },
  {
    id: 'p3',
    category: 'motivacao',
    author: 'Pedro L.',
    authorAvatar: null,
    title: '3 meses de evolucao!',
    content: 'Comecei no NOVAIX ha 3 meses e ja perdi 8kg. Continuem firme!',
    replies: 20,
    likes: 45,
    createdAt: '2026-06-23T09:15:00Z',
  },
  {
    id: 'p4',
    category: 'duvidas',
    author: 'Maria F.',
    authorAvatar: null,
    title: 'Treino funciona sem academia?',
    content: 'Da pra ter resultados treinando em casa so com peso corporal?',
    replies: 6,
    likes: 11,
    createdAt: '2026-06-22T16:45:00Z',
  },
];
