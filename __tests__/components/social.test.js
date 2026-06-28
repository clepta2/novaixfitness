import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('../../src/constants/shadows', () => ({
  SHADOWS: { sm: {}, md: {}, lg: {} },
}));

jest.mock('../../src/utils/responsive', () => ({
  scale: (n) => n,
}));

jest.mock('../../src/styles', () => ({
  typography: {
    label: { fontFamily: 'Montserrat_700Bold', fontSize: 11 },
    h5: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
    bodyMuted: { fontFamily: 'Inter_400Regular', fontSize: 14 },
    bodySmall: { fontFamily: 'Inter_400Regular', fontSize: 12 },
    caption: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  },
}));

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      insert: jest.fn().mockResolvedValue({ error: null }),
    })),
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
    })),
  },
}));

jest.mock('../../src/hooks/useRealtimeComments', () => ({
  useRealtimeComments: () => [],
}));

jest.mock('../../src/hooks/useRealtimeLikes', () => ({
  useRealtimeLikes: () => ({ likes: 0, isLiked: false, toggleLike: jest.fn() }),
}));

jest.mock('../../src/components/ui/Avatar', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Avatar: (props) => React.createElement(View, null),
  };
});

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@test.com' },
  }),
}));

import PostCard from '../../src/components/social/PostCard';

describe('Social Components', () => {
  describe('PostCard', () => {
    const mockPost = {
      id: 'post1',
      user: { name: 'Atleta', avatar: null },
      content: 'Treinei hoje!',
      image: null,
      createdAt: '2 horas',
      likes: 5,
      comments: 2,
      isLiked: false,
    };

    it('renders post card', () => {
      const { getByText } = render(<PostCard post={mockPost} />);
      expect(getByText('Treinei hoje!')).toBeTruthy();
    });

    it('renders user name', () => {
      const { getByText } = render(<PostCard post={mockPost} />);
      expect(getByText('Atleta')).toBeTruthy();
    });

    it('renders time', () => {
      const { getByText } = render(<PostCard post={mockPost} />);
      expect(getByText('2 horas')).toBeTruthy();
    });

    it('renders likes count', () => {
      const { getByText } = render(<PostCard post={mockPost} />);
      expect(getByText('5')).toBeTruthy();
    });

    it('calls onLike when like pressed', () => {
      const onLike = jest.fn();
      const { getByText } = render(<PostCard post={mockPost} onLike={onLike} />);
      fireEvent.press(getByText('5'));
      expect(onLike).toHaveBeenCalledWith('post1');
    });
  });
});
