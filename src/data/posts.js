// src/data/posts.js
// Dados de posts da comunidade - NOVAIX FITNESS

export const mockPosts = [
  {
    id: '1',
    user: {
      name: 'Carlos Silva',
      avatar: null,
      initials: 'CS',
    },
    content: 'Treinei peito e tríceps hoje! Supino reto com 80kg, novo recorde pessoal. Quem mais tá na pegada?',
    image: 'https://via.placeholder.com/400x300/1E232A/CCFF00?text=Treino+Hoje',
    createdAt: '2h atrás',
    likes: 24,
    comments: 8,
    isLiked: false,
  },
  {
    id: '2',
    user: {
      name: 'Ana Santos',
      avatar: null,
      initials: 'AS',
    },
    content: '30 dias de streak! Nunca pensei que conseguiria manter a consistência. O app ajuda demais!',
    image: null,
    createdAt: '5h atrás',
    likes: 56,
    comments: 12,
    isLiked: true,
  },
  {
    id: '3',
    user: {
      name: 'Pedro Lima',
      avatar: null,
      initials: 'PL',
    },
    content: 'HIIT de 30 minutos acabou comigo. Mas valeu a pena! Queima garantida.',
    image: 'https://via.placeholder.com/400x300/1E232A/FF6B35?text=HIIT',
    createdAt: '8h atrás',
    likes: 18,
    comments: 5,
    isLiked: false,
  },
  {
    id: '4',
    user: {
      name: 'Maria Oliveira',
      avatar: null,
      initials: 'MO',
    },
    content: 'Dica: quando sentir que não dá mais, lembra do seu objetivo. A dor é temporária, o resultado é pra sempre!',
    image: null,
    createdAt: '12h atrás',
    likes: 89,
    comments: 23,
    isLiked: true,
  },
  {
    id: '5',
    user: {
      name: 'Lucas Ferreira',
      avatar: null,
      initials: 'LF',
    },
    content: 'Primeira vez que consegui fazer muscle-up! Depois de 3 meses tentando. O treino de calistenia do app ajudou muito.',
    image: 'https://via.placeholder.com/400x300/1E232A/00E676?text=Muscle+Up',
    createdAt: '1d atrás',
    likes: 134,
    comments: 31,
    isLiked: false,
  },
];

export const mockComments = {
  '1': [
    { id: '1', user: 'Ana Santos', text: 'Parabéns! Eu tô fazendo 60kg ainda', time: '1h atrás' },
    { id: '2', user: 'Pedro Lima', text: 'Meta! Tô tentando chegar nos 80kg', time: '45min atrás' },
  ],
  '2': [
    { id: '1', user: 'Carlos Silva', text: 'Incrível! Qual seu streak atual?', time: '4h atrás' },
  ],
};
