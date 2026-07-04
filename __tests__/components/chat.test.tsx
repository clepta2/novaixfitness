import React from 'react';
import { View, Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light' },
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
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      insert: jest.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@test.com' },
  }),
}));

import ChatInput from '../../src/components/chat/ChatInput';
import MessageBubble from '../../src/components/chat/MessageBubble';

describe('Chat Components', () => {
  describe('ChatInput', () => {
    it('renders without crashing', () => {
      const { toJSON } = render(<ChatInput value="" onChange={() => {}} onSend={() => {}} />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('MessageBubble', () => {
    it('renders user message', () => {
      const { toJSON } = render(<MessageBubble message={{ text: 'Olá coach', isUser: true }} />);
      expect(toJSON()).toBeTruthy();
    });

    it('renders coach message', () => {
      const { toJSON } = render(<MessageBubble message={{ text: 'Olá atleta!', isUser: false }} />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
