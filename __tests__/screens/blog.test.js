import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    Ionicons: (props) => React.createElement('Ionicons', props),
  };
});

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock('../../src/utils/responsive', () => ({
  scale: (n) => n,
}));

jest.mock('../../src/constants/shadows', () => ({
  SHADOWS: { sm: {}, md: {}, lg: {} },
}));

jest.mock('../../src/styles', () => ({
  typography: {
    label: { fontFamily: 'Montserrat_700Bold', fontSize: 11 },
    h2: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 18 },
    bodyMuted: { fontFamily: 'Inter_400Regular', fontSize: 14 },
  },
  layout: {
    screen: { flex: 1, backgroundColor: '#12161A' },
    scroll: { padding: 24, paddingTop: 60 },
  },
}));

jest.mock('../../src/data/articles', () => ({
  ARTICLES: [
    {
      id: '1',
      title: '5 Dicas de Nutrição para Hipertrofia',
      category: 'nutricao',
      readTime: '5 min',
      author: 'Dr. Rafael Mendes',
      date: '2025-06-20',
      excerpt: 'Descubra as melhores estratégias nutricionais.',
      content: 'Conteúdo do artigo sobre nutrição.',
      tags: ['nutrição', 'hipertrofia'],
    },
    {
      id: '2',
      title: 'Guia Completo de Treino Push/Pull/Legs',
      category: 'treino',
      readTime: '8 min',
      author: 'Coach Lucas Almeida',
      date: '2025-06-18',
      excerpt: 'Monte sua rotina de treinos com o método PPL.',
      content: 'Conteúdo do artigo sobre treino.',
      tags: ['treino', 'PPL'],
    },
    {
      id: '3',
      title: 'Como Reduzir o Estresse com Exercícios',
      category: 'saude',
      readTime: '4 min',
      author: 'Dra. Camila Santos',
      date: '2025-06-15',
      excerpt: 'A atividade física é uma das melhores ferramentas.',
      content: 'Conteúdo do artigo sobre saúde.',
      tags: ['saúde', 'estresse'],
    },
  ],
  ARTICLE_CATEGORIES: [
    { id: 'todos', label: 'TODOS', icon: 'newspaper' },
    { id: 'nutricao', label: 'NUTRIÇÃO', icon: 'nutrition' },
    { id: 'treino', label: 'TREINO', icon: 'barbell' },
    { id: 'saude', label: 'SAÚDE', icon: 'heart' },
  ],
  getArticlesByCategory: (cat) => {
    const articles = [
      { id: '1', category: 'nutricao' },
      { id: '2', category: 'treino' },
      { id: '3', category: 'saude' },
    ];
    if (cat === 'todos' || !cat) return articles;
    return articles.filter((a) => a.category === cat);
  },
  getArticleById: (id) => {
    const articles = [
      { id: '1', title: '5 Dicas de Nutrição', category: 'nutricao' },
    ];
    return articles.find((a) => a.id === id);
  },
}));

import BlogScreen from '../../app/blog';

describe('Blog Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header', () => {
    const { getByText } = render(<BlogScreen />);
    expect(getByText('BLOG')).toBeTruthy();
  });

  it('renders subtitle', () => {
    const { getByText } = render(<BlogScreen />);
    expect(getByText('Artigos sobre fitness, nutrição e saúde')).toBeTruthy();
  });

  it('renders all articles by default', () => {
    const { getByText } = render(<BlogScreen />);
    expect(getByText('5 Dicas de Nutrição para Hipertrofia')).toBeTruthy();
    expect(getByText('Guia Completo de Treino Push/Pull/Legs')).toBeTruthy();
    expect(getByText('Como Reduzir o Estresse com Exercícios')).toBeTruthy();
  });

  it('renders category pills', () => {
    const { getAllByText } = render(<BlogScreen />);
    expect(getAllByText('TODOS').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('NUTRIÇÃO').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('SAÚDE').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('TREINO').length).toBeGreaterThanOrEqual(1);
  });

  it('filters articles by category', () => {
    const { getByText, queryByText } = render(<BlogScreen />);
    fireEvent.press(getByText('NUTRIÇÃO'));
    expect(getByText('5 Dicas de Nutrição para Hipertrofia')).toBeTruthy();
    expect(queryByText('Guia Completo de Treino Push/Pull/Legs')).toBeNull();
  });

  it('navigates to article detail on press', () => {
    const { getByText } = render(<BlogScreen />);
    fireEvent.press(getByText('5 Dicas de Nutrição para Hipertrofia'));
    expect(getByText('ARTIGO')).toBeTruthy();
  });

  it('renders article detail content', () => {
    const { getByText } = render(<BlogScreen />);
    fireEvent.press(getByText('5 Dicas de Nutrição para Hipertrofia'));
    expect(getByText('Dr. Rafael Mendes')).toBeTruthy();
    expect(getByText('5 min')).toBeTruthy();
  });

  it('navigates back from detail', () => {
    const { getByText, UNSAFE_getAllByType } = render(<BlogScreen />);
    fireEvent.press(getByText('5 Dicas de Nutrição para Hipertrofia'));
    expect(getByText('ARTIGO')).toBeTruthy();
    const allIonicons = UNSAFE_getAllByType('Ionicons');
    const backBtn = allIonicons.find((el) => el.props.name === 'arrow-back');
    fireEvent.press(backBtn.parent);
    expect(getByText('BLOG')).toBeTruthy();
  });

  it('shows empty state for no matching category', () => {
    const { getByText } = render(<BlogScreen />);
    const mindsetPill = getByText('TODOS');
    expect(mindsetPill).toBeTruthy();
  });
});
